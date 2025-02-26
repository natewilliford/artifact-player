import axios, { AxiosError } from 'axios'
import { axiosInstance } from '../axios.js'
import {
  BankGoldTransactionSchema,
  BankItemTransactionSchema,
  BankSchema,
  CharacterFightDataSchema,
  CharacterMovementDataSchema,
  CharacterRestDataSchema,
  CharacterSchema,
  EquipRequestSchema,
  GameError,
  RewardDataSchema,
  SimpleItemSchema,
  SkillDataSchema,
  Slot,
  TaskDataSchema,
  TaskFullSchema,
  UseItemSchema,
} from './types.js'

type ApiResponse<T> = {
  data?: T
  error?: Error
}

export default {
  getCharacters: async (): Promise<ApiResponse<CharacterSchema[]>> => {
    return await doGet('/my/characters')
  },
  moveCharacter: async (
    characterName: string,
    x: number,
    y: number
  ): Promise<ApiResponse<CharacterMovementDataSchema>> => {
    return await doPost(`/my/${characterName}/action/move`, {
      x: x,
      y: y,
    })
  },
  fight: async (
    characterName: string
  ): Promise<ApiResponse<CharacterFightDataSchema>> => {
    return await doPost(`/my/${characterName}/action/fight`)
  },
  rest: async (
    characterName: string
  ): Promise<ApiResponse<CharacterRestDataSchema>> => {
    return await doPost(`/my/${characterName}/action/rest`)
  },
  gather: async (name: string): Promise<ApiResponse<SkillDataSchema>> => {
    return await doPost(`/my/${name}/action/gathering`)
  },
  craft: async (
    name: string,
    code: string,
    quantity: number
  ): Promise<ApiResponse<SkillDataSchema>> => {
    return await doPost(`/my/${name}/action/crafting`, { code, quantity })
  },
  equip: async (
    name: string,
    code: string,
    slot: Slot,
    quantity: number = 1
  ): Promise<ApiResponse<EquipRequestSchema>> => {
    return await doPost(`my/${name}/action/equip`, { code, slot, quantity })
  },
  unequip: async (
    name: string,
    slot: Slot,
    quantity: number = 1
  ): Promise<ApiResponse<EquipRequestSchema>> => {
    return await doPost(`my/${name}/action/unequip`, { slot, quantity })
  },
  getTasks: async (): Promise<ApiResponse<TaskFullSchema[]>> => {
    return await doGet(`/tasks/list`)
  },
  acceptTask: async (name: string): Promise<ApiResponse<TaskDataSchema>> => {
    return await doPost(`/my/${name}/action/task/new`)
  },
  completeTask: async (
    name: string
  ): Promise<ApiResponse<RewardDataSchema>> => {
    return await doPost(`/my/${name}/action/task/complete`)
  },
  getBankDetails: async (): Promise<ApiResponse<BankSchema>> => {
    return await doGet('/my/bank')
  },
  getBankItems: async (): Promise<ApiResponse<SimpleItemSchema[]>> => {
    return await doGet('/my/bank/items')
  },
  depositBank: async (
    name: string,
    code: string,
    quantity: number
  ): Promise<ApiResponse<BankItemTransactionSchema>> => {
    return await doPost(`/my/${name}/action/bank/deposit`, { code, quantity })
  },
  withdrawBank: async (
    name: string,
    code: string,
    quantity: number
  ): Promise<ApiResponse<BankItemTransactionSchema>> => {
    return await doPost(`/my/${name}/action/bank/withdraw`, { code, quantity })
  },
  depositBankGold: async (
    name: string,
    quantity: number
  ): Promise<ApiResponse<BankGoldTransactionSchema>> => {
    return await doPost(`/my/${name}/action/bank/deposit/gold`, { quantity })
  },
  withdrawBankGold: async (
    name: string,
    quantity: number
  ): Promise<ApiResponse<BankGoldTransactionSchema>> => {
    return await doPost(`/my/${name}/action/bank/withdraw/gold`, { quantity })
  },
  useItem: async (
    name: string,
    code: string,
    quantity: number
  ): Promise<ApiResponse<UseItemSchema>> => {
    return await doPost(`/my/${name}/action/use`, { code, quantity })
  },
}

const logError = (err: any) => {
  const error = err as Error | AxiosError
  if (axios.isAxiosError(error)) {
    const ae = error as AxiosError<GameError>
    if (ae?.response?.data) {
      console.log(
        `Game error: ${ae?.response?.data.error.code} - ${ae?.response?.data.error.message}`
      )
    } else {
      console.log(`Axios error: ${ae.code} - ${ae.message}`)
    }
  } else {
    console.log('generic error: ', error)
  }
}

const doGet = async <T>(path: string): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosInstance.get(path)
    return { data: res?.data?.data }
  } catch (err) {
    logError(err)
    return { error: err as Error }
  }
}

const doPost = async <T>(
  path: string,
  data: object = {}
): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosInstance.post(path, data)
    return { data: res?.data?.data }
  } catch (err) {
    logError(err)
    return { error: err as Error }
  }
}
