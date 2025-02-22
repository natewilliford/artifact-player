import { formatISO, parseISO } from "date-fns";

export class Character {
  characterSchema: CharacterSchema;
  currentCooldown: CooldownSchema;

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
}