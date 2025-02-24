import { ZodSchema } from "zod"

enum ProcessCommandCode {
  Done,
  Unrecognized,
  Quit
}

interface CommandObj<T> {
  commandNames: string[] // Valid ways of calling. 
  argsSchema: ZodSchema
  commandOperation: (args: T) => Promise<ProcessCommandCode>
}
const buildCommand = <T>(names: string[], argsSchema: ZodSchema, op: (args: T) => Promise<ProcessCommandCode>): CommandObj<T> => {
    return {
      commandNames: names,
      argsSchema,
      commandOperation: op
    }
}

class CommandProcessor {
  commandMap = new Map<string, CommandObj<any>>()

  constructor(commands: CommandObj<any>[]) {
    commands.forEach(c => this.addCommand(c))
  }
  
  addCommand<T>(command: CommandObj<T>) {
    command.commandNames.forEach(name => {
      if (this.commandMap.get(name)) {
        throw new Error("Command already exists with name: " + name)
      }
      this.commandMap.set(name, command)
    })
  }

  async runCommand(input: string): Promise<ProcessCommandCode> {
    const parts = input.split(' ').filter(p => p.length > 0)
    const name = parts[0]
    const args = parts.slice(1)
    
    const com = this.commandMap.get(name)
    if(!com) {
      console.warn(`No command with name: ${name}`)
      return ProcessCommandCode.Unrecognized
    }
    
    const parseResults = com.argsSchema.safeParse(args)
    if (parseResults.success) {
      console.log(parseResults.data)
      return await com.commandOperation(parseResults.data)
    } else {
      parseResults.error.issues.forEach(iss => {
        console.warn(`${iss.message} - arg: ${iss.path}`)
      })
      return ProcessCommandCode.Unrecognized
    }
  }
}

export { buildCommand, CommandObj, CommandProcessor, ProcessCommandCode }
