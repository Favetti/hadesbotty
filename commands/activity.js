// This command will add the activity

exports.run = async (client, message, args, level) => { 

  args = args.map(function(x){ return x.toLowerCase() });
  const moment = require("moment");
  var targetID = message.author.id,
      lvl = 0,
      inf = 0,
      ts = 0,
      msg = "Updating",
      log = client.activityDB.get(targetID) || new Object(),
      d = new Date(Date.now()),
      stamp=(d.getFullYear()+"."+(d.getMonth()+1)+"."+d.getDate());

  if (!log.hasOwnProperty(stamp))
    log[stamp] = {lvl: 0, inf: 0, ts: 0};
      
  for (var i = 0; i < args.length; i++) {
    if (args[i] === "level" || args[i] === "lvl"){
      if (args[i+1] > 0){
        lvl = args[i+1];
        msg += " Level to "+ Number(lvl);
        log[stamp].lvl = Number(lvl);
        i++;
      }
    }
    if (args[i] === "influence" || args[i] === "inf"){
      if (args[i+1] > 0) {
        inf = args[i+1]
        msg += " Influence to "+ Number(inf);
        log[stamp].inf = Number(inf);
        i++;
      }
    }
  }
   
  if (client.hsTech.has(targetID)) {
    let allTech = client.hsTech.get(targetID);
    Object.keys(allTech).forEach(function(techID) {
      if (client.config.hadesTech[techID]) 
        ts += client.config.hadesTech[techID].levels[Number(allTech[techID]-1)] || 0;
    });
    if (log[stamp].ts !== ts) {
      msg += " TechScore to "+ Number(ts);
      log[stamp].ts = ts;
    }
  }
  
  if(msg !== "Updating") {
    client.activityDB.set(targetID, log);
    //client.logger.debug("write: "+JSON.stringify(log));
    message.reply(msg);
  }
  else
    message.reply("Current activity for today is: Level "+log[stamp].lvl+", Influence "+log[stamp].inf+", TechScore "+log[stamp].ts);
  
  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["act"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "activity",
  category: "Hades Star",
  description: "Update activity record for TODAY.",
  usage: "activity [lvl n] [inf n]"
};
