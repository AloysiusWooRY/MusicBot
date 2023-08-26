module.exports = {
    name: "interactionCreate",
    run: async (bot, interaction) => {
        if (interaction.isCommand()) handleSlashCommand(bot, interaction)
        else if (interaction.isButton()) handleButton(bot, interaction)
    },
}

const handleButton = async (bot, interaction) => {

    const { client } = bot
    const [name, ...params] = interaction.customId.split("-")

    const button = client.buttons.get(name)
    if (!button) return

    await interaction.deferUpdate()
    await button.run(client, interaction, params)

}

const handleSlashCommand = async (bot, interaction) => {

    const { client } = bot
    if (!interaction.inGuild()) return interaction.reply("This command can only be used in a guild")

    const slashcmd = client.slashcommands.get(interaction.commandName)
    if (!slashcmd) return

    if (slashcmd.perms && !interaction.member.permissions.has(slashcmd.perms))
        return interaction.reply("You do not have permissions to use this command")

    await interaction.deferReply()
    await slashcmd.run({ client, interaction })
}