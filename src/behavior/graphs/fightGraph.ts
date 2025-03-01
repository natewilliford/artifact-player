import { Character, Pos } from '../../gamestate/character.js'
import { buildNode, Graph } from '../decisiongraph/graph.js'
import {
  depositAllOperation,
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
  hasItemsTrigger,
  healthAboveTrigger,
  healthBelowTrigger,
  invert,
} from '../triggers.js'
import { addCooldownNode } from './helpers.js'

export type FightGraphParams = {
  fightLocation: Pos
  bank: Pos
  healAmount: number // Damage taken before healing. Heals at max_health - healAmount
  healItem: string
  healItemCount: number // Number of items to withdraw from bank.
  depositItems: string[] // trash to bank
}

export const buildFightGraph = (
  c: Character,
  params: FightGraphParams
): Graph => {
  const g = new Graph(c)
  const healBelow = c.characterSchema.max_hp - params.healAmount

  g.startingNode = buildNode('start', noop)
  g.addNode(g.startingNode)
  g.addEdge('start', 'move-fight', alwaysTrigger)

  g.buildAndAddNode('move-fight', moveOperation(c, params.fightLocation))
  addCooldownNode(g, 'move-fight', c)
  g.addEdge('move-fight', 'fight', atPositionTrigger(c, params.fightLocation))

  g.buildAndAddNode('fight', fightOperation(c))
  addCooldownNode(g, 'fight', c)
  g.addEdge('fight', 'heal', healthBelowTrigger(c, healBelow))
  g.addEdge(
    'fight',
    'move-fight',
    invert(atPositionTrigger(c, params.fightLocation))
  )

  g.addNode(buildNode('heal', useItemOperation(c, params.healItem, 1)))
  addCooldownNode(g, 'heal', c)
  g.addEdge('heal', 'move-bank', invert(hasItemsTrigger(c, params.healItem, 1)))
  g.addEdge('heal', 'fight', healthAboveTrigger(c, healBelow))

  g.buildAndAddNode('move-bank', moveOperation(c, params.bank))
  addCooldownNode(g, 'move-bank', c)

  if (params.depositItems.length > 0) {
    g.addEdge('move-bank', 'deposit', atPositionTrigger(c, params.bank))
    g.buildAndAddNode('deposit', depositAllOperation(c, params.depositItems))

    // For now just checking the first item for the trigger. Should work if the
    // first item is the most common drop or trips are frequent enough.
    g.addEdge(
      'deposit',
      'check-amount',
      invert(hasItemsTrigger(c, params.depositItems[0], 1))
    )
  } else {
    g.addEdge('move-bank', 'check-amount', atPositionTrigger(c, params.bank))
  }

  g.buildAndAddNode('check-amount', noop)
  g.addEdge(
    'check-amount',
    'wait',
    invert(bankHasItemsTrigger(c, params.healItem, params.healItemCount))
  )
  g.addEdge(
    'check-amount',
    'withdraw',
    bankHasItemsTrigger(c, params.healItem, params.healItemCount)
  )

  g.buildAndAddNode('wait', waitOperation(20))
  g.addEdge('wait', 'check-amount', alwaysTrigger)

  g.buildAndAddNode(
    'withdraw',
    withdrawOperation(c, params.healItem, params.healItemCount)
  )
  addCooldownNode(g, 'withdraw', c)
  g.addEdge(
    'withdraw',
    'move-fight',
    hasItemsTrigger(c, params.healItem, params.healItemCount)
  )

  return g
}
