import { z } from "zod";

export type CooldownSchema = {
  total_seconds: number;
  remaining_seconds: number;
  started_at: string; // '2025-02-22T19:47:16.464Z'
  expiration: string;
  reason: string; // 'movement', 'fight', 'crafting', 'gathering'...
}

export type MapContentSchema = {
  type: string;
  code: string;
}

export type MapSchema = {
  name: string;
  skin: string;
  x: number;
  y: number;
  content: MapContentSchema | null;
}

export type InventorySlot = {
  slot: number;
  code: string; // The item code.
  quantity: number;
}

export type CharacterSchema = {
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
  weapon_slot: string
  rune_slot: string
  shield_slot: string
  helmet_slot: string
  body_armor_slot: string
  leg_armor_slot: string
  boots_slot: string


  // ...
  inventory: InventorySlot[];



}

export type DropSchema = {
  code: string;
  quantity: number;
}

export type FightSchema = {
  xp: number;
  gold: number;
  drops: DropSchema[];
  turns: number;
  // ...
  logs: string[];
  result: 'win' | 'loss';
}

export type ItemSchema = {
  name: string
  code: string
  level: number
  // ...
}

export const slotSchema = z.enum(["weapon", "shield", "helmet", 'body_armor']);
export type Slot = z.infer<typeof slotSchema>

// Responses
export type CharacterMovementDataSchema = { 
  cooldown: CooldownSchema;
  destination: MapSchema;
  character: CharacterSchema;
}

export type CharacterFightDataSchema = {
  cooldown: CooldownSchema;
  fight: FightSchema;
  character: CharacterSchema;
}

export type CharacterRestDataSchema = {
  cooldown: CooldownSchema;
  hp_restored: number;
  character: CharacterSchema;
}

export type GameErrorError = {
  code: number;
  message: string;
}

export type GameError = {
  error: GameErrorError;
}

export type SkillInfoSchema = {
  xp: number,
  items: DropSchema[]
}

export type SkillDataSchema = {
  cooldown: CooldownSchema
  details: SkillInfoSchema
  character: CharacterSchema
}

export type EquipRequestSchema = {
  cooldown: CooldownSchema
  slot: string
  item: ItemSchema
  character: CharacterSchema
}