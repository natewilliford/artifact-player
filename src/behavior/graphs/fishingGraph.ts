import { Character, Pos } from '../../gamestate/character.js'
import { buildNode, Graph } from '../decisiongraph/graph.js'
import {
  craftOperation,
  depositOperation,
  gatherOperation,
  moveOperation,
  noop,
} from '../operations.js'
import {
  alwaysTrigger,
  atPositionTrigger,
  hasItemsTrigger,
  invert,
} from '../triggers.js'
import { addCooldownNode } from './helpers.js'

export const buildFishingGraph = (c: Character): Graph => {
  const g = new Graph(c)

  const fishingLoc: Pos = { x: 4, y: 2 }
  const cookingWorkshop: Pos = { x: 1, y: 1 }
  const bank: Pos = { x: 4, y: 1 }
  const batchCount = 20

  g.startingNode = buildNode('start', noop)
  g.addNode(g.startingNode)
  g.addEdge('start', 'move-fishing', alwaysTrigger)

  g.buildAndAddNode('move-fishing', moveOperation(c, fishingLoc))
  addCooldownNode(g, 'move-fishing', c)
  g.addEdge('move-fishing', 'fish', atPositionTrigger(c, fishingLoc))

  g.buildAndAddNode('fish', gatherOperation(c))
  addCooldownNode(g, 'fish', c)
  g.addEdge('fish', 'move-cooking', hasItemsTrigger(c, 'gudgeon', batchCount))

  g.buildAndAddNode('move-cooking', moveOperation(c, cookingWorkshop))
  addCooldownNode(g, 'move-cooking', c)
  g.addEdge('move-cooking', 'cook', atPositionTrigger(c, cookingWorkshop))

  g.buildAndAddNode('cook', craftOperation(c, 'cooked_gudgeon', batchCount))
  addCooldownNode(g, 'cook', c)
  g.addEdge(
    'cook',
    'move-bank',
    hasItemsTrigger(c, 'cooked_gudgeon', batchCount)
  )

  g.buildAndAddNode('move-bank', moveOperation(c, bank))
  addCooldownNode(g, 'move-bank', c)
  g.addEdge('move-bank', 'deposit', atPositionTrigger(c, bank))

  g.buildAndAddNode(
    'deposit',
    depositOperation(c, 'cooked_gudgeon', batchCount)
  )
  addCooldownNode(g, 'deposit', c)
  g.addEdge(
    'deposit',
    'move-fishing',
    invert(hasItemsTrigger(c, 'cooked_gudgeon', batchCount))
  )

  return g
}
