// ================= Iframe Bridge =================
// These functions are called from inside the iframe to update the main app state.

window.bridgeMoveBlock = function (idx, dir) { moveBlock(idx, dir); iframeScrollY += (dir * 80); };
window.bridgeRemoveBlock = function (idx) { removeBlock(blocksData[idx].id); };
window.bridgeAddBlock = function (type, idx) { addBlock(type, idx); };

// Undo/Redo from inside iframe (Ctrl+Z / Ctrl+Y)
window.bridgeUndo = function () { performUndo(); };
window.bridgeRedo = function () { performRedo(); };

window.bridgeUpdateMeta = function (key, value) {
    if (key === 'footer') value = value.replace(/<br\s*[\/]?>/gi, '\n').replace(/<div>/gi, '\n').replace(/<\/div>/gi, '');
    projectMeta[key] = value; saveToLocalStorage();
};

window.bridgeSetBadgeColor = function (colorClass) {
    projectMeta.versionClass = colorClass; triggerUpdate(false);
};

window.bridgeUpdateText = function (id, key, value) {
    const block = blocksData.find(b => b.id === id);
    if (!block) return;

    if (key === 'content') value = value.replace(/<br\s*[\/]?>/gi, '\n').replace(/<div>/gi, '\n').replace(/<\/div>/gi, '');
    block[key] = value;

    // تحديثات مباشرة للدوم (DOM) لمنع إعادة التحميل الكامل (Live Updates)
    const iframeDoc = document.getElementById('previewFrame').contentWindow.document;
    const wrapper = iframeDoc.querySelector(`[data-block-id="${id}"]`);

    if (wrapper) {
        if (key === 'borderColor' && block.type === 'section') {
            const sec = wrapper.querySelector('.section');
            if (sec) sec.style.setProperty('--section-borderColor', value);
            saveToLocalStorage();
            return;
        }
        if (key === 'hideIcon' && block.type === 'alert') {
            const iconDiv = wrapper.querySelector('.alert-icon');
            if (iconDiv) iconDiv.style.display = value ? 'none' : 'block';
            const btn = wrapper.querySelector('button[title="إخفاء/إظهار الأيقونة"] i');
            if (btn) {
                btn.setAttribute('data-lucide', value ? 'eye-off' : 'eye');
                if (iframeDoc.defaultView.lucide) iframeDoc.defaultView.lucide.createIcons();
            }
            saveToLocalStorage();
            return;
        }
        if (key === 'icon' && (block.type === 'section' || block.type === 'sub_section')) {
            const iconEl = wrapper.querySelector('h2.section-title i, h3.sub-section-title i');
            if (iconEl) {
                iconEl.setAttribute('data-lucide', value || 'layers');
                if (iframeDoc.defaultView.lucide) iframeDoc.defaultView.lucide.createIcons();
            }
            saveToLocalStorage();
            return;
        }
        if (key === 'imgUrl' && block.type === 'figure') {
            const img = wrapper.querySelector('.figure-content img');
            const placeholder = wrapper.querySelector('.figure-placeholder');
            if (value && value.trim() !== '') {
                if (img) {
                    img.src = value;
                } else if (placeholder) {
                    const newImg = iframeDoc.createElement('img');
                    newImg.src = value;
                    newImg.alt = block.captionTitle || '';
                    placeholder.replaceWith(newImg);
                }
            } else if (img) {
                const ph = iframeDoc.createElement('div');
                ph.className = 'figure-placeholder';
                ph.innerHTML = '<i data-lucide="image" style="width: 48px; height: 48px; margin-bottom: 10px; opacity: 0.5;"></i><br>[صورة/مخطط]';
                img.replaceWith(ph);
                if (iframeDoc.defaultView.lucide) iframeDoc.defaultView.lucide.createIcons();
            }
            saveToLocalStorage();
            return;
        }
        if (key === 'sectionId' && (block.type === 'section' || block.type === 'sub_section')) {
            const secEl = wrapper.querySelector('.section');
            const oldId = block.sectionId;
            if (secEl && value) {
                secEl.id = value;
                // تحديث الروابط في الشريط الجانبي داخل نفس الـ iframe
                const links = iframeDoc.querySelectorAll('a[href="#' + oldId + '"]');
                links.forEach(a => a.setAttribute('href', '#' + value));
            }
            saveToLocalStorage();
            return;
        }
        if (key === 'alertType' && block.type === 'alert') {
            const alertEl = wrapper.querySelector('.alert');
            if (alertEl) {
                ['alert-info', 'alert-success', 'alert-warning', 'alert-danger'].forEach(c => alertEl.classList.remove(c));
                alertEl.classList.add('alert-' + value);
                const iconMap = { info: 'info', success: 'check-circle', warning: 'alert-triangle', danger: 'shield-alert' };
                const iconName = iconMap[value] || 'info';
                const icon = alertEl.querySelector('.alert-icon i');
                if (icon) {
                    icon.setAttribute('data-lucide', iconName);
                    if (iframeDoc.defaultView.lucide) iframeDoc.defaultView.lucide.createIcons();
                }
            }
            saveToLocalStorage();
            return;
        }
    }

    saveToLocalStorage();
};

window.bridgeUpdateTableLive = function (id, type, rIndex, cIndex, value) {
    const block = blocksData.find(b => b.id === id);
    if (block && block.tableData) {
        if (type === 'header') block.tableData.headers[cIndex] = value;
        else block.tableData.rows[rIndex][cIndex] = value;
        saveToLocalStorage();
    }
};

window.bridgeAddTableRow = function (id) { const block = blocksData.find(b => b.id === id); if (block) { block.tableData.rows.push(new Array(block.tableData.headers.length).fill('')); triggerUpdate(false); } };
window.bridgeAddTableCol = function (id) { const block = blocksData.find(b => b.id === id); if (block) { block.tableData.headers.push('جديد'); block.tableData.rows.forEach(r => r.push('')); triggerUpdate(false); } };
window.bridgeDelTableCol = function (id) { const block = blocksData.find(b => b.id === id); if (block && block.tableData.headers.length > 1) { block.tableData.headers.pop(); block.tableData.rows.forEach(r => r.pop()); triggerUpdate(false); } };
window.bridgeDelTableRow = function (id, rIndex) { const block = blocksData.find(b => b.id === id); if (block && block.tableData.rows.length > 1) { block.tableData.rows.splice(rIndex, 1); triggerUpdate(false); } };

window.bridgeFormatText = function (blockId, key, newHTML) {
    const block = blocksData.find(b => b.id === blockId);
    if (block) { block[key] = newHTML.replace(/<br\s*[\/]?>/gi, '\n'); saveToLocalStorage(); }
};

// Markdown Bridge
window.bridgeUpdateMarkdown = function (id, value) {
    const block = blocksData.find(b => b.id === id);
    if (block) {
        block.content = value;
        saveToLocalStorage();
        triggerUpdate(true);
    }
};

window.bridgeToggleMarkdownView = function (id, mode) {
    const block = blocksData.find(b => b.id === id);
    if (block) {
        block.viewMode = mode; // 'raw' أو 'preview'
        triggerUpdate(true);
    }
};

window.bridgeUpdateMarkdownFromHTML = function (id, htmlContent) {
    if (window.TurndownService) {
        const turndownService = new TurndownService({ codeBlockStyle: 'fenced', headingStyle: 'atx' });
        let markdown = turndownService.turndown(htmlContent);
        window.bridgeUpdateMarkdown(id, markdown);
    }
};

let draggedIndex = null;
window.bridgeDragStart = function (e, idx) {
    draggedIndex = idx;
    e.dataTransfer.effectAllowed = 'move';
    const iframeDoc = document.getElementById('previewFrame').contentWindow.document;
    if (iframeDoc) {
        setTimeout(() => {
            iframeDoc.body.classList.add('is-dragging');
        }, 50);
    }
};
window.bridgeDragEnter = function (e, element) {
    if (draggedIndex !== null && element.dataset.index != draggedIndex) {
        element.classList.add('drag-over');
    }
};
window.bridgeDragLeave = function (e, element) {
    element.classList.remove('drag-over');
};
window.bridgeDragOver = function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
};
window.bridgeDrop = function (e, dropIndex) {
    e.preventDefault();
    const iframeDoc = document.getElementById('previewFrame').contentWindow.document;
    if (iframeDoc) {
        iframeDoc.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        iframeDoc.body.classList.remove('is-dragging');
    }

    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const item = blocksData.splice(draggedIndex, 1)[0];
    blocksData.splice(dropIndex, 0, item);

    saveToLocalStorage();
    triggerUpdate(true);
    draggedIndex = null;
};

window.bridgeDragEnd = function (e) {
    draggedIndex = null;
    const iframeDoc = document.getElementById('previewFrame').contentWindow.document;
    if (iframeDoc) {
        iframeDoc.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        iframeDoc.body.classList.remove('is-dragging');
    }
};
