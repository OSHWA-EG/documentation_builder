/* ================= Main Application State & Initialization ================= */

let projectMeta = {
    theme: "theme-builder",
    footer: "صنع بعناية للمهندس العربي بواسطة فريق التوثيق في Egypt OSHWA Community.\nهذا العمل يخضع لترخيص المشاع الإبداعي (CC BY-SA 4.0)."
};

let blocksData = [];
let updateTimeout;
let iframeScrollY = 0;

const defaultTable = { headers: ['الطرف', 'النوع', 'الوظيفة'], rows: [['GPIO0', 'إدخال/إخراج', 'تكوين الإقلاع']] };

// توحيد/ترقية شكل بيانات البلوكات لدعم المسودات القديمة والقالب الافتراضي
function normalizeBlocks(rawBlocks) {
    if (!Array.isArray(rawBlocks)) return [];

    return rawBlocks.map((block, index) => {
        if (!block || typeof block !== 'object') return block;
        const b = { ...block };

        // توحيد تسمية النوع الفرعي
        if (b.type === 'sub-section') b.type = 'sub_section';

        // نقل العنوان من content إلى title للأقسام القديمة
        if ((b.type === 'section' || b.type === 'sub_section') && !b.title && b.content) {
            b.title = b.content;
        }

        // التأكد من وجود sectionId ثابت لكل قسم
        if ((b.type === 'section' || b.type === 'sub_section') && !b.sectionId) {
            b.sectionId = b.id || `${b.type}_${index}`;
        }

        // كتل النص القديمة -> فقرة
        if (b.type === 'text') {
            b.type = 'paragraph';
        }

        // كتل القوائم القديمة -> فقرة تحوي <ul>/<ol> HTML حتى يلتقطها المولّد الحالي
        if (b.type === 'list') {
            const listType = b.listType === 'ol' ? 'ol' : 'ul';
            const items = Array.isArray(b.items) ? b.items : [];
            const listHtml = `<${listType}>` + items.map((it) => `<li>${it}</li>`).join('') + `</${listType}>`;
            b.type = 'paragraph';
            b.content = listHtml;
            delete b.items;
            delete b.listType;
        }

        // كتل العنوان القديمة -> h1/h2/h3
        if (b.type === 'title' && b.level && ['h1', 'h2', 'h3'].includes(b.level)) {
            b.type = b.level;
            b.content = b.content || '';
            delete b.level;
        }

        // الصور القديمة -> figure حديثة
        if (b.type === 'image') {
            b.type = 'figure';
            b.imgUrl = b.url || b.imgUrl || '';
            b.captionTitle = b.captionTitle || '';
            b.captionText = b.caption || b.captionText || '';
            delete b.url;
            delete b.caption;
        }

        // الاقتباسات القديمة -> فقرة تحتوي blockquote
        if (b.type === 'quote') {
            b.type = 'paragraph';
            if (b.content) {
                b.content = `<blockquote>${b.content}</blockquote>`;
            } else {
                b.content = '';
            }
        }

        // تنبيهات قديمة تستخدم style -> alertType
        if (b.type === 'alert') {
            if (!b.alertType && b.style) {
                b.alertType = b.style;
            }
            delete b.style;
        }

        // الجداول القديمة التي تستخدم data بدلاً من tableData
        if (b.type === 'table' && !b.tableData && b.data) {
            b.tableData = b.data;
            delete b.data;
        }

        return b;
    });
}

window.onload = async () => {
    lucide.createIcons();
    const savedData = localStorage.getItem('oshw_builder_v2_data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            if (parsed && parsed.blocks && parsed.blocks.length > 0) {
                loadProjectData(parsed);
            } else {
                await loadDefaultTemplate();
            }
        } catch (e) {
            console.error("Error loading saved data", e);
            await loadDefaultTemplate();
        }
    } else {
        await loadDefaultTemplate();
    }

    // ربط الواجهة
    document.getElementById('themeSelect').value = projectMeta.theme || 'theme-builder';
    updatePreview();
};

async function loadDefaultTemplate() {
    try {
        // When running from file://, fetch() to local JSON is blocked by browsers (CORS, origin "null").
        // Use JS-provided template instead.
        if (window.location && window.location.protocol === 'file:' && window.DEFAULT_TEMPLATE) {
            const defaultData = window.DEFAULT_TEMPLATE;
            projectMeta = defaultData.meta || projectMeta;
            blocksData = normalizeBlocks(defaultData.blocks || []);
            return;
        }

        const response = await fetch('default-template.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        const defaultData = await response.json();
        projectMeta = defaultData.meta || projectMeta;
        blocksData = normalizeBlocks(defaultData.blocks || []);
        // تحديث إعدادات الواجهة لتطابق القالب
        if (projectMeta.title) document.getElementById('metaTitle').value = projectMeta.title;
        if (projectMeta.desc) document.getElementById('metaDesc').value = projectMeta.desc;
        if (projectMeta.autoNum !== undefined) document.getElementById('metaAutoNum').checked = projectMeta.autoNum;
    } catch (error) {
        console.error('Failed to load default template:', error);
        // Fallback to JS-provided template if available (works on file:// too)
        if (window.DEFAULT_TEMPLATE) {
            const defaultData = window.DEFAULT_TEMPLATE;
            projectMeta = defaultData.meta || projectMeta;
            blocksData = normalizeBlocks(defaultData.blocks || []);
            return;
        }
        // Fallback to minimal data if fetch fails
        projectMeta.title = "بدون عنوان";
        blocksData = [{
            type: 'section',
            id: 'sec-1',
            title: 'وثيقة مبدئية',
            icon: 'file',
            sectionId: 'sec-1'
        }];
        const pId = 'p_' + Date.now().toString().slice(-4);
        blocksData.push({ id: pId, type: 'paragraph', content: '' });
    }
}

function triggerUpdate(saveScroll = true) {
    const statusEl = document.getElementById('saveStatus');
    statusEl.innerText = 'جاري الحفظ...';
    statusEl.style.color = 'var(--copper)';
    statusEl.style.borderColor = 'rgba(251, 191, 36, 0.3)';

    if (saveScroll) {
        const iframe = document.getElementById('previewFrame');
        if (iframe.contentWindow) iframeScrollY = iframe.contentWindow.scrollY;
    }

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        saveToLocalStorage();
        updatePreview();
        statusEl.innerText = 'محفوظ';
        statusEl.style.color = 'var(--accent)';
        statusEl.style.borderColor = 'rgba(16, 185, 129, 0.2)';
    }, 500);
}

let historyStack = [];
let historyIndex = -1;
let isUndoRedoOperation = false;

function performUndo() {
    if (historyIndex > 0) {
        isUndoRedoOperation = true;
        historyIndex--;
        loadProjectData(historyStack[historyIndex], true);
        isUndoRedoOperation = false;
    }
}

function performRedo() {
    if (historyIndex < historyStack.length - 1) {
        isUndoRedoOperation = true;
        historyIndex++;
        loadProjectData(historyStack[historyIndex], true);
        isUndoRedoOperation = false;
    }
}

function pushToHistory() {
    if (isUndoRedoOperation) return;
    const stateStr = JSON.stringify({ meta: projectMeta, blocks: blocksData });
    if (historyIndex >= 0 && JSON.stringify(historyStack[historyIndex]) === stateStr) return;

    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push({ meta: JSON.parse(JSON.stringify(projectMeta)), blocks: JSON.parse(JSON.stringify(blocksData)) });
    if (historyStack.length > 50) historyStack.shift();
    else historyIndex = historyStack.length - 1;
}

window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        performUndo();
    } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        performRedo();
    }
});

function saveToLocalStorage() {
    pushToHistory();
    localStorage.setItem('oshw_builder_v2_data', JSON.stringify({ header: projectMeta, blocks: blocksData }));
}

function loadProjectData(data, fromHistory = false) {
    if (data.header) projectMeta = { ...projectMeta, ...data.header };
    if (data.meta) projectMeta = { ...projectMeta, ...data.meta };
    blocksData = normalizeBlocks(data.blocks || []);

    if (fromHistory) {
        localStorage.setItem('oshw_builder_v2_data', JSON.stringify({ header: projectMeta, blocks: blocksData }));
        updatePreview();
    }
}

// ================= UI Actions =================

function changeTheme(themeName) {
    projectMeta.theme = themeName;
    saveToLocalStorage();
    updatePreview();
}

function populateSelect(selectId, data) {
    const sel = document.getElementById(selectId);
    if (sel.options.length === 0) {
        data.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.innerText = item.name + ' (' + item.id + ')';
            sel.appendChild(opt);
        });
    }
}

function openSettingsModal() {
    if (window.OSHWA_META_DATA) {
        populateSelect('modalORG', OSHWA_META_DATA.organizations);
        populateSelect('modalDOM', OSHWA_META_DATA.domains);
        populateSelect('modalStatusSelect', OSHWA_META_DATA.statuses);
    }

    document.getElementById('modalORG').value = projectMeta.org || 'OE';
    document.getElementById('modalDOM').value = projectMeta.dom || 'EM';
    document.getElementById('modalID').value = projectMeta.projectId || '';
    document.getElementById('modalStatusSelect').value = projectMeta.statusType || 'COM';
    document.getElementById('modalStatus').value = projectMeta.status || '';

    document.getElementById('modalLogoUrl').value = projectMeta.logoUrl || '';
    document.getElementById('modalBrandIcon').value = projectMeta.brandIcon || 'cpu';
    document.getElementById('modalVersionClass').value = projectMeta.versionClass || 'tag-copper';
    document.getElementById('modalSeoTitle').value = projectMeta.seoTitle || '';
    document.getElementById('modalSeoDesc').value = projectMeta.seoDesc || '';
    document.getElementById('modalAutoNum').checked = projectMeta.autoNum || false;

    // Toggle custom inputs if XX
    document.getElementById('modalORG').onchange = (e) => { document.getElementById('modalOrgCustom').style.display = e.target.value === 'XX' ? 'block' : 'none'; };
    document.getElementById('modalDOM').onchange = (e) => { document.getElementById('modalDomCustom').style.display = e.target.value === 'XX' ? 'block' : 'none'; };

    document.getElementById('modalORG').dispatchEvent(new Event('change'));
    document.getElementById('modalDOM').dispatchEvent(new Event('change'));

    document.getElementById('settingsModal').classList.add('active');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

function saveSettings() {
    let orgVal = document.getElementById('modalORG').value;
    projectMeta.org = orgVal === 'XX' ? document.getElementById('modalOrgCustom').value.toUpperCase() : orgVal;

    let domVal = document.getElementById('modalDOM').value;
    projectMeta.dom = domVal === 'XX' ? document.getElementById('modalDomCustom').value.toUpperCase() : domVal;

    projectMeta.projectId = document.getElementById('modalID').value;
    projectMeta.statusType = document.getElementById('modalStatusSelect').value;
    projectMeta.status = document.getElementById('modalStatus').value;

    projectMeta.logoUrl = document.getElementById('modalLogoUrl').value;
    projectMeta.brandIcon = document.getElementById('modalBrandIcon').value || 'cpu';
    projectMeta.versionClass = document.getElementById('modalVersionClass').value;
    projectMeta.seoTitle = document.getElementById('modalSeoTitle').value;
    projectMeta.seoDesc = document.getElementById('modalSeoDesc').value;
    projectMeta.autoNum = document.getElementById('modalAutoNum').checked;

    closeSettingsModal();
    triggerUpdate(false);
}

// إنشاء مستند جديد بنموذج البلوكات الحديث
function createNewDocument() {
    projectMeta = {
        ...projectMeta,
        theme: "theme-builder",
        title: "بدون عنوان",
        status: "WIP"
    };

    blocksData = [];
    historyStack = [];
    historyIndex = -1;

    // إضافة قسم رئيسي افتراضي وفق النموذج الحديث
    addBlock('section', -1);

    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = 'theme-builder';
    changeTheme('theme-builder');
}

// دمج الوظائف القديمة الخاصة بالتصدير والاستيراد من exporter.js لاحقاً
