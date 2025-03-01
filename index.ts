import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import { token } from "./config.json";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers
	],
});

interface CustomClient extends Client {
	commands: Collection<string, any>;
}

(client as CustomClient).commands = new Collection();

const load = async () => {
	const commandsPath = path.join(dirname, "src", "commands");
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((f) => f.endsWith(".ts"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const commandModule = await import(filePath);

		const command = commandModule.default || commandModule;

		if ("data" in command && "execute" in command)
			(client as CustomClient).commands.set(command.data.name, command);
		else
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
	}
};

load();

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = (client as CustomClient).commands.get(
		interaction.commandName
	);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred)
			await interaction.followUp({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		else
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
	}
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
