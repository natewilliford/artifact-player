
import { Graph } from "./decisiongraph/graph.js"

export const runGraph = async (graph: Graph) => {
  let running = true
  let node = graph.startingNode
  while(running) {  
    if (!node) {
      console.warn(`Null node.`)
      break
    }
    console.log("Current node: " + node.id)
    if (node.id === "end") {
      console.log("We are at the end node.")
      running = false
      continue
    }

    console.log("Checking triggers.")
    const edges = graph.edges.get(node.id)
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
        node = graph.nodes.get(e.toNodeId)
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

    console.log(`Doing operation for node ${node?.id}`)
    await node?.doOperation()
    console.log("Operation done")
  }
}
