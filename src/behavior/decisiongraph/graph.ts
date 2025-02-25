import actions from "../../actions/actions.js"

type Trigger = () => boolean
type Operation = () => Promise<Maybe<Error>>

type Edge = {
  shouldTrigger: Trigger
  fromNodeId: string
  toNodeId: string
}

type Node = {
  id: string
  doOperation: Operation
}

const buildNode = (nodeId: string, op: Operation) => {
  return {
    id: nodeId,
    doOperation: op
  }
}

class Graph {
  startingNode?: Node

  // Nodes indexed on node id
  nodes: Map<string, Node> = new Map()

  // Edges indexed on the from node id.
  edges: Map<string, Edge[]> = new Map()

  operationError?: {
    error: Error
    node: string
  }
  
  addNode(n: Node) {
    if (this.nodes.get(n.id)) {
      throw new Error("Graph already contains node with id: " + n.id)
    }
    this.nodes.set(n.id, n)
  }

  buildAndAddNode(nodeId: string, op: Operation) {
    this.addNode(buildNode(nodeId, op))
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

  async resolveError(): Promise<Maybe<Error>> {
    // TODO: Make this configurable?
    console.log("Trying to resolve error by reloading.")
    return await actions.load()
  }

  async runGraph() {
    let running = true
    let node = this.startingNode
    while(running) {  
      if (!node) {
        console.warn(`Null node.`)
        break
      }

      if (this.operationError) {
        const newError = await this.resolveError()
        if (newError) {
          console.log("Couldn't resolve error. Killing graph.")
          running = false
        } else {
          this.operationError = undefined
        }
        continue
      }

      console.log("Current node: " + node.id)
      if (node.id === "end") {
        console.log("We are at the end node.")
        running = false
        continue
      }

      console.log("Checking triggers.")
      const edges = this.edges.get(node.id)
      if (!edges || edges.length === 0) {
        console.warn(`Node ${node.id} has no edges. Finishing.`)
        running = false
        continue
      }
      // Reset the loop (can't just call continue in the inner for loop).
      let shouldContinue = false
      for (let i = 0; i < edges.length; i++) {
        let e = edges[i]
        if (e.shouldTrigger()) {
          console.log(`Triggered edge from ${e.fromNodeId} to ${e.toNodeId}`)
          node = this.nodes.get(e.toNodeId)
          if (!node) {
            console.warn(`Null node with id ${e.toNodeId}`)
            running = false
            break
          }
          shouldContinue = true
          break
        }
      }
      if (shouldContinue) continue

      if (node) {
        console.log(`Doing operation for node ${node.id}`)
        const opError = await node.doOperation()
        if (opError) {
          this.operationError = {
            error: opError,
            node: node.id
          }
        } else {
          console.log("Operation done")
        }
      }
    }
  }
}

export { Trigger, Operation, Node, buildNode, Graph }