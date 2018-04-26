// This command....

/*

moment().startOf('day');
moment().isSameOrBefore(String);
moment().subtract(7, 'days');


*/
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
      errorMsg = "",
      log = client.activityDB.get(targetID) || new Object(),
      today = moment().startOf('day').valueOf(); // isnt CONST for TESTING-MODE
  
  //TESTING-MODE
  if (args[0] === "x" && level > 5){
      today = moment().subtract(args[1], 'days').startOf('day').valueOf();
    }
  

  if (args[0] === "audit"){
    let range = moment().subtract(args[1] > 0 ? args[1] : 7, 'days').valueOf();
    msg = "Audit starting "+moment(range).fromNow()+"\n";
    client.logger.debug("range:"+range.format('YYYY MM DD'));
    
    searchObj.members.forEach(function (tag, targetID){
      if (client.activityDB.has(targetID)) {
        let mostRecentDay = false,
            pastDay = false;
        log = client.activityDB.get(targetID);
        
        client.logger.debug(":member:"+targetID+":"+JSON.stringify(log))

        mostRecentDay = Math.max(...Object.keys(log))
        if ( mostRecentDay < range ) {
          errorMsg += client.getDisplayName(targetID, message.guild)+"have no recent activity log\n";
          return; //next member
        }

        pastDay = Object.keys(log).reduce(function(prevVal, element) {
          return element < range ? Math.max(prevVal, element) : prevVal;
        }, 0);

        if ( !pastDay ) {
          errorMsg += client.getDisplayName(targetID, message.guild)+"have no past activity log\n";
          return; //next member
        }
        
        client.logger.debug("past:"+moment(pastDay).format('YYYY MM DD')+"|recent:"+moment(mostRecentDay).format('YYYY MM DD'))

        //let x = Object.keys(log[mostRecentDay]).map(function(element) {
        //  return log[mostRecentDay][element] - log[pastDay][element];
        //})
        hasData=true;
        dataTable.cell('User', client.getDisplayName(targetID, message.guild).substr(0,15));
        dataTable.cell('Lvl Diff', log[mostRecentDay].lvl - log[pastDay].lvl);
        dataTable.cell('Inf Diff', log[mostRecentDay].inf - log[pastDay].inf);
        dataTable.cell('TS Diff', log[mostRecentDay].ts - log[pastDay].ts);
        dataTable.newRow();

      }
    });    
    
    message.channel.send(msg+ "```" + dataTable.sort(['User|asc']).toString()+"```");
    if (errorMsg) message.channel.send(errorMsg);
    
    return;
  }
  
  if (!log.hasOwnProperty(today))
    log[today] = {lvl: 0, inf: 0, ts: 0};
      
  for (var i = 0; i < args.length; i++) {
    if (args[i] === "level" || args[i] === "lvl"){
      if (args[i+1] > 0){
        lvl = args[i+1];
        msg += " Level to "+ Number(lvl);
        log[today].lvl = Number(lvl);
        i++;
      }
    }
    else if (args[i] === "influence" || args[i] === "inf"){
      if (args[i+1] > 0) {
        inf = args[i+1]
        msg += " Influence to "+ Number(inf);
        log[today].inf = Number(inf);
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
    if (log[today].ts !== ts) {
      msg += " TechScore to "+ Number(ts);
      log[today].ts = ts;
    }
  }

  if(msg !== "Updating") {
    client.activityDB.set(targetID, log);
    client.logger.debug("write: "+JSON.stringify(log));
    message.reply(msg);
  }
  else
    message.reply("your current activity for today is: Level "+log[today].lvl+", Influence "+log[today].inf+", TechScore "+log[today].ts);
  
  
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["act"],
  permLevel: "user"
};

exports.help = {
  name: "activity",
  category: "Hades Star",
  description: "Update activity record for the day.",
  usage: `activity [lvl n] [inf n] [audit n]
- - - - - - - - - - - - - - - - - -
Examples:
• !act lvl 100 inf 6000
• !act lvl 55
• !act inf 3000
• !act audit (standard audit, 7 days)
• !act audit 5 (5 days audit)
- - - - - - - - - - - - - - - - - -
For TESTING purposes this command will allow you to update in the PAST, specifying the number of days to the past: activity [x n] [lvl n] [inf n]
Example:
 . !act x 5 lvl 10 inf 2000 (sets 5 days ago)
 'x' must be the first argument, followed by the number of days.`
};
