# Penlo Meeting Capture (Chrome Extension)

Captures live captions from **Google Meet** and **Zoom** and syncs them to the Enterprise Brain via `POST /api/v1/ingest/penlo-brain`.

## Install (developer mode)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `meeting-capture/` folder
4. Click the extension icon → enter your Brain ingest URL and `pb_live_` API key

## Generate API key

In the Penlo web dashboard: **Connect App** → Create API key.

## Endpoint URL

```
https://your-brain-url/api/v1/ingest/penlo-brain
```

Local dev:

```
http://localhost:8000/api/v1/ingest/penlo-brain
```

## How it works

- Content script polls caption DOM elements every 5 seconds
- Buffers text and flushes every 30 seconds to the Brain
- Payload follows Penlo Contract v1.1
