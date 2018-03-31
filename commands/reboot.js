exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  await message.reply("Bot is shutting down.");
  client.commands.forEach( async cmd => {
    await client.unloadCommand(cmd);
  });
  process.exit(1);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reboot",
  category: "System",
  description: "Duh... what you think?",
  usage: "reboot"
};
