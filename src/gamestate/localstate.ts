import { CharacterSchema, SimpleItemSchema } from '../api/types.js'
import { Bank } from './bank.js'
import { Character } from './character.js'

const characterMap = new Map<string, Character>()
let bank: Bank | undefined

export const localState = {
  addOrUpdateCharacter: (cs: CharacterSchema) => {
    const existing = characterMap.get(cs.name)
    if (existing) {
      existing.updateCharacter(cs)
    } else {
      characterMap.set(cs.name, new Character(cs))
    }
  },
  getCharacter: (name: string): Character => {
    const character = characterMap.get(name)
    if (!character) {
      throw new Error('Character not found: ' + name)
    }
    return character
  },
  getCharacters: () => {
    return characterMap
  },
  createOrUpdateBank(items: SimpleItemSchema[]) {
    if (bank) {
      bank.updateItems(items)
    } else {
      bank = new Bank(items)
    }
  },
  getBank() {
    return bank
  },
}
