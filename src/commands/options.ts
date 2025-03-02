import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("number-test")
		.setDescription("Testing number options")
		.addBooleanOption((o) =>
			o
				.setName("boolean-option")
				.setDescription("Boolean confirmation")
				.setRequired(true)
		)
		.addNumberOption((o) =>
			o
				.setName("number-option")
				.setDescription("Number Confirmation")
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(1000)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ flags: 64 });
		const boolean = interaction.options.getBoolean("boolean-option");
		const count = interaction.options.getNumber("number-option");

		if (boolean)
			return await interaction.editReply(`You selected the number: ${count}`);
		else
			return await interaction.editReply(
				`You marked false, ${interaction.user.username}`
			);
	},
};
