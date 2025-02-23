
enum Command {
  Quit,
  List,
  Move, 
  Fight,
  Rest,
}

const commandsMap: { [key: string]: Command} = {
  "quit": Command.Quit,
  "q": Command.Quit,
  "exit": Command.Quit,
  "list": Command.List,
  "move": Command.Move,
  "fight": Command.Fight,
  "rest": Command.Rest,
}

export { Command, commandsMap }