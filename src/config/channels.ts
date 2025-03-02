import fs from "fs";
import path from "path";

const channelsFilePath = path.join(process.cwd(), "channels.json");

interface DoorChannels {
	welcome: string | null;
	goodbye: string | null;
}

interface GuildChannelConfig {
	[guildId: string]: DoorChannels;
}

interface ChannelConfig {
	guilds: GuildChannelConfig;
}

const defaultChannels: ChannelConfig = {
	guilds: {},
};

export function loadChannels(): ChannelConfig {
	try {
		if (!fs.existsSync(channelsFilePath)) {
			fs.writeFileSync(channelsFilePath, JSON.stringify(defaultChannels, null, 2));
			return defaultChannels;
		}
		
		const data = fs.readFileSync(channelsFilePath, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		console.error("Error loading channels:", error);
		return defaultChannels;
	}
}

export function saveChannels(channels: ChannelConfig): boolean {
	try {
		console.log('Writing to file:', channelsFilePath);
		fs.writeFileSync(channelsFilePath, JSON.stringify(channels, null, 2));
		console.log('Successfully wrote channels configuration');
		return true;
	} catch (error) {
		console.error("Error saving channels:", error);
		return false;
	}
}

export function getDoorChannels(guildId: string): DoorChannels {
	const channels = loadChannels();
	return channels.guilds[guildId] || { welcome: null, goodbye: null };
}

export function setDoorChannels(
	guildId: string,
	welcomeChannelId: string | null,
	goodbyeChannelId: string | null
): boolean {
	const channels = loadChannels();

	if (!channels.guilds[guildId])
		channels.guilds[guildId] = { welcome: null, goodbye: null };

	if (welcomeChannelId !== null)
		channels.guilds[guildId].welcome = welcomeChannelId;

	if (goodbyeChannelId !== null)
		channels.guilds[guildId].goodbye = goodbyeChannelId;

	console.log('Saving channels:', JSON.stringify(channels, null, 2));
	return saveChannels(channels);
}
