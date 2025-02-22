type CooldownSchema = {
  total_seconds: number;
  remaining_seconds: number;
  started_at: string; // '2025-02-22T19:47:16.464Z'
  expiration: string;
  reason: string; // 'movement', 'fight', 'crafting', 'gathering'...
}

type MapContentSchema = {
  type: string;
  code: string;
}

type MapSchema = {
  name: string;
  skin: string;
  x: number;
  y: number;
  content: MapContentSchema | null;
}

type InventorySlot = {
  slot: number;
  code: string; // The item code.
  quantity: number;
}

type CharacterSchema = {
  name: string;
  account: string;
  skin: string;
  level: number;
  xp: number;
  max_xp: number; // xp needed to level up.
  gold: number;
  // ...
  hp: number;
  max_hp: number;
  // ... 
  x: number;
  y: number;
  // ...
  inventory: InventorySlot[];
}

// Responses
type CharacterMovementDataSchema = { 
  cooldown: CooldownSchema;
  destination: MapSchema;
  character: CharacterSchema;
}
