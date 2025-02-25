import { Character, Pos } from "../../gamestate/character.js";
import { buildNode, Graph } from "../decisiongraph/graph.js";
import { gatherOperation, moveOperation, noop } from "../operations.js";
import { alwaysTrigger, atPositionTrigger, hasItemsTrigger } from "../triggers.js";
import { addCooldownNode } from "./helpers.js";

type CollectWoodGraphParams = {
  character: Character,
  gatherLocation: Pos,
  gatherItemCode: string,
  gatherAmount: number
  // bankLocation: Pos,
}

export const buildGatherWoodGraph = (params: CollectWoodGraphParams): Graph => {
  const c = params.character
  const g = new Graph()

  // Nodes
  g.startingNode = buildNode("start",  noop)
  g.addNode(g.startingNode)

  // 1. Move to location
  g.buildAndAddNode("move", moveOperation(c, params.gatherLocation))
  addCooldownNode(g, "move", c)

  // 2. Collect resources
  g.buildAndAddNode("gather", gatherOperation(c))
  addCooldownNode(g, "gather", c)

  // 3. Done
  g.buildAndAddNode("end",  noop)

  // Edges
  g.addEdge("start", "move", alwaysTrigger)
  g.addEdge("move", "gather", atPositionTrigger(c, params.gatherLocation))
  g.addEdge("gather", "end", hasItemsTrigger(c, params.gatherItemCode, params.gatherAmount))

  return g
}