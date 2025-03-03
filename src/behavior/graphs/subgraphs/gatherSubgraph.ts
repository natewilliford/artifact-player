import { Character, Pos } from '../../../gamestate/character.js'
import { buildNode, Graph } from '../../decisiongraph/graph.js'
import { gatherOperation, moveOperation, noop } from '../../operations.js'
import {
  alwaysTrigger,
  atPositionTrigger,
  hasItemsTrigger,
} from '../../triggers.js'
import { addCooldownNode } from '../helpers.js'

export type GatherSubgraphParams = {
  gatherLocation: Pos
  itemCode: string
  batchCount: number
}

export const buildGatherSubgraph = (
  c: Character,
  { gatherLocation, itemCode, batchCount }: GatherSubgraphParams
): Graph => {
  const g = new Graph(c)
  g.startingNode = buildNode('start', noop)

  g.addNode(g.startingNode)
  g.addEdge('start', 'move-gather', alwaysTrigger)

  g.buildAndAddNode('move-gather', moveOperation(c, gatherLocation))
  addCooldownNode(g, 'move-gather', c)
  g.addEdge('move-gather', 'gather', atPositionTrigger(c, gatherLocation))

  g.buildAndAddNode('gather', gatherOperation(c))
  addCooldownNode(g, 'gather', c)
  g.addEdge('gather', 'end', hasItemsTrigger(c, itemCode, batchCount))

  g.buildAndAddNode('end', noop)

  return g
}
