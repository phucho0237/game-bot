const {
   SlashCommandBuilder,
   ChatInputCommandInteraction,
   EmbedBuilder,
} = require("discord.js");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Check the bot's ping"),
   /**
    *
    * @param {ChatInputCommandInteraction} interaction
    */
   async execute(interaction) {
      try {
         await interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setColor("#CED9DE")
                  .setDescription("🏓 Pinging..."),
            ],
         });

         const sent = await interaction.fetchReply();

         const roundtripLatency =
            sent.createdTimestamp - interaction.createdTimestamp;

         await interaction.editReply({
            embeds: [
               new EmbedBuilder()
                  .setColor("#4287F5")
                  .setTitle("🏓 Pong!")
                  .setDescription(
                     `Websocket latency: **${interaction.client.ws.ping}ms**\nRoundtrip latency: **${roundtripLatency}ms**`,
                  ),
            ],
         });
      } catch (err) {
         console.error(err);
         return interaction.reply({
            content: "Something went wrong! Please try again later.",
            flags: MessageFlags.Ephemeral,
         });
      }
   },
};
