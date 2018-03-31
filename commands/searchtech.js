// Hades star Technology Level
// This command will search for all the users that have an specific technology

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const cmd = client.commands.get("tech");
  args.push("search");
  try { cmd.run(client, message, args, level); }
  catch (e) {
    message.reply("An error occured and was caught by the message event: " + e);
    throw e;
  }
  return;
  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "searchtech",
  category: "Deprecated - HS",
  description: "DEPRECATED! Search for a Technology from all users",
  usage: "This command was replaced by the TECH command, this remais as an ALIAS.\nsearchtech [techID] [role @role]\n\nValid Tech: transp, miner, bs, cargobay, computer, tradeboost, rush, tradeburst, autopilot, offload, beam, entrust, recall, hydrobay, miningboost, enrich, remote, hydroupload, miningunity, crunch, genesis, battery, laser, mass, dual, barrage, alpha, delta, passive, omega, mirror, emp, teleport, rsextender, repair, warp, unity, sanctuary, stealth, fortify, impulse, rocket, salvage, suppress, destiny, barrier, vengeance, leap"
};
