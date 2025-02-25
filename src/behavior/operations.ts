import actions from "../actions/actions.js";
import { Character, Pos } from "../gamestate/character.js";
import { delay } from "../util.js";
import { Operation } from "./decisiongraph/graph.js";

export const noop: Operation = async () => null

export const moveOperation = (c: Character, pos: Pos): Operation => {
  return async () => {
     return await actions.moveCharacter(c.getName(), pos.x, pos.y)
  }
}

export const cooldownOperation = (c: Character): Operation => {
  return async () => {
    const secondsRemaining = c.getCooldownSecondsRemaining()
    await delay(secondsRemaining * 1000 + 100) // Add a few millis to make sure.
    return null
  }
}

export const waitOperation = (seconds: number): Operation => {
  return async () => {
    console.log(`Waiting ${seconds}s`)
    await delay(seconds * 1000)
    return null
  }
}

export const fightOperation = (c: Character): Operation => {
  return async () => {
    return await actions.fight(c.getName())
  }
}

export const restOperation = (c: Character): Operation => {
  return async () => {
    return await actions.rest(c.getName())
  }
}

export const gatherOperation = (c: Character): Operation => {
  return async() => {
    return await actions.gather(c.getName())
  }
}

export const craftOperation = (c: Character, code: string, quantity: number): Operation => {
  return async() => {
    return await actions.craft(c.getName(), code, quantity)
  }
}

export const depositOperation = (c: Character, code: string, quantity: number): Operation => {
  return async() => {
    return await actions.depositBank(c.getName(), code, quantity)
  }
}

export const withdrawOperation = (c: Character, code: string, quantity: number): Operation => {
  return async() => {
    return await actions.withdrawBank(c.getName(), code, quantity)
  }
}

export const useItemOperation = (c: Character, code: string, quantity: number): Operation => {
  return async() => {
    return await actions.useItem(c.getName(), code, quantity)
  }
}

