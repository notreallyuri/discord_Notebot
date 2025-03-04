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

			
			if (member.user.id === member.client.user.id) {
				console.log(
					`Bot is the member leaving guild ${member.guild.name}, skipping goodbye message`
				);
				return;
			}

			const doorChannels = await getDoorChannels(member.guild.id);

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
				.setTitle(`${member.user.tag}`)
				.setDescription(`has left the server.`)
				.setTimestamp()
				.setFooter({ text: `User ID: ${member.id}` });

			await goodbyeChannel.send({ embeds: [leaveEmbed] });
		} catch (error) {
			console.error("Error in GuildMemberRemove event:", error);
		}
	},
};
