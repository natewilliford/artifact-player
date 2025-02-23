import { Character } from "./character.js";

const characterMap = new Map<string, Character>();

const characters = {
  addCharacter: (c: Character) => {
    characterMap.set(c.getName(), c)
  },
  getCharacter: (name: string) => {
    const character = characterMap.get(name)
    if (!character) {
      throw new Error("Character not found: " + name)
    }
    return character
  }
}

export { characterMap, characters }