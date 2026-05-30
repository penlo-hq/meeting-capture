document.getElementById('save').addEventListener('click', () => {
  const url = document.getElementById('url').value.trim();
  const key = document.getElementById('key').value.trim();
  chrome.storage.sync.set({ penloApiUrl: url, penloApiKey: key }, () => {
    document.getElementById('status').textContent = 'Saved!';
  });
});

chrome.storage.sync.get(['penloApiUrl', 'penloApiKey'], (cfg) => {
  if (cfg.penloApiUrl) document.getElementById('url').value = cfg.penloApiUrl;
  if (cfg.penloApiKey) document.getElementById('key').value = cfg.penloApiKey;
});
