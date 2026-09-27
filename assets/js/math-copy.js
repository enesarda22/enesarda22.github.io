// Preserve TeX when readers copy prose containing MathJax equations.
(() => {
  const blockElements = new Set([
    'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DIV', 'FIGCAPTION', 'FIGURE',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'LI', 'MAIN', 'NAV',
    'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'TR', 'UL'
  ]);

  function plainText(fragment) {
    const preserved = [];
    const protect = text => `\uE000${preserved.push(text) - 1}\uE001`;

    function read(node) {
      if (node.nodeType === Node.TEXT_NODE) return node.data.replace(/\s+/g, ' ');
      if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return '';
      if (node.nodeName === 'BR') return '\n';
      if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE') return '';

      // Keep equation source and code whitespace intact while collapsing HTML indentation.
      const content = node.matches?.('[data-copied-math], pre, code')
        ? protect(node.textContent)
        : Array.from(node.childNodes, read).join('');
      return blockElements.has(node.nodeName) ? `\n\n${content}\n\n` : content;
    }

    return read(fragment)
      .replace(/[ \t]*\n[ \t]*/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .replace(/\uE000(\d+)\uE001/g, (_, index) => preserved[index]);
  }

  document.addEventListener('copy', event => {
    const selection = window.getSelection();
    const active = document.activeElement;
    if (event.defaultPrevented || !event.clipboardData || !selection || selection.isCollapsed) return;
    if (active?.matches('input, textarea') || active?.isContentEditable) return;

    const mathDocument = window.MathJax?.startup?.document;
    if (!mathDocument) return;

    const items = mathDocument.getMathItemsWithin([document.body])
      .filter(item => item.inputJax.name === 'TeX' && item.typesetRoot?.isConnected);
    const ranges = Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange());
    if (!ranges.some(range => items.some(item => range.intersectsNode(item.typesetRoot)))) return;

    // A selection touching part of an equation copies that complete expression.
    for (const range of ranges) {
      for (const item of items) {
        if (item.typesetRoot.contains(range.startContainer)) range.setStartBefore(item.typesetRoot);
        if (item.typesetRoot.contains(range.endContainer)) range.setEndAfter(item.typesetRoot);
      }
    }
    ranges.sort((a, b) => a.compareBoundaryPoints(Range.START_TO_START, b));
    const merged = [];
    for (const range of ranges) {
      const previous = merged[merged.length - 1];
      if (previous && previous.comparePoint(range.startContainer, range.startOffset) === 0) {
        if (previous.comparePoint(range.endContainer, range.endOffset) === 1) {
          previous.setEnd(range.endContainer, range.endOffset);
        }
      } else {
        merged.push(range);
      }
    }

    const fragments = merged.map(range => {
      const selected = items.filter(item => range.intersectsNode(item.typesetRoot));
      selected.sort((a, b) => a.typesetRoot.compareDocumentPosition(b.typesetRoot) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
      const fragment = range.cloneContents();
      const equations = fragment.querySelectorAll('mjx-container');
      if (equations.length !== selected.length) return null;

      equations.forEach((equation, index) => {
        const item = selected[index];
        const source = item.math.trim();
        const replacement = document.createElement(item.display ? 'div' : 'span');
        replacement.dataset.copiedMath = '';
        replacement.textContent = item.display ? `$$\n${source}\n$$` : `$${source}$`;
        equation.replaceWith(replacement);
      });
      return fragment;
    });
    if (fragments.some(fragment => !fragment)) return;

    const text = fragments.map(plainText).join('\n\n');
    const html = document.createElement('div');
    fragments.forEach((fragment, index) => {
      if (index) html.append(document.createElement('br'), document.createElement('br'));
      html.append(fragment);
    });
    html.querySelectorAll('[data-copied-math]').forEach(node => node.removeAttribute('data-copied-math'));
    event.clipboardData.setData('text/plain', text);
    event.clipboardData.setData('text/html', html.innerHTML);
    event.preventDefault();
  });
})();
