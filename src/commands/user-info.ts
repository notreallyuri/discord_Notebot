import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { loadSingleUser } from "@/config/user";

export default {
	data: new SlashCommandBuilder()
		.setName("user-info")
		.setDescription("Provides basic info about a user")
		.addMentionableOption((o) =>
			o.setName("user").setDescription("Select a user to display")
		),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ flags: 64 });

		const user = interaction.user;
		const selectedUser = interaction.options.getUser("user");
		const displayUser = selectedUser || user;

		const userEmbed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle(`User Info: ${displayUser.username}`)
			.setThumbnail(displayUser.displayAvatarURL())
			.addFields(
				{ name: "User ID", value: displayUser.id },
				{
					name: "Account Created",
					value: `<t:${Math.floor(displayUser.createdTimestamp / 1000)}:R>`,
				},
				{ name: "Is Bot", value: displayUser.bot ? "Yes" : "No" }
			);

		userEmbed
			.setFooter({ text: `Requested by ${user.username}` })
			.setTimestamp();

		await interaction.editReply({ embeds: [userEmbed] });
	},
};
