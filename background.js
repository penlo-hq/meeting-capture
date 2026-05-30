chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== 'TRANSCRIPT_CHUNK') return;

  chrome.storage.sync.get(['penloApiUrl', 'penloApiKey'], async (cfg) => {
    const url = cfg.penloApiUrl;
    const key = cfg.penloApiKey;
    if (!url || !key) {
      sendResponse({ ok: false, error: 'not_configured' });
      return;
    }

    const payload = {
      schemaVersion: '1.1',
      deviceID: 'chrome-extension-meeting-capture',
      userEmail: null,
      syncedAt: new Date().toISOString(),
      facts: [{
        subject: 'Meeting',
        predicate: 'discussed',
        object: msg.transcript.slice(0, 2000),
        confidence: 0.7,
        capturedAt: new Date().toISOString(),
      }],
      people: [],
      topicSummary: [`Meeting capture from ${new URL(msg.url).hostname}`],
      vaultFiles: [],
    };

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Penlo-Brain/1.1-ChromeExtension',
        },
        body: JSON.stringify(payload),
      });
      sendResponse({ ok: resp.ok, status: resp.status });
    } catch (err) {
      sendResponse({ ok: false, error: String(err) });
    }
  });

  return true;
});
