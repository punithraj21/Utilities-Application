// functions/sendNotifications/index.js
const admin = require("firebase-admin");
const serviceAccount = require("./signinmas-9f718-firebase-adminsdk-rqo86-5415702e5a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://signinmas-9f718-default-rtdb.asia-southeast1.firebasedatabase.app",
});

// functions/sendNotifications/index.js
// ... Firebase Admin initialization

module.exports = async (req: any, res: any) => {
  const db = admin.firestore();
  const notificationsRef = db.collection("NOTIFICATIONS");
  const snapshot = await notificationsRef.get();

  const tokens = [];
  snapshot.forEach((doc: any) => {
    const token = doc.data().token;
    if (token) {
      tokens.push(token);
    }
  });

  if (tokens.length > 0) {
    // Implement your notification sending logic here
    // For example, using Firebase Cloud Messaging (FCM)
  }

  res.status(200).json({ message: "Notifications process initiated" });
};
