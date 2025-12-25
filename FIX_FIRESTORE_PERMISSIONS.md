# 🔧 FIX: "Missing or insufficient permissions" Error

## The Problem
When users try to sign up, they get this error because Firestore security rules are blocking the write operation.

## The Solution - Update Firestore Rules (5 minutes)

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com
2. Select your project
3. Click **"Firestore Database"** in the left sidebar
4. Click the **"Rules"** tab at the top

### Step 2: Replace the Rules
1. You'll see the current rules (probably very restrictive)
2. **DELETE ALL** the existing rules
3. **COPY** the contents of `firestore.rules` file (in this project root)
4. **PASTE** into the Firebase console rules editor
5. Click **"Publish"** button

### Step 3: What These Rules Allow

**✅ Allowed:**
- Users can create their own account during signup
- Users can read/update their own profile
- Admins (estherandmays@gmail.com) can do EVERYTHING
- Subcontractors can read projects and their own payments
- Everyone can only see their own messages

**❌ Blocked:**
- Users cannot edit other users' data
- Subcontractors cannot create/delete projects
- Subcontractors cannot see other people's payments
- Non-admins cannot manage automation rules

### Step 4: Test Again
After publishing the rules:
1. Go back to your signup page
2. Try signing up as a subcontractor again
3. It should work now! ✅

---

## Alternative: Temporary Fix (NOT RECOMMENDED for production)

If you just want to test quickly, you can use these "allow all" rules temporarily:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ WARNING:** This allows ANYONE to read/write EVERYTHING. Only use for testing, then replace with the secure rules from `firestore.rules`.

---

## Need Help?
If this doesn't work, check:
1. Firebase project is the same one your env vars point to
2. Firestore is initialized in "Native mode" (not Datastore mode)
3. Rules were published successfully (look for green "Published" message)
