import { saveGuilds, loadGuilds } from "./guilds";
import { DoorChannels } from "./data";

export async function getDoorChannels(guildId: string): Promise<DoorChannels> {
	const guildData = await loadGuilds();

	if (guildData.guilds[guildId] && guildData.guilds[guildId].DoorChannels) {
		return guildData.guilds[guildId].DoorChannels;
	}

	return { welcome: null, goodbye: null };
}

export async function setDoorChannels(
	guildId: string,
	welcomeChannelId: string | null,
	goodbyeChannelId: string | null
): Promise<boolean> {
	const guildData = await loadGuilds();

	if (!guildData.guilds[guildId]) {
		guildData.guilds[guildId] = {
			DoorChannels: undefined,
			DoorMessages: undefined,
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

export async function setDoorMessage(
	guildId: string,
	welcomeMessage: string | null,
	goodbyeMessage: string | null
) {
	const guildData = await loadGuilds();

	if (!guildData.guilds[guildId]) {
		guildData.guilds[guildId] = {
			DoorChannels: undefined,
			DoorMessages: undefined,
		};
	}

	if (!guildData.guilds[guildId].DoorMessages) {
		guildData.guilds[guildId].DoorMessages = {
			welcome: null,
			goodbye: null,
		};
	}

	if (welcomeMessage !== null) {
		guildData.guilds[guildId].DoorMessages.welcome = welcomeMessage;
	}

	if (goodbyeMessage !== null) {
		guildData.guilds[guildId].DoorMessages.goodbye = goodbyeMessage;
	}

	return saveGuilds(guildData);
}
