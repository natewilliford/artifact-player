import { Character } from "../../gamestate/character.js";
import { buildNode, Graph } from "../decisiongraph/graph.js";
import { fightOperation, moveOperation, noop, useItemOperation, waitOperation, withdrawOperation } from "../operations.js";
import { alwaysTrigger, atPositionTrigger, bankHasItemsTrigger, bankHasLessThanItems, hasItemsTrigger, hasLessThanItemsTrigger, healthAboveTrigger, healthBelowTrigger } from "../triggers.js";
import { addCooldownNode } from "./helpers.js";

export const buildChickenFightGraph = (c: Character): Graph => {
  const g = new Graph()

  const fightLocation = {x: 0, y: 1}
  const bank = { x: 4, y: 1 }
  const foodCode = "cooked_gudgeon"
  const foodAmount = 10
  const healBelow = c.characterSchema.max_hp - 70

  // Nodes
  g.startingNode = buildNode("start", noop)
  g.addNode(g.startingNode)
  g.buildAndAddNode("move-fight", moveOperation(c, fightLocation))
  addCooldownNode(g, "move-fight", c)
  g.buildAndAddNode("fight", fightOperation(c))
  addCooldownNode(g, "fight", c)
  g.addNode(buildNode("heal", useItemOperation(c, foodCode, 1)))
  addCooldownNode(g, "heal", c)
  g.buildAndAddNode("move-bank", moveOperation(c, bank))
  addCooldownNode(g, "move-bank", c)
  g.buildAndAddNode("check-amount", noop)
  g.buildAndAddNode("wait", waitOperation(20))
  g.buildAndAddNode("withdraw", withdrawOperation(c, foodCode, foodAmount))
  addCooldownNode(g, "withdraw", c)
  
  // Edges
  g.addEdge("start", "move-fight", alwaysTrigger)
  g.addEdge("move-fight", "fight", atPositionTrigger(c, fightLocation))
  g.addEdge("fight", "heal", healthBelowTrigger(c, healBelow))
  g.addEdge("heal", "move-bank", hasLessThanItemsTrigger(c, foodCode, 1))
  g.addEdge("heal", "fight", healthAboveTrigger(c, healBelow))
  g.addEdge("move-bank", "check-amount", atPositionTrigger(c, bank))
  g.addEdge("check-amount", "wait", bankHasLessThanItems(c, foodCode, foodAmount))
  g.addEdge("check-amount", "withdraw", bankHasItemsTrigger(c, foodCode, foodAmount))
  g.addEdge("withdraw", "move-fight", hasItemsTrigger(c, foodCode, 10))

  // g.addEdge("fight", "end", reachedLevelTrigger(c, 2))

  return g
}

