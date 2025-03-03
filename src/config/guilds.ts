import path from "path";
import fs from "fs";
import { db } from "./firebase";

const guildsFilePath = path.join(process.cwd(), "guilds.json");

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
	goodbyMessage: Message | undefined;
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

		snapshot.forEach((doc) => (base.guilds[doc.id] = doc.data() as Guild));
		return guilds;
	} catch (error) {
		console.error("Error loading guilds:", error);
		return { guilds: {} };
	}
}

export async function saveGuilds(data: Guilds): Promise<boolean> {
	try {
		const batch = db.batch();
		Object.entries(data).forEach(([guildId, guildData]) => {
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
	const guildData = await loadGuilds();

	if (guildData.guilds[guildId]) {
		console.log(`Guild with ID ${guildId} already exists.`);
		return false;
	}

	guildData.guilds[guildId] = {
		DoorChannels: undefined,
		DoorMessages: undefined,
		users: undefined,
	};
	return saveGuilds(guildData);
}

export async function deleteGuild(guildId: string): Promise<boolean> {
	const guildData = await loadGuilds();

	if (!guildData.guilds[guildId]) {
		console.log(`Guild with ID ${guildId} doesn't exist.`);
		return false;
	}

	delete guildData.guilds[guildId];

	return saveGuilds(guildData);
}
