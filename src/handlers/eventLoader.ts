import { Client } from "discord.js";
import path from "path";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const loadEvents = async (client: Client) => {
	const eventsPath = path.join(dirname, "..", "events");
	const eventFiles = readdirSync(eventsPath).filter((f) => f.endsWith(".ts"));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const eventModule = await import(filePath);

		const event = eventModule.default || eventModule;

		if ("data" in event && "execute" in event) {
			if (event.data.once) {
				client.once(event.data.name, (...args) => event.execute(...args));
			} else {
				client.on(event.data.name, (...args) => event.execute(...args));
			}
			console.log(`[INFO] Registered event: ${event.data.name}`);
		} else {
			console.log(
				`[WARNING] The event at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
};
