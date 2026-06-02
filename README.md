# Penlo Meeting Capture (Chrome Extension)

Captures live captions from **Google Meet** and **Zoom** and syncs them to the Enterprise Brain via `POST /api/v1/ingest/standup`.

This is different from the Flow iOS app, which uses `POST /api/v1/ingest/penlo-brain` with structured Contract v1.1 payloads.

## Install (developer mode)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `meeting-capture/` folder
4. Click the extension icon → enter your **Brain base URL** and `pb_live_` API key

## Generate API key

In the Penlo web dashboard: **Connect App** → Create API key.

## Configuration

Enter the **Brain base URL** (origin only — the extension appends `/api/v1/ingest/standup`):

```
https://your-brain-url.railway.app
```

Local dev:

```
http://localhost:8000
```

Do **not** paste the full `/api/v1/ingest/penlo-brain` path from Connect App — that endpoint is for Flow iOS structured sync.

## How it works

- Content script polls caption DOM elements every 5 seconds
- Buffers text and flushes every 30 seconds to the background worker
- On meeting end (or 5-minute idle), posts to the Brain:

```json
{
  "transcript": "[2026-06-02T12:00:00Z] Speaker: caption text\n...",
  "meeting_type": "ad_hoc"
}
```

- Auth: `Authorization: Bearer pb_live_<key>`
