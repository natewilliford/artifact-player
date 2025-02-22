
enum Command {
  Quit,
  Move, 
  Fight,

}

const commands: { [key: string]: Command} = {
  "quit": Command.Quit,
  "exit": Command.Quit,
  "move": Command.Move,
  "fight": Command.Fight
}

export { Command, commands }