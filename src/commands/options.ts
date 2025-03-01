import { SlashCommandBuilder, CommandInteraction } from "discord.js";

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
	async execute(interaction: CommandInteraction) {
		const boolean = interaction.options.get("boolean-option")?.value as boolean;
		const count = interaction.options.get("number-option")?.value as number;

		if (boolean)
			return await interaction.reply(`You selected the number: ${count}`);
		else
			return await interaction.reply(
				`You marked false, ${interaction.user.username}`
			);
	},
};
