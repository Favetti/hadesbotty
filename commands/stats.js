const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]"),
        easyTable = require('easy-table');
  var table = new easyTable;
  
  var msg = `= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()} (${client.userDB.size.toLocaleString()} active)
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}`;

  if (args[0]) {
    if (args[0] === "full"){
      let corps = {};
      client.userDB.forEach(function (target, targetID){
        Object.keys(target).forEach(function (key){
          if (key !== "username" && key !== "lastSeen" && key !== "timeOffset"  && key !== "whitelist") {
            if (!corps[key]) corps[key] = {users: 0};
            corps[key].users++;
            corps[key].name = target[key].name;
          }
        });
      });
      Object.keys(corps).forEach(function (key){
        if (corps[key].users >= 5) {
          table.cell('Corps', "• "+corps[key].name.substr(0,20));
          table.cell('Users', corps[key].users);
          table.newRow();
        }
      });
    }
  }  
  message.channel.send(msg, {code: "asciidoc"})
  message.channel.send(table.sort(['Users|des']).toString(), {code: "asciidoc"})
  message.channel.send("*Only showing channels with 5 or more users...")
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "System",
  description: "Gives some (not-so)useful bot statistics",
  usage: "stats"
};
