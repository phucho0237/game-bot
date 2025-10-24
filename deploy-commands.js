const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const config = require("./src/config");

const commands = [];
const folderPath = path.join(__dirname, "src", "commands");
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
   const commandsPath = path.join(folderPath, folder);
   const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

   for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
         commands.push(command.data.toJSON());
      } else {
         console.warn(`Command at ${filePath} missing 'data' or 'execute'.`);
      }
   }
}

const rest = new REST().setToken(config.bot.token);

(async () => {
   try {
      console.log(`Start refreshing ${commands.length} command (/) of app.`);

      const data = await rest.put(
         Routes.applicationGuildCommands(
            config.bot.clientId,
            config.guild.guildId
         ),
         { body: commands }
      );

      console.log(`Successfully refresh ${data.length} command.`);
   } catch (err) {
      console.error(err);
   }
})();
