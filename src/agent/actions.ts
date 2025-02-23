import actions from "../actions/actions.js";
import { Character, Pos } from "../gamestate/character.js";
import { delay } from "../util.js";
import { Action } from "./decisiongraph/graph.js";

export const noopAction: Action = async () => {}

export const moveAction = (c: Character, pos: Pos): Action => {
  return async () => {
     await actions.moveCharacter(c.getName(), pos.x, pos.y)
  }
}

export const cooldownAction = (c: Character): Action => {
  return async () => {
    const secondsRemaining = c.getCooldownSecondsRemaining()
    console.log(`Waiting for cooldown: ${secondsRemaining}s`)
    await delay(secondsRemaining * 1000 + 100) // Add a few millis to make sure.
  }
}

export const fightAction = (c: Character): Action => {
  return async () => {
    await actions.fight(c.getName())
  }
}

export const restAction = (c: Character): Action => {
  return async () => {
    await actions.rest(c.getName())
  }
}