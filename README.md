# Notepad Bot

Notepad is a Discord bot designed to enhance server utility with a set of default commands. It helps manage and streamline tasks within a server efficiently.

## Features
- Basic server utility commands
- Notepad-like functionality for storing quick notes (To be implemented)
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
   ```json
   {
      "token": "your-token-here",
      "clientId": "your-clientid-here"
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

## Commands (To be implemented, for now it's only basic utility commands)
| Command | Description |
|---------|-------------|
| `/note add [text]` | Adds a quick note |
| `/note list` | Lists all saved notes |
| `/note delete [id]` | Deletes a specific note |
| `/help` | Shows available commands |

## Contributing
Feel free to submit issues or pull requests to improve the bot.

## License
This project is licensed under the MIT License.

