import React, { useState, useRef, useEffect } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import './App.css';

const LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
];

function App() {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [viewMode, setViewMode] = useState('side-by-side');
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage, default to 'light'
    const savedTheme = localStorage.getItem('diffly-theme');
    return savedTheme || 'light';
  });
  const diffEditorRef = useRef(null);
  const monacoRef = useRef(null);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('diffly-theme', theme);
  }, [theme]);

  // Update editor options when theme changes (without remounting)
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
    }
  }, [theme]);

  // Update language model when language changes
  useEffect(() => {
    if (diffEditorRef.current && monacoRef.current) {
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      
      const originalModel = originalEditor.getModel();
      const modifiedModel = modifiedEditor.getModel();
      
      if (originalModel && modifiedModel) {
        monacoRef.current.editor.setModelLanguage(originalModel, language);
        monacoRef.current.editor.setModelLanguage(modifiedModel, language);
      }
    }
  }, [language]);

  // Sync editor content to state
  const syncEditorContent = () => {
    if (diffEditorRef.current) {
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      setOriginalText(originalEditor.getValue());
      setModifiedText(modifiedEditor.getValue());
    }
  };

  const formatText = () => {
    if (!diffEditorRef.current) return;
    
    const originalEditor = diffEditorRef.current.getOriginalEditor();
    const modifiedEditor = diffEditorRef.current.getModifiedEditor();
    
    if (language === 'json') {
      try {
        const originalValue = originalEditor.getValue();
        const modifiedValue = modifiedEditor.getValue();
        
        if (originalValue) {
          const parsed = JSON.parse(originalValue);
          originalEditor.setValue(JSON.stringify(parsed, null, 2));
        }
        if (modifiedValue) {
          const parsed = JSON.parse(modifiedValue);
          modifiedEditor.setValue(JSON.stringify(parsed, null, 2));
        }
        syncEditorContent();
      } catch (e) {
        alert('Invalid JSON format. Cannot format.');
      }
    } else {
      originalEditor.getAction('editor.action.formatDocument')?.run();
      modifiedEditor.getAction('editor.action.formatDocument')?.run();
      setTimeout(syncEditorContent, 100);
    }
  };

  const clearAll = () => {
    if (diffEditorRef.current) {
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      originalEditor.setValue('');
      modifiedEditor.setValue('');
    }
    setOriginalText('');
    setModifiedText('');
  };

  const handleDiffEditorDidMount = (editor, monaco) => {
    diffEditorRef.current = editor;
    monacoRef.current = monaco;
    
    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();
    
    originalEditor.updateOptions({ readOnly: false });
    modifiedEditor.updateOptions({ readOnly: false });

    // Listen for content changes
    originalEditor.onDidChangeModelContent(() => {
      setOriginalText(originalEditor.getValue());
    });
    modifiedEditor.onDidChangeModelContent(() => {
      setModifiedText(modifiedEditor.getValue());
    });
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleViewModeChange = (newViewMode) => {
    syncEditorContent();
    setViewMode(newViewMode);
  };

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  const diffEditorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 13,
    fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",
    wordWrap: 'on',
    automaticLayout: true,
    readOnly: false,
    renderSideBySide: viewMode === 'side-by-side',
    theme: editorTheme,
    enableSplitViewResizing: true,
    originalEditable: true,
    modifiedEditable: true,
    lineNumbers: 'on',
    glyphMargin: true,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all',
    scrollbar: {
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
  };

  return (
    <div className={`App ${theme}`}>
      <header className="app-header">
        <div className="header-left">
          <div className="app-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h8v2H3V6zm0 4h8v2H3v-2zm0 4h8v2H3v-2zm13-8h5v2h-5V6zm0 4h5v2h-5v-2zm0 4h5v2h-5v-2z" fill="#007ACC"/>
              <path d="M11 6l2 6-2 6" stroke="#007ACC" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>Diffly</h1>
        </div>
        <div className="header-right">
          <button onClick={toggleTheme} className="theme-toggle" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="control-group">
            <label htmlFor="language-select">Language</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select-control"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="view-mode">View</label>
            <select
              id="view-mode"
              value={viewMode}
              onChange={(e) => handleViewModeChange(e.target.value)}
              className="select-control"
            >
              <option value="side-by-side">Side by Side</option>
              <option value="unified">Inline</option>
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          <button onClick={formatText} className="toolbar-btn" title="Format Code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h10M4 17h16"/>
            </svg>
            <span>Format</span>
          </button>
          <button onClick={clearAll} className="toolbar-btn btn-danger" title="Clear All">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
            </svg>
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="editor-panel">
        <div className="editor-labels">
          <div className="editor-label original">
            <span className="label-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </span>
            Original
          </div>
          {viewMode === 'side-by-side' && (
            <div className="editor-label modified">
              <span className="label-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </span>
              Modified
            </div>
          )}
        </div>
        <div className="diff-status-bar">
          <div className="diff-legend">
            <span className="legend-item">
              <span className="legend-dot added"></span>
              Added
            </span>
            <span className="legend-item">
              <span className="legend-dot removed"></span>
              Removed
            </span>
          </div>
        </div>
        <div className="editor-wrapper">
          <DiffEditor
            key={viewMode}
            height="calc(100vh - 130px)"
            language={language}
            original={originalText}
            modified={modifiedText}
            onMount={handleDiffEditorDidMount}
            theme={editorTheme}
            options={diffEditorOptions}
          />
        </div>
      </div>

      <footer className="app-footer">
        <span className="footer-text">Built by <strong>Pratik</strong></span>
        <span className="footer-divider">•</span>
        <span className="footer-text">Diffly v1.0</span>
      </footer>
    </div>
  );
}

export default App;
