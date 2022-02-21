const Discord = require("discord.js")

const fs = require("fs")

const client = new Discord.Client({intents: "GUILDS"})

client.on("ready", () =>{

    const files = fs.readdirSync("./Commands", "utf-8")

    files.forEach(x =>{

        const command = require(`./Commands/${x}`)

        client.application?.commands.create({"name": "create-giveaway", "description": "Create A Giveaway", "options": [

            {"name": "time", "description":" Time For The Giveaway to End", "type":"STRING", "required": true},
            {"name": "prize", "description":" Prize For the user who won the Giveaway", "type":"STRING", "required": true},
            {"name": "channel", "description":" Channel You want to send the giveaway embed in!(Not necessary)", "type":"CHANNEL", "required": false}
    
        ],})

        console.log(`> Loaded ${command.name}`)

    })

})

client.on("interactionCreate", (interaction) =>{

    if(!interaction.isCommand()) return;

    if(interaction.commandName == "create-giveaway"){

        const command = require("./Commands/create")

        command.run(client, interaction)

    }

})

client.login("TOKEN_HERE")
