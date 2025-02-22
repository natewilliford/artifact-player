import { formatISO, parseISO } from "date-fns";
import { Names } from "../character.js";

type Pos = {
  x: number;
  y: number;
}

export class Character {
  name: Names;
  characterSchema: CharacterSchema;
  currentCooldown: CooldownSchema;

  constructor(name: Names) {
    this.name = name;
   }

  updateCharacter(characterSchema: CharacterSchema, currentCooldown: CooldownSchema) {
    this.characterSchema = characterSchema;
    this.currentCooldown = currentCooldown;
  }

  getCoolDownExpiration(): Date {
    console.log("in state: " + this.currentCooldown.expiration)

    const cooldownExpires = parseISO(this.currentCooldown.expiration)
    const now = new Date()

    console.log('Cooldown expires at:', formatISO(cooldownExpires))
    console.log('Current time is:', formatISO(now))

    return cooldownExpires
  }

  getPosition(): Pos {
    return {
      x: this.characterSchema.x, 
      y: this.characterSchema.y
    }
  }
}