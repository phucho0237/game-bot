require("dotenv").config();

module.exports = {
   bot: {
      token: process.env.BOT_TOKEN,
      clientId: process.env.BOT_CLIENT_ID,
      clientSecret: process.env.BOT_CLIENT_SECRET,
   },
   guild: {
      guildId: process.env.GUILD_ID,
   },
};
