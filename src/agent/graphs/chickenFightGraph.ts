import actions from "../../actions/actions.js"
import { Character, Pos } from "../../gamestate/character.js"
import { Edge, Graph, Node } from "../decisiongraph/graph.js"

type ChickenFightGraphParams = {
  character: Character
  fightLocation: Pos
  minHealth: number
  targetLevel: number
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const addCooldownNode = (g: Graph, nodeId: string, c: Character) => {
  const cdNode: Node = {
    id: nodeId + "-cooldown",
    doAction: async () => {
      const secondsRemaining = c.getCooldownSecondsRemaining()
      console.log(`Waiting for cooldown: ${secondsRemaining}s`)
      await delay(secondsRemaining * 1000 + 100) // Add a few millis to make sure.
    }
  }
  g.addNode(cdNode)
  
  // Edge transfering to the cooldown node.
  const edge1: Edge = {
    shouldTrigger: () => {
      return c.getCooldownSecondsRemaining() > 0
    },
    fromNodeId: nodeId,
    toNodeId: cdNode.id
  }
  g.addEdge(edge1)

  // Edge transfering back to the normal node.
  const edge2: Edge = {
    shouldTrigger: () => {
      return c.getCooldownSecondsRemaining() === 0
    },
    fromNodeId: cdNode.id,
    toNodeId:  nodeId
  }
  g.addEdge(edge2)
}

export const buildChickenFightGraph = (params: ChickenFightGraphParams): Graph => {
  const c = params.character
  const g = new Graph()

  // Nodes
  g.startingNode = {
    id: "start",
    doAction: async () => {} // no-op
  }
  g.addNode(g.startingNode)

  // 1. Move to location
  g.addNode({
    id: "move",
    doAction: async () => {
      await actions.moveCharacter(c.getName(), params.fightLocation.x, params.fightLocation.y)
    }
  })
  addCooldownNode(g, "move", c)

  // 2. Fight
  g.addNode({
    id: "fight",
    doAction: async () => {
      await actions.fight(c.getName())
    }
  })
  addCooldownNode(g, "fight", c)

  // 3. Heal
  g.addNode({
    id: "heal",
    doAction: async () => {
      await actions.rest(c.getName())
    }
  })
  addCooldownNode(g, "heal", c)

  // 4. End 
  g.addNode({
    id: "end",
    doAction: async () => {} // no-op
  })


  // Edges
  g.addEdge({
    shouldTrigger: () => true,
    fromNodeId: "start",
    toNodeId: "move"
  })
  g.addEdge({
    shouldTrigger: () => {
      const isThere = c.getPosition().x === params.fightLocation.x && c.getPosition().y === params.fightLocation.y
      console.log(`At position? ${isThere}`)
      return isThere
    },
    fromNodeId: "move",
    toNodeId: "fight"
  })
  g.addEdge({
    shouldTrigger: () => {
      return (c.characterSchema.hp / c.characterSchema.max_hp) < params.minHealth
    },
    fromNodeId: "fight",
    toNodeId: "heal"
  })
  g.addEdge({
    shouldTrigger: () => {
      return c.characterSchema.hp == c.characterSchema.max_hp
    },
    fromNodeId: "heal",
    toNodeId: "fight"
  })
  g.addEdge({
    shouldTrigger: () => {
      return c.characterSchema.level >= params.targetLevel
    },
    fromNodeId: "fight",
    toNodeId: "end"
  })

  return g
}