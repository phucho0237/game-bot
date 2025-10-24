const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");

const config = require("./config.js");

const client = new Client({
   intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.cooldowns = new Collection();

["commands", "events"].forEach((handler) => {
   require(`./handlers/${handler}`)(client);
});

client.login(config.bot.token);
