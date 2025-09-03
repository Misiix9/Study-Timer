# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "study-timer")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set up Firebase Authentication

1. In your Firebase project console, go to "Authentication"
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Set up Firestore Database

1. In your Firebase project console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll set up security rules later)
4. Select a location closest to your users
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In your Firebase project console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register your app with a nickname (e.g., "Study Timer Web")
6. Copy the Firebase configuration object

## Step 5: Set up Firebase Admin SDK (for server-side operations)

1. In your Firebase project console, go to "Project settings"
2. Go to the "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file (keep it secure!)
5. Extract the required fields for your environment variables

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration:

```bash
# Firebase Configuration (from Step 4)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key-here"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"

# Firebase Admin SDK (from Step 5 - service account JSON)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY_ID="key-id-from-json"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="client-id-from-json"
```

## Step 7: Set up Firestore Security Rules (Optional but Recommended)

In your Firestore console, go to "Rules" and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Study sessions - users can only access their own
    match /studySessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Subjects - users can only access their own
    match /subjects/{subjectId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Goals - users can only access their own
    match /goals/{goalId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Analytics - users can only access their own
    match /analytics/{analyticsId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Step 8: Test the Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Try to create a new account
4. Check your Firebase Authentication console to see if the user was created
5. Check your Firestore console to see if the user document was created

## Firestore Collections Structure

Your app will create the following collections:

- `users` - User profiles and preferences
- `studySessions` - Individual study/break sessions
- `subjects` - Study subjects/topics
- `goals` - User goals and targets
- `analytics` - Daily analytics data

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Make sure all environment variables are set correctly
   - Check that your Firebase project is properly configured

2. **"Missing or insufficient permissions"**
   - Make sure Firestore security rules are set up correctly
   - Ensure the user is authenticated before making database calls

3. **"Network request failed"**
   - Check your internet connection
   - Verify your Firebase project settings

### Getting Help:

- Check the browser console for detailed error messages
- Review the Firebase documentation: https://firebase.google.com/docs
- Check the Firebase console for any configuration issues

## Next Steps

Once Firebase is set up and working:
1. The app will automatically create user documents when users sign up
2. Users can create study sessions, subjects, and goals
3. All data will be stored in Firestore
4. User authentication is handled by Firebase Auth

Your Study Timer app is now fully integrated with Firebase! 🎉
