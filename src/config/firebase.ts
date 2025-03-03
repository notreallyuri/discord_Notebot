import { firestore, credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

export const firebaseInstance = initializeApp({
	credential: credential.cert(config.firebase),
});
export const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
