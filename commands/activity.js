// This command will add the activity

exports.run = async (client, message, args, level) => { 

  args = args.map(function(x){ return x.toLowerCase() });

  const moment = require("moment"),
        table = require('easy-table');
  
  var targetID = message.author.id,
      searchObj = message.guild,
      hasData = false,
      dataTable = new table,
      lvl = 0,
      inf = 0,
      ts = 0,
      msg = "Updating",
      log = client.activityDB.get(targetID) || new Object(),
      //d = new Date(Date.now()),
      //stamp=(d.getFullYear()+"."+(d.getMonth()+1)+"."+d.getDate());
      stamp = moment().format('YYYY.MM.DD');

  if (args[0] === "audit"){
    let period = args[1] || 7; //default period for audit
    let range = moment().subtract(period+1, 'days').format('YYYY.MM.DD');
    
    searchObj.members.forEach(function (tag, targetID){
      let previousRange = 0,
          postRange = 0;
      if (client.activityDB.has(targetID)) {
        client.logger.debug(":member:"+targetID)
        log = client.activityDB.get(targetID);
        Object.keys(log).forEach(function(keyStamp) {
          client.logger.debug(":"+moment(keyStamp, 'YYYY.MM.DD', true) +"|range:"+ moment(range, 'YYYY.MM.DD', true))
          
          if (moment(keyStamp, 'YYYY.MM.DD', true) < moment(range, 'YYYY.MM.DD', true)) {
            client.logger.debug(":act:"+keyStamp+"<"+range);
            if (moment(keyStamp, 'YYYY.MM.DD', true) > moment(previousRange, 'YYYY.MM.DD', true)) {
              client.logger.debug(":prev:"+keyStamp+">"+previousRange);
              previousRange = keyStamp;
            }
          }
          else if (moment(keyStamp, 'YYYY.MM.DD', true) >= moment(range, 'YYYY.MM.DD', true)) {
            client.logger.debug(":act:"+keyStamp+">="+range);
            if (moment(keyStamp, 'YYYY.MM.DD', true) >= moment(postRange, 'YYYY.MM.DD', true)) {
              client.logger.debug(":post:"+keyStamp+">="+postRange);
              postRange = keyStamp;
            }            
          }
          
        });
        
      }
    });
    return;
  }
  
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
    else if (args[i] === "influence" || args[i] === "inf"){
      if (args[i+1] > 0) {
        inf = args[i+1]
        msg += " Influence to "+ Number(inf);
        log[stamp].inf = Number(inf);
        i++;
      }
    }
  }
  
  //always check if techscore needs updating...
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
    client.logger.debug("write: "+JSON.stringify(log));
    message.reply(msg);
  }
  else
    message.reply("your current activity for today is: Level "+log[stamp].lvl+", Influence "+log[stamp].inf+", TechScore "+log[stamp].ts);
  
  
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["act"],
  permLevel: "Bot Support"
};

exports.help = {
  name: "activity",
  category: "Hades Star",
  description: "Update activity record for TODAY.",
  usage: "activity [lvl n] [inf n]"
};
