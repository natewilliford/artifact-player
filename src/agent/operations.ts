import actions from "../actions/actions.js";
import { Character, Pos } from "../gamestate/character.js";
import { delay } from "../util.js";
import { Operation } from "./decisiongraph/graph.js";

export const noop: Operation = async () => {}

export const moveOperation = (c: Character, pos: Pos): Operation => {
  return async () => {
     await actions.moveCharacter(c.getName(), pos.x, pos.y)
  }
}

export const cooldownOperation = (c: Character): Operation => {
  return async () => {
    const secondsRemaining = c.getCooldownSecondsRemaining()
    console.log(`Waiting for cooldown: ${secondsRemaining}s`)
    await delay(secondsRemaining * 1000 + 100) // Add a few millis to make sure.
  }
}

export const fightOperation = (c: Character): Operation => {
  return async () => {
    await actions.fight(c.getName())
  }
}

export const restOperation = (c: Character): Operation => {
  return async () => {
    await actions.rest(c.getName())
  }
}

export const gatherOperation = (c: Character): Operation => {
  return async() => {
    await actions.gather(c.getName())
  }
}