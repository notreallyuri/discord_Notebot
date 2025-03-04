import { Events, Guild, EmbedBuilder } from "discord.js";
import { addGuild } from "../config/guilds";

export default {
	data: {
		name: Events.GuildCreate,
		once: false,
	},
	async execute(guild: Guild) {
		try {
			console.log(`Bot added to new guild: ${guild.name} (${guild.id})`);

			const systemChannel =
				guild.systemChannel ||
				guild.channels.cache.find(
					(c) =>
						c.isTextBased() &&
						guild.members.me &&
						c.permissionsFor(guild.members.me).has("SendMessages")
				);

			const guildData = {
				name: guild.name,
				ownerId: guild.ownerId,
				memberCount: guild.memberCount,
			};

			if (systemChannel?.isTextBased()) {
				const welcomeEmbed = new EmbedBuilder()
					.setColor("#00FF00")
					.setTitle("Thanks for adding me!")
					.setDescription("Use `/help` to see available commands.")
					.addFields({
						name: "Setup",
						value: "Use `/set-door` to configure welcome/goodbye channels",
					})
					.setTimestamp()
					.setFooter({ text: `Guild ID: ${guild.id}` });

				await addGuild(guild.id, guildData);
				await systemChannel.send({ embeds: [welcomeEmbed] });
			}
		} catch (error) {
			console.error("Error in guildCreate event:", error);
		}
	},
};
