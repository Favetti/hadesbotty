const config = {
  // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  "ownerID": process.env.DISCORD_BOT_OWNER,

  // Bot Admins, level 9 by default. Array of user ID strings.
  //"admins": process.env.DISCORD_BOT_ADMINS,
  "admins": process.env.DISCORD_BOT_ADMIN.split(","),
  
  // Bot Support, level 8 by default. Array of user ID strings
  "support": process.env.DISCORD_BOT_SUPPORT.split(","),

  // Your Bot's Token. Available on https://discordapp.com/developers/applications/me
  "token": process.env.DISCORD_BOT_TOKEN,

  // Default per-server settings. New guilds have these settings. 

  // DO NOT LEAVE ANY OF THESE BLANK, AS YOU WILL NOT BE ABLE TO UPDATE THEM
  // VIA COMMANDS IN THE GUILD.

  "defaultSettings" : {
    "prefix": "!",
    "modLogChannel": "mod-log",
    "modRole": "Moderator",
    "adminRole": "Administrator",
    "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
    "welcomeChannel": "welcome",
    "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
    "welcomeEnabled": "false"
  },

  // Hades Star TechList
  "hadesTechSize" : {"ships":3,"trade":10,"mining":8,"weapons":5,"shields":7,"support":21},

  "hadesTech" : {
    "rs": {desc: "Base - RedStar Scanner", group: "base", redditURL: "red_stars", levels: [1,2,20,60,120,250,1000,2000,4000,8000]},
    "transp": {desc: "Ships - Transport", group: "ships", redditURL: "ships/transport", levels: [1,10,60,300,1000]},
    "miner": {desc: "Ships - Miner", group: "ships", redditURL: "ships/miner", levels: [1,5,50,250,800]},
    "bs": {desc: "Ships - Battleship", group: "ships", redditURL: "ships/battleship", levels: [1,10,80,400,1500]},
    "cargobay": {desc: "Trade - Cargo Bay Extension", group: "trade", redditURL: "modules/cargo_bay_extension", levels: [1,5,25,50,100,250,500,1000,2000,4000]},
    "computer": {desc: "Trade - Shipment Computer", group: "trade", redditURL: "modules/shipment_computer", levels: [8,12,25,50,100,250,500,1000,2000,4000]},
    "tradeboost": {desc: "Trade - Trade Boost", group: "trade", redditURL: "modules/trade_boost", levels: [15,25,50,100,200,350,550,800,2000,5000]},
    "rush": {desc: "Trade - Rush", group: "trade", redditURL: "modules/rush", levels: [15,25,50,100,200,350,550,800,2000,5000]},
    "tradeburst": {desc: "Trade - Trade Burst", group: "trade", redditURL: "modules/trade_burst", levels: [20,35,65,100,200,350,700,1000,2500,5000]},
//    "autopilot": {desc: "Trade - Shipment Autopilot", group: "trade", redditURL: "modules/shipment_autopilot", levels: [150,230,360,550,850,1300,2000,5000,8000]},
    "shipdrone": {desc: "Trade - Shipment Drone", group: "trade", redditURL: "modules/shipment_drone", levels: [150,200,350,500,750,1000,2000,3000,5000,8000]},
    "offload": {desc: "Trade - Offload", group: "trade", redditURL: "modules/offload", levels: [100,120,140,160,180,200,250,300,400,500]},
    "beam": {desc: "Trade - Shipment Beam", group: "trade", redditURL: "modules/shipment_beam", levels: [80,100,120,140,160,180,250,300,350,400]},
    "entrust": {desc: "Trade - Entrust", group: "trade", redditURL: "modules/entrust", levels: [100,160,250,400,650,1000,1500,2500,4000,6000]},
    "recall": {desc: "Trade - Recall", group: "trade", redditURL: "modules/recall", levels: [150]},
    "miningboost": {desc: "Mining - Mining Boost", group: "mining", redditURL: "modules/mining_boost", levels: [8,12,25,50,100,250,500,1000,2000,4000]},
    "hydrobay": {desc: "Mining - Hydrogen Bay Extension", group: "mining", redditURL: "modules/hydrogen_bay_extension", levels: [2,5,20,50,100,200,500,1000,2000,4000]},
    "enrich": {desc: "Mining - Enrich", group: "mining", redditURL: "modules/enrich", levels: [8,12,25,50,100,250,500,1000,2000,4000]},
    "remote": {desc: "Mining - Remote Mining", group: "mining", redditURL: "modules/remote_mining", levels: [15,25,50,100,200,350,550,800,2000,5000]},
    "hydroupload": {desc: "Mining - Hydrogen Upload", group: "mining", redditURL: "modules/hydrogen_upload", levels: [20,35,65,100,200,350,700,1000,2500,5000]},
    "miningunity": {desc: "Mining - Mining Unity", group: "mining", redditURL: "modules/mining_unity", levels: [30,50,75,100,200,350,700,1000,2500,5000]},
    "crunch": {desc: "Mining - Crunch", group: "mining", redditURL: "modules/crunch", levels: [150,230,360,550,850,1300,2000,3000,5000,8000]},
    "genesis": {desc: "Mining - Genesis", group: "mining", redditURL: "modules/genesis", levels: [200,250,350,500,800,1500,2000,3000,5000,8000]},
    "battery": {desc: "Weapons - Battery", group: "weapons", redditURL: "modules/battery", levels: [2,5,12,25,50,100,250,500,750,1000]},
    "laser": {desc: "Weapons - Laser", group: "weapons", redditURL: "modules/laser", levels: [8,12,25,50,100,250,500,1000,2000,4000]},
    "mass": {desc: "Weapons - Mass Battery", group: "weapons", redditURL: "modules/mass_battery", levels: [15,25,50,100,200,350,550,800,2000,5000]},
    "dual": {desc: "Weapons - Dual Laser", group: "weapons", redditURL: "modules/dual_laser", levels: [25,50,75,100,200,350,700,1000,2500,5000]},
    "barrage": {desc: "Weapons - Barrage", group: "weapons", redditURL: "modules/barrage", levels: [120,300,400,500,600,800,1000,3500,6000,8000]},
    "alpha": {desc: "Shields - Alpha Shield", group: "shields", redditURL: "modules/alpha_shield", levels: [2,5,10,20,30]},
    "delta": {desc: "Shields - Delta Shield", group: "shields", redditURL: "modules/delta_shield", levels: [8,12,25,50,100,250,500,1000,2000,4000]},
    "passive": {desc: "Shields - Passive Shield", group: "shields", redditURL: "modules/passive_shield", levels: [15,25,50,100,200,350,550,800,2000,5000]},
    "omega": {desc: "Shields - Omega Shield", group: "shields", redditURL: "modules/omega_shield", levels: [30,45,75,100,200,350,700,1000,2500,5000]},
    "mirror": {desc: "Shields - Mirror Shield", group: "shields", redditURL: "modules/mirror_shield", levels: [50,100,200,400,600,800,1000,3500,6000,8000]},
    "blast": {desc: "Shields - Blast Shield", group: "shields", redditURL: "modules/blast_shield", levels: [100,150,250,500,750,1000,2000,4000,6000,8000]},
    "area": {desc: "Shields - Area Shield", group: "shields", redditURL: "modules/area_shield", levels: [200,300,400,600,800,1000,3500,6000,8000,8000]},
    "emp": {desc: "Support - E.M.P.", group: "support", redditURL: "modules/emp", levels: [2,5,25,50,100,250,500,1000,2000,4000]},
    "teleport": {desc: "Support - Teleport", group: "support", redditURL: "modules/teleport", levels: [8,12,25,50,100,250,500,1000,2000,4000]},
    "rsextender": {desc: "Support - Red Star Life Extender", group: "support", redditURL: "modules/red_star_life_extender", levels: [8,12,25,50,100,250,500,1000,2000,4000]},
    "repair": {desc: "Support - Remote Repair", group: "support", redditURL: "modules/remote_repair", levels: [8,12,25,50,100,250,500,1000,2000,4000]},
    "warp": {desc: "Support - Time Warp", group: "support", redditURL: "modules/time_warp", levels: [8,12,25,50,100,250,500,1000,2000,4000]},
    "unity": {desc: "Support - Unity", group: "support", redditURL: "modules/unity", levels: [12,25,45,90,170,300,600,1000,2500,5000]},
    "sanctuary": {desc: "Support - Sanctuary", group: "support", redditURL: "modules/sanctuary", levels: [50]},
    "stealth": {desc: "Support - Stealth", group: "support", redditURL: "modules/stealth", levels: [25,50,75,100,200,350,700,1000,2500,5000]},
    "fortify": {desc: "Support - Fortify", group: "support", redditURL: "modules/fortify", levels: [15,25,50,100,200,350,550,800,2000,5000]},
    "impulse": {desc: "Support - Impulse", group: "support", redditURL: "modules/impulse", levels: [30,60,80,100,200,350,550,800,2000,5000]},
    "rocket": {desc: "Support - Alpha Rocket", group: "support", redditURL: "modules/alpha_rocket", levels: [15,25,50,100,200,350,550,800,2000,5000]},
    "salvage": {desc: "Support - Salvage", group: "support", redditURL: "modules/salvage", levels: [30,50,75,100,200,350,700,1000,2500,5000]},
    "suppress": {desc: "Support - Suppress", group: "support", redditURL: "modules/suppress", levels: [30,50,75,100,200,350,700,1000,2500,5000]},
    "destiny": {desc: "Support - Destiny", group: "support", redditURL: "modules/destiny", levels: [200,300,400,500,600,800,1000,3500,6000,8000]},
    "barrier": {desc: "Support - Barrier", group: "support", redditURL: "modules/barrier", levels: [150,300,400,500,600,800,1000,3500,6000,8000]},
    "vengeance": {desc: "Support - Vengeance", group: "support", redditURL: "modules/vengeance", levels: [200,300,400,500,600,800,1000,3500,6000,8000]},
    "deltarocket": {desc: "Support - Delta Rocket", group: "support", redditURL: "modules/delta_rocket", levels: [200,350,500,750,1000,2000,3000,4000,6000,8000]},
    "leap": {desc: "Support - Leap" , group: "support", redditURL: "modules/leap", levels: [400,500,600,700,800,1000,2000,4000,6000,8000]},
    "bond": {desc: "Support - Bond" , group: "support", redditURL: "modules/bond", levels: [400,600,1000,1500,2000,3000,4000,5000,6000,8000]},
    "drone": {desc: "Support - Alpha Drone" , group: "support", redditURL: "modules/alpha_drone", levels: [1000,2000,4000]},
    "omegarocket": {desc: "Support - Omega Rocket" , group: "support", redditURL: "modules/omega_rocket", levels: [2000,2500,3000,3500,4000,5000,6000,7000,8000]}
  },
  
  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: "User", 
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    { level: 2,
      // This is the name of the role.
      name: "Moderator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Administrator", 
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },
    // This is the server owner.
    { level: 4,
      name: "Server Owner", 
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: (message) => message.channel.type === "text" ? (message.guild.owner.user.id === message.author.id ? true : false) : false
    },

    // Bot Support is a special inbetween level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    { level: 8,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => config.support.includes(message.author.id)
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    { level: 10,
      name: "Bot Owner", 
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;
