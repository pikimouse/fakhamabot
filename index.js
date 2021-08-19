/**
 * Module Imports
 */
const { Client, Collection, GuildMember } = require("discord.js");
const { readdirSync, write } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./util/SalmanebotUtil");
const i18n = require("i18n");
const answers = require("./answers.json");

const client = new Client({
  disableMentions: "everyone",
  restTimeOffset: 0
});

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
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  console.log(answers);
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
  const channel = client.channels.cache.get('875251215229939732');
  
  if (!prefixRegex.test(message.content)){
    if(message.content == 'joy'){
      return channel.send("<@242104158000250882> To9 !");
    }
    else if(message.content == 'jiji'){
      return channel.send("<@775472342347808818> 💛 ", {files:["./sina.jpg"]});
    }
    else if(message.content == 'baba'){
      return channel.send("<@740636163978821653> 7yato kamla khedam !");
    }
    else if(message.content == 'bacha'){
      return channel.send("<@773932024561926155> l9awlih chi 9afiya alkhout !");
    }
    else if(message.content == 'maoqly'){
      return channel.send("<@192023732368179201> zebi fkerro me9ly !", {files:["./maoqly.png"]});
    }
    else if(message.content == 'maria'){
      return channel.send("<@488191257991184384> 🤍 ");
    }
    else if(message.content == 'salmane'){
      return channel.send("<@401761897982066708> I love you :heart: ");
    }
    else if(message.content == 'hind'){
      return channel.send("<@779080691295453191> ana 3ay9a o li majawbnish kandirlih mute ! :woman_gesturing_ok: ", {files:["./hind.gif"]});
    }
    /*else{
    for(var i = 0; i < 1000000; i++){
      const randomElement = answers[Math.floor(Math.random() * answers.length)];
      return channel.send(randomElement);
    }
  }*/
    else return;
  }

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
