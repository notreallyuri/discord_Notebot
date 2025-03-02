import { Client, GatewayIntentBits, Collection, Events } from "discord.js";
import { loadCommands } from "@/loaders/commandLoader";
import { loadEvents } from "@/loaders/eventLoader";
import { token } from "./config.json";

interface CustomClient extends Client {
	commands: Collection<string, any>;
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
}) as CustomClient;

client.commands = new Collection();

client.on(Events.InteractionCreate, async (interaction) => {
	try {
		console.log(
			`Received interaction: ${interaction.type} from ${interaction.user?.tag}`
		);

		if (interaction.isChatInputCommand()) {
			const { commandName } = interaction;
			console.log(`Processing command: ${commandName}`);

			const command = client.commands.get(commandName);

			if (!command) {
				console.error(`Command ${commandName} not found`);
				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply({
						content: "This command is not implemented yet.",
						flags: 64,
					});
				}
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing command ${commandName}:`, error);

				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply({
						content: "There was an error executing this command!",
						flags: 64,
					});
				} else if (interaction.deferred) {
					await interaction.followUp({
						content: "There was an error executing this command!",
						flags: 64,
					});
				}
			}
		}
	} catch (error) {
		console.error("Error in interaction handler:", error);
	}
});

export { client };

console.log("Index.ts loaded");

const isDirectRun = process.argv.some((arg) => arg.includes("index.ts"));
console.log("Is direct run:", isDirectRun);
client.once(Events.ClientReady, (readyClient) => {
	console.log(`🚀 Ready! Logged in as ${readyClient.user.tag}`);
});

if (isDirectRun) {
	console.log("➡️ Starting bot...");
	const startBot = async () => {
		console.log("📨 Loading commands");
		await loadCommands(client).catch((error) => {
			console.error("❌ Error loading commands:", error);
		});
		console.log("✅ Success loading commands");

		console.log("📨 Loading events");
		await loadEvents(client).catch((error) => {
			console.error("❌ Error loading events:", error);
		});
		console.log("✅ Success loading events");

		console.log("📨 Logging in");
		await client.login(token).catch((error) => {
			console.error("❌ Error logging in:", error);
		});
		console.log("✅ Success logging in");
	};
	startBot().catch((error) => {
		console.error("❌ Error starting bot:", error);
	});
} else {
	console.log("Index.ts was imported, not starting bot");
}
