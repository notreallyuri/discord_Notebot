import { REST, Routes } from "discord.js";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const token = process.env.CLIENT_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
	console.error("Missing CLIENT_TOKEN or CLIENT_ID in .env file.");
	process.exit(1);
}

(async () => {
	const commands = [];
	const commandsPath = path.join(dirname, "commands");

	const commandFiles = readdirSync(commandsPath).filter((f) =>
		f.endsWith(".ts")
	);

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const commandModule = await import(filePath);

		const command = commandModule.default || commandModule;

		if ("data" in command && "execute" in command)
			commands.push(command.data.toJSON());
		else
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
	}

	const rest = new REST().setToken(token);

	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		const data = await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});
		console.log("Successfully refreshed application (/) commands.");
	} catch (error) {
		console.error(error);
		console.log("Failed refreshing application (/) commands.");
	}
})();
