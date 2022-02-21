const { Manager } = require("../manager")

const { Client, Interaction } = require("discord.js")

module.exports = {

    name: "create-giveaway",

    description: "Create Giveaways",

    options: [

        {"name": "time", "description":" Time For The Giveaway to End", "type":"STRING", "required": true},
        {"name": "prize", "description":" Prize For the user who won the Giveaway", "type":"STRING", "required": true},
        {"name": "channel", "description":" Channel You want to send the giveaway embed in!(Not necessary)", "type":"CHANNEL", "required": false}

    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    run: (client, interaction) =>{

        if(!interaction.isCommand()) return;

        let time = interaction.options.getString('time')

        let prize = interaction.options.getString('prize')

        let channel = interaction.options.getChannel("channel")

        Manager(client , interaction, {"giveawayOption": {"channelID": channel, "prize": prize, "time": time}})

    }
 
}
