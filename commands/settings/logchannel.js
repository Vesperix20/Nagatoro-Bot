const Guild = require("../../models/guild");
const mongoose = require("mongoose");
const Discord = require("discord.js");

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "modlog",
  category: "settings",
  description: "Sets a channel where moderation commands will be logged in",
  usage: `modlog <#channel>`,
  run: async (client, message, args) => {
    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `**Silly senpai~ you don't have permission to overwrite server configurations. (MANAGE_GUILD)**`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send({ embed: err }).then((msg) => {
        msg.delete({ timeout: 15000 });
      });

    const channel = await message.mentions.channels.first();
    const err1 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `**Silly senpai~ you need to mention a channel to set the moderation logs to.**`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!channel)
      return message.channel
        .send({ embed: err1 })
        .then((m) => m.delete({ timeout: 15000 }));

    await Guild.findOne(
      {
        guildID: message.guild.id,
      },

      async (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new Guild({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            logChannelID: channel.id,
            welcomeChannelID: "N/A",
          });

          await newGuild
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.error(err));

          const success = new Discord.MessageEmbed()

            .setColor(colors.success)
            .setTimestamp()
            .setTitle("You're all set!")
            .setDescription(
              emojis.Hype +
                "Senpai, I've set the server `moderation logs` to the channel <#" +
                channel +
                ">"
            )
            .setFooter("Requested by " + message.member.user.tag);

          return message.channel.send({ embed: success });
        } else {
          guild
            .updateOne({
              logChannelID: channel.id,
            })
            .then((result) => console.log(result))
            .catch((err) => console.error(err));

          const success = new Discord.MessageEmbed()

            .setColor(colors.success)
            .setTimestamp()
            .setTitle("You're all set!")
            .setDescription(
              emojis.Hype +
                "Senpai, I've set the server `moderation logs` to the channel <#" +
                channel +
                ">"
            )
            .setFooter("Requested by " + message.member.user.tag);

          return message.channel.send({ embed: success });
        }
      }
    );
  },
};
