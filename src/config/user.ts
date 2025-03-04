import { UserData } from "./data";
import { db } from "./firebase";
import debounce from "@/utils/debouncer";

export async function loadUsers(): Promise<{
	users: Record<string, UserData>;
}> {
	try {
		const snapshot = await db.collection("users").get();
		const base: { users: Record<string, UserData> } = { users: {} };

		snapshot.forEach((doc) => (base.users[doc.id] = doc.data() as UserData));

		return base;
	} catch (error) {
		console.error("[ERROR] Error loading users:", error);
		return { users: {} };
	}
}

export async function loadSingleUser(userId: string): Promise<UserData | null> {
	try {
		const doc = await db.collection("users").doc(userId).get();
		if (doc.exists) {
			return doc.data() as UserData;
		}

		return null;
	} catch (error) {
		console.error(`[ERROR] Error loading user ${userId}:`, error);
		return null;
	}
}

export async function saveUsers(data: {
	users: Record<string, UserData>;
}): Promise<boolean> {
	try {
		const batch = db.batch();

		Object.entries(data.users).forEach(([userId, userData]) => {
			const ref = db.collection("users").doc(userId);
			batch.set(ref, userData);
		});

		await batch.commit();
		return true;
	} catch (error) {
		return false;
	}
}

export async function addUser(
	userId: string,
	data: Partial<UserData>
): Promise<boolean> {
	try {
		const userRef = db.collection("users").doc(userId);
		const user = await userRef.get();

		if (user.exists) {
			console.log(`[WARN] User with ID ${userId} already exists.`);
			return false;
		}

		await userRef.set(data);
		console.log(`[SUCCESS] Added new user: ${userId}`);
		return true;
	} catch (error) {
		console.log(`[ERROR] Error adding user: ${userId}`, error);
		return false;
	}
}
export async function updateUser(
	userId: string,
	data: Partial<UserData>
): Promise<boolean> {
	try {
		const userRef = db.collection("users").doc(userId);
		await userRef.update(data);
		console.log(`[SUCCESS] User ${userId} updated with new data.`);
		return true;
	} catch (error) {
		console.error("[ERROR] Error updating user data:", error);
		return false;
	}
}

export const updateDebounced = debounce(updateUser, 5000);
