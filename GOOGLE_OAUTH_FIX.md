# 🔧 Fix "Auth Instance Not Found" Error

The "auth instance not found" error typically occurs due to Client ID configuration issues. Here's how to fix it:

## 🎯 **Step 1: Check Your Current Setup**

1. Open `quick-test.html` in your browser
2. Open browser console (F12 → Console tab)
3. Look for specific error messages
4. Note which step fails

## 🏗️ **Step 2: Verify Google Cloud Console Configuration**

### **Go to Google Cloud Console:**
1. Visit: https://console.cloud.google.com/
2. Select your project (or create one if needed)

### **Check APIs & Services:**
1. Go to **"APIs & Services"** → **"Library"**
2. Search for and **ENABLE** these APIs:
   - ✅ Google+ API (or People API)
   - ✅ Google Drive API
   - ✅ Identity and Access Management (IAM) API

### **Verify OAuth Consent Screen:**
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Make sure it's configured with:
   - ✅ App name: EcoSlug Tracker
   - ✅ User support email: Your email
   - ✅ Developer contact: Your email
   - ✅ Status: Not "Needs Verification" (for testing)

### **Check OAuth 2.0 Client IDs:**
1. Go to **"APIs & Services"** → **"Credentials"**
2. Find your OAuth 2.0 Client ID
3. Click the pencil icon to edit it

### **Critical: Authorized JavaScript Origins**
Add these URLs (replace with your actual URLs):
```
http://localhost:3000
http://localhost:8000
http://127.0.0.1:3000
http://127.0.0.1:8000
file://
```

**For your current setup, add:**
```
http://localhost:PORT  (whatever port you're using)
```

### **Critical: Authorized Redirect URIs**
Add these URIs:
```
http://localhost:3000
http://localhost:8000
http://127.0.0.1:3000
http://127.0.0.1:8000
```

## 🔑 **Step 3: Verify Your Client ID**

Your current Client ID is:
```
973644214985-cgb7ehk0d902nhbmja3vkn6ialt8uio9.apps.googleusercontent.com
```

### **Double-check this:**
1. In Google Cloud Console → Credentials
2. Copy the Client ID exactly
3. Make sure it matches what's in your `js/auth.js` file

## 🌐 **Step 4: Test with Correct URL**

### **Important:** OAuth won't work with `file://` protocol in most browsers.

**Instead, serve your files via HTTP:**

### **Option 1: Python (if installed)**
```bash
# Navigate to your project folder
cd C:\Users\mizui\EcoSlug-Tracker

# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

### **Option 2: Node.js (if installed)**
```bash
npx http-server -p 3000
```

### **Option 3: PHP (if installed)**
```bash
php -S localhost:3000
```

### **Then access via:**
```
http://localhost:3000/quick-test.html
```

## 🔧 **Step 5: Common Fixes**

### **Fix 1: Invalid Client Error**
- ❌ **Problem:** "invalid_client" or "unauthorized_client"
- ✅ **Solution:** Client ID is wrong or not properly configured
- **Action:** Double-check Client ID in Google Cloud Console

### **Fix 2: Redirect URI Mismatch**
- ❌ **Problem:** "redirect_uri_mismatch"
- ✅ **Solution:** Current URL not in authorized origins
- **Action:** Add `http://localhost:3000` to authorized JavaScript origins

### **Fix 3: API Not Enabled**
- ❌ **Problem:** Auth instance returns null
- ✅ **Solution:** Required APIs not enabled
- **Action:** Enable Google+ API and Google Drive API

### **Fix 4: Scope Issues**
- ❌ **Problem:** Auth works but features don't
- ✅ **Solution:** Missing required scopes
- **Action:** Check OAuth consent screen scopes

## 🧪 **Step 6: Test Again**

1. After making changes in Google Cloud Console
2. **Wait 5-10 minutes** for changes to propagate
3. Clear browser cache (Ctrl+Shift+Delete)
4. Test again with `quick-test.html`

## ✅ **Expected Results**

When working correctly, you should see:
```
✅ Step 1: Network connection OK (1.0s)
✅ Step 2: Google API script loaded (2.1s)
✅ Step 3: Google Auth client loaded (3.2s)
✅ Step 4: Client ID configuration OK (3.5s)
🎉 All tests passed! Google Auth should work.
```

## 🚨 **Still Not Working?**

### **Create a New Client ID:**
1. In Google Cloud Console → Credentials
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Name: **"EcoSlug Tracker Test"**
5. Add authorized JavaScript origins:
   ```
   http://localhost:3000
   ```
6. Add authorized redirect URIs:
   ```
   http://localhost:3000
   ```
7. **Copy the new Client ID** and update `js/auth.js`

### **Debug Information:**
Check browser console for these specific errors:
- `invalid_client` = Wrong Client ID
- `unauthorized_client` = Client not configured
- `redirect_uri_mismatch` = URL not authorized
- `access_denied` = User denied permission

## 📞 **Need More Help?**

If you're still getting "auth instance not found":

1. **Share the browser console output** from `quick-test.html`
2. **Confirm your serving method** (localhost vs file://)
3. **Double-check Google Cloud Console setup**
4. **Try creating a completely new OAuth client**

The most common issue is that the current URL (how you're accessing the page) doesn't match what's configured in Google Cloud Console's "Authorized JavaScript origins".
