const { Client, GatewayIntentBits, Events } = require("discord.js");

const config = require("./config.js");

const client = new Client({
   intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () => {
   console.log(`Logged in as ${client.user.tag}`);
});

client.login(config.bot.token);
