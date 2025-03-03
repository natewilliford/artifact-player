import { Graph } from './graph.js'
import { Node } from './node.js'

export interface GraphNode extends Node {
  graph: Graph
}

export const isGraphNode = (n: Node): n is GraphNode => {
  return 'graph' in n
}

export const buildGraphNode = (id: string, subGraph: Graph): GraphNode => {
  return {
    id,
    doOperation: async (): Promise<Maybe<Error>> => {
      // TODO: have subgraph return error
      await subGraph.runGraph()
      return
    },
    graph: subGraph,
  }
}
