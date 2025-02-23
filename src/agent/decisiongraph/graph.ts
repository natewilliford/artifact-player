type Edge = {
  shouldTrigger(): boolean
  fromNodeId: string
  toNodeId: string
}

type Node = {
  id: string
  doAction(): Promise<void>
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

  addEdge(e: Edge) {
    const existingFromNodeList = this.edges.get(e.fromNodeId)
    if (existingFromNodeList) {
      existingFromNodeList.push(e)
    } else {
      this.edges.set(e.fromNodeId, [e])
    }
  }
}

export { Edge, Node, Graph }