import { Character, Pos } from "../gamestate/character.js"
import { localState } from "../gamestate/localstate.js"
import { Trigger } from "./decisiongraph/graph.js"

export const alwaysTrigger: Trigger = () => true


export const healthPercentTrigger = (c: Character, healthAmount: number): Trigger => {
  return (): boolean => 
    (c.characterSchema.hp / c.characterSchema.max_hp) < healthAmount
}

export const healthBelowTrigger = (c: Character, healthAmount: number): Trigger => {
  return (): boolean => c.characterSchema.hp < healthAmount
}

export const healthAboveTrigger = (c: Character, healthAmount: number): Trigger => {
  return (): boolean => c.characterSchema.hp >= healthAmount
}

export const reachedLevelTrigger = (c: Character, level: number): Trigger => {
  return () => c.characterSchema.level >= level
}

export const atPositionTrigger = (c: Character, pos: Pos): Trigger => {
  return () => {
    const isThere = c.getPosition().x === pos.x && c.getPosition().y === pos.y
    console.log(`At position? ${isThere}`)
    return isThere
  }
}

export const hasCooldownTrigger = (c: Character): Trigger => {
  return () => c.getCooldownSecondsRemaining() > 0
}

export const cooldownDoneTrigger = (c: Character): Trigger => {
  return () => c.getCooldownSecondsRemaining() === 0
}

export const hasItemsTrigger = (c: Character, code: string, quantity: number): Trigger => {
  return () => {
    const itemCount = c.getItemCount(code)
    console.log(`Item count: ${code} - ${itemCount}`)
    return itemCount >= quantity
  }
}

export const hasLessThanItemsTrigger = (c: Character, code: string, quantity: number): Trigger => {
  return () => {
    const itemCount = c.getItemCount(code)
    console.log(`Item count: ${code} - ${itemCount}`)
    return itemCount < quantity
  }
}

export const bankHasItemsTrigger = (c: Character, code: string, quantity: number): Trigger => {
  return () => {
    const bank = localState.getBank()
    if (!bank) {
      console.warn("Couldn't get bank local state.")
      return false
    }

    const itemCount = bank.getItemCount(code)
    console.log(`Item count: ${code} - ${itemCount}`)
    return itemCount >= quantity
  }
}

export const bankHasLessThanItems = (c: Character, code: string, quantity: number): Trigger => {
  return () => {
    const bank = localState.getBank()
    if (!bank) {
      console.warn("Couldn't get bank local state.")
      return false
    }

    const itemCount = bank.getItemCount(code)
    console.log(`Item count: ${code} - ${itemCount}`)
    return itemCount < quantity
  }
}