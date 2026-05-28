# NutriLens — Android Build Guide (TWA)

This guide explains how to wrap the NutriLens PWA as a native Android app using **Trusted Web Activity (TWA)**.

---

## Prerequisites

- Node.js 18+
- Java JDK 11+ (for signing)
- Android SDK (or use Android Studio)
- Deployed PWA (e.g., on Vercel)

---

## Option 1: PWABuilder (Recommended — No Code)

1. **Deploy to Vercel**: `npx vercel --prod`
2. **Go to [pwabuilder.com](https://www.pwabuilder.com/)**
3. Enter your URL: `https://nutrilens.vercel.app`
4. Click **"Package for Stores"** → **"Android"**
5. Download the APK/AAB
6. Sign and publish to Google Play

---

## Option 2: Bubblewrap CLI

### Step 1 — Install Bubblewrap
```bash
npm install -g @nicolo-ribaudo/bubblewrap
```

### Step 2 — Initialize the project
```bash
cd android
bubblewrap init --manifest="https://nutrilens.vercel.app/manifest.json"
```

### Step 3 — Build the APK
```bash
bubblewrap build
```

This generates:
- `app-release-signed.apk` — Ready to install
- `app-release-bundle.aab` — For Google Play

### Step 4 — Test on device
```bash
adb install app-release-signed.apk
```

---

## Digital Asset Links

For the TWA to display as a full-screen app (no browser bar), you must configure Digital Asset Links.

### Step 1: Get your SHA-256 fingerprint
```bash
keytool -list -v -keystore keystore.jks -alias nutrilens
```
Copy the SHA-256 fingerprint.

### Step 2: Update assetlinks.json
Edit `public/.well-known/assetlinks.json` and replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your actual fingerprint.

### Step 3: Deploy
The file must be accessible at:
```
https://nutrilens.vercel.app/.well-known/assetlinks.json
```

Vercel serves files from `public/` at the root, so this should work automatically after deployment.

---

## Publishing to Google Play

1. Create a developer account at [play.google.com/console](https://play.google.com/console)
2. Create a new app
3. Upload the `.aab` file
4. Fill in store listing (screenshots, description, etc.)
5. Submit for review

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Browser bar showing | Check Digital Asset Links configuration |
| App crashes on launch | Ensure the PWA URL is accessible |
| White screen | Check service worker caching |
| Icons not showing | Verify icon paths in manifest.json |
