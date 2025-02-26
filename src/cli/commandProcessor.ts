import { z, ZodSchema } from 'zod'
import { Character } from '../gamestate/character.js'

export enum ProcessCommandCode {
  Done,
  Unrecognized,
  Quit,
}

export type CommandObj<T> = {
  commandNames: string[] // Valid ways of calling.
  argsSchema: ZodSchema
  commandOperation: (args: T) => Promise<void>
}

export const buildCommand = <T>(
  names: string[],
  argsSchema: ZodSchema,
  op: (args: T) => Promise<void>
): CommandObj<T> => {
  return {
    commandNames: names,
    argsSchema,
    commandOperation: op,
  }
}

export class CommandProcessor {
  commandMap = new Map<string, CommandObj<any>>()
  constructor(commands: CommandObj<any>[]) {
    commands.forEach((c) => this.addCommand(c))
  }

  addCommand<T>(command: CommandObj<T>) {
    command.commandNames.forEach((name) => {
      if (this.commandMap.get(name)) {
        throw new Error('Command already exists with name: ' + name)
      }
      this.commandMap.set(name, command)
    })
  }

  async runCommand(input: string): Promise<ProcessCommandCode> {
    const parts = input.split(' ').filter((p) => p.length > 0)
    const name = parts[0]
    const args = parts.slice(1)

    const com = this.commandMap.get(name)
    if (!com) {
      console.warn(`No command with name: ${name}`)
      return ProcessCommandCode.Unrecognized
    }

    const parseResults = com.argsSchema.safeParse(args)
    if (parseResults.success) {
      try {
        await com.commandOperation(parseResults.data)
        return ProcessCommandCode.Done
      } catch (err) {
        if (err instanceof QuitError) {
          return ProcessCommandCode.Quit
        }
        console.warn(err)
        return ProcessCommandCode.Done
      }
    } else {
      parseResults.error.issues.forEach((iss) => {
        console.warn(`${iss.message} - arg: ${iss.path}`)
      })
      return ProcessCommandCode.Unrecognized
    }
  }
}

export class QuitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QuitError'
  }
}
