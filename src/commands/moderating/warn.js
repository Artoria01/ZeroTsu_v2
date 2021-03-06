const errors = require("../../../utils/errors.js"); //better errors

module.exports = {
    config: {
        name: "warn",
        usage: "$warn <user> <reason>",
        description: "Quelqu'un se comporte mal ? Essayez de les avertir",
        permissions: "administrator"
    },
    run: async (bot, message, args) => {
        if (message.channel.type == "dm") return message.channel.send("Cette commande ne fonctionne que sur un serveur!");
        if (!message.member.hasPermission("ADMINISTRATOR")) return errors.noPerms(message, "ADMINISTRATOR");
        
        let cmd = message.content.split(" ")[0]; //because command aliases
        if (args[0] == "help") return message.channel.send(`Usage: ${cmd} <user> <reason>`);

        let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!mutee) return message.channel.send("Utilisateur non trouvé.");

        if (mutee.id === bot.user.id) return errors.botuser(message, "warn");

        let reason = args.join(" ").slice(22);
        if (!reason) reason = "Aucune raison n'a été donnée."
        
        mutee.send(`Vous avez été warn dans **${message.guild.name}** pour **${reason}**`).catch(() => {
            return message.channel.send(":x: Cet utilisateur a son **DM** bloqué");
        });
        return message.channel.send(`${mutee} ***a été warn!***`);

    }
}
