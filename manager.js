const { MessageEmbed, MessageButton, MessageActionRow, Client, Interaction} = require('discord.js')

const Builder = require("@discordjs/builders")

const parse = require("parse-ms")

let ended = false

const ms = require('ms')

const { Database } = require("easymapdb")

const db = new Database("./database.json")

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */
module.exports.Manager = (client, interaction,options = {giveawayOption: {prize: '', time: 0, channel: null}, button: {emoji: "🎉", StartStyle: "SUCCESS", EndStyle: "DANGER"}, embed: {StartColor: "GREEN", EndColor: "BLURPLE"}}) => {
    options = {giveawayOption: {prize: '', time: 0, channel: null}, button: {emoji: "🎉", StartStyle: "SUCCESS", EndStyle: "DANGER"}, embed: {StartColor: "GREEN", EndColor: "BLURPLE"}}
        if(!interaction.isCommand())return;
    let time1 = interaction.options.getString('time')

    let prize = interaction.options.getString('prize')

    let channel1 = interaction.options.getChannel("channel")

    const JoinGiveawayButton = new MessageButton()

    .setEmoji(options.button.emoji)

    .setCustomId("jg")

    .setStyle("SUCCESS")

    .setLabel("Join Giveaway")

    const endButton = new MessageButton()

    .setStyle("DANGER")

    .setCustomId("end")

    .setLabel("End the Giveaway Early")

    const row = new MessageActionRow()

    .addComponents(JoinGiveawayButton, endButton)

    const time = ms(time1)

    console.log(time)

    let parsed1 = parse(time);

    let parsedTime1 = `${parsed1.days} days, ${parsed1.hours} hours, ${parsed1.minutes} minutes, ${parsed1.seconds} seconds`

    const embed = new MessageEmbed()

    .setTitle(prize)

    .setColor(options.embed.StartColor)

    .setDescription(`Ending In ${parsedTime1}\n\nPress ${options.button.emoji} to enter the giveaway\n\n**Hosted By <@${interaction.user.id}>**`)

    let channel;// = interaction.channel

    try{
    channel = client.channels.cache.get(channel1.id)
    }catch(err){
    channel = interaction.channel
    }

    channel.send({"embeds": [embed], components: [row]}).then(r => {
    
        db.set(`giveawayTime_${r.id}`, Date.now() +time)

        const collector = r.channel.createMessageComponentCollector({"componentType": "BUTTON", time: time})

        collector.on("collect", (i) => {

            if(i.customId == "jg"){

            
            let arr = db.has(`entries_${i.message.id}`)
             if(arr) arr = db.get(`entries_${i.message.id}`);
            if(!arr) arr = db.set(`entries_${i.message.id}`, [])
            if(!arr){ 

                db.push(`entries_${i.message.id}`, i.user.id)

                i.reply({"content": "You have successfully joined the giveaway", "ephemeral": true})

            }else{

            if(arr.filter(x => x == i.user.id) || arr.includes(i.user.id)){

                i.reply({content: "You have already joined the giveaway", "ephemeral": true})

            }

            }
        }

        if(i.customId == "end"){

            if(!i.memberPermissions.has(["MANAGE_CHANNELS", "MANAGE_MESSAGES"])){

                i.reply({content: "You Don't Have Enough Permissions, Required permissions \"MANAGE_CHANNELS\" and \"MANAGE_MESSAGES\""})

            }else{

                collector.stop(`Ended By ${i.user.id}`)

            }

        }

        })

        collector.on("end", (collected) => {

            if(!collected.size){

                interaction.user.send({content: "There were no entries in the giveaway"})

                
                const EndGiveawayButton1 = new MessageButton()

                .setEmoji(options.button.emoji)
            
                .setCustomId("jg")
            
                .setStyle("DANGER")

                .setLabel("join")

                .setDisabled(true)

                const roww = new MessageActionRow()

                .addComponents(EndGiveawayButton1)

                const endWithNoUsersEmbed = new MessageEmbed()

                .setTitle("No Winners")

                .setDescription(`No one participated in the giveaway so there aare no winners\nPrize: **${options.giveawayOption.prize}**\nHosted by **<@${interaction.user.id}>**`)

                .setColor("RED")

                r.edit({"embeds": [endWithNoUsersEmbed], "components": [roww]})

            }else{

                let arr = db.get(`entries_${r.id}`)

                let Random = Math.floor(Math.random() * arr.length)

                let winner = arr[Random]

                const winEmbed = new MessageEmbed()

                .setTitle("Giveaway Ended")

                .setDescription(`${options.giveawayOption.prize}\n\nWinner: <@${winner}>\n\n**Hosted by <@${interaction.user.id}>**`)

                .setColor(options.embed.EndColor)

                const EndGiveawayButton = new MessageButton()

                .setEmoji(options.button.emoji)
            
                .setCustomId("jg")
            
                .setStyle("DANGER")

                .setLabel("end?")

                .setDisabled(true)

                const rerollButton = new MessageButton()

                .setLabel("reroll? (Click Within 24 Hours)")

                .setCustomId("rr")

                .setStyle("PRIMARY")
                
                const rowA = new MessageActionRow()

                .addComponents(EndGiveawayButton, rerollButton)

                r.edit({embeds: [winEmbed], 'components': [rowA]}).then(console.log("send"))

                r.channel.send({content: `<@${winner}> you have won ${options.giveawayOption.prize}`})

                const rr = r.channel.createMessageComponentCollector({"time": 1000 * 60 * 60 * 24, "componentType": "BUTTON"})

                rr.on('collect', (i) =>{

                    if(i.customId == "rr"){

                        if(!i.memberPermissions.has(["MANAGE_CHANNELS", "MANAGE_MESSAGES"])){

                        i.reply({content: "You Don't Have Enough Permissions, Required permissions \"MANAGE_CHANNELS\" ands \"MANAGE_MESSAGES\""})

                        }else{

                            let arr1 = db.get(`entries_${r.id}`)

                            let Random1 = Math.floor(Math.random() * arr1.length)
            
                            let winner1 = arr1[Random1]

                            r.reply({content: `The New Winner is <@${winner1}> and has won ${options.giveawayOption.prize}`})

                        }

                    }

                })

                collector.on("end" , (collected) =>{

                    db.delete(`entries_${r.id}`)

                    ended = true

                })
            }

        })

    })

}
