// Hades star Technology Level
// This command will calculate the tech level for all users
/* global Map */ // clear error: Map is not defined. 

exports.run = async (client, message, args, level) => { 

  args = args.map(x => x.toLowerCase());

  const util = require('util');
  const table = require('easy-table');
  await client.redstarQue.defer;
  try {
    var errors = "";
    var userID = message.author.id;
    var userQue = client.redstarQue.has('userQue'+userID)
        ? client.redstarQue.get('userQue'+userID)
        : false;
    //client.logger.error(util.inspect(client.redstarQue)); // Debug
    //client.fetchUser(userID).then(user => {user.send("Hello I worlded you via DM!")}); // Debug
    var action;
    //client.logger.error("arg 1 is: "+args[0]); // Debug
    switch (args[0]) {
      case 'reset':
        if (message.author.permLevel >= 9) {
          client.redstarQue.clear()
          message.reply("Redstar Ques Cleared!");
        } else {
          message.reply("HAHAHAHAHaaaa... Um... who do you think you are?");
        }
        return true;;
      case 'ready':
      case 'rdy':
      case 'rd':
      case 'r':
        action = 'ready';
        break;
      case 'unready':
      case 'unrdy':
      case 'unrd':
      case 'unr':
      case 'uready':
      case 'urdy':
      case 'urd':
      case 'ur':
      case 'u':
        action = 'unready';
        break;
      case 'status':
      case 'stats':
      case 'sts':
      case 'st':
      case 's':
        action = 'status';
        break;
      case 'kick':
      case 'kik':
      case 'kck':
      case 'k':
        action = 'kick';
        break;
      case 'leave':
      case 'lve':
      case 'l':
      case 'quit':
      case 'qt':
      case 'q':
      case 'out':
      case 'o':
        action = 'leave';
        break;
      case 'talk':
        action = 'talk';
        break;
      default:
        action = 'join';
        break;
    }
    //client.logger.error("Action is "+action); // Debug
    if (!userQue && 'join' !== action) {
      message.author.send(`You are not in a que, so cannot use "${action}"`);
      return true;
    }
    var newRedstarQue;
    if ('join' === action && 0 <= args.length && (newRedstarQue = args[0].replace(/\D/g,''))) {
      //newRedstarQue set here
    } else if ('join' === action) {
      message.author.send(`You must provide the RS level you want to join, e.g.: "!redstar 7"`);
      return true;
    }
    switch (action){
      case 'talk':
        args.shift();
        return action_talk(client, userID, args);
      case 'join':
        return action_join(client, userID, newRedstarQue);
      case 'ready':
        return action_ready(client, userID, true);
      case 'unready':
        return action_ready(client, userID, false);
      case 'status':
        return action_status(client, userID, false);
      case 'kick':
        return action_kick(client, userID)
      case 'leave':
        return action_leave(client, userID);
    }
    message.reply("Unknown Command");
    
  } catch (error) { 
    message.reply(`\nThere was an error: ${error}\n${errors}`); 
    throw error;
  } 
};

const MATCH_MAX = 5;
const MATCH_MIN = 2;
const MATCH_KICK = 120 * 1000;
const MATCH_KICK_EXTRA = MATCH_KICK;

function action_status(client, userID, rsQueName, message) {
  if (message) {
    message += "\n"
  } else {
    message = "";
  }
  var targetUserID = userID;
  var singleMessage = false;
  if (userID && !rsQueName) {
    singleMessage = true;
    if (!client.redstarQue.has('userQue'+userID)) {
      client.fetchUser(userID).then(user => {user.send("You have no que to check the status on!")});
      return true;
    }
    var rsQueName = client.redstarQue.get('userQue'+userID).rsQueName;
  }
  
  if (!client.redstarQue.has('redstarQue'+rsQueName)) {
    client.fetchUser(userID).then(user => {user.send("The RS"+rsQueName+" que you were in does not exist!")});
    //client.logger.error("Cannot find "+'redstarQue'+rsQueName); // Debug
    //client.logger.error(require('util').inspect(client.redstarQue)); // Debug
    client.redstarQue.delete('userQue'+userID);
    return true;
  }
  var rsQueInfo = client.redstarQue.get('redstarQue'+rsQueName);
  var userIDs = new Array();
  var readyNum = 0;
  var quePosition = 0;
  var quePositionFound = !userID;//We don't need to check the que position
  rsQueInfo.users.forEach( (userIDcompare) => {
    if (!quePositionFound) {
      quePosition++;
    }
    if (userID === userIDcompare) {
      quePositionFound = true;
    }
    if (userIDs.length >= MATCH_MAX) return;
    if (client.redstarQue.has('userQue'+userIDcompare) && client.redstarQue.get('userQue'+userIDcompare).ready) {
      readyNum++;
    }
    userIDs.push(userIDcompare);
  });
  var userNum = userIDs.length;
  if (singleMessage) {
    userIDs = new Array(userID);
  }
  message += `RS${rsQueName} Status: ${userNum}/${MATCH_MAX} in que ${readyNum}/${userNum} are ready`;
  var extraKickTime = 0;
  if (quePosition > MATCH_MAX) {
    extraKickTime = MATCH_KICK_EXTRA;
    message = "You are #**"+quePosition+"** in the que and must wait for this match to start or kick users\n"+message;
  }
  if (false !== rsQueInfo.kickTime) {
    var tillKick = Math.round((extraKickTime + rsQueInfo.kickTime - Date.now()) / 1000, 0);
    if (0 < tillKick) {
      message += ` **${tillKick}**s until you can kick unready players`
    } else {
      message += ` You may **kick** players now using _!redstar kick_`
    }
  }
  action_send(client, userIDs, message, targetUserID);
  if (readyNum >= userNum && readyNum >= MATCH_MIN) {
    action_start(client, rsQueName, rsQueInfo);
    return true;
  }
}

function action_send(client, userIDs, message, targetUserID) {
  if (!Array.isArray(userIDs)) {
      client.logger.error("action_send recieved a non-array value "+userIDs);
  }
  //client.logger.error("sending: "+message); // Debug
  userIDs.forEach( (userID) => {
    if (targetUserID && targetUserID === userID) {
      client.fetchUser(userID).then(user => {user.send(message.replace('Someone','You'))});
    } else {
      client.fetchUser(userID).then(user => {user.send(message)});
    }
  });
}
                               
function action_start(client, rsQueName, rsQueInfo) {
  var userIDs = new Array();
  rsQueInfo.users.forEach( (userID) => {
    if (userIDs.length >= MATCH_MAX) return;
    action_leave(client, userID, true);
    //rsQueInfo.users = rsQueInfo.users.splice(rsQueInfo.users.indexOf(userID),1);
    userIDs.push(userID);
  });
  rsQueInfo.kickTime = false;
  client.redstarQue.set("redstarQue"+rsQueName, rsQueInfo);
  setTimeout(action_send, 1,     client, userIDs, "Countdown, 30s left until scan");
  setTimeout(action_send, 20000, client, userIDs, "Countdown, 10s left until scan");
  setTimeout(action_send, 30000, client, userIDs, "Countdown, SCAN NOW!");
  setTimeout(action_status, 45000, client, false, rsQueName, "The previous match was started 1MATCH_MAXs ago, You are now part of the new match");
  return true;
}
             
function action_leave(client, userID, suppressStatus) {
  if (!client.redstarQue.has('userQue'+userID)) {
    client.fetchUser(userID).then(user => {user.send("You have no que to leave!")});
    return true;
  }
  var rsQueName = client.redstarQue.get('userQue'+userID).rsQueName;
  if (!client.redstarQue.has('redstarQue'+rsQueName)) {
    client.fetchUser(userID).then(user => {user.send("The RS"+rsQueName+" que you were in does not exist!")});
    client.redstarQue.delete('userQue'+userID);
    return true;
  
  }
  var rsQueInfo = client.redstarQue.get('redstarQue'+rsQueName);
  if (-1 === rsQueInfo.users.indexOf(userID)) {
    client.fetchUser(userID).then(user => {user.send("You have already left the RS"+rsQueName+" que!")});
    return true;
  }
  rsQueInfo.users.splice(rsQueInfo.users.indexOf(userID),1);
  client.redstarQue.set('redstarQue'+rsQueName, rsQueInfo);
  client.redstarQue.delete('userQue'+userID);
  client.fetchUser(userID).then(user => {user.send("You left the RS"+rsQueName+" que, Goodbye!")});
  if (!suppressStatus) {
    action_status(client, userID, rsQueName, "Someone left the RS"+rsQueName+" que");
  }
}

function action_join(client, userID, rsQueName) {
  if (!client.redstarQue.has('redstarQue'+rsQueName)) {
    var rsQueInfo = {
      users: new Array(),
      kickTime: false,
    };
    client.redstarQue.set('redstarQue'+rsQueName, rsQueInfo);
  } else {
    var rsQueInfo = client.redstarQue.get('redstarQue'+rsQueName);
  }
  if (-1 !== rsQueInfo.users.indexOf(userID)) {
    client.fetchUser(userID).then(user => {user.send("You are already in the RS"+rsQueName+" que!")});
    client.logger.error(require('util').inspect(rsQueInfo));
    return true;
  }
  var oldQueName = false;
  if (client.redstarQue.has('userQue'+userID) && rsQueName !== client.redstarQue.get('userQue'+userID).rsQueName) {
    action_leave(client, userID);
  }
  client.logger.error("About to set " + 'userQue'+userID);
  client.redstarQue.set('userQue'+userID, {rsQueName:rsQueName, ready: false});
  rsQueInfo.users.push(userID);
  if (rsQueInfo.users.length >= MATCH_MIN && !rsQueInfo.kickTime) {
    rsQueInfo.kickTime = Date.now() + MATCH_KICK;
  } else {
    rsQueInfo.kickTime = false;
  }
  client.redstarQue.set('redstarQue'+rsQueName, rsQueInfo);
  //client.logger.error(require('util').inspect(client.redstarQue)); // Debug
  action_status(client, userID, rsQueName, "Someone joined the RS"+rsQueName+" que");
}
    
function action_ready(client, userID, ready) {
  if (!client.redstarQue.has('userQue'+userID)) {
    client.fetchUser(userID).then(user => {user.send("You have no que to become ready in!")});
    return true;
  }
  var rsQueName = client.redstarQue.get('userQue'+userID).rsQueName;
  if (!client.redstarQue.has('redstarQue'+rsQueName)) {
    client.fetchUser(userID).then(user => {user.send("The RS"+rsQueName+" que you were in does not exist!")});
    client.redstarQue.delete('userQue'+userID);
    return true;
  }
  var rsQueInfo = client.redstarQue.get('redstarQue'+rsQueName);
  if (-1 === rsQueInfo.users.indexOf(userID)) {
    client.fetchUser(userID).then(user => {user.send("The RS"+rsQueName+" que you were supposed to be in doesn't have you, joining now but marking you as unready!")});
    action_join(client, userID, rsQueName);
    return true;
  }
  var userInfo = client.redstarQue.get('userQue'+userID);
  if (ready === userInfo.ready) {
    client.fetchUser(userID).then(user => {user.send("You are already"+(ready?"":" not")+" ready in the RS"+rsQueName+" que.")});
    return true;
  }
  userInfo.ready = ready;
  client.redstarQue.set('userQue'+userID, userInfo).defer;
  action_status(client, userID, rsQueName, "Someone changed status to"+(ready?"":" not")+" ready in the RS"+rsQueName+" que.");
}
  
function action_kick(client, userID) {
  if (!client.redstarQue.has('userQue'+userID)) {
    client.fetchUser(userID).then(user => {user.send("You have no que to kick anyone out of!")});
    return true;
  }
  var rsQueName = client.redstarQue.get('userQue'+userID).rsQueName;
  if (!client.redstarQue.has('redstarQue'+rsQueName)) {
    client.fetchUser(userID).then(user => {user.send("The RS"+rsQueName+" que you were in does not exist!")});
    client.redstarQue.delete('userQue'+userID);
    return true;
  }
  var rsQueInfo = client.redstarQue.get('redstarQue'+rsQueName);
  if (-1 === rsQueInfo.users.indexOf(userID)) {
    client.fetchUser(userID).then(user => {user.send("The RS"+rsQueName+" que you were supposed to be in doesn't have you, joining now but not kicking anyone!")});
    action_join(client, userID, rsQueName);
    return true;
  }
  if (!rsQueInfo.kickTime) {
    client.fetchUser(userID).then(user => {user.send("You cannot kick people if the RS"+rsQueName+" que is not full.")});
    return true;
  }
  var timeTillKick = rsQueInfo.kickTime - Date.now();
  if (0 < timeTillKick) {
    client.fetchUser(userID).then(user => {user.send("You cannot kick people for another "+(timeTillKick/1000)+" seconds in the RS"+rsQueName+" que")});
    return true;
  }
  var userNum = 0;
  var inCurrentMatch = false;
  var kickableUsers = new Array();
  var readyUsers = new Array();
  rsQueInfo.users.forEach( (userIDcompare) => {
    if (userNum >= MATCH_MAX) return;
    userNum++;
    if (client.redstarQue.get('userQue'+userIDcompare).ready) {
      readyUsers.push(userIDcompare);
    } else {
      kickableUsers.push(userIDcompare);
    }
    if (userID === userIDcompare) {
      inCurrentMatch = true;
    }
  });
  if (!inCurrentMatch && (0 - MATCH_KICK_EXTRA) < timeTillKick) {
    client.fetchUser(userID).then(user => {user.send("You are not in the current RS"+rsQueName+" match so cannot kick people yet. Please wait another "+Math.round((timeTillKick + MATCH_KICK_EXTRA)/1000,0)+" seconds.")});
    return true;
  }
  rsQueInfo.kickTime = false;
  client.redstarQue.set('redstarQue'+rsQueName, rsQueInfo);
  action_send(client, kickableUsers, "You have been kicked from the RS"+rsQueName+" que because you didn't mark yourself as ready soon enough. You can re-join the que but please pay attention.");
  kickableUsers.forEach( (userID) => {
    action_leave(client, userID, true);
  });
  readyUsers.forEach( (userID) => {
    action_ready(client, userID, false);
  });
  action_status(client, userID, rsQueName, ""+kickableUsers.length+" AFK players have been kicked from the RS"+rsQueName+" que and everyone has been set to not ready status");
}

function action_talk(client, userID, args) {
  if (!client.redstarQue.has('userQue'+userID)) {
    client.fetchUser(userID).then(user => {user.send("You have no que to talk to anyone in. Lonely!")});
    return true;
  }
  var rsQueName = client.redstarQue.get('userQue'+userID).rsQueName;
  if (!client.redstarQue.has('redstarQue'+rsQueName)) {
    client.fetchUser(userID).then(user => {user.send("The RS"+rsQueName+" que you were in does not exist!")});
    client.redstarQue.delete('userQue'+userID);
    return true;
  }
  var rsQueInfo = client.redstarQue.get('redstarQue'+rsQueName);
  var quePosition = rsQueInfo.users.indexOf(userID);
  if (-1 === quePosition) {
    client.fetchUser(userID).then(user => {user.send("The RS"+rsQueName+" que you were supposed to be in doesn't have you, joining now but not kicking anyone!")});
    action_join(client, userID, rsQueName);
    return true;
  }
  return action_send(client, rsQueInfo.users, "User(#**"+quePosition+"**): "+args.join(' '), userID);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rs"],
  permLevel: "User"
};

exports.help = {
  name: "redstar",
  category: "Hades Star",
  description: "Joins a cross-server queue for a redstar.",
  usage: `redstar [RSnumber, leave, status, ready, unready, or kick]
The que starts counting down as soon as all users are ready. If there are ${MATCH_MAX} users in the que, the option to kick AFK/unready player becomes available after 2 minutes.
Examples:
  • !redstar 6        (Joins the RS6 que)
  • !redstar status   (View the current que status)
  • !redstar leave    (Leave the que)
  • !redstar ready    (sets status to ready)
  • !redstar unready  (sets status to not-ready)
  • !redstar kick     (removes unready players and marks all others as unready)
Short Versions: 'rs 6', 'rs s', 'rs l', 'rs r', 'rs u', 'rs k'
- - - - - - - - - - - - - - - - - - - - - - - - - - - -
** All communication happens thru Direct Messages **`
};
