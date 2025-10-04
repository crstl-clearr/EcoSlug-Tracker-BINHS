# Simple HTTP Server for EcoSlug Tracker
# Keep this window open while testing!

Write-Host "==========================================" -ForegroundColor Green
Write-Host "  EcoSlug Tracker - Simple Web Server" -ForegroundColor Green  
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

$port = 3000
$currentDir = Get-Location

Write-Host "Starting server..." -ForegroundColor Yellow
Write-Host "Port: $port" -ForegroundColor Cyan
Write-Host "Directory: $currentDir" -ForegroundColor Cyan
Write-Host ""

try {
    # Create and start the HTTP listener
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    
    Write-Host "SUCCESS! Server is running on http://localhost:$port" -ForegroundColor Green
    Write-Host ""
    Write-Host "Open these URLs in your browser:" -ForegroundColor Yellow
    Write-Host "• Test: http://localhost:$port/quick-test.html" -ForegroundColor Cyan
    Write-Host "• Settings: http://localhost:$port/settings.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
    Write-Host "Listening for requests..." -ForegroundColor Gray
    Write-Host ""
    
    # Main server loop
    while ($listener.IsListening) {
        try {
            # Wait for a request
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            # Get the requested file path
            $requestedPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrEmpty($requestedPath) -or $requestedPath -eq "/") {
                $requestedPath = "index.html"
            }
            
            $filePath = Join-Path $currentDir $requestedPath
            
            # Log the request
            $timestamp = Get-Date -Format "HH:mm:ss"
            Write-Host "$timestamp - Request: $requestedPath" -ForegroundColor Gray
            
            if (Test-Path $filePath -PathType Leaf) {
                # File exists - serve it
                $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
                
                # Set content type based on file extension
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
                
                # Send the file
                $response.StatusCode = 200
                $response.ContentLength64 = $fileBytes.Length
                $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
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
        .links { margin-top: 20px; }
        .links a { 
            display: inline-block; margin: 10px; padding: 10px 20px; 
            background: #3498db; color: white; text-decoration: none; 
            border-radius: 4px; 
        }
    </style>
</head>
<body>
    <h1>404 - File Not Found</h1>
    <p>The file <strong>$requestedPath</strong> was not found.</p>
    <div class="links">
        <a href="/">Home</a>
        <a href="/quick-test.html">Quick Test</a>
        <a href="/settings.html">Settings</a>
    </div>
</body>
</html>
"@
                $errorBytes = [System.Text.Encoding]::UTF8.GetBytes($errorHtml)
                $response.StatusCode = 404
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $errorBytes.Length
                $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
            }
            
            # Close the response
            $response.Close()
            
        } catch {
            # Handle individual request errors
            if ($_.Exception -is [System.Net.HttpListenerException]) {
                # Listener was stopped - exit the loop
                break
            } else {
                Write-Host "Request error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
} catch {
    Write-Host "ERROR: Failed to start server" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    
    # Show helpful solutions based on the error
    if ($_.Exception.Message -like "*Access is denied*") {
        Write-Host "SOLUTION:" -ForegroundColor Yellow
        Write-Host "1. Run PowerShell as Administrator" -ForegroundColor Cyan
        Write-Host "2. Right-click PowerShell -> 'Run as administrator'" -ForegroundColor Cyan
    } elseif ($_.Exception.Message -like "*already in use*" -or $_.Exception.Message -like "*address already*") {
        Write-Host "SOLUTION:" -ForegroundColor Yellow  
        Write-Host "1. Port 3000 is already being used by another program" -ForegroundColor Cyan
        Write-Host "2. Close other web servers or restart your computer" -ForegroundColor Cyan
        Write-Host "3. Or edit this script and change the port number" -ForegroundColor Cyan
    } else {
        Write-Host "SOLUTION:" -ForegroundColor Yellow
        Write-Host "1. Try running as Administrator" -ForegroundColor Cyan
        Write-Host "2. Install Python from https://python.org" -ForegroundColor Cyan
    }
    
} finally {
    # Clean up
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
    Write-Host ""
    Write-Host "Server stopped." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
