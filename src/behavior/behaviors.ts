import { Character } from "../gamestate/character.js"
import { Graph } from "./decisiongraph/graph.js"
import { buildChickenFightGraph } from "./graphs/chickenFightGraph.js"
import { buildGatherWoodGraph } from "./graphs/collectWoodGraph.js"

export type BehaviorObj = {
  name: string
  buildGraph: (c: Character) => Graph
}

export const buildBehaviors = (): BehaviorObj[] => {
  const behaviors: BehaviorObj[] = []

  behaviors.push({
    name: "fight-chicken",
    buildGraph: (c: Character) => buildChickenFightGraph(c)
  })

  behaviors.push({
    name: "fishing",
    buildGraph: (c: Character) => buildChickenFightGraph(c)
  })

  behaviors.push({
    name: "gather-wood",
    buildGraph: (c: Character) => buildGatherWoodGraph({
        character: c,
        gatherLocation: { x: -1, y: 0 },
        gatherAmount: 10,
        gatherItemCode: "ash_wood"
      })
    })

  return behaviors
}

