import { Character } from '../../gamestate/character.js'
import { items } from '../../gamestate/items.js'
import { locations } from '../../gamestate/locations.js'
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
  taskDoneTrigger,
} from '../triggers.js'
import { addCooldownNode } from './helpers.js'

export const buildYellowSlimeFightGraph = (c: Character): Graph => {
  const g = new Graph(c)

  const fightLocation = locations.yellowSlimes
  const foodType = items.consumables.cookedGudgeon
  const foodPickupAmount = 10
  const healBelow = c.characterSchema.max_hp - 50

  g.startingNode = buildNode('start', noop)
  g.addNode(g.startingNode)
  g.addEdge('start', 'move-fight', alwaysTrigger)

  g.buildAndAddNode('move-fight', moveOperation(c, fightLocation))
  addCooldownNode(g, 'move-fight', c)
  g.addEdge('move-fight', 'fight', atPositionTrigger(c, fightLocation))

  g.buildAndAddNode('fight', fightOperation(c))
  addCooldownNode(g, 'fight', c)
  g.addEdge('fight', 'heal', healthBelowTrigger(c, healBelow))
  g.addEdge('fight', 'end', taskDoneTrigger(c))

  g.addNode(buildNode('heal', useItemOperation(c, foodType, 1)))
  addCooldownNode(g, 'heal', c)
  g.addEdge('heal', 'move-bank', hasLessThanItemsTrigger(c, foodType, 1))
  g.addEdge('heal', 'fight', healthAboveTrigger(c, healBelow))

  g.buildAndAddNode('move-bank', moveOperation(c, locations.bank))
  addCooldownNode(g, 'move-bank', c)
  g.addEdge('move-bank', 'check-amount', atPositionTrigger(c, locations.bank))

  g.buildAndAddNode('check-amount', noop)
  g.addEdge(
    'check-amount',
    'wait',
    bankHasLessThanItems(c, foodType, foodPickupAmount)
  )
  g.addEdge(
    'check-amount',
    'withdraw',
    bankHasItemsTrigger(c, foodType, foodPickupAmount)
  )

  g.buildAndAddNode('wait', waitOperation(20))
  g.addEdge('wait', 'check-amount', alwaysTrigger)

  g.buildAndAddNode(
    'withdraw',
    withdrawOperation(c, foodType, foodPickupAmount)
  )
  addCooldownNode(g, 'withdraw', c)
  g.addEdge('withdraw', 'move-fight', hasItemsTrigger(c, foodType, 10))

  g.buildAndAddNode('end', noop)

  return g
}
