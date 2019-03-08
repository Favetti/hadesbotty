exports.run = async (client, message, args, level) => { 
  
  message.channel.send({embed: {
    color: 0x00AE86,
    title: "So you like me, huh? Where do you wanna take me to?",
    url: process.env.BOT_INVITE_LINK,
    description: "Use the link above to invite me to a new Corp. Server.\n\nYou can also read more about me at: https://hadesbotty.weebly.com/\n\n",
    footer: {
      text: "PS: you need to be a server admin or owner..."
    }
  }});
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "invite",
  category: "Miscelaneous",
  description: "Get a link to the invite URL",
  usage: "invite"
};
