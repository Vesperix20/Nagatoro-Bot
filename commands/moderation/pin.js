const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "pin",
  category: "fun",
  description: "Pin a message",
  usage: "pin <message>",
  run: async (client, message, args) => {
    if (message.author.bot) {
      return;
    }

    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTimestamp()
      .setTitle(configs.missing_title_moderation + " " + emojis.Sip)
      .setDescription(
        "Silly senpai~ you don't have permission to pin messages. (**MANAGE_MESSAGES**) " +
          emojis.Hmm
      );

    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send({ embed: err }).then((msg) => {
        msg.delete({ timeout: 15000 });
      });

    const text = args.slice(0).join(" ");

    const errm = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_fun + emojis.Sip)
      .setDescription(
        emojis.Hmm +
          " Senpai~ What message did you want me to pin again? \n Please mention a message for me to pin!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!args.length)
      return message.channel.send({ embed: errm }).then((msg) => {
        msg.delete({ timeout: 15000 });
      });

    message.delete();

    const embed = new Discord.MessageEmbed()
      .setColor(colors.success)
      .setTitle(":pushpin: Pinned Message")
      .setDescription(text)
      .setTimestamp()
      .setFooter("Pinned by " + message.member.user.tag);

    message.channel.send({ embed: embed }).then((msg) => msg.pin());

    const responsable_mod = message.member;
    const channel_occured = message.channel;

    var logembed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTimestamp()
      .setAuthor(" ➜ Action || Pin", responsable_mod.user.displayAvatarURL())
      .addField("Moderator:", responsable_mod, true)
      .addField("Channel:", channel_occured, true)
      .addField("Message:", "```" + text + "```", true)
      .setTimestamp();

    const Guild = require("../../models/guild");
    const settings = await Guild.findOne(
      {
        guildID: message.guild.id,
      },
      (err, guild) => {
        if (err) return console.error(err);
        if (guild) {
          console.log(guild);
        }
      }
    );

    let logchannel = message.guild.channels.cache.get(settings.logChannelID);
    logchannel.send({ embed: logembed });
  },
};
