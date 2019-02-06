module.exports = (client) => {
  
  client.checkPrivacy = (targetID, message) => {

    if (!client.userDB.has(targetID))             
      return true; //OK to proceed  : target not in the DB
    
    let targetDB = client.userDB.get(targetID);
    if (!Array.isArray(targetDB.whitelist) || !targetDB.whitelist.length)
      return true; //OK to proceed : target has no whitelist

    if (!message.guild)
      if (message.author.id !== targetID)
        return false; //do NOT proceed : PM by another user
      else
        return true; //OK to proceed : dealing with user's own tech
        
    let guildID = message.guild.id;
    if (targetDB.whitelist.includes(guildID))
      return true; //OK to proceed : guild is in the whitelist
    
    return false; //do NOT proceed : default, whitelist exists and guild is not there
  }

  client.normalizeTechName = (name) => {

    name = name.toLowerCase();
    switch(name) {
        
      // TECH GROUPS:
      case "ship":
         return "ships";
      case "weapon":
         return "weapons";
      case "shield":
         return "shields";

      // BASE TECH:
      case "redstarscanner":
      case "scanner":
      case "rss":
         return "rs";
        
      // INDIVIDUAL TECH - ships:
      case "ts":
      case "trans":
      case "transport":
         return "transp";
      case "mine":
         return "miner";
      case "battleship":
      case "battle":
         return "bs";
        
      // INDIVIDUAL TECH - trade:
      case "cargo_bay_extension":
      case "cargo":
      case "cb":
         return "cargobay";
      case "shipment_computer":
      case "shipmentcomputer":
      case "comp":
      case "sc":
         return "computer";
      case "trade_boost":
      case "tboost":
         return "tradeboost";
         //return "rush";
      case "trade_burst":
      case "tburst":
      case "burst":
         return "tradeburst";
      case "shipment_autopilot":
      case "shipmentautopilot":
      case "autoship":
      case "pilot":
      case "auto":
      case "sa":
         return "autopilot";
      case "shipmentdrone":
      case "shipment_drone":
      case "sdrone":
         return "shipdrone";
      case "off":
         return "offload";
      case "shipment_beam":
      case "shipmentbeam":
      case "sbeam":
      case "sb":
         return "beam";
         //return "entrust";
         //return "recall";
        
      // INDIVIDUAL TECH - mining:
      case "hydrogen_bay_extension":
      case "hydrogenbay":
      case "hb":
         return "hydrobay";
      case "mining_boost":
      case "mboost":
      case "mb":
         return "miningboost";
         //return "enrich";
      case "remote_mining":
      case "remotemining":
      case "rm":
         return "remote";
      case "hydrogen_upload":
      case "upload":
      case "hu":
         return "hydroupload";
      case "mining_unity":
      case "munity":
      case "mu":
         return "miningunity";
         //return "crunch";
         //return "genesis";
      case "miningdrone":
      case "mining_drone":
      case "mdrone":
         return "minedrone";
        
      // INDIVIDUAL TECH - weapons:
      case "batt":
         return "battery";
         //return "laser";
      case "mass_battery":
      case "massbattery":
      case "massbatt":
         return "mass";
      case "dual_laser":
      case "duallaser":
      case "dualaser":
         return "dual";
         //return "barrage";
      case "dart_launcher":
      case "dartlauncher":
         return "dart";
   
      // INDIVIDUAL TECH - shields:
      case "alpha_shield":
      case "alphashield":
         return "alpha";
      case "delta_shield":
      case "deltashield":
      case "dshield":
      case "ds":
         return "delta";
      case "passive_shield":
      case "passiveshield":
      case "pshield":
      case "ps":
         return "passive";
      case "omega_shield":
      case "omegashield":
      case "oshield":
      case "os":
         return "omega";
      case "mirror_shield":
      case "mirrorshield":
      case "mshield":
      case "ms":
         return "mirror";
      case "blastshield":
      case "blast_shield":
      case "bshield":
         return "blast";
      case "area_shield":
      case "areashield":
      case "ashield":
      case "as":
         return "area";
        
      // INDIVIDUAL TECH - support:
      case "e.m.p.":
         return "emp";
      case "tel":
      case "tele":
         return "teleport";
      case "red_star_life_extender":
      case "redstarextender":
      case "extender":
      case "rse":
      case "rsle":
         return "rsextender";
      case "remote_repair":
      case "remoterepair":
      case "remoterep":
      case "remrepair":
      case "remrep":
      case "rr":
      case "rep":
         return "repair";
      case "time_warp":
      case "timewarp":
      case "tw":
      case "twarp":
         return "warp";
         //return "unity";
      case "sanc":
      case "sanct":
         return "sanctuary";
         //return "stealth";
      case "fort":
         return "fortify";
         //return "impulse";
      case "alpha_rocket":
      case "alpharocket":
      case "arocket":
      case "rock":
      case "rockets":
         return "rocket";
      case "salv":
         return "salvage";
      case "supp":
         return "suppress";
      case "dest":
         return "destiny";
         //return "barrier";
      case "veng":
      case "venge":
         return "vengeance";
      case "delta_rocket":
         return "deltarocket";
         //return "leap";
      case "alpha_drone":
      case "alphadrone":
      case "drones":
         return "drone";
      case "omega_rocket":
         return "omegarocket";
      default:
        break;
    }
    return name;
  }
};
