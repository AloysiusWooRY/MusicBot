module.exports = {
    name: "role",
    run: async(client, interaction, parameters) => {
        const roleId = parameters[0]
        if (!interaction.guild) return interaction.reply({ content: "This command can only be used in a guild!", ephemeral: true })

        const role = await interaction.guild.roles.fetch(roleId)
        if (!role)
            return interaction.reply({ content: "Role not found", ephemeral: true })

        const member = await interaction.guild.members.fetch(interaction.member.id)
        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role.id)
            return interaction.reply({ content: `Removed the role ${role.name} from you!`, ephemeral: true })
        } else {
            await member.roles.add(role.id)
            return interaction.reply({ content: `Added the role ${role.name} from you!`, ephemeral: true })
        }
    }
}