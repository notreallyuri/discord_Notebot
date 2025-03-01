import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("server-info")
		.setDescription("Provides information about the server."),
	async execute(interaction: CommandInteraction) {
		if (!interaction.guild)
			return interaction.reply("This command can only be used in a server.");

		await interaction.reply(
			`Server: ${interaction.guild.name} \n Member count: ${interaction.guild.memberCount}`
		);
	},
};
