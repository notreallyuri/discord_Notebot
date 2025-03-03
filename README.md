# Notepad Bot

Notepad is a Discord bot designed to enhance server utility with a set of default commands. It helps manage and streamline tasks within a server efficiently.

## Features
- Basic server utility commands (Implemented)
- Notepad-like functionality for storing quick notes (Planned)
- Customizable settings for better server management

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (Recommended: latest LTS version)
- [Bun](https://bun.sh/) (if using Bun for package management)
- A Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/ds_bot_notepad.git
   cd ds_bot_notepad
   ```
2. Install dependencies:
   ```sh
   bun install  # If using Bun
   # or
   npm install  # If using npm
   ```
3. Create a `config.json` file in the root directory and add your Discord bot token:
   - Choose your preferred setup method: local development or cloud storage.
      1. **Local Development:** Your `config.json` should look like this:
         ```json
         {
            "token": "your-token-here",
            "clientId": "your-clientid-here"
         }
         ```
      2. **Cloud-based storage (e.g., Firebase) for easier access and deployment:**
         ```json
         {
            "token": "your-token-here",
            "clientId": "your-clientid-here",
            "firebase": {
               "...your-firebase-details": ""
            }
         }
         ```
4. Start the bot:
   ```sh
   bun start  # If using Bun
   # or
   npm start  # If using npm
   ```

## Usage
Invite the bot to your server using the OAuth2 URL from the [Discord Developer Portal](https://discord.com/developers/applications), then use the available commands.

## Commands
| Command | Implemented | Description |
|---------|-------------|-------------|
| `/note add [title *required*] [content]` | ✅ | Adds a quick note |
| `/note list` | ✅ | Lists all saved notes |
| `/note read [id]` | ✅ | Lists all saved notes |
| `/note delete [id]` | ✅ | Deletes a specific note |
| `/help` | ✅ | Shows available commands |
| `/purge` | ✅ | Clears the chat with a custom amount |
| `/set-door` | ✅ | Set default chat for welcome or goodbye messages |
| `/guild-info` | ✅ | Provides information for the current guild |

*Planned features are marked with ❌.*

## Contributing
Feel free to submit issues or pull requests to improve the bot.

## License
This project is licensed under the MIT License.

