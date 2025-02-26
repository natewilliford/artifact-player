import { Character, Pos } from '../../gamestate/character.js'
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
  hasLessThanItemsTrigger,
  taskDoneTrigger,
} from '../triggers.js'
import { addCooldownNode } from './helpers.js'

export const buildGatherWoodGraph = (c: Character): Graph => {
  const loc: Pos = { x: 6, y: 1 }

  const g = new Graph(c)
  const batchCount = 20

  // Nodes
  g.startingNode = buildNode('start', noop)
  g.addNode(g.startingNode)
  g.addEdge('start', 'move-forest', alwaysTrigger)

  g.buildAndAddNode('move-forest', moveOperation(c, loc))
  addCooldownNode(g, 'move-forest', c)
  g.addEdge('move-forest', 'gather', atPositionTrigger(c, loc))

  g.buildAndAddNode('gather', gatherOperation(c))
  addCooldownNode(g, 'gather', c)
  g.addEdge(
    'gather',
    'move-bank',
    hasItemsTrigger(c, items.resources.ashWood, batchCount)
  )

  g.buildAndAddNode('move-bank', moveOperation(c, locations.bank))
  addCooldownNode(g, 'move-bank', c)
  g.addEdge('move-bank', 'deposit', atPositionTrigger(c, locations.bank))

  g.buildAndAddNode(
    'deposit',
    depositAllOperation(c, [items.resources.ashWood, items.resources.sap])
  )
  addCooldownNode(g, 'deposit', c)
  g.addEdge('deposit', 'end', taskDoneTrigger(c))
  g.addEdge(
    'deposit',
    'move-forest',
    hasLessThanItemsTrigger(c, items.resources.ashWood, batchCount)
  )

  g.buildAndAddNode('end', noop)

  return g
}
