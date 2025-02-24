import { Pos } from "../../gamestate/character.js"
import { characters } from "../../gamestate/characters.js"
import { buildNode, Graph } from "../decisiongraph/graph.js"
import { gatherOperation, moveOperation, noop } from "../operations.js"
import { alwaysTrigger, atPositionTrigger } from "../triggers.js"
import { addCooldownNode } from "./helpers.js"

export const buildFishingGraph = (name: string): Graph => {
  const c = characters.getCharacter(name)
  
  const g = new Graph()

  const fishingLoc: Pos = {x: 4, y: 2}

  // Nodes
  g.startingNode = buildNode("start",  noop)
  g.addNode(g.startingNode)
  g.buildAndAddNode("move", moveOperation(c, fishingLoc))
  addCooldownNode(g, "move", c)
  g.buildAndAddNode("fish", gatherOperation(c))
  addCooldownNode(g, "fish", c)
  
  // Edges
  g.addEdge("start", "move", alwaysTrigger)
  g.addEdge("move", "fish", atPositionTrigger(c, fishingLoc))
  // g.addEdge("fight", "end", reachedLevelTrigger(c, 2))

  return g
}

