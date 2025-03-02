import { Events, GuildMember, EmbedBuilder, TextChannel } from "discord.js";
import { getDoorChannels } from "@/config/channels";

export default {
	data: {
		name: Events.GuildMemberRemove,
		once: false,
	},
	async execute(member: GuildMember) {
		try {
			console.log(`Member left: ${member.user.tag}`);

			const doorChannels = getDoorChannels(member.guild.id);

			if (!doorChannels.goodbye) {
				console.log(
					`No goodbye channel configured for guild: ${member.guild.name}`
				);
				return;
			}

			const goodbyeChannel = member.guild.channels.cache.get(
				doorChannels.goodbye
			) as TextChannel;

			if (!goodbyeChannel || !goodbyeChannel.isTextBased()) {
				console.log(
					`Goodbye channel not found or not a text channel in guild: ${member.guild.name}`
				);
				return;
			}

			const leaveEmbed = new EmbedBuilder()
				.setColor("#FF0000")
				.setTitle(`Member Left`)
				.setDescription(`${member.user.tag} has left the server.`)
				.addFields({
					name: "Joined Server",
					value: member.joinedTimestamp
						? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
						: "Unknown join date",
				})
				.setTimestamp()
				.setFooter({ text: `User ID: ${member.id}` });

			await goodbyeChannel.send({ embeds: [leaveEmbed] });
		} catch (error) {
			console.error("Error in GuildMemberRemove event:", error);
		}
	},
};
