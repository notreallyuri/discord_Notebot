import { db } from "./firebase";

export interface DoorChannels {
	welcome: string | null;
	goodbye: string | null;
}

interface Message {
	title: string | null;
	content: string | null;
}

export interface DoorMessages {
	welcomeMessage: Message | undefined;
	goodbyeMessage: Message | undefined;
}

export interface Note {
	id: number;
	title: string;
	content: string | null;
}

export type User = Record<string, Array<Note | undefined> | undefined>;

export interface GuildData {
	DoorChannels?: DoorChannels;
	DoorMessages?: DoorMessages;
	users?: User;
}

export type Guild = Record<string, GuildData>;

export interface Guilds {
	guilds: Guild;
}

export const guilds: Guilds = {
	guilds: {},
};

export async function loadGuilds(): Promise<Guilds> {
	try {
		const snapshot = await db.collection("guilds").get();
		const base: Guilds = { guilds: {} };

		snapshot.forEach((doc) => (base.guilds[doc.id] = doc.data() as GuildData));
		return base;
	} catch (error) {
		console.error("Error loading guilds:", error);
		return { guilds: {} };
	}
}

export async function saveGuilds(data: Guilds): Promise<boolean> {
	try {
		const batch = db.batch();
		Object.entries(data.guilds).forEach(([guildId, guildData]) => {
			const ref = db.collection("guilds").doc(guildId);
			batch.set(ref, guildData);
		});

		await batch.commit();
		return true;
	} catch (error) {
		return false;
	}
}

export async function addGuild(guildId: string): Promise<boolean> {
	try {
		const guildRef = db.collection("guilds").doc(guildId);
		const guild = await guildRef.get();

		if (guild.exists) {
			console.log(`Guild with ID ${guildId} already exists.`);
			return false;
		}

		await guildRef.set({
			DoorChannels: undefined,
			DoorMessages: undefined,
			users: undefined,
		});

		console.log(`Added new guild: ${guildId}`);
		return true;
	} catch (error) {
		console.error(`Error adding guild: ${guildId}, error:`, error);
		return false;
	}
}

export async function deleteGuild(guildId: string): Promise<boolean> {
	try {
		await db.collection("guilds").doc(guildId).delete();
		console.log(`Deleted guild: ${guildId}`);
		return true;
	} catch (error) {
		console.error("Error deleting guild:", error);
		return false;
	}
}
