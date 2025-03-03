import { loadGuilds, saveGuilds, Note } from "./guilds";

function getUserNotes(
	guildId: string,
	userId: string
): Array<Note | undefined> | undefined {
	const data = loadGuilds();

	if (!data.guilds[guildId]) {
		console.log(`Guild with ID ${guildId} doesn't exist.`);
		return undefined;
	}

	if (!data.guilds[guildId].users) {
		data.guilds[guildId].users = {};
		saveGuilds(data);
	}

	if (!data.guilds[guildId].users[userId]) {
		data.guilds[guildId].users[userId] = [];
		saveGuilds(data);
	}

	return data.guilds[guildId].users[userId];
}

function addNote(guildId: string, userId: string, noteId: number) {}
function removeNote(guildId: string, userId: string, noteId: number) {}
