import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChannelType,
	ChatInputCommandInteraction,
} from "discord.js";
import { setDoorChannels, setDoorMessage } from "@/config/channels";

export default {
	data: new SlashCommandBuilder()
		.setName("set-door")
		.setDescription(
			"Set the default channel for welcome/leave messages in this guild"
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addSubcommand((o) =>
			o
				.setName("message")
				.setDescription("Set the message for the door")
				.addStringOption((o) =>
					o
						.setName("welcome")
						.setDescription("The message to set as welcome door")
						.setRequired(false)
				)
				.addStringOption((o) =>
					o
						.setName("goodbye")
						.setDescription("The message to set as goodbye door")
						.setRequired(false)
				)
		)
		.addSubcommand((o) =>
			o
				.setName("channel")
				.setDescription("Set the door channel")
				.addChannelOption((o) =>
					o
						.setName("welcome")
						.setDescription("The channel to set as welcome door")
						.setRequired(false)
						.addChannelTypes(ChannelType.GuildText)
				)
				.addChannelOption((o) =>
					o
						.setName("goodbye")
						.setDescription("The channel to set as  goodbye door")
						.setRequired(false)
						.addChannelTypes(ChannelType.GuildText)
				)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			return await interaction.editReply({
				content: "Command `/set-door` can only be used inside a guild.",
			});
		}

		await interaction.deferReply({ flags: 64 });

		const subCommand = interaction.options.getSubcommand();

		try {
			switch (subCommand) {
				case "channel": {
					const welcomeChannel = interaction.options.getChannel("welcome");
					const goodbyeChannel = interaction.options.getChannel("goodbye");

					setDoorChannels(
						interaction.guildId,
						welcomeChannel?.id || null,
						goodbyeChannel?.id || null
					);

					let res = "Door channels updated";

					if (welcomeChannel)
						res += `\nWelcome channel set to: ${welcomeChannel.toString()}`;
					if (goodbyeChannel)
						res += `\nGoodbye channel set to: ${goodbyeChannel.toString()}`;
					if (!welcomeChannel && !goodbyeChannel)
						res += "\nNo channels provided, please specify a channel";

					await interaction.editReply({ content: res });
					break;
				}
				case "message": {
					const welcomeMessage = interaction.options.getString("welcome");
					const goodbyeMessage = interaction.options.getString("goodbye");

					setDoorMessage(
						interaction.guildId,
						welcomeMessage || null,
						goodbyeMessage || null
					);

					let res = "Door messages updated";

					if (welcomeMessage)
						res += `\nWelcome message set to: \n${welcomeMessage}`;
					if (goodbyeMessage)
						res += `\n Goodbye channel set to: \n${goodbyeMessage}`;
					if (!welcomeMessage && !goodbyeMessage)
						res += "\nNo channels provided, please specify a channel";

					await interaction.editReply({ content: res });
					break;
				}
				default: {
					await interaction.editReply({ content: "❌ Invalid command!" });
					break;
				}
			}
		} catch (error) {}
	},
};
