import { addSeconds } from "date-fns";

export type Pos = {
  x: number;
  y: number;
}

export class Character {
  characterSchema: CharacterSchema
  currentCooldown: CooldownSchema | undefined
  localCooldownStart: Date | undefined

  constructor(characterSchema: CharacterSchema) {
    this.characterSchema = characterSchema
  }

  updateCharacter(characterSchema: CharacterSchema, currentCooldown: CooldownSchema) {
    this.characterSchema = characterSchema
    this.currentCooldown = currentCooldown
    this.localCooldownStart = new Date()
  }

  getCoolDownExpiration(): Date {
    if (!this.localCooldownStart || !this.currentCooldown) {
      return new Date()
    }

    return addSeconds(this.localCooldownStart, this.currentCooldown.total_seconds)
  }

  getCooldownSecondsRemaining(): number {
    const now = new Date()
    // Use millis directly since date-fns Durations don't include milliseconds.
    const millis = Math.max(this.getCoolDownExpiration().getTime() - now.getTime(), 0)
    return millis / 1000
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