import {
	SlashCommandBuilder,
	EmbedBuilder,
	ChatInputCommandInteraction,
} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("guild-info")
		.setDescription("Sends guild information"),
	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply({ flags: 64 });

			if (!interaction.guild) {
				return await interaction.editReply(
					"This command can only be used in a server."
				);
			}

			const owner = await interaction.guild.fetchOwner();
			const onlineMembers =
				interaction.guild.members.cache.filter(
					(member) =>
						member.presence?.status === "online" ||
						member.presence?.status === "idle" ||
						member.presence?.status === "dnd"
				).size || 0;

			const embed = new EmbedBuilder()
				.setColor("Random")
				.setThumbnail(interaction.guild.iconURL())
				.setTitle(interaction.guild.name)
				.setDescription(`Here's some info about the server`)
				.addFields({
					name: "Guild owner",
					value: owner ? `${owner.user.toString()}` : "Unknown",
				})
				.addFields(
					{
						name: "Total Members",
						value: `${interaction.guild.memberCount}`,
						inline: true,
					},
					{
						name: "Members online",
						value: `${onlineMembers}`,
						inline: true,
					}
				)
				.setTimestamp()
				.setFooter({
					text: `Guild ID: ${interaction.guild.id}`,
					iconURL: interaction.client.user.displayAvatarURL(),
				});

			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.error("Error in guild-info command:", error);

			if (interaction.deferred) {
				await interaction.editReply(
					"There was an error fetching guild information."
				);
			} else if (!interaction.replied) {
				await interaction.reply({
					content: "There was an error fetching guild information.",
					flags: 64,
				});
			}
		}
	},
};
