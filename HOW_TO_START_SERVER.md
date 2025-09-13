# 🚀 How to Start and Keep the Server Running

## 🎯 **The Problem**
"Localhost refused to connect" means the web server stopped running. You need to keep it running while you test the Google authentication.

## ✅ **Solution: Start the Server**

### **Method 1: Double-click the PowerShell script**
1. **Find the file**: `start-server.ps1` in your project folder
2. **Right-click** on it → **"Run with PowerShell"**
3. **If you see a security warning**, click "Run anyway" or "Yes"

### **Method 2: Run from PowerShell**
1. **Open PowerShell** in your project folder:
   - Hold `Shift` + Right-click in the folder
   - Choose "Open PowerShell window here"
2. **Run the command**:
   ```powershell
   .\start-server.ps1
   ```

### **Method 3: If execution policy blocks it**
```powershell
powershell -ExecutionPolicy Bypass -File start-server.ps1
```

## 📱 **What You Should See**

When working correctly, you'll see:
```
==========================================
  EcoSlug Tracker - Local Web Server
==========================================

Starting server on: http://localhost:3000
Serving files from: C:\Users\mizui\EcoSlug-Tracker

Once started, open these URLs in your browser:
• Test page: http://localhost:3000/quick-test.html
• Settings:  http://localhost:3000/settings.html  
• Debug:     http://localhost:3000/debug-auth.html

Press Ctrl+C to stop the server
==========================================

✅ Server started successfully!
🌐 Open http://localhost:3000/quick-test.html in your browser
```

## 🌐 **Then Open Your Browser**

**IMPORTANT**: Keep the PowerShell window open! Don't close it.

Open your browser and go to:
- http://localhost:3000/quick-test.html
- http://localhost:3000/settings.html

## 🔧 **Troubleshooting**

### **"Execution policy" error**
Run PowerShell as Administrator, then:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **"Port already in use" error**
Something else is using port 3000. Edit `start-server.ps1` and change:
```powershell
$port = 3000
```
to:
```powershell
$port = 8080
```
Then use http://localhost:8080/ instead.

### **"Access denied" error**
Run PowerShell as Administrator (right-click PowerShell → "Run as administrator")

## ⚠️ **Important Notes**

1. **Keep the server running** - Don't close the PowerShell window
2. **The server shows activity** - You'll see requests logged like:
   ```
   12:16:45 - Request: quick-test.html
   12:16:45 - Request: js/auth.js
   ```
3. **To stop the server** - Press `Ctrl+C` in the PowerShell window

## 🎯 **Success Indicators**

You know it's working when:
- ✅ PowerShell window stays open showing "Server started successfully!"
- ✅ Browser loads http://localhost:3000/quick-test.html
- ✅ You see file requests in the PowerShell window
- ✅ No "refused to connect" errors

Once the server is running, proceed with testing your Google authentication! 🚀
