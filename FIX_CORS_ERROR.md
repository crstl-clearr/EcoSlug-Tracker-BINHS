# 🔧 Fix CORS Error - Complete Solution

The CORS error happens because you're opening files directly (`file://` protocol) instead of serving them via HTTP. Google OAuth **requires** HTTP/HTTPS.

## 🚀 **Step 1: Start the Local Web Server**

### **Option A: Use PowerShell (Recommended)**
```powershell
# Right-click on start-server.ps1 → "Run with PowerShell"
# OR open PowerShell in your project folder and run:
.\start-server.ps1
```

### **Option B: Use the Batch File**
```batch
# Double-click start-server.bat
```

### **Option C: Manual PowerShell Command**
```powershell
# Open PowerShell in your project folder and run:
powershell -ExecutionPolicy Bypass -File start-server.ps1
```

## 🌐 **Step 2: Update Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click your OAuth 2.0 Client ID to edit it
4. In **"Authorized JavaScript origins"**, add:
   ```
   http://localhost:3000
   ```
5. In **"Authorized redirect URIs"**, add:
   ```
   http://localhost:3000
   ```
6. Click **Save**
7. **Wait 5 minutes** for changes to take effect

## 🧪 **Step 3: Test the Fix**

1. **Start the server** using one of the methods above
2. **Open your browser** and go to:
   ```
   http://localhost:3000/quick-test.html
   ```
3. **Check results** - you should see all green checkmarks:
   ```
   ✅ Step 1: Network connection OK
   ✅ Step 2: Google API script loaded  
   ✅ Step 3: Google Auth client loaded
   ✅ Step 4: Client ID configuration OK
   ```

## ✅ **Expected Behavior**

- **No more CORS errors** in console
- **No "Invalid cookiePolicy" errors**  
- **All 4 test steps pass**
- **Manual login button becomes enabled**
- **Google sign-in popup should work**

## 🎯 **Access Your App**

Once the server is running, access your app at:
- **Main app**: http://localhost:3000/index.html
- **Settings**: http://localhost:3000/settings.html  
- **Quick test**: http://localhost:3000/quick-test.html
- **Debug page**: http://localhost:3000/debug-auth.html

## 🔧 **Troubleshooting**

### **Server Won't Start**
- Run PowerShell as **Administrator**
- Try a different port (edit script and change 3000 to 8080)
- Close other programs using port 3000

### **Still Getting CORS Errors**
- Make sure you're accessing `http://localhost:3000/` (not file://)
- Clear browser cache (Ctrl+Shift+Delete)
- Wait 5-10 minutes after updating Google Cloud Console

### **Auth Still Fails**
- Double-check your Client ID in `js/auth.js`
- Verify APIs are enabled in Google Cloud Console
- Check browser console for specific error messages

## 🎉 **Success Indicators**

You'll know it's working when:
1. ✅ Server starts without errors
2. ✅ Browser shows `http://localhost:3000` in address bar
3. ✅ No CORS errors in console
4. ✅ Quick test shows all green checkmarks
5. ✅ Google sign-in popup appears when clicking the button

Once this works, your Google authentication will be fully functional! 🚀
