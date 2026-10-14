(function () {
  document.querySelectorAll('[data-dlg]').forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      var dialog = document.getElementById(trigger.dataset.dlg);
      if (!dialog || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      dialog.showModal();
      var body = dialog.querySelector('.ch__body');
      if (body) body.scrollTop = 0;
      var close = dialog.querySelector('.org__x');
      if (close) close.focus();
    });
  });

  document.querySelectorAll('dialog.org-dlg').forEach(function (dialog) {
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog || event.target.closest('.org__x')) dialog.close();
    });
  });

  document.querySelectorAll('.ch__nav a').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var target = document.querySelector(link.getAttribute('href'));
      var body = target && target.closest('.ch__body');
      if (target && body) body.scrollTo({ top: target.offsetTop - body.offsetTop, behavior: 'smooth' });
    });
  });
})();
