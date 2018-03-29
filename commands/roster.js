// Hades star Technology Level
// This command will calculate the tech level for all users
/* global Map */ // clear error: Map is not defined. 

exports.run = async (client, message, args, level) => { 

  args = args.map(x => x.toLowerCase());
  if (0 >= args.length) { args[0] = 'all'}
  const util = require('util');
  const table = require('easy-table');
  await client.rosterDB.defer;
  try {
  var hasData=false,
      errors = '',
      members = new Map(),
      techLists = new Array(),
      callType = 'get',
      battleEmbed = {  'embed': {'title':  "Battle Roster",  'fields': new Array()}},
      supportEmbed = {  'embed': {'title': "Support Roster", 'fields': new Array()}};
      
  techLists[techLists.length] = new Map();
  args.forEach(function(arg, index) {
    //errors += `Processing argument ${arg}\n`;// Debug
    if (0 == index && ('set' === arg || 'remove' === arg  || 'add' === arg || 'reset' === arg )) {
      callType = arg;
    } else if ('|' === arg) {
      techLists[techLists.length] = new Map();
    } else if (arg.indexOf("<@&") >= 0) { //target is a ROLE
      let roleID = arg.replace("<@&","").replace(">","");
      if (!message.guild.roles.has(roleID)) {
        errors += `Role ${arg} not found! Maybe i can't mention it...\n`;
        return true; //Skip to next member of args
      }
      message.guild.roles.get(roleID).members.forEach(function(targetDB, targetID){
        targetDB = client.userDB.get(targetID);
        members.set(targetID, targetDB);
      });
    } else if (arg.indexOf("<@") >= 0 ) { //target is a USER
      //errors += "found user: "+arg+"\n";// Debug
      var targetID = arg.replace("<@","").replace(">","").replace("!","");
      var targetDB = client.userDB.get(targetID);// || {username: targetID, lastSeen: false}
      if (!targetDB) {
        errors += `User ${arg} has no data`;
        return true; //Skip to next member of args
      } 
      //errors += "added user: "+arg+"\n";// Debug
      members.set(targetID, targetDB);
    } else if ('all' === arg) {
      if (callType === 'set') {
        errors += `Cannot use 'all' when setting roster builds but you can target a specific role\n`;
        return true;
      }
      //errors += `Using all active users`;// Debug
      message.guild.members.forEach(function(targetDB, targetID){
          targetDB = client.userDB.get(targetID);
          members.set(targetID, targetDB);
        });
    } else {
      let techID = client.normalizeTechName(arg);
      techLists[techLists.length - 1].set(techID, true);
    }
  });
    
  if (members.size < 1) {
    errors += `Unable to find any matching users\n`;
  }
    
  if (techLists.length < 1) {
    errors += `Unable to find any matching technologies\n`;
  }
  
  members.forEach( (targetDB, targetID) => {
    //client.logger.error(util.inspect(client.rosterDB));
    var rosterEntry;
    rosterEntry = client.rosterDB.has(targetID) ? client.rosterDB.get(targetID) : false;
    if (!rosterEntry) {
      //errors += "No roster entry for "+targetID+"\n";// Debug
      rosterEntry = new Map([['active', false], ['battleBuild', false], ['supportBuild', false]]);
    } else {
      //errors += "rosterEntry is:\n" + util.inspect(rosterEntry) + "\n";// Debug
    }
    switch (callType) {
      case 'reset':
        rosterEntry = new Map([['active', false], ['battleBuild', false], ['supportBuild', false]]);
      case 'remove':
        rosterEntry.set('active', false);
        break;
      case 'add':
        rosterEntry.set('active', true);
        break;
      case 'set':
        rosterEntry.set('active', true);
        var battleBuild = false;
        var supportBuild = false;
        techLists.forEach( (techMap, techMapIndex) => {
          var build = {
            shipType:        false,
            weaponType:      false,
            shieldType:      false,
            supportModules:  new Map(),
            tradeModules:    new Map(),
            miningModules:   new Map(),
          }
          techMap.forEach( (value, techID) => {
            if (client.config.hadesTech[techID]) {
              switch (client.config.hadesTech[techID].group) {
                case 'ships':
                  if (build.shipType) {
                    errors += `Cannot add second ship type ${techID}, will use ${build.shipType}`;
                    return true;
                  }
                  build.shipType = techID;
                  break;
                case 'weapons':
                  if (build.weaponType) {
                    errors += `Cannot add second wearpon type ${techID}, will use ${build.weaponType}`;
                    return true;
                  }
                  build.weaponType = techID;
                  break;
                case 'shields':
                  if (build.shieldType) {
                    errors += `Cannot add second shield type ${techID}, will use ${build.shieldType}`;
                    return true;
                  }
                  build.shieldType = techID;
                  break;
                case 'support':
                  build.supportModules.set(techID, true);
                  break;
                case 'mining':
                  build.miningModules.set(techID, true);
                  break;
                case 'trade':
                  build.tradeModules.set(techID, true);
                  break;
              }
            } else {
              errors += `Invalid techID ${techID}\n`;
            }
          });// end of techMap.forEach( (techID) => {
          if (!build.shipType) {
            errors += `No ship type found for build ${techMapIndex}\n`;
            return true;// Don't process
          }
          if ('miner' !== build.shipType && 0 < build.miningModules.size) {
            errors += `No mining modules allowed on ${build.shipType}, skipping build ${techMapIndex}\n`;
            return true;// Don't process
          }
          if ('transp' != build.shipType && 0 < build.tradeModules.size) {
            errors += `No trading modules allowed on ${build.shipType}, skipping build ${techMapIndex}\n`;
            return true;// Don't process
          }
          if ('bs' != build.shipType && 1 < build.supportModules.size) {
            errors += `No more than 1 support modules allowed on ${build.shipType}, skipping build ${techMapIndex}\n`;
            return true;// Don't process
          }
          if ('bs' != build.shipType && build.weaponType) {
            errors += `No weapon module allowed on ${build.shipType}, skipping build ${techMapIndex}\n`;
            return true;// Don't process
          }
          if ('bs' != build.shipType && build.shieldType) {
            errors += `No weapon module allowed on ${build.shipType}, skipping build ${techMapIndex}\n`;
            return true;// Don't process
          }
          if ('bs' === build.shipType) {
            if (false !== battleBuild) {
              errors += `Cannot set 2 or more battleships in one command, skipping build ${techMapIndex}\n`;
              return true;// Don't process
            }
            battleBuild = build;
          }
          if ('miner' === build.shipType || 'transp' === build.shipType) {
            if (false !== supportBuild) {
              errors += `Cannot set 2 or more supports ships in one command, skipping build ${techMapIndex}\n`;
              return true;// Don't process
            }
            supportBuild = build;
          }
        });// end of techLists.forEach( (techMap, techMapIndex) => {
        if (false !== battleBuild) {
          rosterEntry.set('battleBuild',battleBuild);
          //errors += "Setting a battle build\n"; //Debug
        }
        if (false !== supportBuild) {
          rosterEntry.set('supportBuild',supportBuild);
          //errors += "Setting a support build\n"; //Debug
        } 
        break;
    }// end of switch (callType) {
    
    client.rosterDB.set(targetID, rosterEntry);
    if (!rosterEntry.get('active')) {
      return true; //
    }
    let allTech = client.hsTech.get(targetID) || client.hsTech.get('!'+targetID);
    if (!allTech) { return errors += `No tech levels found for user ${targetID}\n`; }
    //errors += util.inspect(rosterEntry)+"\n";// Debug
    if (rosterEntry.get('supportBuild')) {
      //errors += `Found a support build in roster for ${targetID}\n`;// Debug
      //errors += util.inspect(rosterEntry.get('supportBuild')) + "\n";// Debug
      var techID = rosterEntry.get('supportBuild').shipType;
      var buildText = techID+" ("+(Number( allTech[techID] ) || 0)+")";
      rosterEntry.get('supportBuild').supportModules.forEach( (value, techID) => {
        buildText += "\t"+techID+" ("+(Number( allTech[techID] ) || 0)+")";
      });
      rosterEntry.get('supportBuild').tradeModules.forEach( (value, techID) => {
        buildText += "\t"+techID+" ("+(Number( allTech[techID] ) || 0)+")";
      });
      rosterEntry.get('supportBuild').miningModules.forEach( (value, techID) => {
        buildText += "\t"+techID+" ("+(Number( allTech[techID] ) || 0)+")";
      });
    } else {
      buildText = "_No Build_";
    }
    supportEmbed.embed.fields[supportEmbed.embed.fields.length] = {
      'name': targetDB.username,
      'value': buildText,
    };
    
    if (rosterEntry.get('battleBuild')) {
      //errors += `Found a battle build in roster for ${targetID}\n`;// Debug
      //errors += util.inspect(rosterEntry.get('battleBuild')) + "\n";// Debug
      
      var techID = rosterEntry.get('battleBuild').shipType;
      var buildText = techID+" ("+(Number( allTech[techID] ) || 0)+")";
      
      techID = rosterEntry.get('battleBuild').weaponType;
      buildText += "\t"+( techID 
                      ? techID+" ("+(Number( allTech[techID] ) || 0)+")"
                      : "_No Weapon_");
      
      techID = rosterEntry.get('battleBuild').shieldType;
      buildText += "\t"+( techID
                      ? techID+" ("+(Number( allTech[techID] ) || 0)+")"
                      : "_No Shield_");
      
      rosterEntry.get('battleBuild').supportModules.forEach( (value, techID) => {
        buildText += "\t"+techID+" ("+(Number( allTech[techID] ) || 0)+")"
      });
    } else {
      buildText = "_No Build_";
    }
    battleEmbed.embed.fields[battleEmbed.embed.fields.length] = {
      'name': targetDB.username,
      'value': buildText,
    };
  });// end of members.forEach( (targetDB, targetID) => {
    if (errors) {
      message.reply(`\n${errors}`);
    }
    message.reply(battleEmbed);
    message.reply(supportEmbed);
    
  } catch (error) { 
    message.reply(`\nThere was an error: ${error}\n${errors}`); 
    throw error;
  } 
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ws"],
  permLevel: "User"
};

exports.help = {
  name: "roster",
  category: "Hades Star",
  description: "Shows the current roster of who is in the WS and what ships they are bringing Each player can have one battle build and one support build. \n"+
    "  Example: roster all (shows the current builds for all players marked active\n"+
    "  Example: roster remove @user (sets the user to inactive)\n"+
    "  Example: roster add @role (sets all @roll users to active)\n"+
    "  Example: roster set @role bs batt omega sanc emp (sets the battle build for all @role users)\n"+
    "  Example: roster set @user bs batt omega sanc emp | ts cargo entrust barrier (sets the battle and support build for @user)\n",
  usage: "roster [remove or add] (all or @role or @user) [ship type] [techID]... [| [ship type] [techID...]]"
};
