import actions from '../actions/actions.js'
import { Character, Pos } from '../gamestate/character.js'
import { delay } from '../util.js'
import { Operation } from './decisiongraph/types.js'

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
  return async () => {
    return await actions.gather(c.getName())
  }
}

export const craftOperation = (
  c: Character,
  code: string,
  quantity: number
): Operation => {
  return async () => {
    return await actions.craft(c.getName(), code, quantity)
  }
}

export const depositOperation = (
  c: Character,
  code: string,
  quantity?: number
): Operation => {
  return async () => {
    let depositAmount = c.getItemCount(code)
    if (quantity !== undefined) {
      depositAmount = Math.min(depositAmount, quantity)
    }
    if (depositAmount > 0) {
      return await actions.depositBank(c.getName(), code, depositAmount)
    }
  }
}

export const depositAllOperation = (
  c: Character,
  codes: string[]
): Operation => {
  return async () => {
    const codeSet = new Set(codes)

    const promises: Promise<Maybe<Error>>[] = []
    c.characterSchema.inventory.forEach((slot) => {
      if (slot.code && slot.quantity > 0 && codeSet.has(slot.code)) {
        promises.push(
          actions.depositBank(c.getName(), slot.code, slot.quantity)
        )
      }
    })

    const results = await Promise.all(promises)
    // Just return the first error if we got any.
    return results.find((e) => e)
  }
}

export const withdrawOperation = (
  c: Character,
  code: string,
  quantity: number
): Operation => {
  return async () => {
    return await actions.withdrawBank(c.getName(), code, quantity)
  }
}

export const useItemOperation = (
  c: Character,
  code: string,
  quantity: number
): Operation => {
  return async () => {
    return await actions.useItem(c.getName(), code, quantity)
  }
}
