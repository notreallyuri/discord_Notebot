import {
	SlashCommandBuilder,
	EmbedBuilder,
	ChatInputCommandInteraction,
} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Gives a concise list of all commands"),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ flags: 64 });

		const helpEmbed = new EmbedBuilder()
			.setTitle("List of Commands")
			.setThumbnail(interaction.client.user.displayAvatarURL())
			.setDescription(
				`Here are all the available commands you can use with the bot:`
			)
			.addFields(
				{
					name: "`/purge`",
					value: "Purges the chat, cleaning up a clutter of messages.",
				},
				{
					name: "`/set-door`",
					value: "Sets a door for welcome and goodbye messages.",
				},
				{
					name: "`/options`",
					value: "Test command for boolean and number values.",
				},
				{
					name: "`/guild-info`",
					value:
						"Provides information about the current guild, such as name, member count, etc.",
				},
				{
					name: "`/note`",
					value:
						"Manage your quick notes. You can add, list, read, and delete your notes.",
				},
				{
					name: "`/note add`",
					value:
						"Add a note to your note list. Requires a title (2-16 characters) and optional content (1-256 characters).",
				},
				{
					name: "`/note list`",
					value: "List all your notes by ID and title.",
				},
				{
					name: "`/note delete`",
					value: "Delete a note from your note list. Requires the note ID.",
				},
				{
					name: "`/note read`",
					value: "Read a specific note by its ID.",
				},
				// Placeholder for future commands
				{
					name: "`/level-system (coming soon)`",
					value:
						"Displays or manages the user's level and experience in the bot's system.",
				},
				{
					name: "`/user-stats (coming soon)`",
					value: "Displays the user's stats, including activity and rank.",
				}
			)
			.setColor("#4B9CD3") // Optional: Customize color
			.setFooter({
				text: "Use /<command> for more details on each command.",
				iconURL: interaction.client.user.displayAvatarURL(),
			});

		await interaction.editReply({ embeds: [helpEmbed] });
	},
};
