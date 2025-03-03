import { Character, Pos } from '../../gamestate/character.js'
import { buildNode, Graph } from '../decisiongraph/graph.js'
import { buildGraphNode } from '../decisiongraph/graphNode.js'
import { noop } from '../operations.js'
import { alwaysTrigger, runCountTrigger } from '../triggers.js'
import { buildBankDepositSubgraph } from './subgraphs/bankDepositSubgraph.js'
import { buildGatherSubgraph } from './subgraphs/gatherSubgraph.js'

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
  g.addEdge('start', 'gather-subgraph', alwaysTrigger)

  g.addNode(buildGraphNode('gather-subgraph', buildGatherSubgraph(c, params)))
  g.addEdge('gather-subgraph', 'deposit-subgraph', runCountTrigger(1))

  g.addNode(
    buildGraphNode(
      'deposit-subgraph',
      buildBankDepositSubgraph(c, {
        bank: params.bank,
        itemCodes: [params.itemCode, ...params.anciliaryItemCodes],
      })
    )
  )
  g.addEdge('deposit-subgraph', 'gather-subgraph', runCountTrigger(1))

  return g
}
