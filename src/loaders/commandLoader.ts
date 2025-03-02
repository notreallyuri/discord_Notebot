import { Client, Collection } from "discord.js";
import path from "path";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const loadCommands = async (
	client: Client & { commands: Collection<string, any> }
) => {
	const commandsPath = path.join(dirname, "..", "commands");
	const commandFiles = readdirSync(commandsPath).filter((f) =>
		f.endsWith(".ts")
	);

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const commandModule = await import(filePath);

		const command = commandModule.default || commandModule;

		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
			console.log(`[INFO] Registered command: ${command.data.name}`);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
};
