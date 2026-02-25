// ================= Block Operations =================

function generateId() {
    return 'b_' + Date.now() + Math.random().toString(36).substr(2, 5);
}

function addBlock(type, atIndex = -1) {
    const blockId = generateId();
    let block = { id: blockId, type: type };

    if (type === 'alert') { block.alertType = 'info'; block.title = 'تنبيه هندسي'; block.content = ''; }
    if (type === 'table') {
        block.tableData = {
            headers: ['الميزة', 'المواصفات'],
            rows: [['المتحكم', 'ESP32'], ['جهد التشغيل', '3.3V']]
        };
    }
    if (type === 'section') { block.title = 'عنوان القسم الرئيسي'; block.icon = 'layers'; block.sectionId = 'sec_' + Date.now().toString().substr(-4); }
    if (type === 'sub_section') { block.title = 'عنوان فرعي جديد'; block.icon = 'chevron-left'; block.sectionId = 'sub_' + Date.now().toString().substr(-4); }
    if (type === 'h1') { block.content = 'عنوان رئيسي كبير (H1)'; }
    if (type === 'h2') { block.content = 'عنوان فرعي أول (H2)'; }
    if (type === 'h3') { block.content = 'عنوان فرعي ثاني (H3)'; }
    if (type === 'paragraph') { block.content = ''; }
    if (type === 'markdown') { block.content = '# ماركداون جديد...\n\nاكتب الكود أو الشرح هنا.'; block.viewMode = 'preview'; }

    if (atIndex !== -1) blocksData.splice(atIndex + 1, 0, block);
    else blocksData.push(block);

    // إضافة فقرة فارغة تلقائياً بعد الأقسام الجديدة
    if (type === 'section' || type === 'sub_section') {
        const pId = generateId();
        const pBlock = { id: pId, type: 'paragraph', content: '' };
        if (atIndex !== -1) blocksData.splice(atIndex + 2, 0, pBlock);
        else blocksData.push(pBlock);
    }

    triggerUpdate();
}

function moveBlock(index, dir) {
    if (index + dir < 0 || index + dir >= blocksData.length) return;
    [blocksData[index], blocksData[index + dir]] = [blocksData[index + dir], blocksData[index]];
    triggerUpdate();
}

function removeBlock(id) {
    blocksData = blocksData.filter(b => b.id !== id);
    triggerUpdate();
}
