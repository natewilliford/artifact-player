import { Character, Pos } from '../../gamestate/character.js'
import { buildNode, Graph } from '../decisiongraph/graph.js'
import {
  depositAllOperation,
  gatherOperation,
  moveOperation,
  noop,
} from '../operations.js'
import {
  alwaysTrigger,
  atPositionTrigger,
  hasItemsTrigger,
  hasLessThanItemsTrigger,
} from '../triggers.js'
import { addCooldownNode } from './helpers.js'

export type GatherGraphParams = {
  itemCode: string
  anciliaryItemCodes: string[]
  gatherLocation: Pos
  bank: Pos
  batchCount: number
}
export const buildGatherGraph = (c: Character, params: GatherGraphParams) => {
  const g = new Graph(c)

  g.startingNode = buildNode('start', noop)
  g.addNode(g.startingNode)
  g.addEdge('start', 'move-gather', alwaysTrigger)

  g.buildAndAddNode('move-gather', moveOperation(c, params.gatherLocation))
  addCooldownNode(g, 'move-gather', c)
  g.addEdge(
    'move-gather',
    'gather',
    atPositionTrigger(c, params.gatherLocation)
  )

  g.buildAndAddNode('gather', gatherOperation(c))
  addCooldownNode(g, 'gather', c)
  g.addEdge(
    'gather',
    'move-bank',
    hasItemsTrigger(c, params.itemCode, params.batchCount)
  )

  g.buildAndAddNode('move-bank', moveOperation(c, params.bank))
  addCooldownNode(g, 'move-bank', c)
  g.addEdge('move-bank', 'deposit', atPositionTrigger(c, params.bank))

  g.buildAndAddNode(
    'deposit',
    depositAllOperation(c, [params.itemCode, ...params.anciliaryItemCodes])
  )
  addCooldownNode(g, 'deposit', c)
  g.addEdge(
    'deposit',
    'move-gather',
    hasLessThanItemsTrigger(c, params.itemCode, params.batchCount)
  )

  return g
}
