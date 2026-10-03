// app.js - MeisterFormel Applikationslogik

(function () {
  'use strict';

  // Storage key
  const STORAGE_KEY = 'meisterformel_data_v1';

  // State object
  let appState = {
    title: "Formelsammlung: Elektrotechnik Meisterprüfung",
    subtitle: "Fachtheorie Teil II: Grundgrößen, Wechselstrom & Drehstrom",
    author: "Meisteranwärter Elektrotechnik",
    date: new Date().toLocaleDateString('de-DE'),
    theme: "theme-navy",
    columns: "cols-2",
    formulaSize: "math-size-large",
    cards: []
  };

  // Currently focused input element for math insertion
  let lastFocusedInput = null;

  // Zoom level for A4 paper preview
  let currentZoom = 1.0;

  // DOM Elements
  const el = {
    // Header actions
    templateBtn: document.getElementById('templateBtn'),
    templateMenu: document.getElementById('templateMenu'),
    btnImport: document.getElementById('btnImport'),
    importFileInput: document.getElementById('importFileInput'),
    btnExportJson: document.getElementById('btnExportJson'),
    btnMathHelp: document.getElementById('btnMathHelp'),
    btnPrintPdf: document.getElementById('btnPrintPdf'),
    btnResetAll: document.getElementById('btnResetAll'),
    // View toggles
    btnViewSplit: document.getElementById('btnViewSplit'),
    btnViewEditor: document.getElementById('btnViewEditor'),
    btnViewPreview: document.getElementById('btnViewPreview'),
    // Editor controls
    sheetTitle: document.getElementById('sheetTitle'),
    sheetSubtitle: document.getElementById('sheetSubtitle'),
    sheetAuthor: document.getElementById('sheetAuthor'),
    sheetColumns: document.getElementById('sheetColumns'),
    sheetTheme: document.getElementById('sheetTheme'),
    formulaSize: document.getElementById('formulaSize'),
    cardsList: document.getElementById('cardsList'),
    btnAddCard: document.getElementById('btnAddCard'),
    btnAddNote: document.getElementById('btnAddNote'),
    cardCountBadge: document.getElementById('cardCountBadge'),
    // Preview targets
    printSheet: document.getElementById('printSheet'),
    previewTitle: document.getElementById('previewTitle'),
    previewSubtitle: document.getElementById('previewSubtitle'),
    previewAuthor: document.getElementById('previewAuthor'),
    previewDate: document.getElementById('previewDate'),
    previewGrid: document.getElementById('previewGrid'),
    autoSaveIndicator: document.getElementById('autoSaveIndicator'),
    // Zoom controls
    paperStage: document.querySelector('.paper-stage'),
    btnZoomIn: document.getElementById('btnZoomIn'),
    btnZoomOut: document.getElementById('btnZoomOut'),
    btnZoomReset: document.getElementById('btnZoomReset'),
    zoomLevelText: document.getElementById('zoomLevelText'),
    // Modal
    helpModal: document.getElementById('helpModal'),
    btnCloseHelp: document.getElementById('btnCloseHelp'),
    btnGotItHelp: document.getElementById('btnGotItHelp'),
  };

  /* ====================================================
     Initialisierung
  ==================================================== */
  function init() {
    loadSavedDataOrPreset('elektro');
    bindGlobalEvents();
    bindMathQuickButtons();
    bindTabNavigation();
    renderAll();
    refreshIcons();
    setupAutosaveDebounce();
  }

  /* ====================================================
     Daten laden & Vorlagen
  ==================================================== */
  function loadSavedDataOrPreset(presetKey = 'elektro') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        appState = JSON.parse(saved);
        if (!appState.cards || !Array.isArray(appState.cards)) {
          throw new Error('Ungültiges Datenformat');
        }
        return;
      } catch (e) {
        console.warn('Konnte gespeicherte Daten nicht laden, lade Vorgabe:', e);
      }
    }
    loadPreset(presetKey, false);
  }

  function loadPreset(key, confirmPrompt = true) {
    if (confirmPrompt && appState.cards.length > 0) {
      const ok = confirm("Möchtest du diese Vorlage laden? Alle nicht gespeicherten Anpassungen werden überschrieben.");
      if (!ok) return;
    }

    const template = PRESET_TEMPLATES[key] || PRESET_TEMPLATES.elektro;
    appState = {
      title: template.title,
      subtitle: template.subtitle,
      author: template.author,
      date: new Date().toLocaleDateString('de-DE'),
      theme: template.theme || 'theme-navy',
      columns: template.columns || 'cols-2',
      formulaSize: template.formulaSize || 'math-size-large',
      cards: JSON.parse(JSON.stringify(template.cards))
    };

    saveToStorage();
    renderAll();
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      flashAutosave();
    } catch (e) {
      console.error('Fehler beim Speichern in LocalStorage:', e);
    }
  }

  function flashAutosave() {
    if (!el.autoSaveIndicator) return;
    el.autoSaveIndicator.style.opacity = '1';
    clearTimeout(el.autoSaveIndicator._timer);
    el.autoSaveIndicator._timer = setTimeout(() => {
      el.autoSaveIndicator.style.opacity = '0.6';
    }, 1500);
  }

  /* ====================================================
     Rendering (Editor & A4 Sheet Preview)
  ==================================================== */
  function renderAll() {
    // 1. Meta Fields im Editor aktualisieren
    el.sheetTitle.value = appState.title || '';
    el.sheetSubtitle.value = appState.subtitle || '';
    el.sheetAuthor.value = appState.author || '';
    el.sheetColumns.value = appState.columns || 'cols-2';
    el.sheetTheme.value = appState.theme || 'theme-navy';
    if (el.formulaSize) {
      el.formulaSize.value = appState.formulaSize || 'math-size-large';
    }

    // 2. A4 Sheet Header & Theme aktualisieren
    el.previewTitle.textContent = appState.title || 'Formelsammlung';
    el.previewSubtitle.textContent = appState.subtitle || '';
    el.previewAuthor.textContent = appState.author || 'Prüfling';
    el.previewDate.textContent = appState.date || new Date().toLocaleDateString('de-DE');

    // Theme & Column & Formel-Größe classes
    const sizeClass = appState.formulaSize || 'math-size-large';
    el.printSheet.className = `a4-sheet ${appState.theme} ${appState.columns} ${sizeClass}`;
    el.cardsList.className = `cards-list ${sizeClass}`;

    // 3. Karten-Zähler
    el.cardCountBadge.textContent = appState.cards.length;

    // 4. Editor-Karten rendern
    renderEditorCards();

    // 5. Vorschau-Karten rendern
    renderPreviewCards();

    // 6. Symbole in Buttons rendern
    renderAllSymbolsInButtons();

    refreshIcons();
  }

  /* Editor Karten rendern */
  function renderEditorCards() {
    el.cardsList.innerHTML = '';

    if (appState.cards.length === 0) {
      el.cardsList.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: #64748b; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;">
          <p style="font-weight: 600; margin-bottom: 0.5rem;">Noch keine Formelkarten vorhanden</p>
          <p style="font-size: 0.8rem; margin-bottom: 1rem;">Klicke oben auf "+ Formelkarte hinzufügen" oder wähle eine Meister-Vorlage.</p>
        </div>
      `;
      return;
    }

    appState.cards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'edit-card-item';
      cardEl.dataset.id = card.id;

      if (card.type === 'note') {
        // Reiner Notiz-/Textblock
        cardEl.innerHTML = `
          <div class="edit-card-header">
            <div class="edit-card-title-group">
              <span class="card-num-badge">${index + 1}</span>
              <span>Notizblock: ${escapeHtml(card.title || 'Unbenannt')}</span>
            </div>
            <div class="edit-card-actions">
              <button class="btn-icon" data-action="move-up" data-index="${index}" title="Nach oben"><i data-lucide="arrow-up"></i></button>
              <button class="btn-icon" data-action="move-down" data-index="${index}" title="Nach unten"><i data-lucide="arrow-down"></i></button>
              <button class="btn-icon" data-action="delete" data-index="${index}" title="Löschen" style="color: #dc2626;"><i data-lucide="trash-2"></i></button>
            </div>
          </div>
          <div class="edit-card-body">
            <div class="form-group">
              <label>Überschrift</label>
              <input type="text" class="form-input card-field" data-field="title" value="${escapeHtml(card.title || '')}" placeholder="z. B. Wichtige VDE Prüfschritte">
            </div>
            <div class="form-group">
              <label>Textinhalt (unterstützt Formeln wie \\(R \\le 0{,}3\\,\\Omega\\))</label>
              <textarea class="form-textarea card-field math-aware" data-field="content" rows="4" placeholder="Schreibe Notizen oder Aufzählungen...">${escapeHtml(card.content || '')}</textarea>
            </div>
          </div>
        `;
      } else {
        // Formelkarte
        cardEl.innerHTML = `
          <div class="edit-card-header">
            <div class="edit-card-title-group">
              <span class="card-num-badge">${index + 1}</span>
              <span>${escapeHtml(card.title || 'Neue Formel')}</span>
            </div>
            <div class="edit-card-actions">
              <button class="btn-icon" data-action="duplicate" data-index="${index}" title="Duplizieren"><i data-lucide="copy"></i></button>
              <button class="btn-icon" data-action="move-up" data-index="${index}" title="Nach oben"><i data-lucide="arrow-up"></i></button>
              <button class="btn-icon" data-action="move-down" data-index="${index}" title="Nach unten"><i data-lucide="arrow-down"></i></button>
              <button class="btn-icon" data-action="delete" data-index="${index}" title="Löschen" style="color: #dc2626;"><i data-lucide="trash-2"></i></button>
            </div>
          </div>
          <div class="edit-card-body">
            <div class="form-grid">
              <div class="form-group">
                <label>Titel der Formel</label>
                <input type="text" class="form-input card-field" data-field="title" value="${escapeHtml(card.title || '')}" placeholder="z. B. Ohm'sches Gesetz">
              </div>
              <div class="form-group">
                <label>Kategorie / Fachgebiet</label>
                <input type="text" class="form-input card-field" data-field="tag" value="${escapeHtml(card.tag || '')}" placeholder="z. B. Grundlagen">
              </div>
            </div>

            <div class="form-group">
              <label>Hauptformel</label>
              <div class="math-input-wrap">
                <textarea class="form-textarea card-field math-aware" data-field="mainFormula" rows="2">${escapeHtml(card.mainFormula || '')}</textarea>
              </div>
            </div>

            <div class="form-group">
              <label>Formelumstellungen / Ergänzung</label>
              <input type="text" class="form-input card-field math-aware" data-field="derivedFormula" value="${escapeHtml(card.derivedFormula || '')}" placeholder="z. B. U = R \\cdot I \\Leftrightarrow I = \\frac{U}{R}">
            </div>

            <div class="form-group">
              <label>Formelzeichen & Einheiten (jede Zeile eins)</label>
              <textarea class="form-textarea card-field math-aware" data-field="variables" rows="2" placeholder="U: Spannung [\\text{V}]&#10;I: Stromstärke [\\text{A}]">${escapeHtml(card.variables || '')}</textarea>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Beispielrechnung / Musteraufgabe (optional)</label>
                <textarea class="form-textarea card-field math-aware" data-field="example" rows="2" placeholder="Gegeben: U = 230 V, I = 5 A...">${escapeHtml(card.example || '')}</textarea>
              </div>
              <div class="form-group">
                <label>Meister-Prüfungstipp / Fallstrick (optional)</label>
                <textarea class="form-textarea card-field math-aware" data-field="tip" rows="2" placeholder="Achtung bei Drehstrom...">${escapeHtml(card.tip || '')}</textarea>
              </div>
            </div>
          </div>
        `;
      }

      el.cardsList.appendChild(cardEl);
    });

    // Re-bind focus listeners so math insert buttons target the active input
    bindFocusListeners();
  }

  /* Vorschau-Karten auf A4 Sheet rendern */
  function renderPreviewCards() {
    el.previewGrid.innerHTML = '';

    appState.cards.forEach((card) => {
      const cardEl = document.createElement('div');

      if (card.type === 'note') {
        // Notizkarte
        cardEl.className = 'sheet-note-card';
        cardEl.innerHTML = `
          ${card.title ? `<div class="sheet-note-title">${escapeHtml(card.title)}</div>` : ''}
          <div class="sheet-note-body">${formatRichText(card.content || '')}</div>
        `;
      } else {
        // Formelkarte
        cardEl.className = 'sheet-card';

        // 1. Header
        let html = `
          <div class="sheet-card-header">
            <span class="sheet-card-title">${escapeHtml(card.title || 'Formel')}</span>
            ${card.tag ? `<span class="sheet-card-tag">${escapeHtml(card.tag)}</span>` : ''}
          </div>
        `;

        // 2. Main Formula
        if (card.mainFormula) {
          html += `
            <div class="sheet-formula-box">
              <div class="sheet-formula-main">${renderMainFormulaMultiline(card.mainFormula)}</div>
            </div>
          `;
        }

        // 3. Derived Formulas
        if (card.derivedFormula) {
          html += `
            <div class="sheet-derived-box">
              <div class="derived-label">Formelumstellung & Varianten</div>
              <div class="derived-content">${renderInlineMathText(card.derivedFormula)}</div>
            </div>
          `;
        }

        // 4. Variables / Einheiten
        if (card.variables) {
          const varLines = card.variables.split('\n').filter(l => l.trim().length > 0);
          if (varLines.length > 0) {
            html += `
              <div class="sheet-vars-box">
                <div class="vars-label">Formelzeichen & Einheiten:</div>
                <div class="vars-list">
                  ${varLines.map(line => `<div>• ${renderInlineMathText(line)}</div>`).join('')}
                </div>
              </div>
            `;
          }
        }

        // 5. Example
        if (card.example) {
          html += `
            <div class="sheet-example-box">
              <div class="example-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Musterrechnung:
              </div>
              <div>${formatRichText(card.example)}</div>
            </div>
          `;
        }

        // 6. Exam Tip / Pitfall
        if (card.tip) {
          html += `
            <div class="sheet-tip-box">
              <div class="tip-title">Meisterprüfung Praxishinweis:</div>
              <div>${formatRichText(card.tip)}</div>
            </div>
          `;
        }

        cardEl.innerHTML = html;
      }

      el.previewGrid.appendChild(cardEl);
    });
  }

  /* ====================================================
     KaTeX Rendering & Auto-Formatierung
  ==================================================== */
  // Safe KaTeX renderer
  function renderKatex(texString, displayMode = false) {
    if (!texString || !texString.trim()) return '';
    if (typeof katex === 'undefined') {
      return `<code>${escapeHtml(texString)}</code>`;
    }
    try {
      return katex.renderToString(texString, {
        displayMode: displayMode,
        throwOnError: false,
        strict: false
      });
    } catch (err) {
      return `<span style="color:red; font-size:0.8rem;">[Formelfehler: ${escapeHtml(err.message)}]</span>`;
    }
  }

  // Auto clean common user syntax:
  // e.g., turn '*' into '\cdot' if not already part of LaTeX command
  function autoCleanMath(str) {
    if (!str) return '';
    let res = str;
    // Ersetze * durch \cdot (außer wenn Teil von Markdown o.ä.)
    res = res.replace(/(^|[^\\])\*/g, '$1\\cdot ');
    return res;
  }

  // Renders text with inline LaTeX formulas (e.g. \(R = U/I\) or $$...$$)
  function renderInlineMathText(text) {
    if (!text) return '';
    let cleaned = autoCleanMath(text);

    // If string already has \( ... \) or $...$, let's process parts
    const parts = cleaned.split(/(\\\(.*?\\\)|\$.*?\$)/g);
    return parts.map(part => {
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const math = part.slice(2, -2);
        return renderKatex(math, false);
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        return renderKatex(math, false);
      } else {
        // If there's raw math-like equation (e.g. contains = or \frac or \cdot)
        if (part.includes('\\frac') || part.includes('\\cdot') || part.includes('\\sqrt') || part.includes('^')) {
          return renderKatex(part, false);
        }
        return escapeHtml(part);
      }
    }).join('');
  }

  // Formats multiline rich text with line breaks and formulas
  function formatRichText(text) {
    if (!text) return '';
    return text.split('\n').map(line => {
      let l = line.trim();
      if (!l) return '<br>';
      // Bold **text**
      l = l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Inline math
      return `<div>${renderInlineMathText(l)}</div>`;
    }).join('');
  }

  // Rendert mehrzeilige Hauptformeln (durch Eingabetaste erzeugt)
  function renderMainFormulaMultiline(formula) {
    if (!formula || !formula.trim()) return '';
    const lines = formula.split('\n').filter(l => l.trim().length > 0);
    return lines.map(line => {
      return `<div class="sheet-formula-row">${renderKatex(autoCleanMath(line), true)}</div>`;
    }).join('');
  }

  function updateMiniMathPreview(cardId, formula) {
    const previewEl = document.getElementById(`mini-preview-${cardId}`);
    if (!previewEl) return;
    if (!formula || !formula.trim()) {
      previewEl.innerHTML = '<span style="color:#94a3b8; font-size:0.75rem;">Formelvorschau erscheint hier...</span>';
      return;
    }
    const lines = formula.split('\n').filter(l => l.trim().length > 0);
    previewEl.innerHTML = lines.map(line => {
      return `<div class="preview-formula-row">${renderKatex(autoCleanMath(line), true)}</div>`;
    }).join('');
  }

  /* ====================================================
     Event Listeners & User Input
  ==================================================== */
  function bindGlobalEvents() {
    // Top-Level Sheet Meta Changes
    el.sheetTitle.addEventListener('input', (e) => {
      appState.title = e.target.value;
      el.previewTitle.textContent = e.target.value || 'Formelsammlung';
      saveToStorage();
    });

    el.sheetSubtitle.addEventListener('input', (e) => {
      appState.subtitle = e.target.value;
      el.previewSubtitle.textContent = e.target.value;
      saveToStorage();
    });

    el.sheetAuthor.addEventListener('input', (e) => {
      appState.author = e.target.value;
      el.previewAuthor.textContent = e.target.value;
      saveToStorage();
    });

    el.sheetColumns.addEventListener('change', (e) => {
      appState.columns = e.target.value;
      el.printSheet.className = `a4-sheet ${appState.theme} ${appState.columns}`;
      saveToStorage();
    });

    el.sheetTheme.addEventListener('change', (e) => {
      appState.theme = e.target.value;
      const sizeClass = appState.formulaSize || 'math-size-large';
      el.printSheet.className = `a4-sheet ${appState.theme} ${appState.columns} ${sizeClass}`;
      saveToStorage();
    });

    if (el.formulaSize) {
      el.formulaSize.addEventListener('change', (e) => {
        appState.formulaSize = e.target.value;
        const sizeClass = appState.formulaSize || 'math-size-large';
        el.printSheet.className = `a4-sheet ${appState.theme} ${appState.columns} ${sizeClass}`;
        el.cardsList.className = `cards-list ${sizeClass}`;
        saveToStorage();
      });
    }

    // Reset All Button
    el.btnResetAll.addEventListener('click', () => {
      if (confirm('Möchtest du wirklich alle Eingaben leeren?')) {
        loadPreset('blank', false);
      }
    });

    // Template Dropdown
    el.templateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      el.templateMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      el.templateMenu.classList.remove('show');
    });

    el.templateMenu.querySelectorAll('.dropdown-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tKey = btn.dataset.template;
        loadPreset(tKey, true);
        el.templateMenu.classList.remove('show');
      });
    });

    // Add Card / Note Buttons
    el.btnAddCard.addEventListener('click', () => {
      const newCard = {
        id: 'c-' + Date.now(),
        type: 'formula',
        title: 'Neue Formel',
        tag: 'Fachgebiet',
        mainFormula: 'y = \\frac{a \\cdot b}{c}',
        derivedFormula: 'a = \\frac{y \\cdot c}{b}',
        variables: 'y: Ergebnisgröße\na, b, c: Eingangsparameter',
        example: '',
        tip: ''
      };
      appState.cards.push(newCard);
      saveToStorage();
      renderAll();
      // Scroll to newly added card
      setTimeout(() => {
        const lastEl = el.cardsList.lastElementChild;
        if (lastEl) lastEl.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });

    el.btnAddNote.addEventListener('click', () => {
      const newNote = {
        id: 'n-' + Date.now(),
        type: 'note',
        title: 'Prüfungshinweise / Notiz',
        content: '• Wichtiger Prüfungsgrundsatz 1\n• Wichtige Einheitenumrechnung: 1 kW = 1000 W'
      };
      appState.cards.push(newNote);
      saveToStorage();
      renderAll();
      setTimeout(() => {
        const lastEl = el.cardsList.lastElementChild;
        if (lastEl) lastEl.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });

    // Delegated events for cards in editor
    el.cardsList.addEventListener('input', (e) => {
      const target = e.target;
      if (!target.classList.contains('card-field')) return;

      const cardItem = target.closest('.edit-card-item');
      if (!cardItem) return;

      const cardId = cardItem.dataset.id;
      const field = target.dataset.field;
      const card = appState.cards.find(c => c.id === cardId);
      if (!card) return;

      card[field] = target.value;

      // Update A4 Preview
      renderPreviewCards();
      saveToStorage();
    });

    el.cardsList.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;

      const action = btn.dataset.action;
      const index = parseInt(btn.dataset.index, 10);

      if (action === 'delete') {
        if (confirm('Möchtest du diese Karte wirklich entfernen?')) {
          appState.cards.splice(index, 1);
          saveToStorage();
          renderAll();
        }
      } else if (action === 'duplicate') {
        const orig = appState.cards[index];
        const copy = JSON.parse(JSON.stringify(orig));
        copy.id = 'c-' + Date.now();
        copy.title = (copy.title || '') + ' (Kopie)';
        appState.cards.splice(index + 1, 0, copy);
        saveToStorage();
        renderAll();
      } else if (action === 'move-up') {
        if (index > 0) {
          const temp = appState.cards[index];
          appState.cards[index] = appState.cards[index - 1];
          appState.cards[index - 1] = temp;
          saveToStorage();
          renderAll();
        }
      } else if (action === 'move-down') {
        if (index < appState.cards.length - 1) {
          const temp = appState.cards[index];
          appState.cards[index] = appState.cards[index + 1];
          appState.cards[index + 1] = temp;
          saveToStorage();
          renderAll();
        }
      }
    });

    // View toggles
    el.btnViewSplit.addEventListener('click', () => setViewMode('split'));
    el.btnViewEditor.addEventListener('click', () => setViewMode('editor'));
    el.btnViewPreview.addEventListener('click', () => setViewMode('preview'));

    // Zoom controls
    el.btnZoomIn.addEventListener('click', () => updateZoom(0.1));
    el.btnZoomOut.addEventListener('click', () => updateZoom(-0.1));
    el.btnZoomReset.addEventListener('click', () => resetZoom());

    // Export / Import JSON
    el.btnExportJson.addEventListener('click', exportJsonFile);
    el.btnImport.addEventListener('click', () => el.importFileInput.click());
    el.importFileInput.addEventListener('change', handleImportFile);

    // PDF / Drucken Action
    el.btnPrintPdf.addEventListener('click', triggerPdfPrint);

    // Help Modal
    el.btnMathHelp.addEventListener('click', () => el.helpModal.classList.remove('hidden'));
    el.btnCloseHelp.addEventListener('click', () => el.helpModal.classList.add('hidden'));
    el.btnGotItHelp.addEventListener('click', () => el.helpModal.classList.add('hidden'));
    el.helpModal.addEventListener('click', (e) => {
      if (e.target === el.helpModal) el.helpModal.classList.add('hidden');
    });
  }

  /* Symbol-Einfüger: Klick auf ein Symbol fügt es direkt ein */
  function bindMathQuickButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.sym-btn, .math-insert-btn');
      if (!btn) return;
      e.preventDefault();

      const insertText = btn.dataset.insert || btn.dataset.latex;
      if (!insertText) return;

      // 1. Prüfen, ob der Button innerhalb einer Karte liegt
      let targetInput = null;
      const cardItem = btn.closest('.edit-card-item');
      if (cardItem) {
        targetInput = cardItem.querySelector('.card-field.math-aware');
      }

      // 2. Ansonsten zuletzt fokussiertes Feld oder erstes Formelfeld nehmen
      if (!targetInput) {
        targetInput = (lastFocusedInput && document.body.contains(lastFocusedInput))
          ? lastFocusedInput
          : document.querySelector('.card-field.math-aware');
      }

      // 3. Wenn noch gar keine Karte existiert, neue anlegen
      if (!targetInput) {
        el.btnAddCard.click();
        setTimeout(() => {
          const firstInput = document.querySelector('.card-field.math-aware');
          if (firstInput) {
            insertSymbolSmart(firstInput, insertText);
          }
        }, 100);
        return;
      }

      insertSymbolSmart(targetInput, insertText);
    });
  }

  function bindFocusListeners() {
    document.querySelectorAll('.card-field').forEach(input => {
      input.addEventListener('focus', () => {
        lastFocusedInput = input;
      });
    });
  }

  /* Intelligentes Einfügen des Symbols mit automatischer Klammerung / Selektion */
  function insertSymbolSmart(field, text) {
    field.focus();
    const start = field.selectionStart || 0;
    const end = field.selectionEnd || 0;
    const selected = field.value.substring(start, end);

    let replacement = text;
    let newCursorPos = start + text.length;

    // Wenn der Bruch-Button geklickt wird
    if (text === '\\frac{}{}' || text === '\\frac{a}{b}') {
      if (selected.length > 0) {
        // Markierter Text wird direkt als Zähler übernommen, Cursor in den leeren Nenner
        replacement = `\\frac{${selected}}{}`;
        newCursorPos = start + replacement.length - 1; // Cursor direkt in {} des Nenners: \frac{markiert}{‸}
      } else {
        // Reiner leerer Bruchstrich: KEIN a und KEIN b!
        replacement = '\\frac{}{}';
        newCursorPos = start + 6; // Cursor direkt in {} des Zählers: \frac{‸}{}
      }
    } else if (text === '\\sqrt{x}' || text === '\\sqrt{}') {
      if (selected.length > 0) {
        replacement = `\\sqrt{${selected}}`;
        newCursorPos = start + replacement.length;
      } else {
        replacement = '\\sqrt{}';
        newCursorPos = start + 6; // Cursor direkt in der Wurzel: \sqrt{‸}
      }
    } else if (selected.length > 0) {
      if (text === '^2' || text === '^{2}') {
        replacement = `${selected}^2`;
        newCursorPos = start + replacement.length;
      } else if (text === '_{1}') {
        replacement = `${selected}_{1}`;
        newCursorPos = start + replacement.length;
      } else if (text.includes('\\left(')) {
        replacement = `\\left( ${selected} \\right)`;
        newCursorPos = start + replacement.length;
      }
    } else if (text.includes('\\left(')) {
      newCursorPos = start + 8;
    }

    const oldVal = field.value;
    field.value = oldVal.substring(0, start) + replacement + oldVal.substring(end);
    field.selectionStart = newCursorPos;
    field.selectionEnd = newCursorPos;

    // Event für KaTeX-Aktualisierung und Autosave auslösen
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /* Schnelle Tab-Navigation innerhalb von Brüchen: Tab springt von Zähler in Nenner */
  function bindTabNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const target = e.target;
      if (!target.classList || !target.classList.contains('math-aware')) return;

      const pos = target.selectionStart;
      const val = target.value;

      // Prüfen, ob der Cursor sich innerhalb eines \frac{...}{...} befindet
      const before = val.substring(0, pos);
      const fracIndex = before.lastIndexOf('\\frac{');
      if (fracIndex !== -1) {
        const afterFrac = val.substring(fracIndex);
        const match = afterFrac.match(/^\\frac\{([^}]*)\}\{([^}]*)\}/);
        if (match) {
          const numEnd = fracIndex + 6 + match[1].length;
          const denomStart = numEnd + 2;
          const denomEnd = denomStart + match[2].length;
          const fracEnd = denomEnd + 1;

          if (pos <= numEnd) {
            // Aus dem Zähler direkt in den Nenner springen
            e.preventDefault();
            target.selectionStart = denomStart;
            target.selectionEnd = denomStart;
            return;
          } else if (pos <= denomEnd) {
            // Aus dem Nenner hinter den Bruch springen
            e.preventDefault();
            target.selectionStart = fracEnd;
            target.selectionEnd = fracEnd;
            return;
          }
        }
      }
    });
  }

  /* Rendert mathematische Symbole in den Buttons als gestochen scharfe KaTeX-Formeln */
  function renderAllSymbolsInButtons() {
    if (typeof katex === 'undefined') return;
    document.querySelectorAll('.sym-btn').forEach(btn => {
      if (btn._katexRendered) return;
      const tex = btn.dataset.insert || btn.dataset.latex;
      if (tex) {
        let displayTex = tex.trim();
        if (displayTex === '\\frac{}{}') {
          displayTex = '\\frac{\\Box}{\\Box}';
        }
        if (displayTex.includes('\\') || displayTex.includes('^') || displayTex.includes('_')) {
          try {
            btn.innerHTML = katex.renderToString(displayTex, {
              throwOnError: false,
              displayMode: false
            });
            btn._katexRendered = true;
          } catch (e) {
            // Fallback bleibt bestehen
          }
        }
      }
    });
  }

  /* View Mode Switcher */
  function setViewMode(mode) {
    document.body.classList.remove('view-editor-only', 'view-preview-only');
    el.btnViewSplit.classList.remove('active');
    el.btnViewEditor.classList.remove('active');
    el.btnViewPreview.classList.remove('active');

    if (mode === 'editor') {
      document.body.classList.add('view-editor-only');
      el.btnViewEditor.classList.add('active');
    } else if (mode === 'preview') {
      document.body.classList.add('view-preview-only');
      el.btnViewPreview.classList.add('active');
    } else {
      el.btnViewSplit.classList.add('active');
    }
  }

  /* Zoom controls */
  function updateZoom(delta) {
    currentZoom = Math.min(1.5, Math.max(0.5, currentZoom + delta));
    applyZoom();
  }

  function resetZoom() {
    currentZoom = 1.0;
    applyZoom();
  }

  function applyZoom() {
    if (el.paperStage) {
      el.paperStage.style.transform = `scale(${currentZoom})`;
    }
    if (el.zoomLevelText) {
      el.zoomLevelText.textContent = Math.round(currentZoom * 100) + '%';
    }
  }

  /* JSON Export / Import */
  function exportJsonFile() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeTitle = (appState.title || 'MeisterFormel').replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${safeTitle}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported.cards || !Array.isArray(imported.cards)) {
          throw new Error('Datei enthält kein gültiges MeisterFormel-Format.');
        }
        appState = imported;
        saveToStorage();
        renderAll();
        alert('Lernzettel erfolgreich geladen!');
      } catch (err) {
        alert('Fehler beim Laden der Datei: ' + err.message);
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  }

  /* ====================================================
     PDF Drucken / Export
  ==================================================== */
  function triggerPdfPrint() {
    // Reset zoom so print layout is standard 1:1
    const prevZoom = currentZoom;
    resetZoom();

    // Browser's window.print() uses @media print which outputs pure vector KaTeX math & crisp typography
    setTimeout(() => {
      window.print();
      // Restore previous zoom afterwards
      setTimeout(() => {
        currentZoom = prevZoom;
        applyZoom();
      }, 500);
    }, 100);
  }

  /* ====================================================
     Helper Utilities
  ==================================================== */
  function escapeHtml(string) {
    if (!string) return '';
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function refreshIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  function setupAutosaveDebounce() {
    // Already saving on each input
  }

  // Initialize on DOM load and full window load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', () => {
    renderAllSymbolsInButtons();
    renderPreviewCards();
  });

})();
