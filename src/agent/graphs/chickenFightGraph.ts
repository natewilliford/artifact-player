import { Character, Pos } from "../../gamestate/character.js";
import { cooldownOperation, fightOperation, moveOperation, noop, restOperation } from "../operations.js";
import { buildNode, Graph } from "../decisiongraph/graph.js";
import { alwaysTrigger, atPositionTrigger, cooldownDoneTrigger, fullHealthTrigger, hasCooldownTrigger, lowHealthTrigger, reachedLevelTrigger } from "../triggers.js";

type ChickenFightGraphParams = {
  character: Character
  fightLocation: Pos
  minHealth: number
  targetLevel: number
}

export const buildChickenFightGraph = (params: ChickenFightGraphParams): Graph => {
  const c = params.character
  const g = new Graph()

  // Nodes
  g.startingNode = buildNode("start",  noop)
  g.addNode(g.startingNode)

  // 1. Move to location
  g.buildAndAddNode("move", moveOperation(c, params.fightLocation))
  addCooldownNode(g, "move", c)

  // 2. Fight
  g.buildAndAddNode("fight", fightOperation(c))
  addCooldownNode(g, "fight", c)

  // 3. Heal
  g.addNode(buildNode("heal", restOperation(c)))
  addCooldownNode(g, "heal", c)

  // 4. End 
  g.addNode(buildNode("end", async () => {}))
  
  // Edges
  g.addEdge("start", "move", alwaysTrigger)
  g.addEdge("move", "fight", atPositionTrigger(c, params.fightLocation))
  g.addEdge("fight", "heal", lowHealthTrigger(c, params.minHealth))
  g.addEdge("heal", "fight", fullHealthTrigger(c))
  g.addEdge("fight", "end", reachedLevelTrigger(c, 2))

  return g
}

const addCooldownNode = (g: Graph, nodeId: string, c: Character) => {
  const cdNode = buildNode(nodeId + "-cooldown", cooldownOperation(c))
  g.addNode(cdNode)
  // Edge transfering to the cooldown node.
  g.addEdge(nodeId, cdNode.id, hasCooldownTrigger(c))
  // Edge transfering back to the normal node.
  g.addEdge(cdNode.id, nodeId, cooldownDoneTrigger(c))
}