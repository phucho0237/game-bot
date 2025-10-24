const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const config = require("./src/config");

const commands = [];
const folderPath = path.join(__dirname, "src", "commands");
const commandFolders = fs.readdirSync(folderPath);

// Lặp qua tất cả các thư mục con (utils, moderation, v.v.)
for (const folder of commandFolders) {
   const commandsPath = path.join(folderPath, folder);
   const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

   // Lặp qua tất cả các tệp lệnh
   for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
         // Chỉ lấy phần data JSON để deploy
         commands.push(command.data.toJSON());
      } else {
         console.warn(
            `[WARNING] Command at ${filePath} missing 'data' or 'execute'.`
         );
      }
   }
}

// Khởi tạo REST module
const rest = new REST().setToken(config.bot.token);

// Thực hiện deploy
(async () => {
   try {
      console.log(`Start refresing ${commands.length} command (/) of app.`);

      // Gửi lệnh lên guild cụ thể
      const data = await rest.put(
         Routes.applicationGuildCommands(
            config.bot.clientId,
            config.guild.guildId
         ),
         { body: commands }
      );

      console.log(`Sucessfully refesh ${data.length} command.`);
   } catch (err) {
      console.error(err);
   }
})();
