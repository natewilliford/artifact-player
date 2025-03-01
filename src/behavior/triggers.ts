import { Character, Pos } from '../gamestate/character.js'
import { localState } from '../gamestate/localstate.js'
import { Trigger } from './decisiongraph/graph.js'

export const alwaysTrigger: Trigger = () => true

export const invert = (t: Trigger): Trigger => {
  return (): boolean => !t()
}

export const healthPercentTrigger = (
  c: Character,
  healthAmount: number
): Trigger => {
  return (): boolean =>
    c.characterSchema.hp / c.characterSchema.max_hp < healthAmount
}

export const healthBelowTrigger = (
  c: Character,
  healthAmount: number
): Trigger => {
  return (): boolean => c.characterSchema.hp < healthAmount
}

export const healthAboveTrigger = (
  c: Character,
  healthAmount: number
): Trigger => {
  return (): boolean => c.characterSchema.hp >= healthAmount
}

export const reachedLevelTrigger = (c: Character, level: number): Trigger => {
  return () => c.characterSchema.level >= level
}

export const atPositionTrigger = (c: Character, pos: Pos): Trigger => {
  return () => c.getPosition().x === pos.x && c.getPosition().y === pos.y
}

export const hasCooldownTrigger = (c: Character): Trigger => {
  return () => c.getCooldownSecondsRemaining() > 0
}

export const cooldownDoneTrigger = (c: Character): Trigger => {
  return () => c.getCooldownSecondsRemaining() === 0
}

export const hasItemsTrigger = (
  c: Character,
  code: string,
  quantity: number
): Trigger => {
  return () => c.getItemCount(code) >= quantity
}

export const bankHasItemsTrigger = (
  c: Character,
  code: string,
  quantity: number
): Trigger => {
  return () => {
    const bank = localState.getBank()
    if (!bank) {
      console.warn("Couldn't get bank local state.")
      return false
    }
    return bank.getItemCount(code) >= quantity
  }
}

export const taskDoneTrigger = (c: Character): Trigger => {
  return () => {
    return c.characterSchema.task_progress >= c.characterSchema.task_total
  }
}
