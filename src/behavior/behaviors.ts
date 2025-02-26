import { Character } from '../gamestate/character.js'
import { Graph } from './decisiongraph/graph.js'
import { buildChickenFightGraph } from './graphs/chickenFightGraph.js'
import { buildGatherWoodGraph } from './graphs/collectWoodGraph.js'
import { buildFishingGraph } from './graphs/fishingGraph.js'
import { buildYellowSlimeFightGraph } from './graphs/yellowSlimeTaskGraph.js'

export type BehaviorObj = {
  name: string
  buildGraph: (c: Character) => Graph
}

export const buildBehaviors = (): BehaviorObj[] => {
  const behaviors: BehaviorObj[] = []

  behaviors.push({
    name: 'fight-chickens',
    buildGraph: (c: Character) => buildChickenFightGraph(c),
  })

  behaviors.push({
    name: 'fishing',
    buildGraph: (c: Character) => buildFishingGraph(c),
  })

  behaviors.push({
    name: 'gather-wood',
    buildGraph: (c: Character) => buildGatherWoodGraph(c),
  })

  behaviors.push({
    name: 'fight-yellow-slimes',
    buildGraph: (c: Character) => buildYellowSlimeFightGraph(c),
  })

  return behaviors
}
