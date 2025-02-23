import { Character } from "./character.js";

const characterMap = new Map<string, Character>();

const characters = {
  addCharacter: (c: Character) => {
    characterMap.set(c.getName(), c)
  },
  getCharacter: (name) => {
    return characterMap.get(name)
  }
}

export { characterMap, characters }