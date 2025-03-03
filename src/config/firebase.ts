import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "config.json");

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

initializeApp({
	credential: applicationDefault(),
	projectId: config.firebase.projectId,
});

export const db = getFirestore();
