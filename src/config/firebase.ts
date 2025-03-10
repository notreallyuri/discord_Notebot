import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

if (
	!process.env.FIREBASE_PROJECT_ID ||
	!process.env.FIREBASE_PRIVATE_KEY ||
	!process.env.FIREBASE_CLIENT_EMAIL
) {
	console.error("Missing one or more Firebase environment variables.");
	process.exit(1);
}

export const firebaseInstance = initializeApp({
	credential: credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
	}),
});

export const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
