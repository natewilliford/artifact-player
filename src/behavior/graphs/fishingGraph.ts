import { Pos } from "../../gamestate/character.js"
import { localState } from "../../gamestate/localstate.js"
import { buildNode, Graph } from "../decisiongraph/graph.js"
import { craftOperation, depositOperation, gatherOperation, moveOperation, noop } from "../operations.js"
import { alwaysTrigger, atPositionTrigger, hasItemsTrigger, hasLessThanItemsTrigger } from "../triggers.js"
import { addCooldownNode } from "./helpers.js"

export const buildFishingGraph = (name: string): Graph => {
  const c = localState.getCharacter(name)
  
  const g = new Graph()

  const fishingLoc: Pos = {x: 4, y: 2}
  const cookingWorkshop: Pos = { x: 1, y: 1 }
  const bank: Pos = { x: 4, y: 1 }

  const batchCount = 5

  // Nodes
  g.startingNode = buildNode("start",  noop)
  g.addNode(g.startingNode)
  g.buildAndAddNode("move-fishing", moveOperation(c, fishingLoc))
  addCooldownNode(g, "move-fishing", c)
  g.buildAndAddNode("fish", gatherOperation(c))
  addCooldownNode(g, "fish", c)
  g.buildAndAddNode("move-cooking", moveOperation(c, cookingWorkshop))
  addCooldownNode(g, "move-cooking", c)
  g.buildAndAddNode("cook", craftOperation(c, "cooked_gudgeon", batchCount))
  addCooldownNode(g, "cook", c)
  g.buildAndAddNode("move-bank", moveOperation(c, bank))
  addCooldownNode(g, "move-bank", c)
  g.buildAndAddNode("deposit", depositOperation(c, "cooked_gudgeon", batchCount))
  addCooldownNode(g, "deposit", c)

  // Edges
  g.addEdge("start", "move-fishing", alwaysTrigger)
  g.addEdge("move-fishing", "fish", atPositionTrigger(c, fishingLoc))
  g.addEdge("fish", "move-cooking", hasItemsTrigger(c, "gudgeon", batchCount))
  g.addEdge("move-cooking", "cook", atPositionTrigger(c, cookingWorkshop))
  g.addEdge("cook", "move-bank", hasItemsTrigger(c, "cooked_gudgeon", batchCount))
  g.addEdge("move-bank", "deposit", atPositionTrigger(c, bank))
  g.addEdge("deposit", "move-fishing", hasLessThanItemsTrigger(c, "cooked_gudgeon", batchCount))

  return g
}

