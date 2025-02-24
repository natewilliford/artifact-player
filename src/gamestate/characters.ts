import { CharacterSchema } from "../api/types.js";
import { Character } from "./character.js";

const characterMap = new Map<string, Character>();

const characters = {
  addOrUpdate: (cs: CharacterSchema) => {
    const existing = characterMap.get(cs.name)
    if (existing) {
      existing.updateCharacter(cs)
    } else {
      characterMap.set(cs.name, new Character(cs))
    }
  },
  getCharacter: (name: string) => {
    const character = characterMap.get(name)
    if (!character) {
      throw new Error("Character not found: " + name)
    }
    return character
  }
}

export { characterMap, characters };
