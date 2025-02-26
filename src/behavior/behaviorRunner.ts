import { Character } from '../gamestate/character.js'
import { BehaviorObj } from './behaviors.js'
import { Graph } from './decisiongraph/graph.js'

type RunningBehavior = {
  behavior: BehaviorObj
  graph: Graph
}

export class BehaviorRunner {
  // behaviorName => behaviorobj
  behaviorMap: Map<string, BehaviorObj> = new Map()

  // characterName => behavior
  runningBehaviors: Map<string, RunningBehavior> = new Map()

  constructor(behaviors: BehaviorObj[]) {
    behaviors.forEach((b) => this.addBehavior(b))
  }

  addBehavior(b: BehaviorObj) {
    const existing = this.behaviorMap.get(b.name)
    if (existing) {
      throw new Error('Behavior already exists with name: ' + b.name)
    }
    this.behaviorMap.set(b.name, b)
  }

  runBehavior(character: Character, behaviorName: string) {
    const existingBehavior = this.runningBehaviors.get(character.getName())
    if (existingBehavior) {
      throw new Error(
        `Character ${character.getName()} already running behavior: ${existingBehavior.behavior.name}`
      )
    }

    const behavior = this.behaviorMap.get(behaviorName)
    if (!behavior) {
      throw new Error(`Behavior not found: ${behaviorName}`)
    }

    const graph = behavior.buildGraph(character)
    graph.setOnEnd(() => {
      console.log(`Ended ${behaviorName} behavior for ${character.getName()}`)
      this.runningBehaviors.delete(character.getName())
    })
    this.runningBehaviors.set(character.getName(), {
      behavior,
      graph,
    })
    graph.runGraph()
  }

  stopBehavior(characterName: string) {
    const runningBehavior = this.runningBehaviors.get(characterName)
    if (runningBehavior) {
      console.log(
        `Stopping graph for ${characterName}. Might take a minute to end.`
      )
      runningBehavior.graph.stop()
    } else {
      console.log(`No running behavior for ${characterName}`)
    }
  }

  stopAllBehaviors() {
    this.runningBehaviors.forEach((_, k) => {
      this.stopBehavior(k)
    })
  }

  listBehaviors() {
    this.behaviorMap.forEach((_, k) => {
      console.log(k)
    })
  }

  listRunningBehaviors() {
    this.runningBehaviors.forEach((v: RunningBehavior, k: string) => {
      console.log(`${k}: ${v.behavior.name}`)
    })
  }
}
