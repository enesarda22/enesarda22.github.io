// Static, accessible STIX math typography for paper pages.
window.MathJax = {
  loader: {
    load: ['a11y/assistive-mml']
  },
  tex: {
    inlineMath: [['\\(', '\\)'], ['$', '$']],
    displayMath: [['\\[', '\\]'], ['$$', '$$']],
    processEscapes: true
  },
  output: {
    font: 'mathjax-stix2',
    fontPath: 'https://cdn.jsdelivr.net/npm/@mathjax/%%FONT%%-font@4.1.3',
    displayOverflow: 'linebreak',
    linebreaks: { inline: true, width: '100%' }
  },
  options: {
    // Keep equations static and expose hidden MathML to screen readers.
    enableMenu: false,
    enableExplorer: false,
    enableExplorerHelp: false,
    enableAssistiveMml: true,
    menuOptions: { settings: { assistiveMml: true } },
    renderActions: { explorable: [], attachSpeech: [] }
  },
  startup: {
    pageReady() {
      // Measure inline math after the surrounding text fonts are available.
      return document.fonts.ready
        .then(() => MathJax.startup.defaultPageReady())
        .then(() => {
          // Display line breaks are calculated during typesetting, not by CSS.
          const body = document.querySelector('.paper-body');
          if (!body) return;
          let width;
          let timer;
          new ResizeObserver(([entry]) => {
            const nextWidth = entry.contentRect.width;
            if (width !== undefined && nextWidth !== width) {
              clearTimeout(timer);
              timer = setTimeout(() => {
                // Restart from the source to recalculate line breaks at the new width.
                MathJax.startup.document.rerenderPromise(0).catch(error => console.error(error));
              }, 150);
            }
            width = nextWidth;
          }).observe(body);
        });
    }
  }
};
