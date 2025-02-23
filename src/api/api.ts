import axios, { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "../axios.js";

export default {
  getCharacters: async (): Promise<CharacterSchema[]> => {
    return await doGet('/my/characters') as CharacterSchema[]
  },
  moveCharacter: async (characterName: string, x: number, y: number): Promise<CharacterMovementDataSchema> => {
    return await doPost(`/my/${characterName}/action/move`, {
      x: x,
      y: y
    }) as CharacterMovementDataSchema
  },
  fight: async (characterName: string): Promise<CharacterFightDataSchema> => {
    return await doPost(`/my/${characterName}/action/fight`, {}) as CharacterFightDataSchema
  },
  rest: async (characterName: string): Promise<CharacterRestDataSchema> => {
    return await doPost(`/my/${characterName}/action/rest`, {}) as CharacterRestDataSchema
  },
  gather: async (name: string): Promise<SkillDataSchema> => {
    return await doPost(`/my/${name}/action/gathering`, {}) as SkillDataSchema
  }
}

const handleError = (err: any) => {
  const error = err as Error | AxiosError;
  if(axios.isAxiosError(error)) {
    const ae = error as AxiosError<GameError>
    console.log(`Game error: ${ae.response.data.error.code} - ${ae.response.data.error.message}`)
  } else {
    console.log("generic error: ", error)
  }
} 

const doGet = async (path: string): Promise<object> => {
  try {
    const res = await axiosInstance.get(path)
    return res?.data?.data
  } catch (err) {
    handleError(err)
  }
}

const doPost = async (path: string, data: object): Promise<object> => {
  try {
    const res = await axiosInstance.post(path, data)
    return res?.data?.data
  } catch (err) {
    handleError(err)
  }
}