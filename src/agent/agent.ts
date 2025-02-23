
import { Character } from "../gamestate/character.js"
import { characters } from "../gamestate/characters.js"
import { Graph } from "./decisiongraph/graph.js"
import { buildChickenFightGraph } from "./graphs/chickenFightGraph.js"

const runProgram = async (name: string) => {
  const c: Character = characters.getCharacter(name)
  if (!c) {
    throw new Error("Character not found.")
  }

  const graph = buildChickenFightGraph({
    character: c,
    fightLocation: {
      x: 0,
      y: 1
    },
    minHealth: 0.5,
    targetLevel: 2
  })

  await runGraph(graph)
}

const runGraph = async (graph: Graph) => {
  let running = true
  let node = graph.startingNode
  while(running) {
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
        }
        shouldContinue = true
        break
      }
    }
    if (shouldContinue) continue

    console.log(`Doing action for node ${node.id}`)
    await node.doAction()
    console.log("Action done")
  }
}

export { runProgram }
