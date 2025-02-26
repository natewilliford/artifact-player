import { Character } from '../../gamestate/character.js'
import { buildNode, Graph } from '../decisiongraph/graph.js'
import {
  fightOperation,
  moveOperation,
  noop,
  useItemOperation,
  waitOperation,
  withdrawOperation,
} from '../operations.js'
import {
  alwaysTrigger,
  atPositionTrigger,
  bankHasItemsTrigger,
  bankHasLessThanItems,
  hasItemsTrigger,
  hasLessThanItemsTrigger,
  healthAboveTrigger,
  healthBelowTrigger,
} from '../triggers.js'
import { addCooldownNode } from './helpers.js'

export const buildChickenFightGraph = (c: Character): Graph => {
  const g = new Graph(c)

  const fightLocation = { x: 0, y: 1 }
  const bank = { x: 4, y: 1 }
  const foodCode = 'cooked_gudgeon'
  const foodAmount = 10
  const healBelow = c.characterSchema.max_hp - 70

  g.startingNode = buildNode('start', noop)
  g.addNode(g.startingNode)
  g.addEdge('start', 'move-fight', alwaysTrigger)

  g.buildAndAddNode('move-fight', moveOperation(c, fightLocation))
  addCooldownNode(g, 'move-fight', c)
  g.addEdge('move-fight', 'fight', atPositionTrigger(c, fightLocation))

  g.buildAndAddNode('fight', fightOperation(c))
  addCooldownNode(g, 'fight', c)
  g.addEdge('fight', 'heal', healthBelowTrigger(c, healBelow))

  g.addNode(buildNode('heal', useItemOperation(c, foodCode, 1)))
  addCooldownNode(g, 'heal', c)
  g.addEdge('heal', 'move-bank', hasLessThanItemsTrigger(c, foodCode, 1))
  g.addEdge('heal', 'fight', healthAboveTrigger(c, healBelow))

  g.buildAndAddNode('move-bank', moveOperation(c, bank))
  addCooldownNode(g, 'move-bank', c)
  g.addEdge('move-bank', 'check-amount', atPositionTrigger(c, bank))

  g.buildAndAddNode('check-amount', noop)
  g.addEdge(
    'check-amount',
    'wait',
    bankHasLessThanItems(c, foodCode, foodAmount)
  )
  g.addEdge(
    'check-amount',
    'withdraw',
    bankHasItemsTrigger(c, foodCode, foodAmount)
  )

  g.buildAndAddNode('wait', waitOperation(20))
  g.addEdge('wait', 'check-amount', alwaysTrigger)

  g.buildAndAddNode('withdraw', withdrawOperation(c, foodCode, foodAmount))
  addCooldownNode(g, 'withdraw', c)
  g.addEdge('withdraw', 'move-fight', hasItemsTrigger(c, foodCode, 10))

  return g
}
