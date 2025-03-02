import { Character } from '../../gamestate/character.js'
import { items } from '../../gamestate/items.js'
import { locations } from '../../gamestate/locations.js'
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
  invert,
  runCountTrigger,
} from '../triggers.js'
import { addCooldownNode } from './helpers.js'
import { GraphNode } from './types.js'

export const buildSuperGraph = (c: Character): Graph => {
  const params = {
    gatherLocation: { x: 6, y: 1 },
    bank: locations.bank,
    batchCount: 3,
    itemCode: items.resources.ashWood,
    anciliaryItemCodes: [items.resources.sap],
  }
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
    'deposit-subgraph',
    hasItemsTrigger(c, params.itemCode, params.batchCount)
  )

  const subGraph = buildSubGraph(c, params)
  g.addNode({
    id: 'deposit-subgraph',
    doOperation: async (): Promise<Maybe<Error>> => {
      // TODO: have subgraph return error
      await subGraph.runGraph()
      return
    },
    graph: subGraph,
  } as GraphNode)
  g.addEdge('deposit-subgraph', 'move-gather', runCountTrigger(1))

  return g
}

const buildSubGraph = (c: Character, params: any): Graph => {
  const g = new Graph(c)

  g.startingNode = buildNode('start', noop)
  g.addNode(g.startingNode)
  g.addEdge('start', 'move-bank', alwaysTrigger)

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
    'end',
    invert(hasItemsTrigger(c, params.itemCode, params.batchCount))
  )

  g.buildAndAddNode('end', noop)

  return g
}
