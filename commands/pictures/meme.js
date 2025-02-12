const randomPuppy = require("random-puppy");
const Discord = require("discord.js");

const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "meme",
  category: "Pictures",
  description: "Shows a random image of memes",
  usage: "meme",
  run: async (client, message) => {
    if (message.author.bot) return;

    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle(configs.cooldown)
        .setDescription(
          emojis.Sip +
            "**Please wait ** `10 seconds` ** before using the command again!**"
        )
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);

      return message.channel.send({ embed: er }).then((msg) => {
        msg.delete({ timeout: 15000 });
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 10000);
    }

    let reddit = [
      "meme",
      "memes",
      "cleanmemes",
      "animememes",
      "cleanmemes",
      "dankmeme",
      "wholesomememes",
      "MemeEconomy",
      "animememes",
      "meirl",
      "me_irl",
      "cleanmemes",
    ];

    let msg = [
      "All yours, senpai~",
      "Here you go senpai~",
      "Teehee~",
      "Woah there, senpai~",
      "Senpai~",
      "Marvellous choice, senpai~",
      "I've got you covered, senpai~",
      "Hope you enjoy, senpai~",
    ];

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];
    let response = msg[Math.floor(Math.random() * msg.length)];

    randomPuppy(subreddit).then(async (url) => {
      await message.channel;

      const embed = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTitle(response)
        .setDescription(
          "*Didn't appear? " +
            emojis.Arrow +
            " [Click me](" +
            url +
            ") " +
            emojis.Sip +
            "*"
        )
        .setTimestamp()
        .setImage(url)
        .setFooter("Requested by " + message.member.user.tag);
      message.channel.send({ embed: embed });
    });
  },
};
