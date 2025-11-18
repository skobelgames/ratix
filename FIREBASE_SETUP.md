# Firebase Security Rules Setup

## Problem Fixed

Your Firebase application was experiencing permission errors because the Firestore security rules were not configured. The following errors have been addressed:

1. ✅ **Missing or insufficient permissions** for visitors collection
2. ✅ **Missing or insufficient permissions** for platform stats
3. ✅ **Missing or insufficient permissions** for friend challenges
4. ✅ **Query constraint error** for friends online count (already had workaround in code)

## Files Created

The following Firebase configuration files have been created:

- `firestore.rules` - Firestore database security rules
- `storage.rules` - Firebase Storage security rules
- `firebase.json` - Main Firebase configuration
- `.firebaserc` - Firebase project configuration
- `firestore.indexes.json` - Database indexes for optimal queries

## Security Rules Overview

### Collections and Permissions:

1. **users** - Anyone can read, users can only write their own data
2. **visitors** - Public read/write for visitor tracking
3. **games** - Public read, players can create/update their games
4. **matchmaking** - Public read, authenticated users can manage their queue entries
5. **friendInvitations** - Users can only see/manage invitations they're involved in
6. **platformStats** - Public read, authenticated users can write

## Deployment Instructions

### Prerequisites

Install Firebase CLI if you haven't already:

```bash
npm install -g firebase-tools
```

### Login to Firebase

```bash
firebase login
```

### Deploy Security Rules

Deploy the Firestore and Storage rules to your Firebase project:

```bash
firebase deploy --only firestore:rules,storage
```

Or deploy everything (rules + indexes):

```bash
firebase deploy
```

### Verify Deployment

After deployment:

1. Visit the [Firebase Console](https://console.firebase.google.com/project/ratix-fbf35/firestore/rules)
2. Check that the rules are active under **Firestore Database > Rules**
3. Check Storage rules under **Storage > Rules**

## Testing

After deploying the rules, test your application:

1. Reload your game application
2. The following should now work without permission errors:
   - Visitor tracking and online count display
   - Platform statistics loading
   - Friend challenges and invitations
   - Friends online count

## Troubleshooting

### If you still see permission errors:

1. Verify rules are deployed:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. Check the Firebase Console to ensure rules are published

3. Clear browser cache and reload the application

4. Check browser console for specific permission errors

### Common Issues:

- **Rules not updating**: Wait 1-2 minutes after deployment for rules to propagate
- **Index errors**: Deploy indexes with `firebase deploy --only firestore:indexes`
- **Authentication errors**: Ensure Firebase Auth is properly configured in your project

## Security Notes

The current rules provide a good balance between functionality and security:

- All user profiles are publicly readable (needed for displaying usernames/stats)
- Users can only modify their own data
- Visitor tracking is open (needed for anonymous users)
- Game data is protected - only participants can modify games
- Friend invitations are private - only sender/recipient can access

For production, you may want to add additional validation rules, such as:
- Data validation (field types, required fields)
- Rate limiting
- Size limits on uploads

## Next Steps

1. Deploy the rules using the commands above
2. Test your application
3. Monitor Firebase Console for any rule violation logs
4. Adjust rules as needed based on your specific requirements
