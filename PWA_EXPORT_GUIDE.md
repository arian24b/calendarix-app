# Calendarix PWA Export Guide for Android and iOS

This guide provides instructions for exporting your Calendarix PWA to native app formats for submission to the Android and iOS app stores.

## Prerequisites

- Node.js (v10 or higher)
- Java 8 JDK (for Android export)
- Android SDK (for Android export)
- Xcode (for iOS export, Mac only)
- Apple Developer Account (for iOS submission)
- Google Play Developer Account (for Android submission)

## Project Setup Changes

The following changes have been made to your project to support mobile app exports:

1. Added proper icon files in SVG format at `/public/icons/`
2. Updated Capacitor configuration in `capacitor.config.ts`

## Android Export with Bubblewrap (TWA)

Trusted Web Activities (TWA) allow you to package your PWA as an Android app for the Google Play Store.

### Step 1: Install Bubblewrap CLI

```bash
npm install -g @bubblewrap/cli
```

### Step 2: Build your PWA

```bash
npm run build
```

### Step 3: Initialize Bubblewrap with your PWA

```bash
mkdir android-export && cd android-export
bubblewrap init --manifest=https://calendarix.pro/manifest.json
```

Follow the interactive wizard to configure your app details.

### Step 4: Build the Android App Bundle

```bash
bubblewrap build
```

This will generate an `.aab` file (Android App Bundle) that you can upload to the Google Play Store.

### Step 5: Digital Asset Links

Create a Digital Asset Links file to establish trust between your PWA and the Android app:

1. Get your app's SHA-256 fingerprint:

   ```bash
   bubblewrap fingerprint
   ```

   Alternatively, if you have the keystore file:

   ```bash
   keytool -list -v -keystore <path-to-keystore> -alias <key-alias>
   ```

2. Update the file at `public/.well-known/assetlinks.json` with the following content:

   ```json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "pro.calendarix.app",
         "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
       }
     }
   ]
   ```

3. Deploy this file to your website at `https://your-domain.com/.well-known/assetlinks.json`.

4. Verify the file is accessible by visiting `https://your-domain.com/.well-known/assetlinks.json` in your browser.

## iOS Export with PWABuilder or Capacitor

### Option 1: Using PWABuilder (Recommended)

1. Visit [PWABuilder.com](https://www.pwabuilder.com/)
2. Enter your PWA's URL
3. Navigate to the publish page
4. Select iOS package option
5. Configure your app details
6. Download the generated Xcode project
7. Open the project in Xcode and follow the instructions to build and submit to the App Store

### iOS App Site Association

To enable deep linking in your iOS app:

1. Create a file at `public/.well-known/apple-app-site-association` with the following content:

   ```json
   {
     "applinks": {
       "apps": [],
       "details": [
         {
           "appID": "TEAM_ID.pro.calendarix.app",
           "paths": ["*"]
         }
       ]
     }
   }
   ```

2. Replace `TEAM_ID` with your Apple Developer Team ID (found in your Apple Developer account).

3. Deploy this file to your website at `https://your-domain.com/.well-known/apple-app-site-association`.

4. The file must be served without a file extension and with the MIME type `application/json`.

5. Verify the file is accessible by visiting `https://your-domain.com/.well-known/apple-app-site-association` in your browser.

### Option 2: Using Capacitor

1. Install iOS platform:

   ```bash
   npm install @capacitor/ios
   npx cap add ios
   ```

2. Build your PWA:

   ```bash
   npm run build
   ```

3. Sync your web code to the native project:

   ```bash
   npx cap sync
   ```

4. Open the iOS project in Xcode:

   ```bash
   npx cap open ios
   ```

5. In Xcode, configure your app signing, capabilities, and other settings

6. Build and archive your app for submission to the App Store

## Additional Considerations

### Add to Homescreen Functionality

One of the key advantages of PWAs is that users can install them directly from the browser without going through app stores. We've already configured Calendarix with the necessary manifest.json and service worker files to enable this functionality.

To help users install your PWA directly:

1. Direct users to the new installation guide at `INSTALL_ON_MOBILE.md`
2. Consider adding an installation prompt or banner in your app UI
3. Test the installation process on both Android and iOS devices

For detailed instructions on how users can install the app, refer to the `INSTALL_ON_MOBILE.md` file.

### App Store Guidelines

- Ensure your app provides value beyond just wrapping a website
- Include proper app icons and splash screens
- Follow each platform's design guidelines
- Implement platform-specific features where possible

### PWA Optimization

- Test your PWA thoroughly on mobile devices
- Ensure offline functionality works correctly
- Optimize performance for mobile networks
- Implement responsive design for various screen sizes

### Updates

One advantage of PWAs is that most updates can be deployed to your web server without requiring app store approval. However, changes to native configurations will require new app submissions.

## Resources

- [Google's PWA in Play Store Guide](https://developers.google.com/codelabs/pwa-in-play)
- [PWABuilder Documentation](https://docs.pwabuilder.com/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Store Guidelines](https://play.google.com/about/developer-content-policy/)

## Troubleshooting

### Android Issues

- **Digital Asset Links not working**: Ensure your assetlinks.json file is accessible at `https://yourdomain.com/.well-known/assetlinks.json` and contains the correct SHA-256 fingerprint. Verify it's served with the correct MIME type (application/json).
- **App crashes on launch**: Verify that your PWA works correctly in Chrome and that all required features are supported. Check Chrome DevTools for any console errors.
- **TWA not opening in full screen**: Make sure your manifest.json has `"display": "standalone"` and your assetlinks.json file is correctly configured.
- **Bubblewrap build errors**: Ensure you have the correct Java version (JDK 8) and Android SDK installed. Try running with `--verbose` flag for more detailed error messages.
- **Play Store rejection**: Review Google's [PWA quality criteria](https://web.dev/articles/pwa-checklist) and ensure your app meets all requirements. Make sure your app provides value beyond just wrapping a website.

### iOS Issues

- **App rejected by App Store**: Ensure your app provides value beyond just wrapping a website and follows all App Store guidelines. Apple is particularly strict about PWA wrappers.
- **App not working offline**: Make sure your service worker is properly configured for offline support and caches essential assets.
- **Apple App Site Association not working**: Verify the file is served without a file extension and with the MIME type `application/json`. It must be accessible at `https://yourdomain.com/.well-known/apple-app-site-association`.
- **Deep linking not working**: Check that your App ID prefix matches your Team ID and the bundle identifier in Xcode matches what's in your apple-app-site-association file.
- **PWABuilder iOS package issues**: Ensure your manifest.json has all required fields including icons with proper sizes (at least 192x192 and 512x512).

### General Issues

- **Service worker not updating**: Implement proper versioning for your service worker and cache management.
- **Manifest not recognized**: Verify your manifest.json is properly linked in your HTML with `<link rel="manifest" href="/manifest.json">`.
- **Icons not displaying**: Ensure your icons are in the correct format and sizes as specified in your manifest.json file.
- **Offline functionality not working**: Test your PWA in Chrome DevTools' Application tab with the "Offline" option enabled.
