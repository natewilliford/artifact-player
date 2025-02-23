import { Character } from "../../gamestate/character.js"
import { buildNode, Graph } from "../decisiongraph/graph.js"
import { cooldownOperation } from "../operations.js"
import { cooldownDoneTrigger, hasCooldownTrigger } from "../triggers.js"

export const addCooldownNode = (g: Graph, nodeId: string, c: Character) => {
  const cdNode = buildNode(nodeId + "-cooldown", cooldownOperation(c))
  g.addNode(cdNode)
  // Edge transfering to the cooldown node.
  g.addEdge(nodeId, cdNode.id, hasCooldownTrigger(c))
  // Edge transfering back to the normal node.
  g.addEdge(cdNode.id, nodeId, cooldownDoneTrigger(c))
}