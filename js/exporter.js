// ================= HTML Engine & Exporters =================

// قالب الـ CSS الأساسي (العام) الموجود في كل النسخ
const commonCSS = `
    html { scroll-behavior: smooth; }
    body { margin: 0; font-family: 'Tajawal', sans-serif; display: flex; min-height: 100vh; line-height: 1.8; font-size: 1.15rem; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    ::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

// قالب الجافاسكريبت الأساسي الذي يدمج في الملف المصدر للعمل بدون المحرر
const templateJS = `
    lucide.createIcons();
    function normalizeArabic(text) { if (!text) return ""; return text.replace(/[\\u064B-\\u065F]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").toLowerCase(); }
    var searchModal = document.getElementById('searchModal'); var searchInput = document.getElementById('searchInput'); var searchResults = document.getElementById('searchResults');
    var sectionsDOM = document.querySelectorAll('.search-target'); var searchData = [];
    sectionsDOM.forEach(sec => { 
        var id = sec.id; 
        var hTag = sec.querySelector('h2, h3');
        var title = hTag ? hTag.innerText : ''; 
        var content = sec.innerText || ''; 
        searchData.push({ id: id, title: title, content: content, normalizedTitle: normalizeArabic(title), normalizedContent: normalizeArabic(content) }); 
    });
    var fuse = new Fuse(searchData, { includeScore: true, threshold: 0.3, ignoreLocation: true, keys: [{ name: 'normalizedTitle', weight: 0.7 }, { name: 'normalizedContent', weight: 0.3 }] });
    window.openSearch = function() { searchModal.classList.add('active'); searchInput.focus(); document.body.style.overflow = 'hidden'; };
    window.closeSearch = function(e) { if(e && e.target !== searchModal) return; searchModal.classList.remove('active'); document.body.style.overflow = ''; };
    document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); window.openSearch(); } if (e.key === 'Escape') window.closeSearch(); });
    searchInput.addEventListener('input', (e) => { var nq = normalizeArabic(e.target.value); if (nq.length < 2) { searchResults.classList.remove('active'); searchResults.innerHTML = ''; return; } var res = fuse.search(nq); searchResults.classList.add('active'); if (res.length === 0) { searchResults.innerHTML = '<div class="search-empty"><i data-lucide="frown" style="margin-bottom:10px; opacity:0.5;"></i><br>لم يتم العثور على نتائج.</div>'; lucide.createIcons(); return; } var html = ''; res.forEach(r => { var snip = r.item.content.substring(0, 120) + '...'; html += \`<a href="#\${r.item.id}" class="search-result-item" onclick="closeSearch()"><div class="search-result-title"><i data-lucide="hash" style="width:16px;"></i> \${r.item.title}</div><div class="search-result-excerpt">\${snip}</div></a>\`; }); searchResults.innerHTML = html; lucide.createIcons(); });
    window.copyTerm = function(term) { navigator.clipboard.writeText(term); };
    
    // إعدادات marked
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: false,
        highlight: function(code, lang) {
            var language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-'
    });

    function setActiveNav(id) {
        if (!id) return;
        document.querySelectorAll('.nav-link, .nav-group-title').forEach(link => link.classList.remove('active'));
        var active = document.querySelector('.nav-link[href="#' + id + '"], .nav-group-title[href="#' + id + '"]');
        if (active) active.classList.add('active');
    }

    var observerSpy = new IntersectionObserver((entries) => {
        // Pick the top-most intersecting section to avoid flicker
        var visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
            setActiveNav(visible[0].target.id);
        }
    }, { root: null, rootMargin: '-20% 0px -65% 0px', threshold: 0 });

    document.querySelectorAll('.search-target').forEach(sec => observerSpy.observe(sec));

    // Immediate feedback on click (IntersectionObserver may lag with fast scroll / short sections)
    var navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.addEventListener('click', function(e) {
            var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
            if (!a) return;
            var hash = (a.getAttribute('href') || '').replace('#', '');
            if (hash) setActiveNav(hash);
        });
    }
    
    var themeToggleFab = document.getElementById('theme-toggle-fab'); var currentTheme = localStorage.getItem('ebook-theme'); if(!currentTheme) currentTheme = 'dark';
    
    var hljsLight = document.getElementById('hljs-theme-light');
    var hljsDark = document.getElementById('hljs-theme-dark');

    function applyTheme(theme) { 
        document.documentElement.setAttribute('data-theme', theme); 
        document.getElementById('sun-icon-fab').style.display = theme === 'dark' ? 'block' : 'none'; 
        document.getElementById('moon-icon-fab').style.display = theme === 'dark' ? 'none' : 'block'; 
        localStorage.setItem('ebook-theme', theme); 

        if (hljsLight && hljsDark) {
            if (theme === 'dark') { hljsDark.disabled = false; hljsLight.disabled = true; }
            else { hljsDark.disabled = true; hljsLight.disabled = false; }
        }
    }
    
    applyTheme(currentTheme); 
    if(themeToggleFab) {
        themeToggleFab.addEventListener('click', () => { currentTheme = currentTheme === 'dark' ? 'light' : 'dark'; applyTheme(currentTheme); });
    }
`;

// تنسيقات محرر البناء التفاعلي
const previewInteractiveCSS = `
    .preview-block-wrapper { position: relative; border: 2px dashed transparent; border-radius: 8px; padding: 12px 10px 4px 10px; margin: 8px -10px; transition: 0.2s; z-index: 1; }
    .preview-block-wrapper.is-focused, .preview-block-wrapper:hover { border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.02); z-index: 50; }
    
    .preview-toolbar { position: absolute; top: -14px; left: 10px; background: var(--bg-card); border: 1px solid var(--border); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-radius: 8px; gap: 2px; padding: 4px; z-index: 100; flex-direction: row; align-items: center; opacity: 0; pointer-events: none; transition: opacity 0.2s;}
    .preview-block-wrapper.is-focused > .preview-toolbar, .preview-block-wrapper:hover > .preview-toolbar { opacity: 1; pointer-events: auto; display: flex; }
    
    .pt-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 4px; transition: 0.2s; font-family: inherit;}
    .pt-btn:hover { background: var(--bg-body); color: var(--text-heading); }
    .pt-btn.danger:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
    
    .settings-panel { position: absolute; top: 100%; left: 0; background: var(--bg-card); border: 1px solid var(--border); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); border-radius: 8px; padding: 12px; display: none; flex-direction: column; gap: 8px; width: 240px; z-index: 200; margin-top: 5px;}
    .settings-panel.show { display: flex; }
    /* Dropdowns used by the floating text toolbar */
    #emoji-dropdown.show { display: grid; }
    #style-dropdown.show { display: flex; }
    .settings-panel input, .settings-panel textarea { width: 100%; background: var(--bg-body); border: 1px solid var(--border); color: var(--text-main); padding: 8px; border-radius: 4px; box-sizing: border-box; font-family: inherit; direction: rtl;}
    .settings-panel input:focus, .settings-panel textarea:focus { outline: 1px solid var(--accent); }
    
    .icon-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 5px; }
    .icon-grid button { background: var(--bg-body); border: 1px solid var(--border); color: var(--text-main); padding: 6px; cursor: pointer; border-radius: 4px; display: flex; justify-content: center; transition:0.2s;}
    .icon-grid button:hover { background: rgba(5, 150, 105, 0.1); color: var(--accent); border-color: var(--accent);}
    .settings-panel label { font-size: 0.8rem; color: var(--text-muted); }

    .add-divider-container { position: absolute; bottom: -20px; left: 0; right: 0; height: 40px; display: flex; align-items: center; justify-content: center; z-index: 105; opacity: 0; transition: opacity 0.2s; }
    .preview-block-wrapper.is-focused > .add-divider-container, .preview-block-wrapper:hover > .add-divider-container { opacity: 1; }
    .add-divider-line { position: absolute; left: 0; right: 0; height: 2px; background: var(--accent); top: 19px; z-index: -1; display: none; }
    .add-divider-container:hover .add-divider-line { display: block; }
    .add-btn-circle { background: var(--bg-card); border: 2px solid var(--border); color: var(--text-muted); width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: 0.2s; }
    .add-btn-circle:hover { border-color: var(--accent); color: var(--accent); transform: scale(1.1); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);}
    
    .inline-add-menu { position: absolute; top: 40px; background: var(--bg-card); border: 1px solid var(--border); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); border-radius: 8px; display: none; flex-direction: row; padding: 5px; gap: 5px;}
    .inline-add-menu.show { display: flex; }
    .inline-add-menu button { background: transparent; border: none; padding: 8px 12px; color: var(--text-main); font-family: inherit; font-size: 0.85rem; cursor: pointer; border-radius: 4px; display:flex; align-items:center; gap:5px; white-space: nowrap;}
    .inline-add-menu button:hover { background: rgba(5, 150, 105, 0.1); color: var(--accent); }

    .editable-text { outline: none; border-radius: 4px; padding: 4px; transition: background 0.2s; border: 1px dashed transparent; display: block; min-height: 1.5em; width: 100%;}
    span.editable-text, strong.editable-text, h1.editable-text, h2.editable-text, h3.editable-text { display: inline-block; width: auto; }
    .editable-text:focus { background: rgba(16, 185, 129, 0.05); border-color: var(--accent); }
    .editable-text:hover { border-color: var(--border); }
    .editable-text[data-placeholder]:empty:before { content: attr(data-placeholder); color: var(--text-muted); pointer-events: none; }
    
    th[contenteditable="true"], td[contenteditable="true"] { outline: none; transition: background 0.2s; }
    th[contenteditable="true"]:focus, td[contenteditable="true"]:focus { background: rgba(16, 185, 129, 0.05); box-shadow: inset 0 0 0 1px var(--accent); }

    .text-format-toolbar { position: fixed; background: #1e293b; border: 1px solid var(--border); border-radius: 8px; padding: 4px; display: none; gap: 4px; z-index: 9999; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); transform: translateY(-10px);}
    .text-format-toolbar button { background: transparent; border: none; color: #e2e8f0; cursor: pointer; padding: 6px 10px; border-radius: 4px; display:flex; align-items:center; gap:5px; font-family:inherit; font-size:0.85rem; font-weight:bold; transition: 0.2s;}
    .text-format-toolbar button:hover { background: rgba(255,255,255,0.1); color: var(--accent); }
    
    .badge-color-picker { position: absolute; top: -35px; right: 0; background: var(--bg-card); border: 1px solid var(--border); padding: 5px; border-radius: 8px; display: none; gap: 5px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);}
    .tag-pill:hover .badge-color-picker { display: flex; }
    .color-dot { width: 20px; height: 20px; border-radius: 50%; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); }
    
    .empty-state { text-align: center; padding: 80px 20px; border: 2px dashed var(--border); border-radius: 16px; margin: 40px auto; max-width: 600px; background: rgba(255,255,255,0.02); }
    .empty-state button { background: var(--accent); color: #000; border: none; padding: 12px 24px; border-radius: 8px; font-family: inherit; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; font-size: 1.1rem;}
    .preview-block-wrapper.drag-over { border-top: 3px solid var(--accent); }
    body.is-dragging .preview-block-wrapper * { pointer-events: none; }
    
    /* Markdown Editor Block overrides */
    .md-editor-textarea { width: 100%; min-height: 200px; background: var(--code-bg); color: var(--text-heading); border: 1px solid var(--border); padding: 15px; border-radius: 0 0 8px 8px; font-family: 'Fira Code', monospace; line-height: 1.6; resize: vertical; box-sizing: border-box; direction: ltr; text-align: left;}
    .md-editor-textarea:focus { outline: none; border-color: var(--accent); }
    .md-tabs { display: flex; background: var(--table-head); border: 1px solid var(--border); border-bottom: none; border-radius: 8px 8px 0 0;}
    .md-tab { padding: 10px 20px; cursor: pointer; font-weight: bold; color: var(--text-muted); border: none; background: transparent; font-family: inherit;}
    .md-tab.active { color: var(--accent); background: var(--bg-card); border-right: 1px solid var(--border);}
`;

function getThemeCSS(themeName) {
    if (window.themesCSS && window.themesCSS[themeName]) {
        return window.themesCSS[themeName];
    }
    console.error('Theme string not found in themes.js:', themeName);
    return '/* Theme fallback */';
}

async function generateHTML(mode = 'export') {
    const title = projectMeta.title || 'بدون عنوان';
    const desc = projectMeta.desc || '';
    const version = projectMeta.version || '';
    const versionClass = projectMeta.versionClass || 'tag-copper';
    const footerText = projectMeta.footer || 'صنع بعناية للمهندس العربي';
    const brandMain = projectMeta.brandMain || 'ESP32 Docs';
    const brandSub = projectMeta.brandSub || 'OSHWA-EG';

    // UID Generation String
    const hasUid = projectMeta.org && projectMeta.dom && projectMeta.projectId;
    const uidStatus = projectMeta.status || projectMeta.statusType || 'COM';
    const uidString = hasUid ? `${projectMeta.org}-${projectMeta.dom}${projectMeta.projectId}-${uidStatus}` : '';

    let sidebarNavHtml = '';
    let mainContentHtml = '';
    let inSection = false;
    let inNavGroup = false;
    let groupIndex = 1;
    let subGroupIndex = 1;

    const commonIcons = ['layers', 'cpu', 'zap', 'git-merge', 'activity', 'image', 'table', 'shield-alert'];

    blocksData.forEach((block, index) => {
        let blockInnerHtml = '';
        let customToolbar = '';

        if (block.type === 'section' || block.type === 'sub_section') {
            if (inSection) {
                mainContentHtml += `</section>\n`;
                inSection = false;
            }

            const secId = block.sectionId || (block.type === 'section' ? `sec_${index}` : `sub_${index}`);
            let secTitle = block.title || 'قسم جديد';
            let displayTitle = secTitle;
            const icon = block.icon || (block.type === 'section' ? 'layers' : 'chevron-left');

            if (block.type === 'section') {
                if (projectMeta.autoNum) displayTitle = `${groupIndex}. ${secTitle.replace(/^\\d+(\\.\\d+)*\\.\\s*/, '')}`;
                else displayTitle = `${groupIndex}. ${secTitle.replace(/^\\d+\\.\\s*/, '')}`;

                if (inNavGroup) sidebarNavHtml += `</div>\n`;
                sidebarNavHtml += `<div class="nav-group"><a href="#${secId}" class="nav-group-title" style="text-decoration:none;"><i data-lucide="${icon}" style="width:16px;"></i> ${displayTitle}</a>\n`;
                inNavGroup = true;
                groupIndex++;
                subGroupIndex = 1;
            } else {
                if (projectMeta.autoNum) {
                    displayTitle = `${groupIndex - 1}.${subGroupIndex}. ${secTitle.replace(/^\\d+(\\.\\d+)*\\.\\s*/, '')}`;
                    subGroupIndex++;
                }
                if (!inNavGroup) { sidebarNavHtml += `<div class="nav-group">\n`; inNavGroup = true; }
                sidebarNavHtml += `<a href="#${secId}" class="nav-link">${displayTitle}</a>\n`;
            }

            const borderColorStyle = block.type === 'section' && block.borderColor ? `style="--section-borderColor: ${block.borderColor};"` : '';
            mainContentHtml += `<section id="${secId}" class="section search-target" ${borderColorStyle}>\n`;
            inSection = true;

            const titleTag = block.type === 'section' ? 'h2' : 'h3';
            const titleClass = block.type === 'section' ? 'class="section-title"' : 'class="sub-section-title"';
            const editableTitle = mode === 'preview' ? `contenteditable="true" class="editable-text"` : '';
            const blurEvent = mode === 'preview' ? `onblur="window.parent.bridgeUpdateText('${block.id}', 'title', this.innerHTML)"` : '';

            let prefixHTML = '';
            let rawTitle = secTitle.replace(/^\d+(\.\d+)*\.\s*/, '');
            if (projectMeta.autoNum) {
                if (block.type === 'section') prefixHTML = `<span style="margin-left:8px; user-select:none; color:var(--text-muted);">${groupIndex - 1}.</span>`;
                else prefixHTML = `<span style="margin-left:8px; user-select:none; color:var(--text-muted);">${groupIndex - 1}.${subGroupIndex - 1}.</span>`;
            }

            blockInnerHtml = `<${titleTag} ${titleClass}><i data-lucide="${icon}"></i> ${prefixHTML}<span ${editableTitle} ${blurEvent} data-placeholder="اكتب العنوان...">${rawTitle}</span></${titleTag}>\n`;

            if (mode === 'preview') {
                let iconsMenu = `<div class="icon-grid">`;
                commonIcons.forEach(ic => iconsMenu += `<button onclick="window.parent.bridgeUpdateText('${block.id}', 'icon', '${ic}'); document.getElementById('settings_${index}').classList.remove('show'); event.stopPropagation();"><i data-lucide="${ic}"></i></button>`);
                iconsMenu += `</div>`;

                let colorsMenu = `<div class="icon-grid" style="grid-template-columns: repeat(6, 1fr);">`;
                ['var(--accent)', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#64748b'].forEach(co => colorsMenu += `<button style="background:${co}; color:white; border:none;" onclick="window.parent.bridgeUpdateText('${block.id}', 'borderColor', '${co}'); document.getElementById('settings_${index}').classList.remove('show'); event.stopPropagation();"></button>`);
                colorsMenu += `</div>`;

                customToolbar = `
                    <div style="position:relative;">
                        <button class="pt-btn" onclick="document.getElementById('settings_${index}').classList.toggle('show')" title="إعدادات القسم"><i data-lucide="settings" style="width:14px;"></i></button>
                        <div class="settings-panel" id="settings_${index}">
                            <label>معرف الرابط (ID):</label>
                            <input type="text" value="${secId}" onchange="window.parent.bridgeUpdateText('${block.id}', 'sectionId', this.value)">
                            ${block.type === 'section' ? `<label style="margin-top:8px; display:block;">لون الشريط الجانبي:</label>${colorsMenu}` : ''}
                            <label style="margin-top:8px; display:block;">اختر أيقونة:</label>
                            ${iconsMenu}
                            <label style="margin-top:8px; display:block;">أو اكتب اسم أيقونة Lucide:</label>
                            <input type="text" dir="ltr" value="${icon}" placeholder="مثال: camera" onchange="window.parent.bridgeUpdateText('${block.id}', 'icon', this.value)">
                        </div>
                    </div>`;
            }
        }
        else if (block.type === 'paragraph') {
            if (mode === 'preview') {
                const pContent = block.content ? block.content.replace(/\n/g, '<br>') : '';
                blockInnerHtml = `<div class="editable-text" contenteditable="true" data-placeholder="اكتب فقرتك هنا..." style="line-height: 1.8;" onblur="window.parent.bridgeUpdateText('${block.id}', 'content', this.innerHTML)">${pContent}</div>\n`;
            } else {
                // If content has block-level HTML tags, avoid wrapping with <p>
                if (/<(ul|ol|div|blockquote|table|li)/i.test(block.content || '')) {
                    blockInnerHtml = `<div class="paragraph-block" style="margin-bottom: 15px;">${block.content || ''}</div>\n`;
                } else {
                    const paragraphs = (block.content || '').split('\n').filter(p => p.trim() !== '');
                    blockInnerHtml = paragraphs.map(p => `<p>${p}</p>\n`).join('') || '';
                }
            }
        }
        else if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
            const hTag = block.type;
            const hClass = block.type === 'h1' ? 'title-h1' : block.type === 'h2' ? 'title-h2' : 'title-h3';
            if (mode === 'preview') {
                const hContent = block.content ? block.content.replace(/\n/g, '<br>') : '';
                blockInnerHtml = `<${hTag} class="${hClass} editable-text" contenteditable="true" data-placeholder="اكتب العنوان هنا..." onblur="window.parent.bridgeUpdateText('${block.id}', 'content', this.innerHTML)">${hContent}</${hTag}>\n`;
            } else {
                blockInnerHtml = `<${hTag} class="${hClass}">${block.content || ''}</${hTag}>\n`;
            }
        }
        else if (block.type === 'markdown') {
            const rawContent = block.content || '';
            let renderedContent = '';

            if (window.marked) {
                if (!window.markedConfigured) {
                    marked.setOptions({
                        gfm: true,
                        breaks: true,
                        headerIds: false,
                        highlight: function (code, lang) {
                            if (window.hljs) {
                                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                                return hljs.highlight(code, { language }).value;
                            }
                            return code;
                        },
                        langPrefix: 'hljs language-'
                    });
                    window.markedConfigured = true;
                }
                renderedContent = marked.parse(rawContent);
            } else {
                renderedContent = `<div class="raw-pre">${rawContent}</div>`;
            }

            if (mode === 'preview') {
                const vMode = block.viewMode || 'preview';
                const isRawActive = vMode === 'raw' ? 'active' : '';
                const isPreviewActive = vMode === 'preview' ? 'active' : '';

                blockInnerHtml = `
                <div class="md-container" style="box-shadow: none;">
                    <div class="md-tabs">
                        <button class="md-tab ${isRawActive}" onclick="window.parent.bridgeToggleMarkdownView('${block.id}', 'raw')">Raw Markdown</button>
                        <button class="md-tab ${isPreviewActive}" onclick="window.parent.bridgeToggleMarkdownView('${block.id}', 'preview')">Preview</button>
                    </div>
                    ${vMode === 'raw'
                        ? `<textarea class="md-editor-textarea" onblur="window.parent.bridgeUpdateMarkdown('${block.id}', this.value)">${rawContent}</textarea>`
                        : `<div class="github-markdown-body" style="border: 1px solid var(--border); border-top: none; border-radius: 0 0 8px 8px;" contenteditable="true" onblur="window.parent.bridgeUpdateMarkdownFromHTML('${block.id}', this.innerHTML)" title="اضغط هنا لتعديل المحتوى مباشرة">${renderedContent}</div>`
                    }
                </div>`;
            } else {
                // Export HTML Output
                blockInnerHtml = `<div class="github-markdown-body">${renderedContent}</div>\n`;
            }
        }
        else if (block.type === 'figure') {
            const imgTag = block.imgUrl ? `<img src="${block.imgUrl}" alt="${block.captionTitle}">` : `<div class="figure-placeholder"><i data-lucide="image" style="width: 48px; height: 48px; margin-bottom: 10px; opacity: 0.5;"></i><br>[صورة/مخطط]</div>`;
            const edTitle = mode === 'preview' ? `contenteditable="true" class="editable-text"` : '';
            const blurTitle = mode === 'preview' ? `onblur="window.parent.bridgeUpdateText('${block.id}', 'captionTitle', this.innerHTML)"` : '';
            const edText = mode === 'preview' ? `contenteditable="true" class="editable-text"` : '';
            const blurText = mode === 'preview' ? `onblur="window.parent.bridgeUpdateText('${block.id}', 'captionText', this.innerHTML)"` : '';

            blockInnerHtml = `<figure class="figure-container"><div class="figure-content">${imgTag}</div><figcaption class="figure-caption"><strong ${edTitle} ${blurTitle} data-placeholder="شكل 1-1">${block.captionTitle || ''}</strong>: <span ${edText} ${blurText} data-placeholder="اكتب الشرح هنا...">${block.captionText || ''}</span></figcaption></figure>\n`;

            if (mode === 'preview') {
                customToolbar = `
                    <div style="position:relative;">
                        <button class="pt-btn" onclick="document.getElementById('settings_${index}').classList.toggle('show')" title="إعدادات الصورة"><i data-lucide="settings" style="width:14px;"></i></button>
                        <div class="settings-panel" id="settings_${index}">
                            <label>رابط الصورة (URL):</label>
                            <input type="text" dir="ltr" value="${block.imgUrl || ''}" onchange="window.parent.bridgeUpdateText('${block.id}', 'imgUrl', this.value)">
                        </div>
                    </div>`;
            }
        }
        else if (block.type === 'table') {
            const data = block.tableData || defaultTable;
            const editable = mode === 'preview' ? 'contenteditable="true" class="editable-cell"' : '';
            const headers = data.headers.map((h, c) => `<th ${editable} onblur="window.parent.bridgeUpdateTableLive('${block.id}', 'header', 0, ${c}, this.innerHTML)">${h}</th>`).join('');

            const rows = data.rows.map((row, r) => {
                let rowContent = row.map((c, ci) => `<td ${editable} onblur="window.parent.bridgeUpdateTableLive('${block.id}', 'cell', ${r}, ${ci}, this.innerHTML)">${c}</td>`).join('');
                if (mode === 'preview') rowContent += `<td style="width:25px; border:none; padding:0; text-align:center; background:transparent !important;"><button class="pt-btn danger" onclick="window.parent.bridgeDelTableRow('${block.id}', ${r})" title="حذف الصف" style="padding:2px;"><i data-lucide="x-circle" style="width:14px;"></i></button></td>`;
                return `<tr>${rowContent}</tr>`;
            }).join('');

            blockInnerHtml = `<div style="overflow-x:auto;"><table class="datasheet-table"><thead><tr>${headers}${mode === 'preview' ? '<th style="width:25px; border:none; background:transparent;"></th>' : ''}</tr></thead><tbody>${rows || '<tr><td colspan="10" style="text-align:center;">لا توجد بيانات</td></tr>'}</tbody></table></div>\n`;

            if (mode === 'preview') {
                blockInnerHtml += `<div style="margin-top:-20px; display:flex; gap:5px; padding:5px; background:var(--bg-card); border:1px solid var(--border); border-top:none; border-radius:0 0 8px 8px; width:fit-content;">
                    <button class="pt-btn" onclick="window.parent.bridgeAddTableRow('${block.id}')"><i data-lucide="plus" style="width:14px;"></i> صف</button>
                    <button class="pt-btn" onclick="window.parent.bridgeAddTableCol('${block.id}')"><i data-lucide="plus" style="width:14px;"></i> عمود</button>
                    <button class="pt-btn danger" onclick="window.parent.bridgeDelTableCol('${block.id}')"><i data-lucide="minus" style="width:14px;"></i> عمود</button>
                </div>\n`;
            }
        }
        else if (block.type === 'alert') {
            const alType = block.alertType || 'info';
            const iconsMap = { info: 'info', success: 'check-circle', warning: 'alert-triangle', danger: 'shield-alert' };
            const alIcon = iconsMap[alType] || 'info';
            const edTitle = mode === 'preview' ? `contenteditable="true" class="editable-text"` : '';
            const blurTitle = mode === 'preview' ? `onblur="window.parent.bridgeUpdateText('${block.id}', 'title', this.innerHTML)"` : '';
            const edText = mode === 'preview' ? `contenteditable="true" class="editable-text"` : '';
            const blurText = mode === 'preview' ? `onblur="window.parent.bridgeUpdateText('${block.id}', 'content', this.innerHTML)"` : '';

            const alertContent = block.content ? block.content.replace(/\n/g, '<br>') : '';
            const hideIcon = block.hideIcon ? 'display:none;' : '';
            blockInnerHtml = `<div class="alert alert-${alType}"><div class="alert-icon" style="${hideIcon}"><i data-lucide="${alIcon}"></i></div><div style="width:100%;"><strong ${edTitle} ${blurTitle} data-placeholder="عنوان التنبيه">${block.title || ''}</strong><div ${edText} ${blurText} data-placeholder="اكتب التنبيه هنا...">${alertContent}</div></div></div>\n`;

            if (mode === 'preview') {
                customToolbar = `
                    <button class="pt-btn" style="color: var(--text-muted)" onclick="window.parent.bridgeUpdateText('${block.id}', 'hideIcon', ${!block.hideIcon})" title="إخفاء/إظهار الأيقونة"><i data-lucide="${block.hideIcon ? 'eye-off' : 'eye'}" style="width:14px;"></i></button>
                    <div style="width:1px; background:var(--border); margin:0 2px;"></div>
                    <button class="pt-btn" style="color: #3b82f6" onclick="window.parent.bridgeUpdateText('${block.id}', 'alertType', 'info')" title="معلومة"><i data-lucide="info" style="width:14px;"></i></button>
                    <button class="pt-btn" style="color: #10b981" onclick="window.parent.bridgeUpdateText('${block.id}', 'alertType', 'success')" title="نجاح"><i data-lucide="check-circle" style="width:14px;"></i></button>
                    <button class="pt-btn" style="color: #f59e0b" onclick="window.parent.bridgeUpdateText('${block.id}', 'alertType', 'warning')" title="تحذير"><i data-lucide="alert-triangle" style="width:14px;"></i></button>
                    <button class="pt-btn" style="color: #ef4444" onclick="window.parent.bridgeUpdateText('${block.id}', 'alertType', 'danger')" title="خطر"><i data-lucide="shield-alert" style="width:14px;"></i></button>`;
            }
        }
        else if (block.type === 'end_section') {
            if (inSection) {
                mainContentHtml += `</section>\n`;
                inSection = false;
            }
            if (mode === 'preview') {
                blockInnerHtml = `<div style="text-align:center; padding:10px; color:var(--border); font-weight:bold; letter-spacing:2px; display:flex; align-items:center; justify-content:center; gap:10px;"><div style="flex:1; height:1px; background:var(--border); opacity:0.5;"></div><i data-lucide="stop-circle" style="width:18px;"></i> نهاية القسم<div style="flex:1; height:1px; background:var(--border); opacity:0.5;"></div></div>`;
            } else {
                blockInnerHtml = ''; // مخفي في التصدير
            }
        }

        // تغليف الكتلة للمعاينة التفاعلية
        if (mode === 'preview') {
            const addMenu = `
                <div class="add-divider-container">
                    <div class="add-divider-line"></div>
                    <button class="add-btn-circle" onclick="document.getElementById('addMenu_${index}').classList.toggle('show'); event.stopPropagation();" title="إضافة كتلة أسفل هذا العنصر"><i data-lucide="plus" style="width:16px;"></i></button>
                    <div class="inline-add-menu" id="addMenu_${index}">
                        <button onclick="window.parent.bridgeAddBlock('paragraph', ${index})"><i data-lucide="align-right" style="width:14px;"></i> نص عادي</button>
                        <button onclick="window.parent.bridgeAddBlock('markdown', ${index})"><i data-lucide="code" style="width:14px;"></i> Markdown</button>
                        <button onclick="window.parent.bridgeAddBlock('table', ${index})"><i data-lucide="table" style="width:14px;"></i> جدول</button>
                        <button onclick="window.parent.bridgeAddBlock('figure', ${index})"><i data-lucide="image" style="width:14px;"></i> صورة</button>
                        <button onclick="window.parent.bridgeAddBlock('alert', ${index})"><i data-lucide="shield-alert" style="width:14px;"></i> تنبيه</button>
                        <div style="width:1px; background:var(--border); margin:0 5px;"></div>
                        <button onclick="window.parent.bridgeAddBlock('h1', ${index})"><i data-lucide="heading-1" style="width:14px;"></i> عنوان H1</button>
                        <button onclick="window.parent.bridgeAddBlock('h2', ${index})"><i data-lucide="heading-2" style="width:14px;"></i> عنوان H2</button>
                        <button onclick="window.parent.bridgeAddBlock('h3', ${index})"><i data-lucide="heading-3" style="width:14px;"></i> عنوان H3</button>
                        <div style="width:1px; background:var(--border); margin:0 5px;"></div>
                        <button onclick="window.parent.bridgeAddBlock('sub_section', ${index})" style="color:var(--copper);"><i data-lucide="chevron-left" style="width:14px;"></i> قسم فرعي</button>
                        <button onclick="window.parent.bridgeAddBlock('section', ${index})" style="color:var(--accent);"><i data-lucide="layers" style="width:14px;"></i> قسم رئيسي</button>
                        <div style="width:1px; background:var(--border); margin:0 5px;"></div>
                        <button onclick="window.parent.bridgeAddBlock('end_section', ${index})" style="color:var(--text-muted);"><i data-lucide="stop-circle" style="width:14px;"></i> إنهاء القسم</button>
                    </div>
                </div>
            `;

            mainContentHtml += `
            <div class="preview-block-wrapper" data-index="${index}" data-block-id="${block.id}"
                 ondragover="window.parent.bridgeDragOver(event, this)" 
                 ondrop="window.parent.bridgeDrop(event, ${index})"
                 ondragenter="window.parent.bridgeDragEnter(event, this)"
                 ondragleave="window.parent.bridgeDragLeave(event, this)">
                <div class="preview-toolbar">
                    <div class="drag-handle" draggable="true" ondragstart="window.parent.bridgeDragStart(event, ${index})" ondragend="window.parent.bridgeDragEnd(event)" style="cursor:grab; padding:4px; opacity:0.6;"><i data-lucide="grip-vertical" style="width:14px;"></i></div> 
                    <div style="width:1px; height:16px; background:var(--border); margin:0 5px;"></div>
                    ${customToolbar}
                    ${customToolbar ? `<div style="width:1px; height:16px; background:var(--border); margin:0 5px;"></div>` : ''}
                    <button class="pt-btn danger" onclick="window.parent.bridgeRemoveBlock(${index})" title="حذف"><i data-lucide="trash-2" style="width:14px;"></i></button>
                </div>
                ${blockInnerHtml}
                ${addMenu}
            </div>\n`;
        } else {
            mainContentHtml += blockInnerHtml;
        }
    });

    if (inSection) mainContentHtml += `</section>\n`;
    if (inNavGroup) sidebarNavHtml += `</div>\n`;

    // حالة المستند الفارغ
    if (blocksData.length === 0 && mode === 'preview') {
        mainContentHtml += `
        <div class="empty-state">
            <i data-lucide="file-text" style="width: 64px; height: 64px; color: var(--border); margin-bottom: 20px;"></i>
            <p style="color:var(--text-muted); margin-bottom:20px; font-size: 1.2rem;">المستند فارغ. ابدأ بإضافة قسم لتبدأ العمل.</p>
            <button onclick="window.parent.bridgeAddBlock('section', -1)"><i data-lucide="plus"></i> إضافة قسم رئيسي</button>
            <button onclick="window.parent.bridgeAddBlock('markdown', -1)" style="background:transparent; border:1px solid var(--border); color:var(--text-main); margin-right:10px;"><i data-lucide="code"></i> إضافة Markdown</button>
        </div>`;
    }

    // Load actual theme CSS
    const themeCSS = getThemeCSS(projectMeta.theme || 'theme-builder');
    const dynamicCSS = mode === 'preview' ? commonCSS + themeCSS + previewInteractiveCSS : commonCSS + themeCSS;

    let interactiveHTML = '';
    if (mode === 'preview') {
        interactiveHTML = `
        <div id="text-format-toolbar" class="text-format-toolbar">
            <button onmousedown="event.preventDefault()" onclick="window.formatText('bold')" title="خط عريض"><i data-lucide="bold" style="width:14px;"></i></button>
            <button onmousedown="event.preventDefault()" onclick="window.formatText('italic')" title="خط مائل"><i data-lucide="italic" style="width:14px;"></i></button>
            <button onmousedown="event.preventDefault()" onclick="window.formatText('underline')" title="تسطير"><i data-lucide="underline" style="width:14px;"></i></button>
            <div style="width:1px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>
            <button onmousedown="event.preventDefault()" onclick="window.formatText('insertUnorderedList')" title="قائمة نقطية"><i data-lucide="list" style="width:14px;"></i></button>
            <button onmousedown="event.preventDefault()" onclick="window.formatText('insertOrderedList')" title="قائمة رقمية"><i data-lucide="list-ordered" style="width:14px;"></i></button>
            <div style="width:1px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>
            <button onmousedown="event.preventDefault()" onclick="window.formatText('justifyRight')" title="محاذاة لليمين"><i data-lucide="align-right" style="width:14px;"></i></button>
            <button onmousedown="event.preventDefault()" onclick="window.formatText('justifyCenter')" title="توسيط"><i data-lucide="align-center" style="width:14px;"></i></button>
            <button onmousedown="event.preventDefault()" onclick="window.formatText('justifyLeft')" title="محاذاة لليسار"><i data-lucide="align-left" style="width:14px;"></i></button>
            <div style="width:1px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>
            <div style="position:relative;" class="emoji-dropdown-container">
                <button onmousedown="event.preventDefault()" onclick="document.getElementById('emoji-dropdown').classList.toggle('show'); event.stopPropagation();" title="إيموجي"><i data-lucide="smile" style="width:14px;"></i></button>
                <div id="emoji-dropdown" class="settings-panel" style="width:220px; grid-template-columns: repeat(6, 1fr); gap:5px; padding:8px; top:-180px; left:0; position:absolute;">
                    <input id="emoji-search" type="search" placeholder="ابحث عن إيموجي..." style="grid-column: 1 / -1; padding:4px 8px; font-size:0.8rem; border-radius:4px; border:1px solid var(--border); background:var(--bg-body); color:var(--text-main); box-sizing:border-box;" />
                    ${['😀','😁','😂','🤣','😃','😄','😅','😉','😊','😋','😎','😍','😘','🤔','🤨','😐','😑','😴','🙄','😮','😢','😭','😡','😳','🤯','🤝','👍','👎','✌️','🙏','💪','🔥','💡','⚠️','✅','❌','📌','📎','✏️','🛠️','⚙️','💻','📱','🔋','📡','📈','📉','📊','🧪','🔗','⭐','🌙','☀️'].map(e => `<button data-emoji="${e}" onmousedown="event.preventDefault()" onclick="window.insertEmoji('${e}')" style="font-size:1.2rem; padding:3px; background:transparent; border:none; cursor:pointer;">${e}</button>`).join('')}
                </div>
            </div>
            <div style="width:1px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>
            <button onmousedown="event.preventDefault()" onclick="window.wrapEngTerm()" title="تغليف كمصطلح هندسي"><i data-lucide="code" style="width:14px;"></i> مصطلح</button>
            <div style="position:relative;" class="custom-style-dropdown-container">
                <button onmousedown="event.preventDefault()" onclick="document.getElementById('style-dropdown').classList.toggle('show'); event.stopPropagation();" title="نمط التمييز"><i data-lucide="star" style="width:14px;"></i> تمييز</button>
                <div id="style-dropdown" class="settings-panel" style="width:150px; grid-template-columns: 1fr; gap:5px; padding:10px; top:-160px; right:0; position:absolute;">
                    <button onmousedown="event.preventDefault()" onclick="window.wrapCustomStyle('tag-copper')" class="tag-pill tag-copper" style="width:100%; border:none; margin:0; font-size:0.8rem; cursor:pointer;">نحاسي (مخصص)</button>
                    <button onmousedown="event.preventDefault()" onclick="window.wrapCustomStyle('tag-green')" class="tag-pill tag-green" style="width:100%; border:none; margin:0; font-size:0.8rem; cursor:pointer;">أخضر (نجاح)</button>
                    <button onmousedown="event.preventDefault()" onclick="window.wrapCustomStyle('tag-blue')" class="tag-pill tag-blue" style="width:100%; border:none; margin:0; font-size:0.8rem; cursor:pointer;">أزرق (مراجعة)</button>
                    <button onmousedown="event.preventDefault()" onclick="window.wrapCustomStyle('tag-red')" class="tag-pill tag-red" style="width:100%; border:none; margin:0; font-size:0.8rem; cursor:pointer;">أحمر (خطر)</button>
                    <button onmousedown="event.preventDefault()" onclick="window.wrapCustomStyle('tag-gray')" class="tag-pill tag-gray" style="width:100%; border:none; margin:0; font-size:0.8rem; cursor:pointer;">رمادي (ملاحظة)</button>
                </div>
            </div>
        </div>`;
    }

    const interactiveJS = mode === 'preview' ? `
        document.addEventListener('click', e => { 
            if(!e.target.closest('.add-divider-container')) document.querySelectorAll('.inline-add-menu').forEach(m => m.classList.remove('show'));
            if(!e.target.closest('.settings-panel') && !e.target.closest('button[title="إعدادات القسم"]') && !e.target.closest('button[title="إعدادات الصورة"]') && !e.target.closest('.emoji-dropdown-container') && !e.target.closest('.custom-style-dropdown-container')) {
                document.querySelectorAll('.settings-panel').forEach(m => m.classList.remove('show'));
            }
            if(e.target.closest('.emoji-dropdown-container') === null && document.getElementById('emoji-dropdown')) {
                document.getElementById('emoji-dropdown').classList.remove('show');
            }
            const wrapper = e.target.closest('.preview-block-wrapper');
            document.querySelectorAll('.preview-block-wrapper').forEach(w => w.classList.remove('is-focused'));
            if(wrapper) wrapper.classList.add('is-focused');
        });

        document.addEventListener('selectionchange', () => {
            const toolbar = document.getElementById('text-format-toolbar');
            if (!toolbar) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0 || !selection.anchorNode) {
                if (!document.getElementById('emoji-dropdown')?.classList.contains('show') &&
                    !document.getElementById('style-dropdown')?.classList.contains('show')) {
                    toolbar.style.display = 'none';
                }
                return;
            }

            // لا نُظهر الشريط إذا لم يكن هناك نص فعلي محدد
            const selectedText = selection.toString().trim();
            if (!selectedText) {
                if (!document.getElementById('emoji-dropdown')?.classList.contains('show') &&
                    !document.getElementById('style-dropdown')?.classList.contains('show')) {
                    toolbar.style.display = 'none';
                }
                return;
            }

            let activeNode = selection.anchorNode.nodeType === 3
                ? selection.anchorNode.parentElement
                : selection.anchorNode;

            if (!activeNode || typeof activeNode.closest !== 'function') {
                return;
            }

            // نقبل أي نص داخل عنصر قابل للتحرير في منطقة المحتوى الرئيسية
            const editableRoot = activeNode.closest('.editable-text, [contenteditable="true"], .github-markdown-body');
            if (!editableRoot) {
                if (!document.getElementById('emoji-dropdown')?.classList.contains('show') &&
                    !document.getElementById('style-dropdown')?.classList.contains('show')) {
                    toolbar.style.display = 'none';
                }
                return;
            }

            const range = selection.getRangeAt(0);
            if (!range) return;

            let rect = range.getBoundingClientRect();

            // في حال كان المستطيل فارغاً (مثلاً سطر فارغ) نرجع لمستطيل العنصر القابل للتحرير
            if (!rect || ((rect.width === 0 && rect.height === 0) || selection.isCollapsed)) {
                if (typeof editableRoot.getBoundingClientRect === 'function') {
                    rect = editableRoot.getBoundingClientRect();
                } else if (editableRoot.parentElement && typeof editableRoot.parentElement.getBoundingClientRect === 'function') {
                    rect = editableRoot.parentElement.getBoundingClientRect();
                }
            }

            if (!rect) return;

            // IMPORTANT:
            // toolbar is position: fixed, so rect.{top,left} are already viewport-relative.
            // Adding scrollY here pushes it off-screen when you scroll.
            toolbar.style.display = 'flex';

            const topPos = rect.top - 45;
            toolbar.style.top = Math.max(8, topPos) + 'px';

            // Center horizontally, clamp within viewport
            const viewportW = window.innerWidth || 0;
            const tbW = toolbar.offsetWidth || 280;
            const desiredLeft = rect.left + (rect.width / 2) - (tbW / 2);
            const clampedLeft = Math.min(Math.max(8, desiredLeft), Math.max(8, viewportW - tbW - 8));
            toolbar.style.left = clampedLeft + 'px';
        });

        window.formatText = function(command) {
            document.execCommand(command, false, null);
            saveCurrentWrapperContent();
        };

        window.insertEmoji = function(emoji) {
            document.execCommand('insertText', false, emoji);
            document.getElementById('emoji-dropdown').classList.remove('show');
            saveCurrentWrapperContent();
        };

        // Emoji search/filter
        (function(){
            var searchInput = document.getElementById('emoji-search');
            if (!searchInput) return;
            searchInput.addEventListener('input', function(e) {
                var q = (e.target.value || '').trim();
                var buttons = document.querySelectorAll('#emoji-dropdown button[data-emoji]');
                if (!q) {
                    buttons.forEach(function(btn){ btn.style.display = 'inline-flex'; });
                    return;
                }
                buttons.forEach(function(btn){
                    var emoji = btn.getAttribute('data-emoji') || '';
                    btn.style.display = emoji.includes(q) ? 'inline-flex' : 'none';
                });
            });
        })();

        // Ctrl+Z / Ctrl+Y inside iframe should undo/redo in parent app history
        document.addEventListener('keydown', (e) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            const key = (e.key || '').toLowerCase();
            if (key === 'z') {
                e.preventDefault();
                e.stopPropagation();
                if (window.parent && window.parent.bridgeUndo) window.parent.bridgeUndo();
            } else if (key === 'y') {
                e.preventDefault();
                e.stopPropagation();
                if (window.parent && window.parent.bridgeRedo) window.parent.bridgeRedo();
            }
        }, true);

        window.unwrapToken = function(el) {
            try {
                if (!el || !el.parentNode) return;
                const t = el.getAttribute('data-term') || el.innerText || '';
                el.replaceWith(document.createTextNode(t));
                saveCurrentWrapperContent();
            } catch (_) {}
        };

        window.wrapEngTerm = function() {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            const range = selection.getRangeAt(0);
            const text = range.toString().trim();
            if (!text) return;
            
            const span = document.createElement('span');
            span.className = 'eng-term';
            span.setAttribute('data-term', text);
            span.innerHTML = text + ' <i data-lucide="copy" style="width:12px;"></i>';
            span.setAttribute('onclick', "copyTerm('" + text.replace(/'/g, "\\\\'") + "')");
            span.setAttribute('ondblclick', 'window.unwrapToken(this)');
            span.contentEditable = "false";
            
            range.deleteContents();
            range.insertNode(span);
            if(window.lucide) lucide.createIcons();
            
            const toolbar = document.getElementById('text-format-toolbar');
            if(toolbar) toolbar.style.display = 'none';
            saveCurrentWrapperContent();
        };

        window.wrapCustomStyle = function(colorClass) {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            const range = selection.getRangeAt(0);
            const text = range.toString().trim();
            if (!text) return;
            
            const span = document.createElement('span');
            span.className = 'tag-pill ' + colorClass;
            span.style.padding = '2px 8px';
            span.style.margin = '0 4px';
            span.innerText = text;
            span.setAttribute('ondblclick', 'window.unwrapToken(this)');
            span.contentEditable = "false";
            
            range.deleteContents();
            range.insertNode(span);
            
            document.getElementById('style-dropdown').classList.remove('show');
            const toolbar = document.getElementById('text-format-toolbar');
            if(toolbar) toolbar.style.display = 'none';

            // Save first BEFORE removing selection range!
            saveCurrentWrapperContent();
            window.getSelection().removeAllRanges();
        };

        function saveCurrentWrapperContent() {
            const selection = window.getSelection();
            if(!selection.anchorNode) return;
            let el = selection.anchorNode;
            if(el.nodeType === 3) el = el.parentElement;
            
            const editable = el.closest('[contenteditable="true"]');
            if (editable) {
                const blurCode = editable.getAttribute('onblur');
                if (blurCode) {
                    const saveFunc = new Function(blurCode);
                    saveFunc.call(editable);
                }
            }
        }

    ` : '';

    const finalJS = `(function() { \n ${templateJS} \n })(); \n ${interactiveJS}`;

    const edTitle = mode === 'preview' ? `contenteditable="true" class="editable-text" onblur="window.parent.bridgeUpdateMeta('title', this.innerHTML)"` : '';
    const edDesc = mode === 'preview' ? `contenteditable="true" class="editable-text" onblur="window.parent.bridgeUpdateMeta('desc', this.innerHTML)"` : '';
    const edVersion = mode === 'preview' ? `contenteditable="true" class="editable-text" onblur="window.parent.bridgeUpdateMeta('version', this.innerHTML)"` : '';
    const edFooter = mode === 'preview' ? `contenteditable="true" class="editable-text" style="width:100%; text-align:center;" onblur="window.parent.bridgeUpdateMeta('footer', this.innerHTML)"` : '';
    const edBrandMain = mode === 'preview' ? `contenteditable="true" class="editable-text" onblur="window.parent.bridgeUpdateMeta('brandMain', this.innerHTML)"` : '';
    const edBrandSub = mode === 'preview' ? `contenteditable="true" class="editable-text" onblur="window.parent.bridgeUpdateMeta('brandSub', this.innerHTML)"` : '';

    const colorPicker = mode === 'preview' ? `
        <div class="badge-color-picker">
            <div class="color-dot" style="background:#d97706" onclick="window.parent.bridgeSetBadgeColor('tag-copper')"></div>
            <div class="color-dot" style="background:#10b981" onclick="window.parent.bridgeSetBadgeColor('tag-green')"></div>
            <div class="color-dot" style="background:#3b82f6" onclick="window.parent.bridgeSetBadgeColor('tag-blue')"></div>
            <div class="color-dot" style="background:#ef4444" onclick="window.parent.bridgeSetBadgeColor('tag-red')"></div>
            <div class="color-dot" style="background:#94a3b8" onclick="window.parent.bridgeSetBadgeColor('tag-gray')"></div>
        </div>` : '';

    const uidElement = '';

    const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${projectMeta.seoDesc || desc}">
    <title>${projectMeta.seoTitle || title} | OSHWA-EG</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"><\/script>
    <script src="https://unpkg.com/lucide@latest"><\/script>
    <!-- Markdown dependencies -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css" id="hljs-theme-light" disabled>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css" id="hljs-theme-dark">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"><\/script>
    
    ${mode === 'export-zip' ? '<link rel="stylesheet" href="assets/style.css">' : `<style>\n${dynamicCSS}\n</style>`}
</head>
    <body>
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-brand" style="margin-bottom: 20px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i data-lucide="${projectMeta.brandIcon || 'cpu'}" style="width:28px; height:28px; flex-shrink:0; color:var(--text-heading);"></i>
                        ${projectMeta.logoUrl ? `<img src="${projectMeta.logoUrl}" alt="Logo" style="max-height:32px; border-radius:4px; flex-shrink:0;">` : ''}
                        <div style="display:flex; flex-direction:column; justify-content:center;">
                            <span ${edBrandMain} style="font-weight:900; font-size:1.1rem; line-height:1.2; color:var(--text-heading);">${brandMain}</span>
                            <span ${edBrandSub} style="font-size:0.85rem; color:var(--gold); font-weight:700; line-height:1.2;">${brandSub}</span>
                        </div>
                    </div>
                </div>
            <button class="search-trigger" onclick="openSearch()"><span><i data-lucide="search" style="width:16px; vertical-align:middle; margin-left:8px;"></i> ابحث في الدليل...</span><span class="kbd">Ctrl+K</span></button>
        </div>
        <nav class="nav-content" id="nav-menu">${sidebarNavHtml}</nav>
    </aside>

    <div class="search-modal-backdrop" id="searchModal" onclick="closeSearch(event)">
        <div class="search-modal" onclick="event.stopPropagation()">
            <div class="search-header"><i data-lucide="search"></i><input type="text" class="search-input" id="searchInput" placeholder="ابحث عن مصطلح..." autocomplete="off"></div>
            <div class="search-results" id="searchResults"></div>
        </div>
    </div>

    <main class="main-wrapper">
        <div class="main">
            <header class="document-header">
                ${uidElement}
                <div>
                    <div style="position:relative; display:inline-block;" class="tag-pill">
                        <span class="tag-pill ${versionClass}" ${edVersion} style="margin:0;">${uidString || version}</span>
                        ${colorPicker}
                    </div>
                </div>
                <h1 ${edTitle}>${title}</h1>
                <p ${edDesc}>${desc}</p>
            </header>
            
            ${mainContentHtml}
            
            <div class="legal-footer"><div ${edFooter}>${footerText.replace(/\n/g, '<br>')}</div></div>
        </div>
    </main>

    ${interactiveHTML}

    <button class="theme-toggle-fab" id="theme-toggle-fab" title="تغيير المظهر">
        <i data-lucide="moon" id="moon-icon-fab" style="display:none;"></i>
        <i data-lucide="sun" id="sun-icon-fab"></i>
    </button>
    <script>${finalJS}<\/script>
</body>
</html>`;
    return fullHtml;
}

async function updatePreview() {
    const htmlContent = await generateHTML('preview');
    const iframe = document.getElementById('previewFrame');
    const doc = iframe.contentWindow.document;
    doc.open(); doc.write(htmlContent); doc.close();
    iframe.onload = () => { iframe.contentWindow.scrollTo(0, iframeScrollY); };

    const headerCodeEl = document.getElementById('headerProjectCode');
    if (headerCodeEl) {
        let hUid = '';
        if (projectMeta.dom && projectMeta.status && projectMeta.projectId) {
            hUid = `OE-${projectMeta.dom}${projectMeta.projectId}-${projectMeta.status}`;
        }
        headerCodeEl.innerText = hUid ? ` - ${hUid}` : '';
    }
}

async function exportHTML() {
    saveToLocalStorage();
    const htmlContent = await generateHTML('export');
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'OSHW_Documentation_Final.html';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportJSON() {
    saveToLocalStorage();
    const dataStr = localStorage.getItem('oshw_builder_v2_data');
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const a = document.createElement('a');
    a.href = dataUri; a.download = 'OSHW_Project_Draft.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try { loadProjectData(JSON.parse(e.target.result)); triggerUpdate(); }
        catch (err) { alert("ملف JSON غير صالح!"); }
    };
    reader.readAsText(file); event.target.value = '';
}
