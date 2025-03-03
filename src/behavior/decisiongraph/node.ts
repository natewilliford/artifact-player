import { Operation } from './types.js'

export interface Node {
  id: string
  doOperation: Operation
}

export const buildNode = (nodeId: string, op: Operation) => {
  return {
    id: nodeId,
    doOperation: op,
  }
}
