export interface DoorChannels {
	welcome: string | null;
	goodbye: string | null;
}

export interface DoorMessage {
	welcome: string | null;
	goodbye: string | null;
}

export interface Note {
	id: number;
	title: string;
	content: string | null;
	createdAt?: string;
}

export interface UserData {
	username?: string;
	avatarUrl?: string;
	notes: Note[];
}

export interface GuildData {
	name?: string;
	ownerId?: string;
	memberCount?: number;
	DoorChannels?: DoorChannels;
	DoorMessages?: DoorMessage;
}

export interface AppData {
	guilds: {
		[guildId: string]: GuildData;
	};
	users: {
		[userId: string]: UserData;
	};
}
