import {
	SlashCommandBuilder,
	EmbedBuilder,
	CommandInteraction,
} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("guild-info")
		.setDescription("Sends guild information"),
	async execute(interaction: CommandInteraction) {
		const guild = interaction.guild;
		const owner = await guild?.fetchOwner();
		const onlineMembers =
			guild?.members.cache.filter(
				(member) =>
					member.presence?.status === "online" ||
					member.presence?.status === "idle" ||
					member.presence?.status === "dnd"
			).size || 0;

		const embed = new EmbedBuilder()
			.setColor("Random")
			.setTitle(guild?.name ?? "Guild Information")
			.setDescription(
				`Here's some info about the server`
			)
			.addFields({
				name: "Guild owner",
				value: owner ? `${owner.user.username}` : "Unknown",
			})
			.addFields({
				name: "Total Members",
				value: `${guild?.memberCount}`,
				inline: true,
			})
			.addFields({
				name: "Members online",
				value: `${onlineMembers}`,
				inline: true,
			})
			.setTimestamp()
			.setFooter({
				text: `Guild ID: ${guild?.id}`,
				iconURL: guild?.iconURL() || undefined,
			});

		await interaction.reply({ embeds: [embed] });
	},
};
