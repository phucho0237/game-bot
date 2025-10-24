const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const config = require("../config");

module.exports = (client) => {
   const folderPath = path.join(__dirname, "..", "commands");
   const commandFolders = fs.readdirSync(folderPath);

   const commands = [];

   for (const folder of commandFolders) {
      const commandsPath = path.join(folderPath, folder);
      const commandFiles = fs
         .readdirSync(commandsPath)
         .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
         const filePath = path.join(commandsPath, file);
         const command = require(filePath);

         if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
         } else {
            console.warn(
               `The command at ${filePath} is missing a required 'data' or 'execute' property.`
            );
         }
      }
   }

   const rest = new REST().setToken(config.bot.token);

   (async () => {
      try {
         console.log(
            `Started refreshing ${commands.length} application (/) commands.`
         );

         const data = await rest.put(
            Routes.applicationGuildCommands(
               config.bot.clientId,
               config.guild.guildId
            ),
            { body: commands }
         );

         console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
         );
      } catch (err) {
         console.error(err);
      }
   })();
};
