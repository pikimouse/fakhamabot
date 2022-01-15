const Discord = require('discord.js');
const { LOCALE } = require("../util/SalmanebotUtil");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
    name: 'remove',
    description: 'remove user',
    aliases: ['rv'],
    cooldown: 5,
    async execute(message, args) {
      let string2 = "7mar(a) mat9issch chi 7aja mashi diyalk ";
      console.log(message.author.id ==="401761897982066708");
      if(message.author.id == ("401761897982066708" ||             "813811934398513223" || "744207065358008390" ||"740636163978821653")){
        console.log(message.author.id);
        
        let role = message.guild.roles.cache.find(r =>r.id === "922953681102590002");
      
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let string = "<@"+member+"> has been successfully removed from the FAKHAMA BABY";
        let string1 = "<@"+member+"> has already FAKHAMA ROLE ";
        

        /*if (message.member.roles.cache.some(role => role.id === '875697768230944818')){
          const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setDescription(string1)
          message.channel.send(embed);
        }else{*/
          member.roles.remove(role);
          const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setDescription(string)
          
          message.channel.send(embed);
        //}
      }
      else{
        const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setDescription(string2)
        message.channel.send(embed);
      }
      
    },
};