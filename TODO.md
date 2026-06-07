# Project Tasks

## App Rename
- [ ] Update `app.json`:
  ```json
  {
    "name": "New App Name",
    "slug": "new-app-slug",
    "ios": { "bundleIdentifier": "com.yourcompany.newapp" },
    "android": { "package": "com.yourcompany.newapp" }
  }
  ```
- [ ] Update `package.json` name field
- [ ] Run `expo prebuild` (if bare workflow)
- [ ] Rebuild: `expo run:android` + `expo run:ios`
- [ ] Update App Store / Play Console listings

## Deep Linking
- [ ] Fix scheme mismatch: `app.json` uses `vakeoexpo` but code uses `vakeo-app`
- [ ] Add Android intent filters for deep linking
- [ ] Migrate to universal links (replace `vakeoexpo://` with `https://`)
- [ ] Verify Messenger share redirect works with universal links
