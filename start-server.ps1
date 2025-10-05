# EcoSlug Tracker - PowerShell Web Server
# This starts a simple web server using PowerShell

$port = 3000
$path = Get-Location

Write-Host "==========================================" -ForegroundColor Green
Write-Host "  EcoSlug Tracker - Local Web Server" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starting server on: http://localhost:$port" -ForegroundColor Cyan
Write-Host "Serving files from: $path" -ForegroundColor Yellow
Write-Host ""
Write-Host "Once started, open these URLs in your browser:" -ForegroundColor White
Write-Host "• Test page: http://localhost:$port/quick-test.html" -ForegroundColor Cyan
Write-Host "• Settings:  http://localhost:$port/settings.html" -ForegroundColor Cyan
Write-Host "• Debug:     http://localhost:$port/debug-auth.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

try {
    # Create HTTP listener
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    
    Write-Host "✅ Server started successfully!" -ForegroundColor Green
    Write-Host "🌐 Open http://localhost:$port/quick-test.html in your browser" -ForegroundColor Yellow
    Write-Host ""
    
    while ($listener.IsListening) {
        try {
            # Get request
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            # Get requested file path
            $requestedFile = $request.Url.LocalPath.TrimStart('/')
            if ($requestedFile -eq "" -or $requestedFile -eq "/") {
                $requestedFile = "index.html"
            }
            
            $filePath = Join-Path $path $requestedFile
            
            Write-Host "$(Get-Date -Format 'HH:mm:ss') - Request: $requestedFile" -ForegroundColor Gray
            
            if (Test-Path $filePath -PathType Leaf) {
                # File exists - serve it
                $content = [System.IO.File]::ReadAllBytes($filePath)
                
                # Set content type based on extension
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($extension) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                    ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                    ".json" { $response.ContentType = "application/json; charset=utf-8" }
                    ".svg"  { $response.ContentType = "image/svg+xml" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".ico"  { $response.ContentType = "image/x-icon" }
                    default { $response.ContentType = "text/plain; charset=utf-8" }
                }
                
                $response.ContentLength64 = $content.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                # File not found
                $errorHtml = @"
<!DOCTYPE html>
<html>
<head>
    <title>404 - Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
        h1 { color: #e74c3c; }
        .links { margin-top: 30px; }
        .links a { display: inline-block; margin: 10px; padding: 10px 20px; 
                   background: #3498db; color: white; text-decoration: none; border-radius: 4px; }
        .links a:hover { background: #2980b9; }
    </style>
</head>
<body>
    <h1>404 - File Not Found</h1>
    <p>The file <strong>$requestedFile</strong> was not found.</p>
    <div class="links">
        <a href="/quick-test.html">Quick Test</a>
        <a href="/settings.html">Settings</a>
        <a href="/debug-auth.html">Debug</a>
        <a href="/index.html">Home</a>
    </div>
</body>
</html>
"@
                $content = [System.Text.Encoding]::UTF8.GetBytes($errorHtml)
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $content.Length
                $response.StatusCode = 404
                $response.OutputStream.Write($content, 0, $content.Length)
            }
            
            $response.Close()
        }
        catch {
            if ($_.Exception -is [System.Net.HttpListenerException]) {
                # Listener was stopped
                break
            }
            Write-Warning "Error handling request: $($_.Exception.Message)"
        }
    }
}
catch {
    Write-Error "Failed to start server: $($_.Exception.Message)"
    if ($_.Exception.Message -like "*access*denied*" -or $_.Exception.Message -like "*port*already*") {
        Write-Host ""
        Write-Host "💡 Try these solutions:" -ForegroundColor Yellow
        Write-Host "1. Run PowerShell as Administrator" -ForegroundColor Cyan
        Write-Host "2. Use a different port (edit the script and change 3000 to 8080)" -ForegroundColor Cyan
        Write-Host "3. Close any other web servers using port 3000" -ForegroundColor Cyan
    }
}
finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
        Write-Host ""
        Write-Host "❌ Server stopped" -ForegroundColor Red
    }
}
