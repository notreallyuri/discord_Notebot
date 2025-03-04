import { GuildData } from "./data";
import { db } from "./firebase";

export type Guilds = { guilds: { [guildId: string]: GuildData } };

export async function loadGuilds(): Promise<Guilds> {
	try {
		const snapshot = await db.collection("guilds").get();
		const guilds: { [guildId: string]: GuildData } = {};

		snapshot.forEach((doc) => {
			guilds[doc.id] = doc.data() as GuildData;
		});
		return { guilds };
	} catch (error) {
		console.error("Error loading guilds:", error);
		return { guilds: {} };
	}
}

export async function saveGuilds(data: Guilds): Promise<boolean> {
	try {
		const batch = db.batch();
		Object.entries(data.guilds).forEach(([guildId, guildData]) => {
			const ref = db.collection("guilds").doc(guildId);
			batch.set(ref, guildData);
		});

		await batch.commit();
		return true;
	} catch (error) {
		console.error("Error saving guilds:", error);
		return false;
	}
}

export async function addGuild(
	guildId: string,
	data?: Partial<GuildData>
): Promise<boolean> {
	try {
		const guildRef = db.collection("guilds").doc(guildId);
		const guild = await guildRef.get();

		if (guild.exists) {
			console.log(`Guild with ID ${guildId} already exists.`);
			return false;
		}

		await guildRef.set({
			name: data?.name,
			ownerId: data?.ownerId,
			memberCount: data?.memberCount,
			DoorChannels: undefined,
			DoorMessages: undefined,
		});

		console.log(`Added new guild: ${guildId}`);
		return true;
	} catch (error) {
		console.error(`Error adding guild: ${guildId}, error:`, error);
		return false;
	}
}

export async function deleteGuild(guildId: string): Promise<boolean> {
	try {
		const guild = await db.collection("guilds").doc(guildId).get();

		if (!guild.exists) {
			console.log(`Guild ${guildId} does not exist, nothing to delete.`);
			return false;
		}

		await db.collection("guilds").doc(guildId).delete();
		console.log(`Deleted guild: ${guildId}`);
		return true;
	} catch (error) {
		console.error("Error deleting guild:", error);
		return false;
	}
}
