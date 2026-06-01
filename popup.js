document.getElementById('save').addEventListener('click', () => {
  const url = document.getElementById('url').value.trim();
  const key = document.getElementById('key').value.trim();
  chrome.storage.sync.set({ penloBaseUrl: url, penloApiKey: key, penloConfigError: '' }, () => {
    const el = document.getElementById('status');
    el.style.color = 'green';
    el.textContent = 'Saved!';
  });
});

chrome.storage.sync.get(['penloBaseUrl', 'penloApiKey', 'penloConfigError'], (cfg) => {
  if (cfg.penloBaseUrl) document.getElementById('url').value = cfg.penloBaseUrl;
  if (cfg.penloApiKey) document.getElementById('key').value = cfg.penloApiKey;
  if (cfg.penloConfigError) {
    const el = document.getElementById('status');
    el.style.color = 'red';
    el.textContent = cfg.penloConfigError;
  }
});
