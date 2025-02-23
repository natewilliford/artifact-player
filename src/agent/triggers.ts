import { Character, Pos } from "../gamestate/character.js"
import { Trigger } from "./decisiongraph/graph.js"

export const alwaysTrigger: Trigger = () => true

//
// Health
//

export const lowHealthTrigger = (c: Character, healthAmount: number): Trigger => {
  return (): boolean => 
    (c.characterSchema.hp / c.characterSchema.max_hp) < healthAmount
}

export const fullHealthTrigger = (c: Character): Trigger => {
  return () => c.characterSchema.hp == c.characterSchema.max_hp
}

//
// XP & Levels
//

export const reachedLevelTrigger = (c: Character, level: number): Trigger => {
  return () => c.characterSchema.level >= level
}

//
// Location/Position
//

export const atPositionTrigger = (c: Character, pos: Pos): Trigger => {
  return () => {
    const isThere = c.getPosition().x === pos.x && c.getPosition().y === pos.y
    console.log(`At position? ${isThere}`)
    return isThere
  }
}

// 
// Cooldown
//

export const hasCooldownTrigger = (c: Character): Trigger => {
  return () => c.getCooldownSecondsRemaining() > 0
}

export const cooldownDoneTrigger = (c: Character): Trigger => {
  return () => c.getCooldownSecondsRemaining() === 0
} 