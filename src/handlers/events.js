const fs = require("node:fs");
const path = require("node:path");

module.exports = (client) => {
   const folderPath = path.join(__dirname, "..", "events");
   const eventFolders = fs.readdirSync(folderPath);

   for (const folder of eventFolders) {
      const eventsPath = path.join(folderPath, folder);
      const eventFiles = fs
         .readdirSync(eventsPath)
         .filter((file) => file.endsWith(".js"));

      for (const file of eventFiles) {
         const filePath = path.join(eventsPath, file);
         const event = require(filePath);

         if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
         } else {
            client.on(event.name, (...args) => event.execute(...args));
         }
      }
   }
};
