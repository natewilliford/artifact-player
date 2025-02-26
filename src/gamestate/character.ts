import { addSeconds } from 'date-fns'
import { CharacterSchema } from '../api/types.js'

export type Pos = {
  x: number
  y: number
}

export class Character {
  characterSchema: CharacterSchema
  lastUpdated: Date

  constructor(characterSchema: CharacterSchema) {
    this.characterSchema = characterSchema
    this.lastUpdated = new Date()
  }

  updateCharacter(characterSchema: CharacterSchema) {
    this.characterSchema = characterSchema
    this.lastUpdated = new Date()
  }

  getCoolDownExpiration(): Date {
    return addSeconds(this.lastUpdated, this.characterSchema.cooldown)
  }

  getCooldownSecondsRemaining(): number {
    const now = new Date()
    // Use millis directly since date-fns Durations don't include milliseconds.
    const millis = Math.max(
      this.getCoolDownExpiration().getTime() - now.getTime(),
      0
    )
    return millis / 1000
  }

  getName(): string {
    return this.characterSchema.name
  }

  getPosition(): Pos {
    return {
      x: this.characterSchema.x,
      y: this.characterSchema.y,
    }
  }

  getItemCount(code: string): number {
    return this.characterSchema.inventory
      .filter((slot) => slot.code === code)
      .reduce((sum, slot) => sum + slot.quantity, 0)
  }
}
