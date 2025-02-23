type Trigger = (() => boolean)
type Action = () => Promise<void>

type Edge = {
  shouldTrigger: Trigger
  fromNodeId: string
  toNodeId: string
}

type Node = {
  id: string
  doAction: Action
}

const buildNode = (nodeId: string, action: Action) => {
  return {
    id: nodeId,
    doAction: action
  }
}

class Graph {
  startingNode: Node

  // Nodes indexed on node id
  nodes: Map<string, Node> = new Map()

  // Edges indexed on the from node id.
  edges: Map<string, Edge[]> = new Map()

  addNode(n: Node) {
    if (this.nodes.get(n.id)) {
      throw new Error("Graph already contains node with id: " + n.id)
    }
    this.nodes.set(n.id, n)
  }

  buildAndAddNode(nodeId: string, action: Action) {
    this.addNode(buildNode(nodeId, action))
  }

  addEdge(fromNode: string, toNode: string, condition: () => boolean) {
    const e: Edge = {
      fromNodeId: fromNode,
      toNodeId: toNode,
      shouldTrigger: condition
    }
    const existingFromNodeList = this.edges.get(e.fromNodeId)
    if (existingFromNodeList) {
      existingFromNodeList.push(e)
    } else {
      this.edges.set(e.fromNodeId, [e])
    }
  }
}

export { Trigger, Action, Node, buildNode, Graph }