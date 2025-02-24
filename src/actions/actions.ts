import api from "../api/api.js";
import { Slot } from "../api/types.js";
import { Character } from "../gamestate/character.js";
import { characters } from "../gamestate/characters.js";

export default {
  loadCharacters: async () => {
    const res = await api.getCharacters()
    if (res) {
      res.forEach(cs => {
        console.log("Adding character: " + cs.name)
        characters.addCharacter(new Character(cs))
      })
    }
  },
  moveCharacter: async (characterName: string, x: number, y: number) => {
    const character = characters.getCharacter(characterName)
    const res = await api.moveCharacter(character.getName(), x, y)
    if (res) {
      character.updateCharacter(res.character, res.cooldown);
      const newPos = character.getPosition()
      console.log(character.getName() + " moved to " + newPos.x + ", " + newPos.y + " - " +  res.destination.name);
      character.getCoolDownExpiration()
    }
  },
  fight: async (characterName: string) => {
    const character = characters.getCharacter(characterName)
    const res = await api.fight(character.getName())
    if (res) {
      character.updateCharacter(res.character, res.cooldown)
      console.log("Fight result: " + res.fight.result + " - " + res.fight.logs[0]);
    }
  },
  rest: async (characterName: string) => {
    const character = characters.getCharacter(characterName)
    const res = await api.rest(character.getName())
    if (res) {
      character.updateCharacter(res.character, res.cooldown)
      console.log(`${character.getName()} rested and restored ${res.hp_restored} hp.`)
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
    // console.log(`   weapon: ${cs.}`)
    
  },
  gather: async (characterName: string) => {
    const character = characters.getCharacter(characterName)
    const res = await api.gather(character.getName())
    if (res) {
      character.updateCharacter(res.character, res.cooldown)
      console.log(`${character.getName()} gathered and gained ${res.details.xp}xp and items:`)
      res.details.items.forEach(i => {
        console.log(`  ${i.quantity}x - ${i.code}`)
      })
    }
  },
  craft: async (name: string, code: string, quantity: number) => {
    const character = characters.getCharacter(name)
    const res = await api.craft(character.getName(), code, quantity)
    console.log(`${character.getName()} crafted and gained ${res.details.xp}xp and items:`)
      res.details.items.forEach(i => {
        console.log(`  ${i.quantity}x - ${i.code}`)
      })
  },
  equip: async (name: string, code: string, slot: Slot, quantity: number = 1) => {
    const character = characters.getCharacter(name)
    const res = await api.equip(character.getName(), code, slot, quantity)
    if (res) {
      character.updateCharacter(res.character, res.cooldown)
      console.log(`${character.getName()} equipped ${res.item.code} in ${res.slot}`)
    }
  },
  unequip: async (name: string, slot: Slot, quantity: number = 1) => {
    const character = characters.getCharacter(name)
    const res = await api.unequip(character.getName(), slot, quantity)
    if (res) {
      character.updateCharacter(res.character, res.cooldown)
      console.log(`${character.getName()} unequipped ${res.item.code} in ${res.slot}`)
    }
  }
}