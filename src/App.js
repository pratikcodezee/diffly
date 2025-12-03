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
  const [language, setLanguage] = useState('plaintext');
  const [viewMode, setViewMode] = useState('side-by-side');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage, default to 'light'
    const savedTheme = localStorage.getItem('diffly-theme');
    return savedTheme || 'light';
  });
  const diffEditorRef = useRef(null);
  const monacoRef = useRef(null);
  // Store content in refs to avoid re-renders causing cursor jumps
  const originalTextRef = useRef('');
  const modifiedTextRef = useRef('');

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

  // Sync editor content to refs
  const syncEditorContent = () => {
    if (diffEditorRef.current) {
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      originalTextRef.current = originalEditor.getValue();
      modifiedTextRef.current = modifiedEditor.getValue();
    }
  };

  const formatJSON = (text) => {
    if (!text.trim()) return text;
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  };

  const formatHTML = (text) => {
    if (!text.trim()) return text;
    let formatted = '';
    let indent = 0;
    const lines = text.replace(/>\s*</g, '>\n<').split('\n');
    
    lines.forEach(line => {
      line = line.trim();
      if (!line) return;
      
      if (line.match(/^<\/\w/)) indent--;
      formatted += '  '.repeat(Math.max(0, indent)) + line + '\n';
      if (line.match(/^<\w[^>]*[^\/]>/) && !line.match(/^<(br|hr|img|input|meta|link)/i)) indent++;
    });
    return formatted.trim();
  };

  const formatCSS = (text) => {
    if (!text.trim()) return text;
    return text
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s+\n/g, '\n')
      .replace(/{\n\s+}/g, '{ }')
      .trim();
  };

  const formatXML = (text) => {
    if (!text.trim()) return text;
    let formatted = '';
    let indent = 0;
    const lines = text.replace(/>\s*</g, '>\n<').split('\n');
    
    lines.forEach(line => {
      line = line.trim();
      if (!line) return;
      
      if (line.match(/^<\/\w/)) indent--;
      formatted += '  '.repeat(Math.max(0, indent)) + line + '\n';
      if (line.match(/^<\w[^>]*[^\/]>/) && !line.match(/^<\?/)) indent++;
    });
    return formatted.trim();
  };

  const formatYAML = (text) => {
    if (!text.trim()) return text;
    return text.split('\n').map(line => {
      const trimmed = line.trimEnd();
      return trimmed;
    }).join('\n').trim();
  };

  const formatSQL = (text) => {
    if (!text.trim()) return text;
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'VALUES', 'SET', 'INTO'];
    let formatted = text;
    
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, kw);
    });
    
    formatted = formatted
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT INTO|UPDATE|DELETE FROM|CREATE|ALTER|DROP|VALUES|SET)\b/gi, '\n$1')
      .replace(/^\n/, '')
      .trim();
    
    return formatted;
  };

  const formatText = () => {
    if (!diffEditorRef.current) return;
    
    const originalEditor = diffEditorRef.current.getOriginalEditor();
    const modifiedEditor = diffEditorRef.current.getModifiedEditor();
    const originalValue = originalEditor.getValue();
    const modifiedValue = modifiedEditor.getValue();
    
    try {
      let formattedOriginal = originalValue;
      let formattedModified = modifiedValue;
      
      switch (language) {
        case 'json':
          if (originalValue) formattedOriginal = formatJSON(originalValue);
          if (modifiedValue) formattedModified = formatJSON(modifiedValue);
          break;
        case 'html':
          if (originalValue) formattedOriginal = formatHTML(originalValue);
          if (modifiedValue) formattedModified = formatHTML(modifiedValue);
          break;
        case 'css':
          if (originalValue) formattedOriginal = formatCSS(originalValue);
          if (modifiedValue) formattedModified = formatCSS(modifiedValue);
          break;
        case 'xml':
          if (originalValue) formattedOriginal = formatXML(originalValue);
          if (modifiedValue) formattedModified = formatXML(modifiedValue);
          break;
        case 'yaml':
          if (originalValue) formattedOriginal = formatYAML(originalValue);
          if (modifiedValue) formattedModified = formatYAML(modifiedValue);
          break;
        case 'sql':
          if (originalValue) formattedOriginal = formatSQL(originalValue);
          if (modifiedValue) formattedModified = formatSQL(modifiedValue);
          break;
        case 'javascript':
        case 'typescript':
        case 'python':
        case 'java':
        case 'csharp':
        case 'cpp':
          // Use Monaco's built-in formatter for code languages
          originalEditor.getAction('editor.action.formatDocument')?.run();
          modifiedEditor.getAction('editor.action.formatDocument')?.run();
          setTimeout(syncEditorContent, 100);
          return;
        default:
          // For plaintext and markdown, just trim whitespace
          if (originalValue) formattedOriginal = originalValue.trim();
          if (modifiedValue) formattedModified = modifiedValue.trim();
      }
      
      originalEditor.setValue(formattedOriginal);
      modifiedEditor.setValue(formattedModified);
      syncEditorContent();
    } catch (e) {
      alert(`Cannot format: ${e.message}`);
    }
  };

  const clearAll = () => {
    if (diffEditorRef.current) {
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      originalEditor.setValue('');
      modifiedEditor.setValue('');
    }
    originalTextRef.current = '';
    modifiedTextRef.current = '';
  };

  const handleDiffEditorDidMount = (editor, monaco) => {
    diffEditorRef.current = editor;
    monacoRef.current = monaco;
    
    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();
    
    originalEditor.updateOptions({ readOnly: false });
    modifiedEditor.updateOptions({ readOnly: false });

    // Listen for content changes - store in refs (no re-render)
    originalEditor.onDidChangeModelContent(() => {
      originalTextRef.current = originalEditor.getValue();
    });
    modifiedEditor.onDidChangeModelContent(() => {
      modifiedTextRef.current = modifiedEditor.getValue();
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
    wordWrap: 'off',
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
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all',
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
      alwaysConsumeMouseWheel: false,
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
          <button onClick={() => setShowHelpModal(true)} className="help-toggle" title="Help & Info">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
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
            height="100%"
            language={language}
            original={originalTextRef.current}
            modified={modifiedTextRef.current}
            onMount={handleDiffEditorDidMount}
            theme={editorTheme}
            options={diffEditorOptions}
          />
        </div>
      </div>

      {showHelpModal && (
        <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>About Diffly</h2>
              <button className="modal-close" onClick={() => setShowHelpModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="help-section">
                <h3>Diffly v1.0</h3>
                <p>A modern diff viewer for comparing text and code.</p>
              </div>
              <div className="help-section">
                <h3>How to Use</h3>
                <ul>
                  <li><strong>Original Panel:</strong> Paste or type your original text</li>
                  <li><strong>Modified Panel:</strong> Paste or type your modified text</li>
                  <li><strong>Language:</strong> Select the appropriate language for syntax highlighting</li>
                  <li><strong>View:</strong> Toggle between side-by-side and inline diff views</li>
                  <li><strong>Format:</strong> Auto-format code based on selected language</li>
                  <li><strong>Clear:</strong> Reset both panels</li>
                </ul>
              </div>
              <div className="help-section">
                <h3>Keyboard Shortcuts</h3>
                <ul>
                  <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> - Format document</li>
                  <li><kbd>Ctrl</kbd> + <kbd>Z</kbd> - Undo</li>
                  <li><kbd>Ctrl</kbd> + <kbd>Y</kbd> - Redo</li>
                </ul>
              </div>
              <div className="help-section help-footer">
                <p>Created by <strong>Pratik Gohil</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
