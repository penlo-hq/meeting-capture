// Per-tab meeting sessions: chunks accumulated until MEETING_END or idle timeout.
const sessions = {};
const IDLE_FLUSH_MS = 5 * 60 * 1000;

function getOrCreate(tabId) {
  if (!sessions[tabId]) sessions[tabId] = { chunks: [], lastActivity: Date.now(), url: '' };
  return sessions[tabId];
}

async function flushSession(tabId) {
  const session = sessions[tabId];
  if (!session || session.chunks.length === 0) {
    delete sessions[tabId];
    return;
  }
  const transcript = session.chunks.join('\n');
  delete sessions[tabId];

  const cfg = await chrome.storage.sync.get(['penloBaseUrl', 'penloApiKey']);
  if (!cfg.penloBaseUrl || !cfg.penloApiKey) return;

  const endpoint = cfg.penloBaseUrl.replace(/\/$/, '') + '/api/v1/ingest/standup';
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.penloApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript, meeting_type: 'ad_hoc' }),
    });
  } catch (_) {
    // best-effort — meeting already closed
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab?.id;

  if (msg.type === 'TRANSCRIPT_CHUNK') {
    if (tabId !== undefined) {
      const session = getOrCreate(tabId);
      session.chunks.push(msg.transcript);
      session.lastActivity = Date.now();
      session.url = msg.url || session.url;
    }
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'MEETING_END' && tabId !== undefined) {
    flushSession(tabId);
    return false;
  }
});

// Flush sessions idle for 5+ minutes (handles tabs that close without unload)
setInterval(() => {
  const now = Date.now();
  for (const tabId of Object.keys(sessions)) {
    if (now - sessions[tabId].lastActivity >= IDLE_FLUSH_MS) {
      flushSession(Number(tabId));
    }
  }
}, 60 * 1000);
