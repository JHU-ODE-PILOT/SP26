// Open PDF and different websites in a new page

document.querySelectorAll('a').forEach(link => {
    if (link.closest('navbar')) return;

    const href = link.getAttribute('href');

    if (href && href.toLowerCase().startsWith('https://')) {
      link.setAttribute('target', '_blank');
    }
  });
