import { DoorChannels, saveGuilds, loadGuilds } from "./guilds";

export function getDoorChannels(guildId: string): DoorChannels {
	const guildData = loadGuilds();

	if (guildData.guilds[guildId] && guildData.guilds[guildId].DoorChannels) {
		return guildData.guilds[guildId].DoorChannels;
	}

	return { welcome: null, goodbye: null };
}

export function setDoorChannels(
	guildId: string,
	welcomeChannelId: string | null,
	goodbyeChannelId: string | null
): boolean {
	const guildData = loadGuilds();

	if (!guildData.guilds[guildId]) {
		guildData.guilds[guildId] = {
			DoorChannels: undefined,
			DoorMessages: undefined,
			users: undefined,
		};
	}

	if (!guildData.guilds[guildId].DoorChannels) {
		guildData.guilds[guildId].DoorChannels = { welcome: null, goodbye: null };
	}

	if (welcomeChannelId !== null) {
		guildData.guilds[guildId].DoorChannels.welcome = welcomeChannelId;
	}

	if (goodbyeChannelId !== null) {
		guildData.guilds[guildId].DoorChannels.goodbye = goodbyeChannelId;
	}

	return saveGuilds(guildData);
}
