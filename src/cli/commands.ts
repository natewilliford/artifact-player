import { z } from "zod"
import actions from "../actions/actions.js"
import { buildChickenFightGraph } from "../behavior/graphs/chickenFightGraph.js"
import { buildGatherWoodGraph } from "../behavior/graphs/collectWoodGraph.js"
import { slotSchema } from "../api/types.js"
import { Character } from "../gamestate/character.js"
import { buildCommand, CommandObj, ProcessCommandCode } from "./commandProcessor.js"
import { buildFishingGraph } from "../behavior/graphs/fishingGraph.js"
import { localState } from "../gamestate/localstate.js"
import { BehaviorRunner } from "../behavior/behaviorRunner.js"

export const buildCommands = (behaviorRunner: BehaviorRunner): CommandObj<any>[] => {
  const commands: CommandObj<any>[] = []

  const emptySchema = z.tuple([])
  const nameSchema = z.tuple([ z.string() ])
  const moveSchema = z.tuple([ z.string(), z.coerce.number(), z.coerce.number() ]) // name, x, y
  const equipScheme = z.tuple([ z.string(), z.string(), slotSchema, z.coerce.number().optional() ])
  const unequipScheme = z.tuple([ z.string(), slotSchema, z.coerce.number().optional() ])
  const itemQuantitySchema = z.tuple([ z.string(), z.string(), z.coerce.number() ])
  const bankGoldScheme = z.tuple([ z.string(), z.coerce.number() ])
  const runBehaviorSchema = z.tuple([ z.string(), z.string() ])

  //
  // Administrative
  //

  commands.push(buildCommand(['exit', 'quit', 'q'], emptySchema, async (args: z.infer<typeof emptySchema>): Promise<ProcessCommandCode> => {
    return ProcessCommandCode.Quit
  }))
  commands.push(buildCommand(['load'], emptySchema, async (args: z.infer<typeof emptySchema>): Promise<ProcessCommandCode> => {
    await actions.load()
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['list'], emptySchema, async (args: z.infer<typeof emptySchema>): Promise<ProcessCommandCode> => {
    localState.getCharacters().forEach((_, k) => console.log(k));
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['stats'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    actions.printStats(args[0])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['tasks'], emptySchema, async (args: z.infer<typeof emptySchema>): Promise<ProcessCommandCode> => {
    await actions.getTasks()
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['task-status'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    actions.printTaskStatus(args[0])
    return ProcessCommandCode.Done
  }))

  //
  // Character commands
  //

  commands.push(buildCommand(['move'], moveSchema, async (args: z.infer<typeof moveSchema>): Promise<ProcessCommandCode> => {
    await actions.moveCharacter(args[0], args[1], args[2])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['fight'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    await actions.fight(args[0])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['rest'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    await actions.rest(args[0])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['gather'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    await actions.gather(args[0])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['craft'], itemQuantitySchema, async (args: z.infer<typeof itemQuantitySchema>): Promise<ProcessCommandCode> => {
    await actions.craft(args[0], args[1], args[2])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['equip'], equipScheme, async (args: z.infer<typeof equipScheme>): Promise<ProcessCommandCode> => {
    await actions.equip(args[0], args[1], args[2], args[3])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['unequip'], unequipScheme, async (args: z.infer<typeof unequipScheme>): Promise<ProcessCommandCode> => {
    await actions.unequip(args[0], args[1], args[2])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['task-accept'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    await actions.acceptTask(args[0])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['task-complete'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    await actions.completeTask(args[0])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['deposit'], itemQuantitySchema, async (args: z.infer<typeof itemQuantitySchema>): Promise<ProcessCommandCode> => {
    await actions.depositBank(args[0], args[1], args[2])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['withdraw'], itemQuantitySchema, async (args: z.infer<typeof itemQuantitySchema>): Promise<ProcessCommandCode> => {
    await actions.withdrawBank(args[0], args[1], args[2])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['deposit-gold'], bankGoldScheme, async (args: z.infer<typeof bankGoldScheme>): Promise<ProcessCommandCode> => {
    await actions.depositBankGold(args[0], args[1])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['withdraw-gold'], bankGoldScheme, async (args: z.infer<typeof bankGoldScheme>): Promise<ProcessCommandCode> => {
    await actions.withdrawBankGold(args[0], args[1])
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['use'], itemQuantitySchema, async (args: z.infer<typeof itemQuantitySchema>): Promise<ProcessCommandCode> => {
    await actions.useItem(args[0], args[1], args[2])
    return ProcessCommandCode.Done
  }))

  commands.push(buildCommand(['run'], runBehaviorSchema, async (args: z.infer<typeof runBehaviorSchema>): Promise<ProcessCommandCode> => {
    const c: Character = localState.getCharacter(args[0])
    if (!c) {
      throw new Error("Character not found.")
    }

    behaviorRunner.runBehavior(c, args[1])
    return ProcessCommandCode.Done
  }))

  commands.push(buildCommand(['stop'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    const c: Character = localState.getCharacter(args[0])
    if (!c) {
      throw new Error("Character not found.")
    }

    behaviorRunner.stopBehavior(c.getName())
    return ProcessCommandCode.Done
  }))

  commands.push(buildCommand(['list-behaviors', 'lb'], emptySchema, async (args: z.infer<typeof emptySchema>): Promise<ProcessCommandCode> => {
    behaviorRunner.listBehaviors()
    return ProcessCommandCode.Done
  }))

  commands.push(buildCommand(['running-behaviors', 'rb'], emptySchema, async (args: z.infer<typeof emptySchema>): Promise<ProcessCommandCode> => {
    behaviorRunner.listRunningBehaviors()
    return ProcessCommandCode.Done
  }))

  return commands
}