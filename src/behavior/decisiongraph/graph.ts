import actions from '../../actions/actions.js'
import { Character } from '../../gamestate/character.js'

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

enum NodeState {
  CheckTriggers,
  Run,
  Error,
  Finishing,
}

const buildNode = (nodeId: string, op: Operation) => {
  return {
    id: nodeId,
    doOperation: op,
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

  // Character for logging. Ops should have their own ref.
  character: Character
  runningPromise?: Promise<void>
  onEndCallback?: () => void

  running = true
  node?: Node
  nodeState: NodeState = NodeState.CheckTriggers

  constructor(c: Character) {
    this.character = c
  }

  addNode(n: Node) {
    if (this.nodes.get(n.id)) {
      throw new Error('Graph already contains node with id: ' + n.id)
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
      shouldTrigger: condition,
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
    console.log('Trying to resolve error by reloading.')
    return await actions.load()
  }

  // Returns imediately, but graph runs async.
  runGraph() {
    this.running = true
    this.nodeState = NodeState.CheckTriggers // The first stage.
    this.runningPromise = this.doRunGraph()
  }

  async doRunGraph() {
    this.node = this.startingNode

    while (this.running && this.nodeState !== NodeState.Finishing) {
      if (!this.node) {
        console.warn(`Null node.`)
        break
      }
      if (this.node.id === 'end') {
        console.log('Reached end node')
        break
      }

      switch (this.nodeState) {
        case NodeState.CheckTriggers:
          await this.handleCheckTriggersState()
          break
        case NodeState.Run:
          await this.handleRunState()
          break
        case NodeState.Error:
          await this.handleErrorState()
          break
      }
    }
    if (this.onEndCallback) {
      this.onEndCallback()
    }
  }

  async handleCheckTriggersState() {
    if (!this.node) return

    console.log('Check trigger state')

    const edges = this.edges.get(this.node.id)
    if (!edges || edges.length === 0) {
      console.warn(`Node ${this.node?.id} has no edges. Finishing.`)
      this.nodeState = NodeState.Finishing
      return
    }

    for (let i = 0; i < edges.length; i++) {
      let e = edges[i]
      if (e.shouldTrigger()) {
        console.log(
          `${this.character.getName()}: ${e.fromNodeId} -> ${e.toNodeId}`
        )
        this.node = this.nodes.get(e.toNodeId)
        // Stay in trigger state.
        return
      }
    }
    this.nodeState = NodeState.Run
  }

  async handleRunState() {
    if (!this.node) return

    console.log('Run state')
    const opError = await this.node.doOperation()
    if (opError) {
      this.nodeState = NodeState.Error
      if (this.operationError) {
        console.log('Multiple errors. Killing graph.')
        this.nodeState = NodeState.Finishing
      }

      this.operationError = {
        error: opError,
        node: this.node.id,
      }
      return
    }
    this.operationError = undefined
    this.nodeState = NodeState.CheckTriggers
  }

  async handleErrorState() {
    console.log('Error state')

    const newError = await this.resolveError()
    if (newError) {
      console.log('Error trying to fix error. Killing graph.')
      this.nodeState = NodeState.Finishing
    } else {
      this.nodeState = NodeState.CheckTriggers
    }
  }

  async stop(): Promise<void> {
    this.running = false
    if (this.runningPromise) {
      await this.runningPromise
    }
    return
  }

  setOnEnd(callback: () => void) {
    this.onEndCallback = callback
  }
}

export { buildNode, Graph, Node, Operation, Trigger }
