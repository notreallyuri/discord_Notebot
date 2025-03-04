import {
	SlashCommandBuilder,
	EmbedBuilder,
	ChatInputCommandInteraction,
} from "discord.js";
import { addNote, getNotes, removeNote, getNoteById } from "@/config/notes";

export default {
	data: new SlashCommandBuilder()
		.setName("note")
		.setDescription("Let the user add and manage his own quicknotes.")
		.addSubcommand((o) =>
			o
				.setName("add")
				.setDescription("Add a note to your note list")
				.addStringOption((o) =>
					o
						.setName("title")
						.setDescription("The title of your note")
						.setMinLength(2)
						.setMaxLength(16)
						.setRequired(true)
				)
				.addStringOption((o) =>
					o
						.setName("content")
						.setDescription("The content of your note")
						.setMinLength(1)
						.setMaxLength(256)
						.setRequired(false)
				)
		)
		.addSubcommand((o) =>
			o
				.setName("list")
				.setDescription("Shows a list of all your notes by id and title")
		)
		.addSubcommand((o) =>
			o
				.setName("delete")
				.setDescription("Delete a note from your note list")
				.addIntegerOption((o) =>
					o.setName("id").setDescription("The id of the note").setRequired(true)
				)
		)
		.addSubcommand((o) =>
			o
				.setName("read")
				.setDescription("Read a note from your note list")
				.addIntegerOption((o) =>
					o.setName("id").setDescription("The id of the note").setRequired(true)
				)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) {
			await interaction.reply({
				content: "Command `/note` can only be used inside a guild.",
				ephemeral: true,
			});
			return;
		}
		await interaction.deferReply({ flags: 64 });

		const subCommand = interaction.options.getSubcommand();

		try {
			switch (subCommand) {
				case "add": {
					const title = interaction.options.getString("title", true);
					const content =
						interaction.options.getString("content") || "No content provided";

					await addNote(interaction.user.id, title, content);

					await interaction.editReply(
						`✅ **Note added!**\n📌 Title: **${title}**\n📝 Content: ${content}`
					);
					break;
				}
				case "list": {
					const notes = await getNotes(interaction.user.id);

					if (!notes || notes.length === 0) {
						const noNotesEmbed = new EmbedBuilder()
							.setTitle("📜 Your Notes")
							.setDescription("❌ You don't have any notes yet.")
							.setColor(0xed4245)
							.setTimestamp();

						await interaction.editReply({ embeds: [noNotesEmbed] });
						break;
					}

					const noteList = notes
						.map((note, index) => {
							const separator = index < notes.length - 1 ? "\n" : "";
							return `**ID ${note?.id}** - ${note?.title}${separator}`;
						})
						.join("");

					const listEmbed = new EmbedBuilder()
						.setTitle("📜 Your Notes")
						.setDescription(noteList)
						.setColor(0x3498db)
						.setFooter({ text: `Total notes: ${notes.length}` })
						.setTimestamp();

					await interaction.editReply({ embeds: [listEmbed] });
					break;
				}
				case "delete": {
					const id = interaction.options.getInteger("id", true);

					const noteExists = await getNoteById(interaction.user.id, id);
					if (!noteExists) {
						await interaction.editReply(`❌ Note with ID ${id} not found.`);
						break;
					}

					await removeNote(interaction.user.id, id);
					await interaction.editReply(`🗑️ **Note with ID ${id} deleted!**`);
					break;
				}
				case "read": {
					const id = interaction.options.getInteger("id", true);
					const note = await getNoteById(interaction.user.id, id);

					if (!note) {
						await interaction.editReply(`❌ Note with ID ${id} not found.`);
						break;
					}

					const embed = new EmbedBuilder()
						.setTitle(`📝 ${note.title}`)
						.setDescription(note.content)
						.setColor(0x3498db)
						.setFooter({ text: `Note ID: ${note.id}` })
						.setTimestamp();

					await interaction.editReply({ embeds: [embed] });
					break;
				}
				default:
					await interaction.editReply({
						content: "❌ Invalid command!",
					});
			}
		} catch (error) {
			console.error(`Error in note command (${subCommand}):`, error);
			try {
				await interaction.editReply({
					content: "❌ An error occurred while processing your command.",
				});
			} catch (replyError) {
				console.error("Failed to send error message:", replyError);
			}
		}
	},
};
