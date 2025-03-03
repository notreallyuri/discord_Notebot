import { User, loadGuilds, Note } from "./guilds";

function getUserNotes(guildId: string, userId: string) {
	const data = loadGuilds();

	if (!data.guilds[guildId].users) {
		data.guilds[guildId].users = { [userId]: undefined };
	}

	if (data.guilds[guildId] && data.guilds[guildId].users[userId]) {
		return data.guilds[guildId].users[userId];
	}

	return [{ id: null, title: null, content: null }];
}
