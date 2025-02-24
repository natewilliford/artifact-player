import api from "../api/api.js";
import { RewardsSchema, Slot } from "../api/types.js";
import { Character } from "../gamestate/character.js";
import { characters } from "../gamestate/characters.js";

export default {
  loadCharacters: async () => {
    const res = await api.getCharacters()
    if (res.data) {
      res.data.forEach(cs => {
        console.log("Adding character: " + cs.name)
        characters.addCharacter(new Character(cs))
      })
    }
  },
  moveCharacter: async (characterName: string, x: number, y: number) => {
    const character = characters.getCharacter(characterName)
    const res = await api.moveCharacter(character.getName(), x, y)
    if (res.data) {
      character.updateCharacter(res.data.character, res.data.cooldown);
      const newPos = character.getPosition()
      console.log(character.getName() + " moved to " + newPos.x + ", " + newPos.y + " - " +  res.data.destination.name);
      character.getCoolDownExpiration()
    }
  },
  fight: async (characterName: string) => {
    const character = characters.getCharacter(characterName)
    const res = await api.fight(character.getName())
    if (res.data) {
      character.updateCharacter(res.data.character, res.data.cooldown)
      console.log("Fight result: " + res.data.fight.result + " - " + res.data.fight.logs[0]);
    }
  },
  rest: async (characterName: string) => {
    const character = characters.getCharacter(characterName)
    const res = await api.rest(character.getName())
    if (res.data) {
      character.updateCharacter(res.data.character, res.data.cooldown)
      console.log(`${character.getName()} rested and restored ${res.data.hp_restored} hp.`)
    }
  },
  printStats: (characterName: string) => {
    const character = characters.getCharacter(characterName)
    if (!character) {
      throw new Error("Character not found: " + characterName)
    }
    const cs = character.characterSchema
    console.log(`Cooldown: ${character.getCooldownSecondsRemaining()}s`)
    console.log(`      Hp: ${cs.hp}/${cs.max_hp}`)
    console.log(`   Level: ${cs.level}`)
    console.log(`      Xp: ${cs.xp}/${cs.max_xp}`)
    console.log(`    Gold: ${cs.gold}`)
    console.log(`Inventory: `)
    cs.inventory.forEach(inv => {
      if (inv.quantity > 0) {
        console.log(`  ${inv.slot}: ${inv.quantity}x - ${inv.code}`)
      }
    })
    console.log(`Equipment: `)
    console.log(`   weapon: ${cs.weapon_slot}`)
  },
  gather: async (characterName: string) => {
    const character = characters.getCharacter(characterName)
    const res = await api.gather(character.getName())
    if (res.data) {
      character.updateCharacter(res.data.character, res.data.cooldown)
      console.log(`${character.getName()} gathered and gained ${res.data.details.xp}xp and items:`)
      res.data.details.items.forEach(i => {
        console.log(`  ${i.quantity}x - ${i.code}`)
      })
    }
  },
  craft: async (name: string, code: string, quantity: number) => {
    const character = characters.getCharacter(name)
    const res = await api.craft(character.getName(), code, quantity)
    if (res.data) {
    console.log(`${character.getName()} crafted and gained ${res.data.details.xp}xp and items:`)
      res.data.details.items.forEach(i => {
        console.log(`  ${i.quantity}x - ${i.code}`)
      })
    }
  },
  equip: async (name: string, code: string, slot: Slot, quantity: number = 1) => {
    const character = characters.getCharacter(name)
    const res = await api.equip(character.getName(), code, slot, quantity)
    if (res.data) {
      character.updateCharacter(res.data.character, res.data.cooldown)
      console.log(`${character.getName()} equipped ${res.data.item.code} in ${res.data.slot}`)
    }
  },
  unequip: async (name: string, slot: Slot, quantity: number = 1) => {
    const character = characters.getCharacter(name)
    const res = await api.unequip(character.getName(), slot, quantity)
    if (res.data) {
      character.updateCharacter(res.data.character, res.data.cooldown)
      console.log(`${character.getName()} unequipped ${res.data.item.code} in ${res.data.slot}`)
    }
  },
  getTasks: async () => {
    const res = await api.getTasks()
    if (res.data) {
      res.data.forEach(task => {
        console.log(`Task - ${task.code} - level: ${task.level} - type: ${task.type} - min_quantity: ${task.min_quantity} - max_quantity: ${task.max_quantity}`)
        console.log(`  skill: ${task.skill}`)
        console.log(`  rewards - gold: ${task.rewards.gold}`)
        logRewards(task.rewards)
      })
    }
  },
  acceptTask: async (name: string) => {
    const character = characters.getCharacter(name)
    const res = await api.acceptTask(character.getName())
    if (res.data) {
      character.updateCharacter(res.data.character, res.data.cooldown)
      console.log(`${character.getName()} accepted task ${res.data.task.code} - type: ${res.data.task.type} - total: ${res.data.task.total}`)
      console.log('  Rewards: ')
      logRewards(res.data.task.rewards)
    }
  },
  completeTask: async (name: string) => {
    const character = characters.getCharacter(name)
    const res = await api.completeTask(character.getName())
    if (res.data) {
      character.updateCharacter(res.data.character, res.data.cooldown)
      console.log(`${character.getName()} completed task. Rewards: `)
      logRewards(res.data.rewards)
    }
  },
  printTaskStatus: async (name: string) => {
    const character = characters.getCharacter(name)
    const cs = character.characterSchema
    if (cs.task && cs.task.length > 0) {
      console.log(`Task: ${cs.task} - type: ${cs.task_type}`)
      console.log(`progress: ${cs.task_progress}/${cs.task_total}`)
    } else {
      console.log('No task in progress')
    }
  }
}

const logRewards = (rewards: RewardsSchema) => {
  rewards.items.forEach(item => {
    console.log(`    ${item.quantity}x - ${item.code}`)
  })
}