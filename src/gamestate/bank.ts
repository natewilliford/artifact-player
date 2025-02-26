import { SimpleItemSchema } from '../api/types.js'

export class Bank {
  items: SimpleItemSchema[]
  gold: number = 0

  constructor(items: SimpleItemSchema[]) {
    this.items = items
  }

  updateItems(items: SimpleItemSchema[]) {
    this.items = items
  }

  updateGold(gold: number) {
    this.gold = gold
  }

  getItemCount(code: string): number {
    return this.items
      .filter((item) => item.code === code)
      .reduce((sum, item) => sum + item.quantity, 0)
  }
}
