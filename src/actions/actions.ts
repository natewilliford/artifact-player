import api from "../api/api.js";
import { Character } from "../gamestate/character.js";

export default {
  moveCharacter: async (character: Character, x: number, y: number) => {
    const res = await api.moveCharacter(character.name, x, y)
    if (res) {
      character.updateCharacter(res.character, res.cooldown);
      const newPos = character.getPosition()
      console.log(character.name + " moved to " + newPos.x + ", " + newPos.y + " - " +  res.destination.name);
    }
  },
  fight: async (character: Character) => {
    const res = await api.fight(character.name)
    if (res) {
      character.updateCharacter(res.character, res.cooldown)
      console.log("Fight result: " + res.fight.result + " - " + res.fight.logs[0]);
    }
  }
}