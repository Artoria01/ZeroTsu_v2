const errors = require("../../../utils/errors.js"); //better errors
const second = require("../../../utils/othererrors.js"); //better errors

module.exports = {
    config: {
        name: "purge",
        aliases: ["del", "delete", "clear"],
        usage: "$purge <amount of messages>",
        description: "Supprimez jusqu'à 100 messages à la fois d'un canal rapidement",
        permissions: "manage messages"
    },
    run: async (bot, message, args) => {
        if (message.channel.type == "dm") return message.channel.send("Cette commande ne fonctionne que sur un serveur!");
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
        if(!message.guild.me.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) return errors.lack(message.channel, "MANAGE_MESSAGES");

        let cmd = message.content.split(" ")[0]; //because command aliases
        if(args[0] == "help") return message.channel.send(`Usage: ${cmd} (number of messages)`);

        if(isNaN(args[0])) return message.channel.send(`Usage: ${cmd} (number of messages)`); //must be number not word

        if (args[0] > 100) return message.channel.send("Pas de suppression de plus de 100 messages à la fois pour éviter le décalage, s'il vous plaît!");
        if(args[0] == 0) return message.channel.send("Vous ne pouvez pas supprimer 0 message!");

        const fetched = await message.channel.fetchMessages({limit: args[0]});
        
        try {
            await message.channel.bulkDelete(fetched);
            if (args[0] > 40) {
                message.channel.send(`Supprimé avec succès ${args[0]} messages`).then(msg => msg.delete(2000));
            } else return;
        } catch(e) {
            let id = second.getError(e.message);
            message.channel.send(`**-Malheureusement, une erreur s'est produite. ID d'erreur: ${id}**`);
        }
    }
}
