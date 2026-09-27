// Reusable copy controls for the visible BibTeX on paper pages.
(() => {
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    const citation = document.getElementById(button.dataset.copyTarget);
    const status = button.closest('.citation-block')?.querySelector('.citation-status');
    if (!citation || !status) return;

    let resetTimer;
    let copying = false;
    button.addEventListener('click', async () => {
      if (copying) return;
      copying = true;
      clearTimeout(resetTimer);
      button.setAttribute('aria-busy', 'true');
      button.classList.remove('is-copied');
      status.textContent = '';
      status.classList.remove('is-error');

      try {
        const text = citation.textContent;
        await navigator.clipboard.writeText(text.endsWith('\n') ? text : `${text}\n`);
        button.classList.add('is-copied');
        status.textContent = 'BibTeX copied to clipboard.';
        resetTimer = setTimeout(() => {
          button.classList.remove('is-copied');
          status.textContent = '';
        }, 2000);
      } catch {
        status.textContent = 'Copy failed. Select the citation text or use the download button.';
        status.classList.add('is-error');
      } finally {
        copying = false;
        button.removeAttribute('aria-busy');
      }
    });
    button.hidden = false;
  });
})();
