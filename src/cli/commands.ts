import { z } from "zod"
import actions from "../actions/actions.js"
import { runProgram } from "../agent/agent.js"
import { characterMap } from "../gamestate/characters.js"
import { buildCommand, CommandObj, ProcessCommandCode } from "./commandProcessor.js"
import { Slot, slotSchema } from "../api/types.js"

export const buildCommands = (): CommandObj<any>[] => {
  const commands: CommandObj<any>[] = []

  const emptySchema = z.tuple([])
  const nameSchema = z.tuple([ z.string() ])
  const moveSchema = z.tuple([ z.string(), z.coerce.number(), z.coerce.number() ]) // name, x, y
  const craftingScheme = z.tuple([ z.string(), z.string(), z.coerce.number() ])
  const equipScheme = z.tuple([ z.string(), z.string(), slotSchema, z.coerce.number().optional() ])
  const unequipScheme = z.tuple([ z.string(), slotSchema, z.coerce.number().optional() ])

  //
  // Administrative
  //

  commands.push(buildCommand(['exit', 'quit', 'q'], emptySchema, async (args: z.infer<typeof emptySchema>): Promise<ProcessCommandCode> => {
    return ProcessCommandCode.Quit
  }))

  //
  // Status
  //

  commands.push(buildCommand(['list'], emptySchema, async (args: z.infer<typeof emptySchema>): Promise<ProcessCommandCode> => {
    characterMap.forEach((_, k) => console.log(k));
    return ProcessCommandCode.Done
  }))
  commands.push(buildCommand(['stats'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    actions.printStats(args[0])
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
  commands.push(buildCommand(['craft'], craftingScheme, async (args: z.infer<typeof craftingScheme>): Promise<ProcessCommandCode> => {
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

  //
  // Macros
  //

  commands.push(buildCommand(['run-program'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    // Don't await so we can run other commands in the mean time.
    runProgram(args[0])
    return ProcessCommandCode.Done
  }))

  return commands
}