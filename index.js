const Discord = require("discord.js");
DisTube = require('distube')

const bot = new Discord.Client({disableEveryone: true});
config = {
    prefix: ".",
};
var weather = require('weather-js');
const randomPuppy = require('random-puppy');
const superagent = require('superagent');



const fs = require("fs");
const money = require("./money.json");

//////////////////////////////////////////////////////////





let botname = "Judit"

bot.on("ready", async() => {
    console.log(`${bot.user.username} elindult`)

    let státuszok = [
        "TTT szerver",
        "Prefixem: ."
    ]


    setInterval(function() {
        let status = státuszok[Math.floor(Math.random()* státuszok.length)]

        bot.user.setActivity(status, {type: "WATCHING"})
    }, 3000)
})

bot.on("message", async message => {
    let MessageArray = message.content.split(" ");
    let cmd = MessageArray[0];
    let args = MessageArray.slice(1);
    let prefix = config.prefix;
    let gay_level = Math.floor(Math.random()*100 + 1)

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;


    ///////////////// ECONOMY  /////////////////

    if(!money[message.author.id]) {
        money[message.author.id] = {
            money: 500

        };
    }
    fs.writeFile("./money.json", JSON.stringify(money), (err) => {
        if(err) console.log(err);
    });
    let selfMoney = money[message.author.id].money;

    if(cmd === `${prefix}bal`){
        let profilkep = message.author.displayAvatarURL();

        let MoneyEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setColor("RED")
        .addField("Egyenleged:", `**${selfMoney}$**`)
        .setThumbnail(profilkep)
        .setFooter(botname)

        message.channel.send(MoneyEmbed)
    }

    if(cmd === `${prefix}FreeMoney`){
        if(message.member.hasPermission("KICK_MEMBERS")){
         let workEmbed = new Discord.MessageEmbed()
         .setAuthor(message.author.username)
         .setColor("GREEN")
         .addField("Ennyi pénzt kaptál:", `${500}$`)

         message.channel.send(workEmbed)

        money[message.author.id] = {
            money: selfMoney + 500
        }
    } else {
        let permi = "Neked ehhez nincs jogod";
        message.reply(permi)
    }
    }

    if(message.guild){
        let drop_money = Math.floor(Math.random()*5 + 1)
        let random_money = Math.floor(Math.random()*900 + 1)

        if(drop_money === 11){
            let üzenetek = ["Kiraboltál egy bankot!", "Elloptad az anyád bankkártyáját!"]
            let random_üzenet_szam = Math.floor(Math.random()*üzenetek.length)

            let DropMoneyEmbed = new Discord.MessageEmbed()
            

            money[message.author.id] = {
                money: selfMoney + random_money
            }

        }
    }

    if(cmd === `${prefix}shop`){
        let ShopEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setDescription(`${prefix}vasarol-vip (AR: 5000$)`)
        .setColor("GREEN")
        .setThumbnail(bot.user.displayAvatarURL())

        message.channel.send(ShopEmbed);

    }

    if(cmd === `${prefix}vasarol-vip`){
        let viprang_id = "866238199504437288"

        let price = "5000";
        if(message.member.roles.cache.has(viprang_id)) return message.reply("*Ezt a rangot már megvetted!*");
        if(selfMoney < price) return message.reply(`Erre a rangra nincs pénzed! Egyenleged: ${selfMoney}$`)

        money[message.author.id] = {
            money: selfMoney - parseInt(price)
        }

        message.guild.member(message.author.id).roles.add(viprang_id);

        message.reply("**Köszönöm a vásárlást! További szép napot!**")

    }

    if(cmd === `${prefix}slot`){
        let min_money = 50;
        if(selfMoney < min_money) return message.reply(`Túl kevés pénzed van! (Minimum ${min_money}$-nak kell lennie a számládon!) Egyenleged: ${selfMoney}.`)
        
        let tét = Math.round(args[0] *100)/100
        if(isNaN(tét)) return message.reply("Kérlek adj meg egy összeget! (PL: 5)")
        if(tét > selfMoney) return message.reply("az egyenlegednél több pénzt nem rakhatsz fel a slotra!")

        let slots = ["🍌","🍎","🍍","🍆","🍒","🍆","🍌","🍍","🍎","🍒","🍆","🍌","🍎","🍒"]
        let result1 = Math.floor(Math.random() * slots.length)
        let result2 = Math.floor(Math.random() * slots.length)
        let result3 = Math.floor(Math.random() * slots.length)

        if(slots[result1] === slots[result2] && slots[result3]){
            let wEmbed = new Discord.MessageEmbed()
            .setTitle(`🎉 Szerencse játék | slot machine 🎉`)
            .addField(message.author.username, `Nyertél! Ennyit kaptál: **${tét*1.6}$**`)
            .addField("Eredmény:", slots[result1] + slots[result2] + slots[result3])
            .setColor("RANDOM")
            .setTimestamp(message.createdAt)
            .setFooter("DarkPvP")
            message.channel.send(wEmbed)

            money[message.author.id] = {
                money: selfMoney + tét*1.6,
                user_id: message.author.id
            }
        } else {
            let wEmbed = new Discord.MessageEmbed()
            .setTitle(`🎰 Szerencse játék | slot machine 🎰`)
            .addField(message.author.username, `Vesztettél! Ennyit buktál: **${tét}$**`)
            .addField("Eredmény:", slots[result1] + slots[result2] + slots[result3])
            .setColor("RANDOM")
            .setTimestamp(message.createdAt)
            .setFooter("DarkPvP")
            message.channel.send(wEmbed)

            money[message.author.id] = {
                money: selfMoney - tét,
                user_id: message.author.id
            }
        }
    }


    if(cmd === `${prefix}lb`){
        let toplist = Object.entries(money)
        .map(v => `${v[1].money}$ <@${v[1].user_id}>`)
        .sort((a, b) => b.split("$")[0] - a.split("$")[0])
        .slice(0, 10)

        let lbEmbed = new Discord.MessageEmbed()
        .setTitle("LeaderBoard")
        .setColor("GREEN")
        .addField("Pénz top lista | TOP10", toplist, true)
        .setTimestamp(message.createdAt)
        .setFooter("DarkPvP")

        message.channel.send(lbEmbed)
    }

    if(cmd === `${prefix}work`){
        let cd_role_id = "";
        let cooldown_time = "12"; //mp
    
        if(message.member.roles.cache.has(cd_role_id)) return message.reply(`Ezt a parancsot ${cooldown_time} óránként használhatod!`)
    
        message.member.roles.add(cd_role_id)
    
        let üzenetek = ["Jó munkát végeztél!", "A főnököd adott egy kis borravalót!"]
        let random_üzenet_szam = Math.floor(Math.random()*üzenetek.length)
    
        let random_money = Math.floor(Math.random()*1000 +1)
    
        let workEmbed = new Discord.MessageEmbed()
        .setTitle("Munka!")
        .addField(`${üzenetek[random_üzenet_szam]}`, `A számládhoz került: **${random_money}$!**`)
        .setColor("RED")
        .setTimestamp(message.createdAt)
        .setFooter(botname)
        message.channel.send(workEmbed)
    
        money[message.author.id] = {
            money: selfMoney + random_money,
            user_id: message.author.id
        }
        
        setTimeout(() => {
            message.member.roles.remove(cd_role_id)
        }, 7 )
    }

    if(cmd === `${prefix}pay`){
        let pay_money = Math.round(args[0]*100)/100
        if(isNaN(pay_money)) return message.reply(`A parancs helyes használata: ${prefix}pay <@név> <összeg>`)
        if(pay_money > selfMoney) return message.reply("az egyenlegednél több pénzt nem adhatsz meg!")

        let pay_user = message.mentions.members.first();

        if(args[1] && pay_user){
            if(!money[pay_user.id]) {
                money[pay_user.id] = {
                    money: 100,
                    user_id: pay_user.id
                }
            }

            money[pay_user.id] = {
                money: money[pay_user.id].money + pay_money,
                user_id: pay_user.id
            }

            money[message.author.id] = {
                money: selfMoney = pay_money,
                user_id: message.author.id
            }
            message.channel.send(`Sikeresen átutaltál <@${pay_user.id}> számlájára ${pay_money}$-t`)

            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });

        }
    }
    


   ///////////////// ECONOMY  /////////////////


    if(cmd === `hello`){
        message.channel.send("Szia!")
    }

    if(cmd === `${prefix}help`){
        let HelpEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setTitle("HELP")
        .addField("asd")
        .setColor("RANDOM")
        .setThumbnail(message.author.displayAvatarURL())

        message.channel.send(HelpEmbed)   
    } 
    
    if(cmd === `${prefix}parancsok`){
        let parancsEmbed = new Discord.MessageEmbed()
        .setTitle("Parancsok")
        .addField("**lb**", "lb")
        .addField("**work**", "work")
        .addField("**slot**", "slot")
        .addField("**shop**", "shop")
        .addField("**iq**", "iq")
        .addField("**gay**", "gay")
        .setDescription(`*A következő parancslistához ird be: ${prefix}parancsok2*`)
        .setColor("RED")

        message.channel.send(parancsEmbed)
    }

    if(cmd === `${prefix}parancsok2`){
        let parancsEmbed = new Discord.MessageEmbed()
        .setTitle("Parancsok 2")
        .addField("**bal**", "bal")
        .addField("**FreeMoney**", "FreeMoney")
        .addField("**kick**", "kick")
        .addField("**vasarol-vip**", "vasarol-vip")
        .addField("**say**", "say")
        .addField("**embedsay**", "embedsay")
        .addField("weather", "weather")
        .setDescription(`*A következő parancslistához ird be: ${prefix}parancsok3*`)
        .setColor("RED")

        message.channel.send(parancsEmbed)
    }

    if(cmd === `${prefix}parancsok3`){
        let parancsEmbed = new Discord.MessageEmbed()
        .setTitle("Parancsok 3")
        .addField("**cat**", "cat")
        .addField("**meme**", "meme")
        .addField("**szavazas**", "szavazas")
        .addField("**report**", "report")
        .setColor("RED")

        message.channel.send(parancsEmbed)
    }

    if(cmd === `${prefix}szerencse`){
        let S_level = Math.floor(Math.random()*100 + 1)
        let S_Embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setDescription(`**:four_leaf_clover: te ennyire vagy szerencsés: ${S_level}%**`)
        .setColor("GREEN")
        .setFooter("SZERENCSE")
        .setTimestamp(message.createdAt)

        message.channel.send(S_Embed)
    }

    

    
    if(cmd === `${prefix}say`){
        if(message.member.hasPermission("MANAGE_MESSAGES")){
        let szöveg = args.join(" ");

    if(szöveg) {
       
        message.channel.send(szöveg)
    } else {
        message.reply("Irj szöveget!")
    }
 } else {
    let permi = "Neked ehhez nincs jogod!";
    message.reply(permi)
}
 }

///////////////////LOGIKAI OP TIPP///////////

if(cmd === `${prefix}kick`){
    if(message.member.hasPermission("KICK_MEMBERS")){
    let kick_user = message.mentions.members.first();
    if(args[0] && kick_user){

        if(args[1]){

            let KickEmbed = new Discord.MessageEmbed()
            .setTitle("KICK")
            .setColor("RED")
            .setDescription(`**Kickelte:** ${message.author.tag}\n**Kickelve lett:** ${kick_user.tag}\n**Kick indoka:** ${args.slice(1).join(" ")}`)

        message.channel.send(KickEmbed);

        kick_user.kick(args.slice(1).join(" "));
        
        } else {
        let parancsEmbed = new Discord.MessageEmbed()
        .setTitle("Parancs használata:")
        .addField(`\`${prefix}kick <@név>  [indok]\``, "kick")
        .setColor("GREEN")
        .setDescription("HIBA: Kérlek adj meg egy indokot!")

        message.channel.send(parancsEmbed);
        }

    } else {
        let parancsEmbed = new Discord.MessageEmbed()
        .setTitle("Parancs használata:")
        .addField(`\`${prefix}kick <@név>  [indok]\``, "kick")
        .setColor("GREEN")
        .setDescription("HIBA: Kérlek emlits meg egy embert")

        message.channel.send(parancsEmbed);

    } 
} 
}



if(cmd === `${prefix}weather`){
    if(args[0]){
        weather.find({search: args.join(" "), degreeType: "C"}, function(err, result) {
            if (err) message.reply(err);

            if(result.lenght === 0 ){
                message.reply("Kérlek adj meg egy létező település nevet!")
                return;     
            }

            let current = result[0].current;
            let location = result[0].location;

            let WeatherEmbed = new Discord.MessageEmbed()
            .setDescription(`**${current.skytext}**`)
            .setAuthor(`Időjárás itt: ${current.observationpoint}`)
            .setThumbnail(current.imaageUrl)
            .setColor("GREEN")
            .addField("Időzóna:", `UTC${location.timezone}`, true)
            .addField("Fokozat tipusa:", `${location.degreetype}`, true)
            .addField("Hőfok:", `${current.temperature}°C`, true)
            .addField("Hőérzet:", `${current.feelslike}°C`, true)
            .addField("Szél", `${current.winddisplay}`, true)
            .addField("Páratartalom:", `${current.humidity}%`, true)

            message.channel.send(WeatherEmbed)
        })

    } else {
        message.reply("Kérlek adj mege egy települést!")
    }
}

if(cmd === `${prefix}cica`){
    let msg = await message.channel.send("*Macska*")

    let {body} = await superagent
    .get(`https://aws.random.cat/meow`)

    if(!{body}) return message.channel.send("A file betöltésekor hiba lépett fel!")

    let catEmbed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setImage(body.file)
    .setTimestamp(message.createdAt)
    .setFooter(botname)
    
    message.channel.send(catEmbed)
}

if(cmd === `${prefix}meme`){
    const subreddits = ["dankmeme", "meme", "me_irl"]
    const random = subreddits[Math.floor(Math.random() * subreddits.length)]

    const IMG = await randomPuppy(random)
    const MemeEmbed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setImage(IMG)

    message.channel.send(MemeEmbed)
}

if(cmd === `${prefix}mute`){
    if(message.member.hasPermission("KICK_MEMBERS")){
    let mutrang_id = "869275766125371403"

    if(message.member.roles.cache.has(mutrang_id));

    message.guild.member(message.author.id).roles.add(mutrang_id);
    let muteEmbed = new Discord.MessageEmbed()
    .setTitle("*MUTE*")
    .addField(":white_check_mark:Sikeres mutolás!")
    .setColor("GREEN")
    .setFooter(botname)

    message.channel.send(muteEmbed)
  }
} 

if(cmd === `${prefix}javaslat`){
    if(args[0]){
        let e_channel = "838155317489172521"

        let e_embed = new Discord.MessageEmbed()
        .setTitle("**Szavazás**")
        .setColor("RED")
        .setDescription(args.join(" "))
        .setFooter(message.author.username)
        .setTimestamp(message.createdAt)

        bot.channels.cache.get(e_channel).send(e_embed).then(async msg => {
            await msg.react("✅")
            await msg.react("❌")
        });
    } else {
        let he_embed = new Discord.MessageEmbed()
        .setTitle("szavazás")
        .setAuthor(message.author.username)
        .setDescription(args.join(" "))
        .setColor("RED")

        message.channel.send(he_embed)
    }
}

if(cmd === `${prefix}embedsay`){
    if(message.member.hasPermission("KICK_MEMBERS")){
        if(args[0]){
            let say_channel = "869968220289892403"

            let say_embed = new Discord.MessageEmbed()
            .setTitle(message.author.username)
            .setDescription(args.join(" "))
            .setColor("YELLOW")
            .setTimestamp(message.createdAt)
            .setFooter(`${message.author.username}  által`)

            bot.channels.cache.get(say_channel).send(say_embed);
        } else {
            let say_embed = new Discord.MessageEmbed()
            .setDescription(args.join(" "))
            .setColor("RANDOM")
            .setTimestamp(message.createdAt)
            .setFooter(bot.user.username)

            message.channel.send(say_embed);
        }
    } else {
        let permi = "Neked ehhez nincs jogod!";
        message.reply(permi)
    }
}

if(cmd === `${prefix}report`){
    if(args[0] && message.mentions.members.first() && args[1]){
        let report_channel = "875092966321033226";

        let report_embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "Reportolta:"   +   message.mentions.members.first().user.username  +   "Játékost!")
        .setColor("RANDOM")
        .setDescription("Report indoka:" + args.join(" ").slice(args[0].lenght))
        .setColor("RANDOM")
        .setTimestamp(message.createdAt)
        .setFooter(bot.user.username)

        bot.channels.cache.get(report_channel).send(report_embed);

    } else {
        let he_embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + `| Használat`)
        .setDescription(`${prefix}report @<név> <indok>`)
        .setColor("RED")
        .setTimestamp(message.createdAt)
        .setFooter(bot.user.username)

        message.channel.send(he_embed);
    } 
} 


if(cmd === `${prefix}iq`){
    let iq_szint = Math.floor(Math.random()*250 + 1)

    let iqEmbed = new Discord.MessageEmbed()
    .setTitle("IQ teszt :bulb:")
    .setDescription(`**A te IQ-d: ${iq_szint}**`)
    .setColor("RANDOM")
    .setFooter("IQ teszt")
    .setTimestamp(message.createdAt)

    message.channel.send(iqEmbed)
}

if(cmd === `${prefix}gay`){
    let gay_level = Math.floor(Math.random()*100 + 1)

    let gayEmbed = new Discord.MessageEmbed()
    .setAuthor(message.author.username)
    .setDescription(`**:rainbow_flag: te ennyire vagy meleg: ${gay_level}%**`)
    .setColor("RANDOM")
    .setFooter("GAY teszt")
    .setTimestamp(message.createdAt)

    message.channel.send(gayEmbed)
    
}

if(cmd === `${prefix}ping`){
    let ping_level = Math.floor(Math.random()*14 + 1)

    let pingEmbed = new Discord.MessageEmbed()
    .setAuthor(botname)
    .setDescription(`**A bot pingje: ${ping_level}**`)
    .setColor("BLUE")
    .setFooter("PING")
    .setTimestamp(message.createdAt)

    message.channel.send(pingEmbed)
}










});






   


bot.login(Process.env.BOT_TOKEN);
