document.getElementById('save').addEventListener('click', () => {
  const url = document.getElementById('url').value.trim();
  const key = document.getElementById('key').value.trim();
  chrome.storage.sync.set({ penloBaseUrl: url, penloApiKey: key }, () => {
    document.getElementById('status').textContent = 'Saved!';
  });
});

chrome.storage.sync.get(['penloBaseUrl', 'penloApiKey'], (cfg) => {
  if (cfg.penloBaseUrl) document.getElementById('url').value = cfg.penloBaseUrl;
  if (cfg.penloApiKey) document.getElementById('key').value = cfg.penloApiKey;
});
