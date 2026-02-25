// ================= Theme Definitions =================
// CSS variables are stored here to bypass CORS issues when running as a local file (Offline-first SPA).

const themesCSS = {
    'theme-builder': `
/* ================= Theme: Classic Builder ================= */
:root {
    --bg-body: #faf9f6; --bg-sidebar: #0f172a; --bg-card: #ffffff;
    --text-main: #374151; --text-muted: #6b7280; --text-heading: #111827;
    --accent: #059669; --accent-hover: #047857; --accent-light: rgba(5, 150, 105, 0.1);
    --border: #e5e7eb; --gold: #d97706; --table-head: #f9fafb; --table-stripe: #f3f4f6; --code-bg: #f1f5f9;
    --alert-danger-bg: #fef2f2; --alert-danger-border: #ef4444; --alert-danger-text: #b91c1c; 
    --alert-info-bg: #eff6ff; --alert-info-border: #3b82f6; --alert-info-text: #1d4ed8; 
    --alert-success-bg: #f0fdf4; --alert-success-border: #22c55e; --alert-success-text: #15803d; 
    --alert-warning-bg: #fffbeb; --alert-warning-border: #f59e0b; --alert-warning-text: #b45309;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05); --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1); --sidebar-width: 320px;
}
[data-theme="dark"] { 
    --bg-body: #020617; --bg-sidebar: #0f172a; --bg-card: #1e293b;
    --text-main: #e2e8f0; --text-muted: #94a3b8; --text-heading: #f8fafc;
    --accent: #10b981; --accent-light: rgba(16, 185, 129, 0.15);
    --border: #334155; --gold: #fbbf24; --table-head: #0f172a; --table-stripe: #111827; --code-bg: #0b1120;
    --alert-danger-bg: rgba(239, 68, 68, 0.1); --alert-danger-border: #ef4444; --alert-danger-text: #fca5a5; 
    --alert-info-bg: rgba(59, 130, 246, 0.1); --alert-info-border: #3b82f6; --alert-info-text: #93c5fd; 
    --alert-success-bg: rgba(16, 185, 129, 0.1); --alert-success-border: #10b981; --alert-success-text: #6ee7b7; 
    --alert-warning-bg: rgba(245, 158, 11, 0.1); --alert-warning-border: #f59e0b; --alert-warning-text: #fcd34d;
}
html { scroll-behavior: smooth; scroll-padding-top: 80px; }
body { margin: 0; font-family: 'Tajawal', sans-serif; background: var(--bg-body); color: var(--text-main); display: flex; min-height: 100vh; line-height: 1.8; font-size: 1.15rem; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
.sidebar { width: var(--sidebar-width); background: var(--bg-sidebar); color: #f8fafc; height: 100vh; position: fixed; right: 0; top: 0; overflow-y: auto; z-index: 40; border-left: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; box-shadow: var(--shadow-sm); }
.sidebar-header { padding: 24px; position: sticky; top: 0; background: var(--bg-sidebar); z-index: 10; border-bottom: 1px solid rgba(255,255,255,0.1); }
.sidebar-brand { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; width: 100%; box-sizing: border-box; } 
.sidebar-brand h2 { margin: 0; font-size: 1.4rem; color: #f8fafc; display: flex; align-items: center; gap: 8px; } 
.sidebar-brand span { color: var(--gold); font-size:0.95rem; font-weight:700;}
.search-trigger { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; padding: 10px 16px; border-radius: 8px; cursor: pointer; width: 100%; font-family: inherit; font-size: 0.95rem; box-sizing: border-box;} .search-trigger:hover { border-color: var(--accent); color: white; }
.search-trigger .kbd { background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; font-family: 'Fira Code', monospace; }
.nav-content { padding: 24px; } .nav-group { margin-bottom: 24px; } .nav-group-title { font-size: 0.95rem; color: #f8fafc; margin-bottom: 12px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
.sidebar a { display: block; color: #94a3b8; text-decoration: none; margin: 4px 0; padding: 8px 16px; border-radius: 6px; border-right: 3px solid transparent; font-weight: 500; transition: 0.2s;} .sidebar a:hover { color: white; background: rgba(255,255,255,0.05); } .sidebar a.active { background: rgba(16, 185, 129, 0.15); color: var(--accent); border-right-color: var(--accent); font-weight: 700; }
.main-wrapper { margin-right: var(--sidebar-width); width: calc(100% - var(--sidebar-width)); display: flex; justify-content: center; } .main { max-width: 950px; width: 100%; padding: 60px 40px; box-sizing: border-box; }
header.document-header { background: linear-gradient(135deg, var(--bg-card), var(--bg-body)); padding: 40px; border-radius: 16px; margin-bottom: 60px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); border-right: 6px solid var(--accent); position:relative;}
.project-uid-badge { display: inline-block; padding: 6px 14px; border-radius: 8px; background: var(--code-bg); border: 1px solid var(--border); font-family: 'Fira Code', monospace; font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 20px; box-shadow: var(--shadow-sm); }
.tag-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; margin-bottom: 16px; margin-right: 10px; letter-spacing: 1px; user-select:none;}
.tag-copper { background: rgba(217, 119, 6, 0.15); color: var(--gold); border: 1px solid rgba(217, 119, 6, 0.3); } 
.tag-green { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); } 
.tag-blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); } 
.tag-red { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); } 
.tag-gray { background: rgba(100, 116, 139, 0.15); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.3); }
header.document-header h1 { margin: 0 0 16px 0; font-size: 2.8rem; font-weight: 900; color: var(--text-heading); line-height: 1.4; } 
header.document-header p { font-size: 1.25rem; color: var(--text-muted); margin: 0; }
.section { background: var(--bg-card); padding: 40px; border-radius: 16px; margin-bottom: 40px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
h2.section-title { color: var(--text-heading); border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-top: 0; margin-bottom: 25px; font-weight: 900; font-size: 2rem; display: flex; align-items: center; gap: 12px; }
h3.sub-section-title { color: var(--text-heading); margin-top: 35px; margin-bottom: 15px; font-weight: 800; font-size: 1.4rem; display: flex; align-items: center; gap: 10px; } 
h3.sub-section-title i { color: var(--accent); }
.title-h1 { font-size: 2.2rem; font-weight: 900; color: var(--text-heading); margin: 30px 0 15px 0; line-height: 1.3; }
.title-h2 { font-size: 1.8rem; font-weight: 800; color: var(--text-heading); margin: 25px 0 15px 0; line-height: 1.3; }
.title-h3 { font-size: 1.4rem; font-weight: 700; color: var(--text-heading); margin: 20px 0 10px 0; line-height: 1.3; }
p { margin-bottom: 15px; }
ul, ol { padding-inline-start: 25px; margin-bottom: 15px; }
li { margin-bottom: 8px; }
.eng-term { background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: 2px 8px; font-family: 'Fira Code', monospace; color: var(--accent); font-size: 0.9em; direction: ltr; display: inline-flex; align-items: center; gap: 6px; margin: 0 4px; cursor: pointer; font-weight: 500; } 
.eng-term:hover { border-color: var(--accent); background: var(--accent-light); }
.alert { padding: 24px; border-radius: 12px; margin: 30px 0; border-right: 4px solid; display: flex; gap: 16px; align-items: flex-start; } 
.alert-icon { flex-shrink: 0; margin-top: 2px; } 
.alert-danger { background-color: var(--alert-danger-bg); border-color: var(--alert-danger-border); color: var(--alert-danger-text); } 
.alert-info { background-color: var(--alert-info-bg); border-color: var(--alert-info-border); color: var(--alert-info-text); } 
.alert-success { background-color: var(--alert-success-bg); border-color: var(--alert-success-border); color: var(--alert-success-text); } 
.alert-warning { background-color: var(--alert-warning-bg); border-color: var(--alert-warning-border); color: var(--alert-warning-text); }
.alert strong { display: block; margin-bottom: 8px; font-size: 1.1rem; }
.figure-container { margin: 40px 0; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--bg-card); box-shadow: var(--shadow-sm); } 
.figure-content { padding: 20px; background: var(--code-bg); display: flex; justify-content: center; align-items: center; min-height: 200px; } 
.figure-content img { max-width: 100%; height: auto; border-radius: 8px; } 
.figure-placeholder { border: 2px dashed var(--border); border-radius: 8px; padding: 40px; text-align: center; color: var(--text-muted); width: 100%; box-sizing: border-box;} 
.figure-caption { padding: 15px 20px; background: var(--table-head); border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.95rem; text-align: center; }
.datasheet-table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 30px 0; font-size: 1rem; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-sm); } 
.datasheet-table th, .datasheet-table td { padding: 14px 18px; text-align: right; border-bottom: 1px solid var(--border); border-left: 1px solid var(--border); } 
.datasheet-table th:last-child, .datasheet-table td:last-child { border-left: none; } 
.datasheet-table tr:last-child td { border-bottom: none; } 
.datasheet-table th { background: var(--table-head); color: var(--text-heading); font-weight: 800; } 
.datasheet-table tr:nth-child(even) { background-color: var(--table-stripe); }
.datasheet-table tbody tr:hover td { background-color: var(--accent-light) !important; transition: background 0.2s;}
.legal-footer { margin-top: 80px; text-align: center; font-size: 1rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 40px; line-height: 1.8;}
.theme-toggle-fab { position: fixed; bottom: 30px; left: 30px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-main); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: var(--shadow-md); z-index: 50;}
.search-modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); z-index: 100; display: none; align-items: flex-start; justify-content: center; padding-top: 10vh; opacity: 0; transition: 0.2s; } .search-modal-backdrop.active { display: flex; opacity: 1; }
.search-modal { background: var(--bg-card); width: 90%; max-width: 650px; border-radius: 16px; box-shadow: var(--shadow-lg), 0 0 0 1px var(--border); overflow: hidden; display: flex; flex-direction: column; max-height: 80vh; transform: scale(0.95); transition: 0.2s; } .search-modal-backdrop.active .search-modal { transform: scale(1); }
.search-header { display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--border); } .search-header i { color: var(--accent); } .search-input { width: 100%; padding: 20px; border: none; background: transparent; font-size: 1.2rem; color: var(--text-heading); outline: none; }
.search-results { overflow-y: auto; padding: 10px; display: none; } .search-results.active { display: block; } .search-result-item { display: block; padding: 16px; border-radius: 8px; text-decoration: none; color: var(--text-main); margin-bottom: 4px; border: 1px solid transparent;} .search-result-item:hover { background: var(--accent-light); border-color: var(--border); } .search-result-title { color: var(--accent); font-weight: 800; font-size: 1.1rem; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; } .search-result-excerpt { font-size: 0.95rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; } .search-empty { padding: 40px 20px; text-align: center; color: var(--text-muted); }
.md-container { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--bg-card); margin-top: 15px; }
.raw-pre { background: var(--code-bg); color: var(--text-heading); padding: 20px; margin: 0; border-radius: 0; font-family: 'Fira Code', monospace; font-size: 1rem; direction: ltr; text-align: left; }
.github-markdown-body { padding: 30px; line-height: 1.8; word-wrap: break-word; color: var(--text-main); }
.github-markdown-body h1, .github-markdown-body h2 { border-bottom: 1px solid var(--border); padding-bottom: .3em; color: var(--text-heading); margin-top: 24px; margin-bottom: 16px; font-weight: 600; font-size: 1.5em; }
.github-markdown-body h3 { font-size: 1.25em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; color: var(--text-heading); }
.github-markdown-body p { margin-top: 0; margin-bottom: 16px; }
.github-markdown-body a { color: #0969da; text-decoration: none; }
[data-theme="dark"] .github-markdown-body a { color: #58a6ff; }
.github-markdown-body table { width: 100%; border-spacing: 0; border-collapse: collapse; margin-top: 0; margin-bottom: 16px; }
.github-markdown-body table th, .github-markdown-body table td { padding: 6px 13px; border: 1px solid var(--border); }
.github-markdown-body table tr { background-color: var(--bg-card); }
.github-markdown-body table tr:nth-child(2n) { background-color: var(--table-stripe); }
.github-markdown-body pre { background-color: var(--code-bg); border-radius: 6px; padding: 16px; overflow: auto; direction: ltr; text-align: left; margin-bottom: 16px;}
.github-markdown-body code { background-color: rgba(175, 184, 193, 0.2); border-radius: 6px; padding: .2em .4em; font-family: 'Fira Code', monospace; font-size: 85%; }
[data-theme="dark"] .github-markdown-body code { background-color: rgba(110, 118, 129, 0.4); }
.github-markdown-body pre code { background: transparent; padding: 0; font-size: 100%; }
.github-markdown-body blockquote { padding: 0 1em; color: var(--text-muted); border-right: .25em solid var(--border); margin: 0 0 16px 0; }
@media print { body { background: white !important; color: black !important; font-size: 11pt; } .sidebar, .theme-toggle-fab, .search-modal-backdrop { display: none !important; } .main-wrapper { margin: 0; width: 100%; } .main { padding: 0; max-width: 100%; } .document-header, .section, .alert, .figure-content, .figure-caption, .datasheet-table th, .datasheet-table tr:nth-child(even) { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .section { page-break-inside: avoid; margin-bottom: 30px; box-shadow: none !important; border: 1px solid #ddd !important; } h2.section-title, .figure-container, .datasheet-table { page-break-inside: avoid; } [data-theme="dark"] .section { background: #f8fafc !important; color: #111 !important; border-color: #cbd5e1 !important; } [data-theme="dark"] .text-heading, [data-theme="dark"] h2, [data-theme="dark"] h3 { color: #0f172a !important; } [data-theme="dark"] .text-muted { color: #475569 !important; } [data-theme="dark"] .alert-info { background: #eff6ff !important; } [data-theme="dark"] .alert-danger { background: #fef2f2 !important; } [data-theme="dark"] .alert-success { background: #f0fdf4 !important; } [data-theme="dark"] .alert-warning { background: #fffbeb !important; } [data-theme="dark"] .datasheet-table th { background: #e2e8f0 !important; color: #000 !important;} [data-theme="dark"] .datasheet-table td { background: #fff !important; color: #000 !important;} [data-theme="dark"] .figure-content { background: #f1f5f9 !important; } [data-theme="dark"] .figure-caption { background: #e2e8f0 !important; color: #111 !important; } }
    `,

    'theme-charter': `
/* ================= Theme: Charter (GitHub/Modern) ================= */
:root {
    --bg-body: #f4f6f8; --bg-sidebar: #0f172a; --bg-card: #ffffff;
    --bg-body: #fdfbf7; --bg-sidebar: #0f172a; --bg-card: #ffffff;
    --text-main: #374151; --text-muted: #6b7280; --text-heading: #111827;
    --accent: #059669; --accent-hover: #047857;
    --border: #e6e4de; --gold: #d97706; --quote-bg: #fefce8; --code-bg: #f1f5f9;
    --table-head: #faf9f6; --table-stripe: #f8f7f3;
    --shadow-card: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
    --alert-danger-bg: #fef2f2; --alert-danger-border: #ef4444; --alert-danger-text: #b91c1c; 
    --alert-info-bg: #eff6ff; --alert-info-border: #3b82f6; --alert-info-text: #1d4ed8; 
    --alert-success-bg: #f0fdf4; --alert-success-border: #22c55e; --alert-success-text: #15803d; 
    --alert-warning-bg: #fffbeb; --alert-warning-border: #f59e0b; --alert-warning-text: #b45309;
    --sidebar-width: 280px; --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
[data-theme="dark"] {
    --bg-body: #020617; --bg-sidebar: #0f172a; --bg-card: #1e293b;
    --text-main: #e2e8f0; --text-muted: #94a3b8; --text-heading: #f8fafc;
    --accent: #10b981; --accent-hover: #34d399;
    --border: #334155; --gold: #fbbf24; --quote-bg: rgba(217, 119, 6, 0.1); --code-bg: #0b1120;
    --table-head: #0f172a; --table-stripe: #111827; --shadow-card: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    --alert-danger-bg: rgba(239, 68, 68, 0.1); --alert-danger-border: #ef4444; --alert-danger-text: #fca5a5; 
    --alert-info-bg: rgba(59, 130, 246, 0.1); --alert-info-border: #3b82f6; --alert-info-text: #93c5fd; 
    --alert-success-bg: rgba(16, 185, 129, 0.1); --alert-success-border: #10b981; --alert-success-text: #6ee7b7; 
    --alert-warning-bg: rgba(245, 158, 11, 0.1); --alert-warning-border: #f59e0b; --alert-warning-text: #fcd34d;
}
html { scroll-behavior: smooth; }
body { margin: 0; font-family: 'Tajawal', sans-serif; background: var(--bg-body); color: var(--text-main); display: flex; min-height: 100vh; transition: background-color 0.3s ease, color 0.3s ease; line-height: 1.8; font-size: 1.1rem; }
.sidebar { width: var(--sidebar-width); background: var(--bg-sidebar); color: white; height: 100vh; position: fixed; right: 0; top: 0; padding: 20px 0; overflow-y: auto; box-sizing: border-box; z-index: 100; border-left: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
.sidebar-header { padding: 0 15px 15px 15px; display: flex; flex-direction: column; border-bottom: 1px solid rgba(255,255,255,.1); margin-bottom: 15px; }
.sidebar-brand h2 { margin: 0; font-weight: 900; font-size: 1.3rem; color: #f8fafc; display: flex; align-items: center; gap: 8px;}
.sidebar-brand span { font-size: 0.9rem; color: var(--gold); }
.search-trigger { margin-top: 15px; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; padding: 10px; border-radius: 8px; cursor: pointer; width: 100%; font-family: inherit; font-size: 0.9rem; box-sizing: border-box;}
.search-trigger .kbd { background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-family: 'Fira Code', monospace; }
.nav-content { padding: 0 15px; } .nav-group-title { font-size: 0.9rem; color: #f8fafc; margin-top: 15px; margin-bottom: 5px; font-weight: 800; }
.sidebar a { display: block; color: #cbd5e1; text-decoration: none; margin: 4px 0; font-size: 0.95rem; transition: var(--transition); padding: 8px 15px; border-radius: 8px; position: relative; overflow: hidden; }
.sidebar a::before { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 4px; background: var(--accent); transform: scaleY(0); transition: transform 0.3s ease; border-radius: 4px; }
.sidebar a:hover { background: rgba(255,255,255,0.05); color: white; padding-right: 20px; }
.sidebar a.active { background: rgba(5, 150, 105, 0.15); color: var(--accent); font-weight: 700; padding-right: 20px; }
.sidebar a.active::before { transform: scaleY(1); }
.main-wrapper { margin-right: var(--sidebar-width); width: calc(100% - var(--sidebar-width)); display: flex; justify-content: center; }
.main { max-width: 1100px; width: 100%; padding: 50px; box-sizing: border-box; }
header.document-header { background: linear-gradient(135deg, var(--bg-sidebar), #1e293b); color: white; padding: 60px 50px; border-radius: 16px; margin-bottom: 50px; box-shadow: var(--shadow-card); position: relative; overflow: hidden; }
[data-theme="dark"] header.document-header { background: linear-gradient(135deg, #0f172a, #020617); border: 1px solid var(--border); }
header.document-header::before { content: ''; position: absolute; top: -50px; left: -50px; width: 250px; height: 250px; background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(255,255,255,0) 70%); }
header.document-header h1 { margin: 0 0 16px 0; font-size: 2.5rem; font-weight: 900; position: relative; z-index: 1; line-height: 1.4; color: white;}
header.document-header p { opacity: 0.8; margin: 0; font-size: 1.25rem; position: relative; z-index: 1; color: white;}
.project-uid-badge { position: relative; z-index: 1; display: inline-block; padding: 6px 14px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); font-family: 'Fira Code', monospace; font-size: 0.95rem; font-weight: 700; color: white; margin-bottom: 20px; backdrop-filter: blur(4px); }
.tag-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; margin-bottom: 16px; margin-right: 10px; position:relative; z-index:1;}
/* Tag colors (used in header + inline text highlighting) */
.tag-copper { background: rgba(217, 119, 6, 0.16); color: var(--gold); border: 1px solid rgba(217, 119, 6, 0.35); }
.tag-green  { background: rgba(16, 185, 129, 0.16); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.35); }
.tag-blue   { background: rgba(59, 130, 246, 0.16); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.35); }
.tag-red    { background: rgba(239, 68, 68, 0.16); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.35); }
.tag-gray   { background: rgba(100, 116, 139, 0.16); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.35); }
.section { background: var(--bg-card); padding: 50px; border-radius: 16px; margin-bottom: 40px; box-shadow: var(--shadow-card); border-right: 6px solid var(--section-borderColor, var(--accent)); transition: var(--transition); }
h2.section-title { margin-top: 0; color: var(--text-heading); border-bottom: 2px solid var(--border); padding-bottom: 20px; margin-bottom: 30px; font-weight: 900; font-size: 2rem; display: flex; align-items: center; gap: 12px;}
h3.sub-section-title { color: var(--text-heading); margin-top: 40px; margin-bottom: 20px; font-weight: 700; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; }
.title-h1 { font-size: 2.2rem; font-weight: 900; color: var(--text-heading); margin: 30px 0 15px 0; line-height: 1.3; }
.title-h2 { font-size: 1.8rem; font-weight: 800; color: var(--text-heading); margin: 25px 0 15px 0; line-height: 1.3; }
.title-h3 { font-size: 1.4rem; font-weight: 700; color: var(--text-heading); margin: 20px 0 10px 0; line-height: 1.3; }
p { margin-bottom: 20px; }
ul, ol { padding-inline-start: 25px; margin-bottom: 20px; }
li { margin-bottom: 8px; }
.eng-term { background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: 2px 8px; font-family: 'Fira Code', monospace; color: var(--accent); font-size: 0.9em; direction: ltr; display: inline-flex; align-items: center; gap: 6px; margin: 0 4px; cursor: pointer; font-weight: 500; } 
.eng-term:hover { border-color: var(--accent); background: var(--accent-light); }
.alert { padding: 24px; border-radius: 12px; margin: 30px 0; border-right: 4px solid; display: flex; gap: 16px; align-items: flex-start; } 
.alert-danger { background-color: var(--alert-danger-bg); border-color: var(--alert-danger-border); color: var(--alert-danger-text); } 
.alert-info { background-color: var(--alert-info-bg); border-color: var(--alert-info-border); color: var(--alert-info-text); } 
.alert-success { background-color: var(--alert-success-bg); border-color: var(--alert-success-border); color: var(--alert-success-text); } 
.alert-warning { background-color: var(--alert-warning-bg); border-color: var(--alert-warning-border); color: var(--alert-warning-text); }
.alert strong { display: block; margin-bottom: 8px; font-size: 1.1rem; }
table.datasheet-table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 30px 0; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
table.datasheet-table th, table.datasheet-table td { padding: 18px; text-align: right; border-bottom: 1px solid var(--border); border-left: 1px solid var(--border); }
table.datasheet-table th:last-child, table.datasheet-table td:last-child { border-left: none; }
table.datasheet-table tr:last-child td { border-bottom: none; }
table.datasheet-table th { background: var(--table-head); color: var(--text-heading); font-weight: 700; font-size: 1.15rem; }
table.datasheet-table tr:nth-child(even) { background-color: var(--table-stripe); }
.figure-container { margin: 40px 0; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--bg-card); box-shadow: var(--shadow-card); } 
.figure-content { padding: 20px; background: var(--table-stripe); display: flex; justify-content: center; align-items: center; min-height: 200px; } 
.figure-content img { max-width: 100%; height: auto; border-radius: 8px; } 
.figure-placeholder { border: 2px dashed var(--border); border-radius: 8px; padding: 40px; text-align: center; color: var(--text-muted); width: 100%; box-sizing: border-box;} 
.figure-caption { padding: 15px 20px; background: var(--bg-card); border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.95rem; text-align: center; }
.md-container { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-top: 30px; background: var(--bg-card); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
.github-markdown-body { padding: 40px; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif; font-size: 16px; line-height: 1.8; word-wrap: break-word; color: var(--text-main); background-color: var(--bg-card); }
.github-markdown-body h1, .github-markdown-body h2 { border-bottom: 1px solid var(--border); padding-bottom: .3em; color: var(--text-heading); margin-top: 30px; margin-bottom: 20px; font-weight: 600; font-size: 1.5em; }
.github-markdown-body h3 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; color: var(--text-heading); font-size: 1.25em;}
.github-markdown-body a { color: #0969da; text-decoration: none; font-weight: 500;}
[data-theme="dark"] .github-markdown-body a { color: #58a6ff; }
.github-markdown-body a:hover { text-decoration: underline; }
.github-markdown-body table { display: table; width: 100%; border-spacing: 0; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; box-shadow: none; border-radius: 4px; }
.github-markdown-body table th, .github-markdown-body table td { padding: 10px 15px; border: 1px solid var(--border); text-align: right; }
.github-markdown-body table tr { background-color: var(--bg-card); }
.github-markdown-body table tr:nth-child(2n) { background-color: var(--table-stripe); }
.github-markdown-body pre { background-color: var(--code-bg); border-radius: 8px; padding: 20px; overflow: auto; direction: ltr; text-align: left; border: 1px solid var(--border); margin-bottom: 20px; }
.github-markdown-body code { background-color: rgba(175, 184, 193, 0.2); border-radius: 6px; padding: .2em .4em; font-family: 'Fira Code', monospace; font-size: 85%; }
[data-theme="dark"] .github-markdown-body code { background-color: rgba(110, 118, 129, 0.4); }
.github-markdown-body pre code { background: transparent; padding: 0; font-size: 14px; }
.github-markdown-body blockquote { padding: 0 1em; color: var(--text-muted); border-right: .25em solid var(--gold); margin: 0 0 20px 0; background: var(--quote-bg); padding: 25px; border-radius: 8px; font-weight: 500; font-size: 1.2rem; line-height: 1.9;}
.legal-footer { margin-top: 80px; text-align: center; font-size: 1rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 40px; line-height: 1.8;}
.theme-toggle-fab { position: fixed; bottom: 30px; left: 30px; background: rgba(255,255,255,0.1); border: none; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(4px); z-index: 50; transition: var(--transition);}
.theme-toggle-fab:hover { background: rgba(255,255,255,0.2); }
.search-modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); z-index: 100; display: none; align-items: flex-start; justify-content: center; padding-top: 10vh; opacity: 0; transition: 0.2s; } .search-modal-backdrop.active { display: flex; opacity: 1; }
.search-modal { background: var(--bg-card); width: 90%; max-width: 650px; border-radius: 16px; box-shadow: var(--shadow-card), 0 0 0 1px var(--border); overflow: hidden; display: flex; flex-direction: column; max-height: 80vh; transform: scale(0.95); transition: 0.2s; } .search-modal-backdrop.active .search-modal { transform: scale(1); }
.search-header { display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--border); } .search-header i { color: var(--accent); } .search-input { width: 100%; padding: 20px; border: none; background: transparent; font-size: 1.2rem; color: var(--text-heading); outline: none; }
.search-results { overflow-y: auto; padding: 10px; display: none; } .search-results.active { display: block; } .search-result-item { display: block; padding: 16px; border-radius: 8px; text-decoration: none; color: var(--text-main); margin-bottom: 4px; border: 1px solid transparent;} .search-result-item:hover { background: var(--accent-light); border-color: var(--border); } .search-result-title { color: var(--accent); font-weight: 800; font-size: 1.1rem; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; } .search-result-excerpt { font-size: 0.95rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; } .search-empty { padding: 40px 20px; text-align: center; color: var(--text-muted); }
@media(max-width: 1000px) { .sidebar { width: 100%; height: auto; border-left: none; position: relative; } .main-wrapper { margin-right: 0; width: 100%; } .main { padding: 30px 20px; } .section { padding: 40px 30px; } }
    `
};

window.themesCSS = themesCSS;
