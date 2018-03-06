module.exports = (client) => {

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    var msg = "";
    try {
      const props = require(`../commands/${commandName}`);
      msg += `${props.help.name}👌;  `;
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e.stack}`;
    }    
    client.logger.log(`Loading Commands: ${msg}`);
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
  
    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */
  
  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code. 
  
  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };    
  
  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
  });
    
  
  // *** HadesBotty userDB ***
  client.checkUserDB = (client, message) => {
    if (message.channel.type !=='text') return;
    const settings = client.settings.get(message.guild.id);
    
    // For ease of use in commands and functions, attach the userDB to the message object
    // to-do: same thing for targetDB
    if (client.userDB.get(message.author.id)) {
      message.userDB = client.userDB.get(message.author.id);
      //message.userDB.username = message.author.username;
      message.guild.fetchMember(message.author.id)
        .then(result => message.userDB.username = result.displayName);
      message.userDB.lastSeen = Date.now();
    }
    else
      message.userDB = {username: message.author.username, lastSeen: Date.now()};

    if (!message.userDB[message.guild.id]) 
      message.userDB[message.guild.id] = {name: message.guild.name, level: 0, points: 0, commands: 0 };

    //client.logger.debug("> "+JSON.stringify(message.userDB));
    
    if (message.content.indexOf(settings.prefix) === 0) 
      message.userDB[message.guild.id].commands++;
    else
      message.userDB[message.guild.id].points++;
    
    const curLevel = Math.floor(0.1 * Math.sqrt(message.userDB[message.guild.id].points));
    if (message.userDB[message.guild.id].level < curLevel) {
      //message.reply(`You've leveled up to chat level **${curLevel}**!`);
      message.userDB[message.guild.id].level = curLevel;
    }
    client.userDB.set(message.author.id, message.userDB);
  };
  
  client.normalizeTechName = (name) => {
    switch(name.toLowerCase()) {
      case "ts":
      case "trans":
      case "transport":
         return "transp";
      case "mine":
         return "miner";
      case "battleship":
      case "battle":
         return "bs";
      case "cargo":
      case "cb":
         return "cargobay";
      case "shipmentcomputer":
      case "comp":
      case "sc":
         return "computer";
      case "tboost":
         return "tradeboost";
         return "rush"; //can't reach
      case "tburst":
         return "tradeburst";
      case "sa":
      case "autoship":
      case "auto":
      case "pilot":
      case "shipmentautopilot":
         return "autopilot";
      case "off":
         return "offload";
      case "shipmentbeam":
      case "sbeam":
      case "sb":
         return "beam";
         return "entrust";//can't reach
         return "recall";//can't reach
      case "hb":
      case "hydrogenbay":
         return "hydrobay";
      case "mb":
      case "mboost":
         return "miningboost";
         return "enrich";
      case "rm":
      case "remotemining":
         return "remote";
      case "upload":
      case "hu":
         return "hydroupload";
      case "mu":
      case "munity":
         return "miningunity";
         return "crunch";//can't reach
         return "genesis";//can't reach
      case "batt":
         return "battery";
         return "laser";
      case "massbatt":
      case "massbattery":
         return "mass";
      case "duallaser":
      case "dualaser":
         return "dual";
         return "barrage";//can't reach
      case "alphashield":
         return "alpha";
      case "deltashield":
      case "dshield":
      case "ds":
         return "delta";
      case "passiveshield":
      case "pshield":
      case "ps":
         return "passive";
      case "omegashield":
      case "oshield":
      case "os":
         return "omega";
      case "mirrorshield":
      case "mshield":
      case "ms":
         return "mirror";
      case "areashield":
      case "ashield":
      case "as":
         return "area";
         return "emp";//can't reach
      case "tel":
      case "tele":
         return "teleport";
      case "rse":
      case "redstarextender":
         return "rsextender";
      case "remoterepair":
      case "remoterep":
      case "remrepair":
      case "remrep":
      case "rr":
      case "rep":
         return "repair";
      case "timewarp":
      case "tw":
      case "twarp":
         return "warp";
         return "unity";//can't reach
      case "sanc":
      case "sanct":
         return "sanctuary";
         return "stealth";//can't reach
      case "fort":
         return "fortify";
         return "impulse";//can't reach
      case "alpharocket":
      case "arocket":
      case "rock":
         return "rocket";
      case "salv":
         return "salvage";
      case "supp":
         return "suppress";
      case "dest":
         return "destiny";
         return "barrier";//can't reach
      case "veng":
      case "venge":
         return "vengeance";
         return "leap";//can't reach
      default:
        break;
    }
    return name.toLowerCase()
  }
 
};
