import { Graph } from '../decisiongraph/graph.js'

export type TriggerParams = {
  currentNodeRunCount: number
}
export type Trigger = (params: TriggerParams) => boolean

export type Operation = () => Promise<Maybe<Error>>

export type Edge = {
  shouldTrigger: Trigger
  fromNodeId: string
  toNodeId: string
}

export interface Node {
  id: string
  doOperation: Operation
}

export interface GraphNode extends Node {
  graph: Graph
}
