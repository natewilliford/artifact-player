import { z } from "zod"
import actions from "../actions/actions.js"
import { runGraph } from "../agent/agent.js"
import { buildChickenFightGraph } from "../agent/graphs/chickenFightGraph.js"
import { buildGatherWoodGraph } from "../agent/graphs/collectWoodGraph.js"
import { slotSchema } from "../api/types.js"
import { Character } from "../gamestate/character.js"
import { characterMap, characters } from "../gamestate/characters.js"
import { buildCommand, CommandObj, ProcessCommandCode } from "./commandProcessor.js"

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

  commands.push(buildCommand(['run-chicken-fight'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    const c: Character = characters.getCharacter(args[0])
    if (!c) {
      throw new Error("Character not found.")
    }
  
    const graph = buildChickenFightGraph({
      character: c,
      fightLocation: {
        x: 0,
        y: 1
      },
      minHealth: 0.5,
      targetLevel: 2
    })
  
    // Don't await so we can run other commands in the mean time.
    runGraph(graph)
    return ProcessCommandCode.Done
  }))

  commands.push(buildCommand(['run-gather-wood'], nameSchema, async (args: z.infer<typeof nameSchema>): Promise<ProcessCommandCode> => {
    const c: Character = characters.getCharacter(args[0])
    if (!c) {
      throw new Error("Character not found.")
    }
  
    const graph = buildGatherWoodGraph({
      character: c,
      gatherLocation: { x: -1, y: 0 },
      gatherAmount: 10,
      gatherItemCode: "ash_wood"
    })
  
    // Don't await so we can run other commands in the mean time.
    runGraph(graph)
    return ProcessCommandCode.Done
  }))

  return commands
}