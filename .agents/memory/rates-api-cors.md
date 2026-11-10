---
name: Frankfurter rate proxy
description: Why live currency data is proxied through the shared API server.
---

Browser requests to the Frankfurter app endpoint can be blocked by missing CORS headers, even though the same request works in a native Expo runtime. Keep external rate requests behind the shared API server and consume that route from the Expo client.

**Why:** The browser-based Expo preview is an important verification surface and should not fail while native requests succeed.

**How to apply:** For future public APIs with uncertain CORS support, prefer a small server-side proxy when the app must run in both web preview and native Expo.