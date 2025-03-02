import { Events, Guild, EmbedBuilder } from "discord.js";
import { loadChannels, saveChannels } from "@/config/channels";
import path from "path";
import fs from "fs";

export default {
	data: {
		name: Events.GuildDelete,
		once: false,
	},
	async execute(guild: Guild) {
		try {
			console.log(`Bot removed from guild: ${guild.name} (${guild.id})`);
			const channels = loadChannels();

			if (channels.guilds[guild.id]) {
				delete channels.guilds[guild.id];

				const saved = saveChannels(channels);
				if (saved)
					console.log(
						`Successfully removed guild ${guild.id} from channels configuration`
					);
				else
					console.error(
						`Failed to remove guild ${guild.id} from channels configuration`
					);
			} else
				console.log(`Guild ${guild.id} not found in channels configuration`);
		} catch (error) {
			console.error("Error in guildDelete event:", error);
		}
	},
};
