import { Character } from "./character.js";


const characters = new Map<string, Character>();

const getCharacter = (name) => {
  if (characters.has(name)) {
    return characters.get(name)
  } else {
    const character = new Character(name)
    characters.set(name, character)
    return character
  }
}

export { characters, getCharacter }