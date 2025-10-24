// Sử dụng require (CommonJS)
const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");

// Tải toàn bộ config bằng require
const config = require("./config.js");

const client = new Client({
   intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

["commands", "events"].forEach((handler) => {
   // require cũng hoạt động ở đây
   require(`./handlers/${handler}`)(client);
});

// Truy cập token qua đối tượng config
client.login(config.bot.token);
