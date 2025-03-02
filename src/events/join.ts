import { Events, GuildMember, EmbedBuilder, TextChannel } from "discord.js";
import { getDoorChannels } from "@/config/channels";

export default {
	data: {
		name: Events.GuildMemberAdd,
		once: false,
	},
	async execute(member: GuildMember) {
		try {
			console.log(`New member joined: ${member.user.tag}`);

			const doorChannels = getDoorChannels(member.guild.id);

			if (!doorChannels.welcome) {
				console.log(
					`No welcome channel configured for guild: ${member.guild.name}`
				);
				return;
			}

			const welcomeChannel = member.guild.channels.cache.get(
				doorChannels.welcome
			) as TextChannel;

			if (!welcomeChannel || !welcomeChannel.isTextBased()) {
				console.log(
					`Welcome channel not found or not a text channel in guild: ${member.guild.name}`
				);
				return;
			}

			const joinEmbed = new EmbedBuilder()
				.setColor("#00FF00")
				.setTitle(`Welcome to ${member.guild.name}!`)
				.setDescription(
					`Hey ${member.user.toString()}, welcome to the server! We're glad to have you here.`
				)
				.setThumbnail(member.user.displayAvatarURL({ size: 256 }))
				.addFields(
					{
						name: "Member Count",
						value: `You are our ${member.guild.memberCount}th member!`,
					},
					{
						name: "Created Account",
						value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
					}
				)
				.setTimestamp()
				.setFooter({ text: `User ID: ${member.id}` });

			await welcomeChannel.send({ embeds: [joinEmbed] });
		} catch (error) {
			console.error("Error in GuildMemberAdd event:", error);
		}
	},
};
