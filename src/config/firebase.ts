import { firestore, credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "config.json");

const serviceAccount = JSON.parse(
	fs.readFileSync(
		path.join(
			process.cwd(),
			"../notebot-f848b-firebase-adminsdk-fbsvc-fa5fcba683.json"
		),
		"utf-8"
	)
);

export const firebaseInstance = initializeApp({
	credential: credential.cert(serviceAccount),
});
export const db = getFirestore();
