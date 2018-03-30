const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  var msg = `= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()}
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}`;

if (args[0]) {
  if (args[0] === "full"){
    msg += "\n-----------------------------------";
    
    let corps = {};
    
    client.settings.foreach(function (target, targetID, mapObj){
      corps[targetID] = {name: "", users: 0}
    });
    client.userDB.forEach(function (target, targetID, mapObj){
      target.foreach(function (target2, targetID2, mapObj2){
        if (corps.includes(targetID2)){
          corps[targetID2].users++;
          corps[targetID2].name = target2.name;
        }
      });
    });
    
    corps.foreach(function(target, targetID){
      msg += "\n• • • "+target.name+" ("+target.users+" users)";
    });
    
  }
}
  
  
message.channel.send(msg, {code: "asciidoc"})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "Miscelaneous",
  description: "Gives some useful bot statistics",
  usage: "stats"
};
