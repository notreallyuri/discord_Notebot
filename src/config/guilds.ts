import path from "path";
import fs from "fs";

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

export interface User {
	id: string;
	notes: Array<Note | undefined>;
}

export interface GuildData {
	DoorChannels: DoorChannels;
	DoorMessages: DoorMessages;
	users: Array<User | undefined>;
}

interface Guild {
	[guildId: string]: GuildData;
}

export interface Guilds {
	guilds: Guild;
}

export const guilds: Guilds = {
	guilds: {},
};

export function loadGuilds(): Guilds {
	try {
		if (!fs.existsSync(guildsFilePath)) {
			fs.writeFileSync(guildsFilePath, JSON.stringify(guilds, null, 2));
			return guilds;
		}

		const data = fs.readFileSync(guildsFilePath, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		console.error("Error loading guilds:", error);
		return guilds;
	}
}

export function saveGuilds(data: Guilds): boolean {
	try {
		console.log("Writing to guilds file:", guildsFilePath);
		fs.writeFileSync(guildsFilePath, JSON.stringify(data, null, 2));
		console.log("Successfully wrote to guilds file!");
		return true;
	} catch (error) {
		console.error("Error saving guild:", error);
		return false;
	}
}
