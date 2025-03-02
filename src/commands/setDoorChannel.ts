import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
	ChannelType,
	ChatInputCommandInteraction,
} from "discord.js";
import { setDoorChannels } from "@/config/channels";

export default {
	data: new SlashCommandBuilder()
		.setName("set-door")
		.setDescription(
			"Set the default channel for welcome/leave messages in this guild"
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addChannelOption((option) =>
			option
				.setName("welcome")
				.setDescription("The channel for welcome messages")
				.setRequired(false)
				.addChannelTypes(ChannelType.GuildText)
		)
		.addChannelOption((option) =>
			option
				.setName("goodbye")
				.setDescription("The channel for goodbye messages")
				.setRequired(false)
				.addChannelTypes(ChannelType.GuildText)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply({ flags: 64 });

			if (!interaction.guildId)
				return await interaction.editReply(
					"This command can only be used in a server"
				);

			const welcomeChannel = interaction.options.getChannel("welcome");
			const goodbyeChannel = interaction.options.getChannel("goodbye");

			setDoorChannels(
				interaction.guildId,
				welcomeChannel?.id || null,
				goodbyeChannel?.id || null
			);

			let response = "Door channels updated";

			if (welcomeChannel)
				response += `\nWelcome channel set to: ${welcomeChannel.toString()}`;

			if (goodbyeChannel)
				response += `\n Goodbye channel set to: ${goodbyeChannel.toString()}`;

			if (!welcomeChannel && !goodbyeChannel)
				response = "No channels were updated, please specify a channel";

			await interaction.editReply(response);
		} catch (error) {
			console.log("Error in set-door command:", error);

			if (interaction.deferred && !interaction.replied)
				await interaction.editReply(
					"There was an error updating the door channels."
				);
			else if (!interaction.replied)
				await interaction.reply({
					content: "There was an error updating the door channels",
					flags: 64,
				});
		}
	},
};
