# Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for your EcoSlug Tracker app, allowing users to sign in with their Google accounts and sync their data to the cloud.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "EcoSlug Tracker")
5. Click "Create"

## Step 2: Enable Required APIs

1. In your project dashboard, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Google Drive API** (for storing user data)
   - **Google+ API** or **People API** (for user profile information)

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace account)
3. Fill out the required information:
   - **App name**: EcoSlug Tracker
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Add scopes (click "Add or Remove Scopes"):
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/userinfo.email`
5. Save and continue through the remaining steps

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Enter a name (e.g., "EcoSlug Tracker Web Client")
5. Add your authorized origins:
   - For local testing: `http://localhost:3000` (or your local server port)
   - For production: `https://yourdomain.com`
6. Add authorized redirect URIs:
   - For local testing: `http://localhost:3000`
   - For production: `https://yourdomain.com`
7. Click "Create"
8. **IMPORTANT**: Copy the Client ID that appears in the dialog

## Step 5: Update Your Code

1. Open `js/auth.js`
2. Find the line with `client_id: 'YOUR_GOOGLE_CLIENT_ID.googleusercontent.com'`
3. Replace `YOUR_GOOGLE_CLIENT_ID` with the Client ID from Step 4
4. The line should look like:
   ```javascript
   client_id: '123456789012-abcdefghijklmnop.apps.googleusercontent.com'
   ```

## Step 6: Test the Integration

1. Serve your application using a local web server (required for OAuth)
2. Navigate to the Settings page
3. You should see a "Sign in with Google" button
4. Click the button to test the authentication flow

## Important Notes

### Security Considerations
- Never commit your actual Client ID to public repositories
- Consider using environment variables for production deployments
- The Client ID is safe to use in client-side code (it's designed to be public)

### Local Development
- OAuth requires your app to be served over HTTP/HTTPS (not `file://`)
- Use a simple HTTP server like:
  ```bash
  # Python 3
  python -m http.server 3000
  
  # Node.js
  npx http-server -p 3000
  
  # PHP
  php -S localhost:3000
  ```

### Data Storage
- User data is stored securely in Google Drive's app-specific folder
- Users can only access data created by your app
- Data is encrypted in transit and at rest by Google

### Production Deployment
- Update the authorized origins and redirect URIs in Google Console
- Consider implementing additional security measures like CSRF protection
- Monitor your API usage in Google Cloud Console

## Troubleshooting

### "redirect_uri_mismatch" Error
- Ensure your redirect URI in Google Console exactly matches your app's URL
- Check for trailing slashes and protocol (http vs https)

### "invalid_client" Error
- Verify your Client ID is correctly copied
- Ensure the OAuth consent screen is configured properly

### API Quotas
- Google Drive API has generous free quotas
- Monitor usage in Google Cloud Console if you have many users

## Features Included

Once set up, users will be able to:

1. **Sign in with Google**: Secure authentication using their Google account
2. **Automatic Data Sync**: Data automatically syncs to Google Drive when signed in
3. **Cross-Device Access**: Access their data from any device by signing in
4. **Manual Sync Controls**: Force sync to/from cloud using buttons in settings
5. **Conflict Resolution**: Prompted when cloud data differs from local data
6. **Privacy Protection**: Data stored in app-specific folder, not accessible by other apps

## Next Steps

After completing the setup:

1. Test the authentication flow thoroughly
2. Consider adding offline support for when users are not signed in
3. Implement data migration tools for existing users
4. Add user feedback for sync status and conflicts
5. Consider implementing automatic background sync

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all steps in this guide were completed
3. Review Google Cloud Console for API usage and errors
4. Test with different browsers and devices

The authentication system is designed to be robust and user-friendly, providing a seamless experience for backing up and syncing EcoSlug Tracker data across devices.
