/* Shim for the Claude artifact runtime outside claude.ai:
   - downloads: saves a file through a Blob and a temporary link
   - everything else (sample = AI calls): unavailable, pages fall back to built-in examples */
(function () {
  if (window.claude && window.claude.use) return;
  var downloads = {
    save: function (o) {
      return new Promise(function (resolve, reject) {
        try {
          var data = o && o.data != null ? o.data : '';
          var blob = data instanceof Blob ? data : new Blob([data], { type: 'text/plain;charset=utf-8' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = (o && o.filename) || 'file.txt';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
          resolve({ saved: true });
        } catch (e) { reject(e); }
      });
    }
  };
  window.claude = { use: function (name) { return Promise.resolve(name === 'downloads' ? downloads : null); } };
  var css = document.createElement('style');
  css.textContent = '.pwa-nav{font:13px system-ui,sans-serif;padding:8px 16px;background:#20242B;color:#9AA1AB}.pwa-nav a{color:#E9EBE6;text-decoration:none}.pwa-nav a:hover{text-decoration:underline}';
  document.head.appendChild(css);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
