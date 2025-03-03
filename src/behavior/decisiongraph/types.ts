export type TriggerParams = {
  currentNodeRunCount: number
}
export type Trigger = (params: TriggerParams) => boolean

export type Operation = () => Promise<Maybe<Error>>

export type Edge = {
  shouldTrigger: Trigger
  fromNodeId: string
  toNodeId: string
}
