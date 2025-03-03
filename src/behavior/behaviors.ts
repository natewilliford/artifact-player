import { Character } from '../gamestate/character.js'
import { items } from '../gamestate/items.js'
import { locations } from '../gamestate/locations.js'
import { Graph } from './decisiongraph/graph.js'
import { buildFightGraph } from './graphs/fightGraph.js'
import { buildFishingGraph } from './graphs/fishingGraph.js'
import { buildGatherGraph } from './graphs/gatherGraph.js'

export type BehaviorObj = {
  name: string
  buildGraph: (c: Character) => Graph
}

export const buildBehaviors = (): BehaviorObj[] => {
  const behaviors: BehaviorObj[] = []

  behaviors.push({
    name: 'fight-chickens',
    buildGraph: (c: Character) =>
      buildFightGraph(c, {
        bank: locations.bank,
        fightLocation: locations.chickens,
        healAmount: 70,
        depositItems: [
          items.resources.rawChicken,
          items.resources.feather,
          items.resources.egg,
          items.resources.goldenEgg,
        ],
        healItem: items.consumables.cookedGudgeon,
        healItemCount: 20,
      }),
  })

  behaviors.push({
    name: 'fishing',
    buildGraph: (c: Character) => buildFishingGraph(c),
  })

  behaviors.push({
    name: 'gather-wood',
    buildGraph: (c: Character) =>
      buildGatherGraph(c, {
        itemCode: items.resources.ashWood,
        anciliaryItemCodes: [items.resources.sap],
        gatherLocation: locations.ashWood2,
        bank: locations.bank,
        batchCount: 3,
      }),
  })

  behaviors.push({
    name: 'gather-copper',
    buildGraph: (c: Character) =>
      buildGatherGraph(c, {
        itemCode: 'copper_ore',
        anciliaryItemCodes: [],
        gatherLocation: { x: 2, y: 0 },
        bank: locations.bank,
        batchCount: 20,
      }),
  })

  behaviors.push({
    name: 'fight-yellow-slimes',
    buildGraph: (c: Character) =>
      buildFightGraph(c, {
        bank: locations.bank,
        fightLocation: locations.yellowSlimes,
        healAmount: 50,
        depositItems: [items.resources.yellowSlimeball, items.resources.apple],
        healItem: items.consumables.cookedGudgeon,
        healItemCount: 20,
      }),
  })

  behaviors.push({
    name: 'fight-green-slimes',
    buildGraph: (c: Character) =>
      buildFightGraph(c, {
        bank: locations.bank,
        fightLocation: locations.greenSlimes,
        healAmount: 50,
        depositItems: [items.resources.greenSlimeBall, items.resources.apple],
        healItem: items.consumables.cookedGudgeon,
        healItemCount: 20,
      }),
  })

  return behaviors
}
