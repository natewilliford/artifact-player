import { Character, Pos } from '../../../gamestate/character.js'
import { buildNode, Graph } from '../../decisiongraph/graph.js'
import { depositOperation, moveOperation, noop } from '../../operations.js'
import {
  alwaysTrigger,
  atPositionTrigger,
  hasItemsTrigger,
  invert,
} from '../../triggers.js'
import { addCooldownNode } from '../helpers.js'

export type BankDepositSubgraphParams = {
  bank: Pos
  itemCodes: string[]
}

export const buildBankDepositSubgraph = (
  c: Character,
  params: BankDepositSubgraphParams
): Graph => {
  const g = new Graph(c)

  g.startingNode = buildNode('start', noop)
  g.addNode(g.startingNode)
  g.addEdge('start', 'move-bank', alwaysTrigger)

  g.buildAndAddNode('move-bank', moveOperation(c, params.bank))
  addCooldownNode(g, 'move-bank', c)

  const depositNodesStart = buildItemsDeposits(g, c, params.itemCodes, 'end')
  g.addEdge('move-bank', depositNodesStart, atPositionTrigger(c, params.bank))

  g.buildAndAddNode('end', noop)

  return g
}

const buildItemsDeposits = (
  g: Graph,
  c: Character,
  itemCodes: string[],
  nextNode: string
): string => {
  const entries = itemCodes.map((ic) => ({
    itemCode: ic,
    nodeId: `deposit-${ic}`,
  }))

  entries.forEach((e, i) => {
    g.buildAndAddNode(e.nodeId, depositOperation(c, e.itemCode))
    addCooldownNode(g, e.nodeId, c)

    // Build the edge to the next node. If last, go to the next node given.
    const nextNodeId =
      i == entries.length - 1 ? nextNode : entries[i + 1].nodeId
    g.addEdge(e.nodeId, nextNodeId, invert(hasItemsTrigger(c, e.itemCode, 1)))
  })

  return entries.length > 0 ? entries[0].nodeId : ''
}
