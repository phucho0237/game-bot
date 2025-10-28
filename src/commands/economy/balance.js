const {
   SlashCommandBuilder,
   ChatInputCommandInteraction,
   EmbedBuilder,
} = require("discord.js");
const prisma = require("../../utils/prismaClient");
const ensureGameUser = require("../../utils/ensureGameUser");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("balance")
      .setDescription("Check your balance"),
   /**
    *
    * @param {ChatInputCommandInteraction} interaction
    */
   async execute(interaction) {
      await interaction.deferReply({ ephemeral: true });

      const user = await ensureGameUser(interaction);
      if (!user) return;

      const embed = new EmbedBuilder()
         .setTitle(`${interaction.user.username}'s Balance`)
         .setDescription(`**Coins:** ${user.coins}\n**Wcoin:** ${user.wcoin}`)
         .setColor("#CED9DE");

      await interaction.editReply({ embeds: [embed], components: [] });
   },
};
