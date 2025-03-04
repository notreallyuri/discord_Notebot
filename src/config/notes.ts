import { saveUsers, loadUsers, loadSingleUser, updateUser } from "./user";
import { Note, UserData } from "./data";
import { db } from "./firebase";

export async function getNotes(userId: string): Promise<Array<Note>> {
	try {
		const userData = await loadSingleUser(userId);

		if (!userData) {
			const newUser: UserData = { notes: [] };
			const data = { users: { [userId]: newUser } };
			await saveUsers(data);
			return [];
		}

		if (!userData.notes) {
			userData.notes = [];

			await saveUsers({ users: { [userId]: userData } });
		}

		return userData.notes;
	} catch (error) {
		console.error(`Error getting notes for user ${userId}:`, error);
		return [];
	}
}

export async function getNoteById(
	userId: string,
	noteId: number
): Promise<Note | null> {
	try {
		const userData = await loadSingleUser(userId);

		if (!userData || !userData.notes) {
			console.warn(`No notes found for user ${userId}`);
			return null;
		}

		const note = userData.notes.find((note) => note.id === noteId);

		if (!note) {
			console.warn(`Note with ID ${noteId} not found for user ${userId}`);
			return null;
		}

		return note;
	} catch (error) {
		console.error(`Error retrieving note ${noteId} for user ${userId}:`, error);
		return null;
	}
}

export async function addNote(
	userId: string,
	title: string,
	content: string
): Promise<Note | null> {
	try {
		const userRef = db.collection("users").doc(userId);
		const userDoc = await userRef.get();

		if (!userDoc.exists) {
			await userRef.set({ notes: [] });
		}

		return db.runTransaction(async (transaction) => {
			const latestUserDoc = await transaction.get(userRef);
			const userData = latestUserDoc.data() || { notes: [] };
			const notes = (userData.notes || []) as Note[];

			const newId =
				notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 1;
			const newNote = {
				id: newId,
				title,
				content,
				createdAt: new Date().toISOString(),
			};

			transaction.update(userRef, {
				notes: [...notes, newNote],
			});

			return newNote;
		});
	} catch (error) {
		console.error(`Error adding note for user ${userId}:`, error);
		return null;
	}
}

export async function removeNote(
	userId: string,
	noteId: number
): Promise<boolean> {
	try {
		const userData = await loadSingleUser(userId);

		if (!userData || !userData.notes) {
			console.warn(`No notes found for user ${userId}`);
			return false;
		}

		const noteExists = userData.notes.some((note) => note.id === noteId);
		if (!noteExists) {
			console.warn(`Note with ID ${noteId} not found for user ${userId}`);
			return false;
		}

		userData.notes = userData.notes.filter((note) => note.id !== noteId);

		return await saveUsers({ users: { [userId]: userData } });
	} catch (error) {
		console.error(`Error removing note ${noteId} for user ${userId}:`, error);
		return false;
	}
}
