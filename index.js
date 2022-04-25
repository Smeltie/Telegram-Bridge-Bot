const TelegramBot = require('node-telegram-bot-api'); // https://github.com/yagop/node-telegram-bot-api
const Discord = require('discord.js'); // https://github.com/discordjs/discord.js
const config = require("./config.json");
const { WebhookClient, MessageEmbed,} = require('discord.js')

const token = config.token;
const token2 = config.token2;
const channelid = config.channelid;

const bot = new TelegramBot(token, {polling: true});
const bot2 = new Discord.Client();

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
  });

const wc = new WebhookClient(config.webhookid, config.webhooktoken)

bot.on('photo', (msg) => {
const fileId  = (msg.photo[msg.photo.length-1].file_id);
const downloadDir = './images'
let something = ''
var https = require('https')
  bot.getFileLink(fileId).then( async (fileUri) => {
    var base64Img = require('base64-img');
    var fs = require('fs');

      let time = process.hrtime();
      let extension = fileUri.split('.').pop();
      let newName = `${time[0]}${time[1]}.${extension}`;
      let file = fs.createWriteStream(`${downloadDir}/${newName}`);
      let request = await https.get(fileUri, (response) => {
         response.pipe(file);

        });
        file.on('finish', () =>{
        const embed = new MessageEmbed()
            .setTitle('Image')
            .attachFiles(`./images/${newName}`)
            .setImage(`attachment://${newName}`)
            .setColor(`#0088CC`)

        try {
            wc.send({
                username : msg.from.first_name,
                avatarURL : 'https://i.imgur.com/FvkH4GU.png',
                embeds : [embed]
            })
        }
        catch(error) {
            console.log('error:', error);
        }
        
         })
  });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!msg.photo) {
    try {
        wc.send({
            username : msg.from.first_name,
            avatarURL : 'https://i.imgur.com/FvkH4GU.png',
            content : `${msg.text}` 
        })
    }
    catch(error) {
        console.log('error:', error);
    }
}  
});

bot2.on('message', msg => {
    if (msg.author.bot) return;
    else if (msg.channel.id == '615514704135061509')
        bot.sendMessage(-1001413954921, `${msg.author.username}: ${msg.content}`);
    else return;
  });

bot.on("polling_error", console.log);
bot2.login(token2);

// end of script