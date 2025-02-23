
import actions from "../actions/actions.js"
import { Character } from "../gamestate/character.js"
import { characters } from "../gamestate/characters.js"

interface Action {
  doAction(): Promise<void>
}

interface Trigger {
  isTriggered(): boolean
}

interface GraphEdge {
  trigger: Trigger
  nextNode: GraphNode
}

interface GraphNode {
  name: string
  isEndNode: boolean
  action: Action
  edges: GraphEdge[]
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const buildCooldownNode = (c: Character, nextNode: GraphNode): GraphNode => {
  return {
    name: "cooldown",
    isEndNode: false,
    action: {
      doAction: async () => {
        await delay(1000)
      }
    },
    edges : [
      { 
        trigger: {
          isTriggered: () => {
            return c.getCooldownSecondsRemaining() <= 0
          }
        },
        nextNode: nextNode
      },
    ]
  }

}

const runProgram = async (name: string) => {
  const c: Character = characters.getCharacter(name)
  if (!c) {
    throw new Error("Character not found.")
  }

  const yesTrigger: Trigger = {
    isTriggered: () => { return true }
  }

  const combatLocation = {
    x: 0,
    y: 1
  }

  const lowHealthTrigger: Trigger = {
    isTriggered: () => {
      return (c.characterSchema.hp / c.characterSchema.max_hp) < 0.5
    }
  }

  const coolDownTrigger: Trigger = {
    isTriggered: () => {
      return c.getCooldownSecondsRemaining() <= 0
    }
  }

  const fullHealthTrigger: Trigger = {
    isTriggered: () => {
      return c.characterSchema.hp == c.characterSchema.max_hp
    }
  }

  const characterLevelTrigger: Trigger = {
    isTriggered: () => {
      return c.characterSchema.level >= 2
    }
  }

  const moveAction: Action = {
    doAction: async () => {
      actions.moveCharacter(c.getName(), combatLocation.x, combatLocation.y)
    }
  }

  const fightAction: Action = {
    doAction: async () => {
      actions.fight(c.getName())
    }
  }

  const restAction: Action = {
    doAction: async () => {
      actions.rest(c.getName())
    }
  }

  const endNode:GraphNode = {
    name: "end",
    isEndNode: true,
    action: { doAction: async () => {} },
    edges: []
  }
  
  const healNode: GraphNode = {
    name: "heal",
    isEndNode: false,
    action: restAction,
    edges: [] // fight added later
  }

  healNode.edges.push({
    trigger: coolDownTrigger,
    nextNode: buildCooldownNode(c, healNode)
  })

  const fightNode: GraphNode = {
    name: "fight",
    isEndNode: false,
    action: fightAction,
    edges: [
      {
        trigger: characterLevelTrigger,
        nextNode: endNode
      },
      {
        trigger: lowHealthTrigger,
        nextNode: healNode
      },
    ]
  }

  fightNode.edges.push({
    trigger: coolDownTrigger,
    nextNode: buildCooldownNode(c, fightNode)
  })

  healNode.edges.push({
    trigger: fullHealthTrigger,
    nextNode: fightNode
  })

  const moveNode: GraphNode = {
    name: "move",
    isEndNode: false,
    action: moveAction,
    edges: [
      {
        trigger: coolDownTrigger,
        nextNode: buildCooldownNode(c, fightNode)
      }
    ]
  }

  const startNode: GraphNode = {
    name: "start",
    isEndNode: false,
    action: { doAction: async () => {} },
    edges: [
      {
        trigger: yesTrigger,
        nextNode: moveNode
      }
    ]
  }

  let running = true
  let node = startNode
  while(running) {
    console.log("Current node: " + node.name)
    if (node.isEndNode) {
      console.log("We are at the end node.")
      running = false
      continue
    }

    console.log("Checking triggers.")
    for (let i = 0; i < node.edges.length; i++) {
      let edge = node.edges[i]
      if (edge.trigger.isTriggered()) {
        console.log(`Triggered ${edge.trigger}. moving to next node.`)
        node = edge.nextNode
        continue
      }
    }

    console.log("Doing action")
    await node.action.doAction()
    console.log("Action done")
  }
}

export { runProgram }