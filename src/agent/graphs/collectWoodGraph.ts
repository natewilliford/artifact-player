import { Character, Pos } from "../../gamestate/character.js";
import { buildNode, Graph } from "../decisiongraph/graph.js";
import { moveOperation, noop } from "../operations.js";
import { addCooldownNode } from "./helpers.js";

type CollectWoodGraphParams = {
  character: Character,
  location: Pos
}

export const buildCollectWoodGraph = (params: CollectWoodGraphParams): Graph => {
  const c = params.character
  const g = new Graph()

    // Nodes
    g.startingNode = buildNode("start",  noop)
    g.addNode(g.startingNode)
  
    // 1. Move to location
    g.buildAndAddNode("move", moveOperation(c, params.location))
    addCooldownNode(g, "move", c)

    // 2. Collect resources
    

    // 3. Done

  return g
}