const {
   ChatInputCommandInteraction,
   EmbedBuilder,
   ActionRowBuilder,
   ButtonBuilder,
   ButtonStyle,
} = require("discord.js");
const prisma = require("./prismaClient");

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
async function ensureGameUser(interaction) {
   const userId = interaction.user.id;

   let user = await prisma.user.findUnique({
      where: { discordId: userId },
   });

   if (user) return user;

   const embed = new EmbedBuilder()
      .setTitle("Welcome, Adventurer!")
      .setDescription(
         "You don't have a game account yet.\nWould you like to create one?",
      )
      .setColor("Yellow");

   const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
         .setCustomId("create_account")
         .setLabel("Yes, create my account")
         .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
         .setCustomId("cancel")
         .setLabel("No, maybe later")
         .setStyle(ButtonStyle.Secondary),
   );

   const msg = await interaction.editReply({
      embeds: [embed],
      components: [row],
   });

   const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 15_000,
   });

   return new Promise((resolve) => {
      collector.on("collect", async (i) => {
         if (i.customId === "create_account") {
            user = await prisma.user.create({
               data: { discordId: userId },
            });

            const success = new EmbedBuilder()
               .setTitle("✅ Account Created!")
               .setDescription("Your account has been successfully created.")
               .setColor("Green");

            await i.update({ embeds: [success], components: [] });
            resolve(user);
         } else if (i.customId === "cancel") {
            await i.update({
               content: "❌ Account creation cancelled.",
               embeds: [],
               components: [],
            });
            resolve(null);
         }
      });

      collector.on("end", async (collected) => {
         if (collected.size === 0) {
            interaction.editReply({
               content: "⏳ Time’s up — no account created.",
               embeds: [],
               components: [],
            });
            resolve(null);
         }
      });
   });
}

module.exports = ensureGameUser;
