// Penlo Meeting Capture — observes caption elements on Google Meet and Zoom.
(function () {
  const CAPTION_SELECTORS = [
    '[data-live-captions]',
    '.iOzk7',
    '.caption-text',
    '.live-transcription-subtitle',
    '.closed-caption',
  ];

  let buffer = [];
  let lastFlush = Date.now();
  const FLUSH_INTERVAL_MS = 30000;

  function extractCaptionText() {
    for (const sel of CAPTION_SELECTORS) {
      const el = document.querySelector(sel);
      if (el && el.textContent?.trim()) {
        return el.textContent.trim();
      }
    }
    return null;
  }

  function flush() {
    if (buffer.length === 0) return;
    const transcript = buffer.join('\n');
    buffer = [];
    chrome.runtime.sendMessage({ type: 'TRANSCRIPT_CHUNK', transcript, url: location.href });
  }

  setInterval(() => {
    const text = extractCaptionText();
    if (text) {
      buffer.push(`[${new Date().toISOString()}] ${text}`);
    }
    if (Date.now() - lastFlush >= FLUSH_INTERVAL_MS && buffer.length > 0) {
      flush();
      lastFlush = Date.now();
    }
  }, 5000);

  window.addEventListener('beforeunload', flush);
})();
