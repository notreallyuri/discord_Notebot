import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	TextChannel,
} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Delete a specified number of messages.")
		.addIntegerOption((o) =>
			o
				.setName("amount")
				.setDescription("🚮 Number of messages to delete (max 100)")
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply({ flags: 64 });

			if (
				!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)
			) {
				return await interaction.editReply(
					"❌ You need the **Manage Messages** permission to use this command."
				);
			}

			if (!interaction.appPermissions.has(PermissionFlagsBits.ManageMessages)) {
				return await interaction.editReply(
					"🚫 I don’t have the **Manage Messages** permission. Please ask a server admin to grant me the necessary permissions."
				);
			}

			if (!interaction.guild) {
				return await interaction.editReply(
					"This command can only be run in a server"
				);
			}

			const amount = interaction.options.getInteger("amount");
			const channel = interaction.channel;

			if (!channel || !(channel instanceof TextChannel)) {
				return await interaction.editReply(
					"This command can only be used in text channels"
				);
			}

			if (!amount)
				return await interaction.editReply("You need to include set a amount");

			const messages = await channel.bulkDelete(amount, false);

			await interaction.editReply({
				content: `🗑️ Successfully deleted **${messages.size}** message(s)`,
			});
		} catch (error) {
			console.error("Error in purge command:", error);

			if (interaction.deferred) {
				await interaction.editReply(
					"There was an error trying to delete messages. Messages older than 14 days cannot be bulk deleted."
				);
			}
		}
	},
};
