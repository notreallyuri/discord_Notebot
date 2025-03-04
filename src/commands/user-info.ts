import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { addUser, loadSingleUser, updateUser } from "@/config/user";

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

		const loadUser = await loadSingleUser(displayUser.id);

		const userEmbed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle(`User Info: ${displayUser.username}`)
			.setThumbnail(displayUser.displayAvatarURL())
			.addFields(
				{ name: "Requested by", value: user.username, inline: true },
				{
					name: "Account Created",
					value: `<t:${Math.floor(displayUser.createdTimestamp / 1000)}:R>`,
				},
				{ name: "Is Bot", value: displayUser.bot ? "Yes" : "No" }
			)
			.setFooter({ text: `ID: ${displayUser.id}` })
			.setTimestamp();

		const userData = {
			username: displayUser.username,
			avatarUrl: displayUser.avatarURL() || displayUser.defaultAvatarURL,
		};

		if (loadUser) {
			await updateUser(displayUser.id, userData);
		}

		if (!loadUser) {
			if (!displayUser.bot) {
				await addUser(displayUser.id, userData);
			}
		}

		await interaction.editReply({ embeds: [userEmbed] });
	},
};
