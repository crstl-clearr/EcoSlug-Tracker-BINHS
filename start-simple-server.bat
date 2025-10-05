@echo off
color 0A
title EcoSlug Tracker - Local Web Server

echo ==========================================
echo   EcoSlug Tracker - Local Web Server
echo ==========================================
echo.
echo This will start a web server on http://localhost:3000
echo Keep this window OPEN while testing!
echo.

echo Attempting to start PowerShell server...
echo.

powershell -ExecutionPolicy Bypass -Command "& {Write-Host 'Starting PowerShell HTTP server...'; try { $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:3000/'); $listener.Start(); Write-Host 'SUCCESS: Server started on http://localhost:3000' -ForegroundColor Green; Write-Host ''; Write-Host 'Open these URLs in your browser:' -ForegroundColor Yellow; Write-Host 'http://localhost:3000/quick-test.html' -ForegroundColor Cyan; Write-Host 'http://localhost:3000/settings.html' -ForegroundColor Cyan; Write-Host ''; Write-Host 'Server is running... Press Ctrl+C to stop' -ForegroundColor White; Write-Host 'Waiting for requests...' -ForegroundColor Gray; while ($listener.IsListening) { try { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $file = $request.Url.LocalPath.TrimStart('/'); if ([string]::IsNullOrEmpty($file)) { $file = 'index.html' }; $filePath = Join-Path (Get-Location) $file; Write-Host \"$(Get-Date -Format 'HH:mm:ss') Request: $file\" -ForegroundColor Gray; if (Test-Path $filePath -PathType Leaf) { $content = [System.IO.File]::ReadAllBytes($filePath); $ext = [System.IO.Path]::GetExtension($filePath).ToLower(); switch ($ext) { '.html' { $response.ContentType = 'text/html; charset=utf-8' }; '.js' { $response.ContentType = 'application/javascript; charset=utf-8' }; '.css' { $response.ContentType = 'text/css; charset=utf-8' }; '.json' { $response.ContentType = 'application/json; charset=utf-8' }; '.svg' { $response.ContentType = 'image/svg+xml' }; '.png' { $response.ContentType = 'image/png' }; '.jpg' { $response.ContentType = 'image/jpeg' }; '.ico' { $response.ContentType = 'image/x-icon' }; default { $response.ContentType = 'text/plain; charset=utf-8' } }; $response.StatusCode = 200; $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length); } else { $notFound = '<!DOCTYPE html><html><head><title>404 - Not Found</title><style>body{font-family:Arial;margin:40px;text-align:center}h1{color:#e74c3c}.links{margin-top:20px}.links a{display:inline-block;margin:10px;padding:10px 20px;background:#3498db;color:white;text-decoration:none;border-radius:4px}</style></head><body><h1>404 - File Not Found</h1><p>Could not find: <strong>' + $file + '</strong></p><div class=\"links\"><a href=\"/\">Home</a><a href=\"/quick-test.html\">Test</a><a href=\"/settings.html\">Settings</a></div></body></html>'; $content = [System.Text.Encoding]::UTF8.GetBytes($notFound); $response.ContentType = 'text/html; charset=utf-8'; $response.StatusCode = 404; $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length); }; $response.Close(); } catch { if ($_.Exception -is [System.Net.HttpListenerException]) { Write-Host 'Server stopped by user' -ForegroundColor Yellow; break } else { Write-Host \"Request error: $($_.Exception.Message)\" -ForegroundColor Red } } } } catch { Write-Host 'ERROR starting server:' -ForegroundColor Red; Write-Host $_.Exception.Message -ForegroundColor Red; Write-Host ''; if ($_.Exception.Message -like '*Access is denied*') { Write-Host 'SOLUTION: Run this file as Administrator' -ForegroundColor Yellow; Write-Host '(Right-click -> Run as administrator)' -ForegroundColor Yellow } elseif ($_.Exception.Message -like '*already in use*') { Write-Host 'SOLUTION: Port 3000 is busy. Close other programs or restart computer' -ForegroundColor Yellow } else { Write-Host 'SOLUTION: Try installing Python from https://python.org' -ForegroundColor Yellow } } finally { if ($listener -and $listener.IsListening) { $listener.Stop(); $listener.Close() } Write-Host ''; Write-Host 'Server stopped.' -ForegroundColor Red } }"

echo.
echo ==========================================
echo Server has stopped or failed to start
echo ==========================================
echo.

REM Try Python as backup
echo Trying Python as backup...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python found! Starting Python server...
    echo Open http://localhost:3000/quick-test.html in your browser
    echo.
    python -m http.server 3000
) else (
    echo Python not found.
    echo.
    echo SOLUTIONS:
    echo 1. Run this file as Administrator (right-click -> Run as administrator)
    echo 2. Install Python from https://python.org/downloads/
    echo 3. Try the PowerShell script: start-server.ps1
)

echo.
echo Press any key to close...
pause >nul
