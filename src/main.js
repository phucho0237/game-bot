const { Client, GatewayIntentBits, Events } = require("discord.js");
require("dotenv").config();

const client = new Client({
   intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () => {
   console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
