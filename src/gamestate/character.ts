import { formatISO, parseISO } from "date-fns";

type Pos = {
  x: number;
  y: number;
}

export class Character {
  characterSchema: CharacterSchema;
  currentCooldown: CooldownSchema;

  constructor(characterSchema: CharacterSchema) {
    this.characterSchema = characterSchema
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

  getName(): string {
    return this.characterSchema.name
  }

  getPosition(): Pos {
    return {
      x: this.characterSchema.x, 
      y: this.characterSchema.y
    }
  }
}