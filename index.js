/**
 * Module Imports
 */
const { Client, Collection, GuildMember } = require("discord.js");
const { readdirSync, write } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./util/SalmanebotUtil");
const keepAlive = require('./server');
const i18n = require("i18n");
const answers = require("./answers.json");
const salmane = require("./salmane.json");
const bacha = require("./bacha.json");
const Discord = require('discord.js')

const client = new Client({
  disableMentions: "everyone",
  restTimeOffset: 0
});
keepAlive();
const bot = new Discord.Client()
client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

i18n.configure({
  locales: ["ar", "de", "en", "es", "fr", "it", "ko", "nl", "pl", "pt_br", "ru", "sv", "th", "tr", "vi", "zh_cn", "zh_sg", "zh_tw"],
  directory: join(__dirname, "locales"),
  defaultLocale: "en",
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,

  logWarnFn: function (msg) {
    console.log("warn", msg);
  },

  logErrorFn: function (msg) {
    console.log("error", msg);
  },

  missingKeyFn: function (locale, value) {
    return value;
  },

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});


/**
 * Client Events
 */
client.on('ready', () => {
    /**const guild = client.guilds.cache.get("856648689879220235");
    const VoiceCountChannel = guild.channels.cache.get("879512555939303444");*/
    /**setInterval(() => {
        /* At the first filter all guild channels to type = voice, then map their members count and get summ with reduce */
        /**let membersInVoice = guild.channels.cache.filter(channel => channel.type === 'voice').map(c => c.members.size).reduce((a, b) => a + b, 0);
        VoiceCountChannel.setName("In Voice: "+membersInVoice);
        console.log(membersInVoice)
    }, 50000);*/
  console.log(`${client.user.username} ready!`);
  //console.log(answers);
  client.user.setActivity(`Fakhama 🗽 Bot`, { type: "LISTENING" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);
/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  
  if(message.content.toLowerCase() == 'fakhama'){
    //console.log(message.author.id);
    if(message.author.id =="740636163978821653"){
      return message.channel.send("<@&922953681102590002>  Ayna antom ya atfal");
    }
  }
    if(message.content.toLowerCase() =="baba"){
      return message.channel.send("<@740636163978821653> 7yato kamla khedam !");
    }
    else if(message.content.toLowerCase() == 'bacha'){
      for(var i = 0; i < 1000000; i++){
        const random = bacha[Math.floor(Math.random() * bacha.length)];
        return message.channel.send(random,);
      }
    }
    else if(message.content.toLowerCase() == 'maoqly'){
      return message.channel.send("<@192023732368179201> zebi fkerro me9ly !", {files:["./maoqly.png"]});
    }
    /*else if(message.content.toLowerCase() == 'fakhama'){
      return message.channel.send("<@&922953681102590002>  Ayna antom ya atfal");
    }*/
    else if(message.content.toLowerCase() == ("salmane" || "salman")){
      for(var i = 0; i < 100; i++){
        const random = salmane[Math.floor(Math.random() * salmane.length)];
        return message.channel.send("<@401761897982066708>"+random/*,  {files:["./pp.png"]}message.author.displayAvatarURL({ format: 'png', size: 1000 })*/);
      }
    }
    else if(message.content.toLowerCase() == 'hind'){
      return message.channel.send("<@779080691295453191> ana 3ay9a o li majawbnish kandirlih mute ! :woman_gesturing_ok: ", {files:["./hind.gif"]});
    }
    else if(message.content.toLowerCase() == 'oyeeh'){
      return message.channel.send("<@744207065358008390>  wash a to9", //{files:["./hind.gif"]}
      );
    }
    else if(message.content.toLowerCase() == 'sara'){
      return message.channel.send("<@759534767070249030> nti l7ob :purple_heart: ");
    }
    else if(message.content.toLowerCase() == ('le7keyek' || '<@760942562570666044>')){
      return message.channel.send("Ana <@760942562570666044> aji drebli zkeyek :eggplant: :peach:  ");
    }
    else{
    /*for(var i = 0; i < 1000000; i++){
      const randomElement = answers[Math.floor(Math.random() * answers.length)];
      return message.reply(randomElement);
    }*/
  }
    //else return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name })
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(i18n.__("common.errorCommand")).catch(console.error);
  }
});
