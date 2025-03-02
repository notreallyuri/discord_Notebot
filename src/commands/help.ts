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
			.setTitle("List of commands")
			.setThumbnail(interaction.client.user.displayAvatarURL())
			.setDescription(
				"`purge` - Purges the chats, cleaning clutter of messages\n`set-door` - Set a door for welcome and goodbye messages\n`options` - Test command for boolean and number values\n`guild-info` - Provides info on the current guild"
			);

		await interaction.editReply({ embeds: [helpEmbed] });
	},
};
