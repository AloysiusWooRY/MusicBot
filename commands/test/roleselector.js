const { MessageActionRow, MessageButton, MessageEmbed, Message } = require("discord.js")

module.exports = {
    name: "roleselector",
    category: "test",
    devOnly: true,
    run: async({ client, message, args }) => {
        message.channel.send({
            embeds: [
                new MessageEmbed()
                .setTitle("Select Role")
                .setDescription("Select roles from the buttons below")
                .setColor("BLUE")
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton().setCustomId("role-885703306029183066").setStyle("PRIMARY").setLabel("SIT")
                ])
            ]
        })
    }
}