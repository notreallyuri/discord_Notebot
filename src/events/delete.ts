import { Events, Guild } from "discord.js";
import { deleteGuild } from "@/config/guilds";

export default {
	data: {
		name: Events.GuildDelete,
		once: false,
	},
	async execute(guild: Guild) {
		try {
			console.log(`Bot removed from guild: ${guild.name} (${guild.id})`);

			await deleteGuild(guild.id);
		} catch (error) {
			console.error("Error in guildDelete event:", error);
		}
	},
};
