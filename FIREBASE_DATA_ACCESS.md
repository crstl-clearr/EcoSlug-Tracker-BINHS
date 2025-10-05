# Firebase Data Access for Developers

This document explains how developers can access and view user data stored in Firebase Firestore for the EcoSlug Tracker app.

## Overview

User data is now stored in Firebase Firestore when users are signed in with Google. This allows developers to access and analyze user data through the Firebase Console.

## Data Structure

### Collection: `pesticideLogs`

Each document in this collection represents a pesticide application log entry with the following fields:

- `userId`: String - Firebase Auth user ID of the user who created the entry
- `entryNumber`: Number - Sequential entry number for the user
- `dateApplied`: String - Date when pesticide was applied (YYYY-MM-DD format)
- `timeApplied`: String - Time when pesticide was applied (HH:MM format)
- `plantArea`: String - Description of the plant/area treated
- `dosageAmount`: String - Amount and type of pesticide used
- `notesRemarks`: String - Additional notes (optional)
- `createdAt`: Timestamp - When the entry was created
- `updatedAt`: Timestamp - When the entry was last updated (optional)

## Accessing Data

### Method 1: Firebase Console (Recommended)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your EcoSlug Tracker project
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **pesticideLogs** collection
5. Browse through the documents to view user data

### Method 2: Firebase Admin SDK (For Automated Access)

If you need programmatic access to the data, you can use the Firebase Admin SDK:

```javascript
// Example Node.js code to access data
const admin = require('firebase-admin');

// Initialize with your service account key
admin.initializeApp({
  credential: admin.credential.cert('path/to/serviceAccountKey.json')
});

const db = admin.firestore();

// Get all pesticide logs
async function getAllLogs() {
  const logsRef = db.collection('pesticideLogs');
  const snapshot = await logsRef.get();

  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}

// Get logs for a specific user
async function getUserLogs(userId) {
  const logsRef = db.collection('pesticideLogs');
  const query = logsRef.where('userId', '==', userId);
  const snapshot = await query.get();

  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}
```

## Security Considerations

- Data is stored per user and can only be accessed by authenticated users of the app
- Developers with Firebase Console access can view all user data
- Consider implementing data export features for users to download their own data
- Regular backups of Firestore data are recommended

## User Privacy

- Users' Google account information (name, email) is handled by Firebase Auth
- Pesticide application data contains sensitive agricultural information
- Ensure compliance with data protection regulations (GDPR, etc.)
- Provide users with clear privacy policies about data storage

## Monitoring and Analytics

### Firebase Console Features

1. **Real-time Database Monitoring**: View live data changes
2. **Query Builder**: Create complex queries to filter data
3. **Export Data**: Export collections to JSON/CSV
4. **Usage Analytics**: Monitor database usage and costs

### Useful Queries

```javascript
// Get logs from last 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const recentLogs = await db.collection('pesticideLogs')
  .where('createdAt', '>', thirtyDaysAgo)
  .get();

// Get logs by specific user
const userLogs = await db.collection('pesticideLogs')
  .where('userId', '==', 'specific-user-id')
  .orderBy('entryNumber')
  .get();

// Count total entries per user
const userStats = await db.collection('pesticideLogs')
  .groupBy('userId')
  .count()
  .get();
```

## Setup Instructions

### For Developers

1. **Get Firebase Project Access**:
   - Request access to the Firebase project from the project owner
   - Or create your own Firebase project and update the configuration

2. **Update Firebase Config**:
   - In `index.html`, replace the placeholder Firebase config with your actual project credentials
   - Never commit real credentials to version control

3. **Service Account for Admin Access**:
   - Generate a service account key in Firebase Console
   - Use it for server-side access to data

## Troubleshooting

### Common Issues

1. **"Permission Denied"**: Ensure you have proper Firebase Console access
2. **"Collection Not Found"**: Check that users have actually signed in and created data
3. **"Quota Exceeded"**: Monitor Firebase usage limits

### Data Migration

If migrating from localStorage to Firestore:
- Users need to sign in with Google
- Existing local data can be migrated using the import/export features
- Consider providing migration tools in the app

## Best Practices

1. **Regular Backups**: Export Firestore data regularly
2. **Data Validation**: Implement server-side validation rules
3. **User Consent**: Ensure users understand data storage implications
4. **Performance**: Use pagination for large datasets
5. **Security**: Implement proper access controls and encryption

## Support

For questions about data access or Firebase setup, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console Guide](https://firebase.google.com/docs/console)

---

**Note**: This system provides developers with full access to user-generated pesticide application data. Handle this data responsibly and ensure compliance with privacy regulations.