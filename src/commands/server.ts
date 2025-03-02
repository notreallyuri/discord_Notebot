import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("server-info")
		.setDescription("Provides information about the server."),
	async execute(interaction: CommandInteraction) {
		try {
			await interaction.deferReply({ flags: 64 });
			
			if (!interaction.guild) {
				return await interaction.editReply("This command can only be used in a server.");
			}

			await interaction.editReply(
				`Server: ${interaction.guild.name} \nMember count: ${interaction.guild.memberCount}`
			);
		} catch (error) {
			console.error("Error in server-info command:", error);
			
			// Handle errors appropriately
			if (interaction.deferred) {
				await interaction.editReply("There was an error fetching server information.");
			} else if (!interaction.replied) {
				await interaction.reply({ 
					content: "There was an error fetching server information.", 
					flags: 64 
				});
			}
		}
	},
};
