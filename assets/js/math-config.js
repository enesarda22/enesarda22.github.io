// Shared math typography for paper pages and the design specimen.
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
      return document.fonts.ready.then(() => MathJax.startup.defaultPageReady());
    }
  }
};
