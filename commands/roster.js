// Hades star Technology Level
// This command will calculate the tech level for all users
/* global Map */ // clear error: Map is not defined. 

exports.run = async (client, message, args, level) => { 

  args = args.map(x => x.toLowerCase());
  if (0 >= args.length) { args[0] = 'all'}
  //const util = require('util');
  //const table = require('easy-table');
  await client.rosterDB.defer;
  try {
  var hasData=false,
      errors = '',
      members = new Map(),
      techLists = new Array(),
      callType = 'get',
      filteredUsers = new Array(),
      battleEmbed = {  'embed': {'title':  "__Battle Roster__",  'fields': new Array()}},
      supportEmbed = {  'embed': {'title': "__Support Roster__", 'fields': new Array()}};
      
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
        if (!client.checkPrivacy(targetID, message))
          filteredUsers.push(client.getDisplayName(targetID, message.guild));
        else
          members.set(targetID, targetDB);
      });
    } else if (arg.indexOf("<@") >= 0 ) { //target is a USER
      //errors += "found user: "+arg+"\n";// Debug
      //var targetID = arg.replace("<@","").replace(">","").replace("!","");
      var targetID = arg.replace(/[^0-9]/g,"");
      var targetDB = client.userDB.get(targetID);// || {username: targetID, lastSeen: false}
      if (!targetDB) {
        errors += `User ${arg} has no data`;
        return true; //Skip to next member of args
      } 
      //errors += "added user: "+arg+"\n";// Debug
      if (!client.checkPrivacy(targetID, message))
        filteredUsers.push(client.getDisplayName(targetID, message.guild));
      else
        members.set(targetID, targetDB);
    } else if ('all' === arg) {
      if (callType === 'set') {
        errors += `Cannot use 'all' when setting roster builds but you can target a specific role\n`;
        return true;
      }
      //errors += `Using all active users`;// Debug
      message.guild.members.forEach(function(targetDB, targetID){
          targetDB = client.userDB.get(targetID);
          if (!client.checkPrivacy(targetID, message))
            filteredUsers.push(client.getDisplayName(targetID, message.guild));
          else
            members.set(targetID, targetDB);
        });
    } else {
      let techID = client.normalizeTechName(arg);
      techLists[techLists.length - 1].set(techID, true);
    }
  });
    
  //client.logger.debug( ":"+filteredUsers.toString());
    
  if (filteredUsers.length > 0)
    message.channel.send("Some users on your query have privacy seetings forbidding their tech to be viewed here: `"+filteredUsers.toString()+"`. You can ask them to WhiteList this channel or clear their WhiteList.")
    
  if (members.size < 1)
    return message.channel.send("Unable to find any matching users.");
    
  if (techLists.length < 1)
    errors += `Unable to find any matching technologies\n`;
  
  members.forEach( (targetDB, targetID) => {
    //client.logger.error(util.inspect(client.rosterDB));
    
    var rosterEntry;
    rosterEntry = client.rosterDB.has(message.guild.id+"."+targetID) ? new Map(client.rosterDB.get(message.guild.id+"."+targetID)) : false;
    if (!rosterEntry) {
      //errors += "No roster entry for "+targetID+"\n";// Debug
      rosterEntry = new Map([['active', false], ['battleBuild', false], ['supportBuild', false]]);
    } else {
      //errors += "rosterEntry is:\n" + util.inspect(rosterEntry) + "\n";// Debug
    }
    switch (callType) {
      case 'reset':
        if (level <= 8)
          return message.reply("Only Bot Support or higher can RESET the roster... safety stuff, you know...");        
        rosterEntry = new Map([['active', false], ['battleBuild', false], ['supportBuild', false]]);
        break;
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
            supportModules:  new Array(),
            tradeModules:    new Array(),
            miningModules:   new Array(),
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
                  if (!build.supportModules.includes(techID)) {
                    build.supportModules.push(techID);
                  }
                  break;
                case 'mining':
                  if (!build.miningModules.includes(techID)) {
                    build.miningModules.push(techID);
                  }
                  break;
                case 'trade':
                  if (!build.tradeModules.includes(techID)) {
                    build.tradeModules.push(techID);
                  }
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
          if ('miner' !== build.shipType && 0 < build.miningModules.length) {
            errors += `No mining modules allowed on ${build.shipType}, skipping build ${techMapIndex}\n`;
            return true;// Don't process
          }
          if ('transp' != build.shipType && 0 < build.tradeModules.length) {
            errors += `No trading modules allowed on ${build.shipType}, skipping build ${techMapIndex}\n`;
            return true;// Don't process
          }
          if ('bs' != build.shipType && 1 < build.supportModules.length) {
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
    
    //Save our updated data before we do anything else.
    client.rosterDB.set(message.guild.id+"."+targetID, [...rosterEntry]);
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
      rosterEntry.get('supportBuild').supportModules.forEach( (techID) => {
        buildText += "\t"+techID+" ("+(Number( allTech[techID] ) || 0)+")";
      });
      rosterEntry.get('supportBuild').tradeModules.forEach( (techID) => {
        buildText += "\t"+techID+" ("+(Number( allTech[techID] ) || 0)+")";
      });
      rosterEntry.get('supportBuild').miningModules.forEach( (techID) => {
        buildText += "\t"+techID+" ("+(Number( allTech[techID] ) || 0)+")";
      });
    } else {
      buildText = "_No Build_";
    }
    supportEmbed.embed.fields[supportEmbed.embed.fields.length] = {
      'name': client.getDisplayName(targetID, message.guild),
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
      
      rosterEntry.get('battleBuild').supportModules.forEach( (techID) => {
        buildText += "\t"+techID+" ("+(Number( allTech[techID] ) || 0)+")"
      });
    } else {
      buildText = "_No Build_";
    }
    battleEmbed.embed.fields[battleEmbed.embed.fields.length] = {
      'name': client.getDisplayName(targetID, message.guild),
      'value': buildText,
    };
  });// end of members.forEach( (targetDB, targetID) => {
    if (errors) {
      message.reply(`\n${errors}`);
    }
    message.channel.send(battleEmbed);
    message.channel.send(supportEmbed);
    
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
  description: "The Corp's WS roster (players/ships)",
  usage: `roster [set, remove or add] (all or @role or @user)... [ship type] [techID]... [| [ship type] [techID...]]
- - - - - - - - - - - - - - - - - - - - - - - - - - - -
Examples:
  • !roster all (shows the current builds for all players marked active)
  • !roster remove @user (sets the @user to inactive)
  • !roster add @role (sets all @role users to active)
  • !roster set @role bs batt omega sanc emp (sets the battle build for all @role users)
  • !roster set @user bs batt omega sanc emp | ts cargo entrust barrier (sets the battle and support build for @user)`
};
