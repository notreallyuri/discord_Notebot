import {
	SlashCommandBuilder,
	CommandInteraction,
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

	async execute(interaction: CommandInteraction) {
		if (
			!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)
		) {
			return await interaction.reply({
				content:
					"You need the 'Manage Messages' permission to use this command.",
				flags: 64,
			});
		}

		if (!interaction.guild)
			return await interaction.reply({
				content: "This command can only be run in a server",
				flags: 64,
			});

		const amount = interaction.options.get("amount")?.value as number;
		const channel = interaction.channel;

		if (!channel || !(channel instanceof TextChannel))
			return await interaction.reply({
				content: "This command can only be used in text channels",
				flags: 64,
			});

		try {
			await interaction.deferReply({ flags: 64 });

			const messages = await channel.bulkDelete(amount, false);

			await interaction.editReply({
				content: `🗑️ Successfully deleted **${messages.size}** message(s)`,
			});
		} catch (error) {
			console.error(error);
			await interaction.editReply({
				content:
					"There was an error trying to delete messages. Messages older than 14 days cannot be bulk deleted.",
			});
		}
	},
};
