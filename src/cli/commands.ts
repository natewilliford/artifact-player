import { z } from "zod"
import actions from "../actions/actions.js"
import { slotSchema } from "../api/types.js"
import { BehaviorRunner } from "../behavior/behaviorRunner.js"
import { Character } from "../gamestate/character.js"
import { localState } from "../gamestate/localstate.js"
import { buildCommand, CommandObj, QuitError } from "./commandProcessor.js"

export const buildCommands = (behaviorRunner: BehaviorRunner): CommandObj<any>[] => {
  const commands: CommandObj<any>[] = []
  let selectedCharacter: Character | undefined
  const safeCharacter = (): Character => {
    if (!selectedCharacter) {
      throw new Error ("No character selected.")
    }
    return selectedCharacter
  }

  const emptySchema = z.tuple([])
  const nameSchema = z.tuple([ z.string() ]) // name
  const moveSchema = z.tuple([ z.coerce.number(), z.coerce.number() ]) // x, y
  const equipSchema = z.tuple([ z.string(), slotSchema ]) // code, slot
  const equipNumSchema = z.tuple([ z.string(), slotSchema, z.coerce.number() ]) // code, slot, quantity
  const unequipSchema = z.tuple([ slotSchema ]) // slot
  const unequipNumSchema = z.tuple([ slotSchema, z.coerce.number() ]) // slot, quantity
  const itemQuantitySchema = z.tuple([ z.string(), z.coerce.number() ]) // code, quantity
  const bankGoldSchema = z.tuple([ z.coerce.number() ]) // quantity
  const runBehaviorSchema = z.tuple([ z.string() ]) // behavior

  //
  // Administrative
  //

  commands.push(buildCommand(['exit', 'quit', 'q'], emptySchema, async (): Promise<void> => {
    behaviorRunner.stopAllBehaviors()
    throw new QuitError('Quit command')
  }))
  commands.push(buildCommand(['load'], emptySchema, async (): Promise<void> => {
    await actions.load()
  }))
  commands.push(buildCommand(['select'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<void> => {
    const c = localState.getCharacter(args[0])
    if (!c) {
      throw new Error("Character not found: " + args[0])
    }
    selectedCharacter = c
  }))
  commands.push(buildCommand(['list', 'ls'], emptySchema, async (): Promise<void> => {
    localState.getCharacters().forEach((c, name) => {
      const b = behaviorRunner.runningBehaviors.get(name)
      const cursor = selectedCharacter?.getName() === name ? ">" : " "
      let logMessage = ` ${cursor} ${name}`
      if (b) {
        const running = b.graph.running ? 'running' : 'ending'
        logMessage = `${logMessage} - ${b.behavior.name} - ${running}`
      }
      console.log(logMessage)
    });
  }))
  commands.push(buildCommand(['stats'], emptySchema, async (): Promise<void> => {
    actions.printStats(safeCharacter().getName())
  }))
  commands.push(buildCommand(['tasks'], emptySchema, async (): Promise<void> => {
    await actions.getTasks()
  }))
  commands.push(buildCommand(['task-status', 'ts'], emptySchema, async (): Promise<void> => {
    localState.getCharacters().forEach(c => actions.printTaskStatus(c.getName()))
  }))

  //
  // Character commands
  //

  commands.push(buildCommand(['move'], moveSchema, async (args: z.infer<typeof moveSchema>): Promise<void> => {
    await actions.moveCharacter(safeCharacter().getName(), args[0], args[1])
  }))
  commands.push(buildCommand(['fight'], emptySchema, async (): Promise<void> => {
    await actions.fight(safeCharacter().getName())
  }))
  commands.push(buildCommand(['rest'], emptySchema, async (): Promise<void> => {
    await actions.rest(safeCharacter().getName())
  }))
  commands.push(buildCommand(['gather'], emptySchema, async (): Promise<void> => {
    await actions.gather(safeCharacter().getName())
  }))
  commands.push(buildCommand(['craft'], itemQuantitySchema, async (args: z.infer<typeof itemQuantitySchema>): Promise<void> => {
    await actions.craft(safeCharacter().getName(), args[0], args[1])
  }))
  commands.push(buildCommand(['equip'], equipSchema, async (args: z.infer<typeof equipSchema>): Promise<void> => {
    await actions.equip(safeCharacter().getName(), args[0], args[1])
  }))
  commands.push(buildCommand(['equip-num'], equipNumSchema, async (args: z.infer<typeof equipNumSchema>): Promise<void> => {
    await actions.equip(safeCharacter().getName(), args[0], args[1], args[2])
  }))
  commands.push(buildCommand(['unequip'], unequipSchema, async (args: z.infer<typeof unequipSchema>): Promise<void> => {
    await actions.unequip(safeCharacter().getName(), args[0])
  }))
  commands.push(buildCommand(['unequip-num'], unequipNumSchema, async (args: z.infer<typeof unequipNumSchema>): Promise<void> => {
    await actions.unequip(safeCharacter().getName(), args[0], args[1])
  }))
  commands.push(buildCommand(['task-accept'], emptySchema, async (): Promise<void> => {
    await actions.acceptTask(safeCharacter().getName())
  }))
  commands.push(buildCommand(['task-complete'], emptySchema, async (): Promise<void> => {
    await actions.completeTask(safeCharacter().getName())
  }))
  commands.push(buildCommand(['deposit'], itemQuantitySchema, async (args: z.infer<typeof itemQuantitySchema>): Promise<void> => {
    await actions.depositBank(safeCharacter().getName(), args[0], args[1])
  }))
  commands.push(buildCommand(['withdraw'], itemQuantitySchema, async (args: z.infer<typeof itemQuantitySchema>): Promise<void> => {
    await actions.withdrawBank(safeCharacter().getName(), args[0], args[1])
  }))
  commands.push(buildCommand(['deposit-gold'], bankGoldSchema, async (args: z.infer<typeof bankGoldSchema>): Promise<void> => {
    await actions.depositBankGold(safeCharacter().getName(), args[0])
  }))
  commands.push(buildCommand(['withdraw-gold'], bankGoldSchema, async (args: z.infer<typeof bankGoldSchema>): Promise<void> => {
    await actions.withdrawBankGold(safeCharacter().getName(), args[0])
  }))
  commands.push(buildCommand(['use'], itemQuantitySchema, async (args: z.infer<typeof itemQuantitySchema>): Promise<void> => {
    await actions.useItem(safeCharacter().getName(), args[0], args[1])
  }))
  commands.push(buildCommand(['run'], runBehaviorSchema, async (args: z.infer<typeof runBehaviorSchema>): Promise<void> => {
      behaviorRunner.runBehavior(safeCharacter(), args[0])
  }))
  commands.push(buildCommand(['stop'], emptySchema, async (): Promise<void> => {
    behaviorRunner.stopBehavior(safeCharacter().getName())
  }))
  commands.push(buildCommand(['list-behaviors', 'lb'], emptySchema, async (): Promise<void> => {
    behaviorRunner.listBehaviors()
  }))

  return commands
}