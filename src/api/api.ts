import axios, { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "../axios.js";

const handleError = (err: any) => {
  const error = err as Error | AxiosError;
  if(axios.isAxiosError(error)) {
    const ae = error as AxiosError<GameError>
    console.log(`Game error: ${ae.response.data.error.code} - ${ae.response.data.error.message}`)
  } else {
    console.log("generic error: ", error)
  }
} 

export default {
  getCharacters: async () => {
    try {
      const res = await axiosInstance.get('/my/characters')
      return res?.data?.data
    } catch (err) {
      handleError(err)
    }
  },

  moveCharacter: async (characterName: string, x: number, y: number): Promise<CharacterMovementDataSchema> => {
    try {
      const res = await axiosInstance.post(`/my/${characterName}/action/move`, {
        x: x,
        y: y
      })
      return res?.data?.data
    } catch (err) {
      handleError(err)
    }
  },

  fight: async (characterName: string): Promise<CharacterFightDataSchema> => {
    try {
      const res = await axiosInstance.post(`/my/${characterName}/action/fight`)
      return res?.data?.data
    } catch (err) {
      handleError(err)
    }
  },

  rest: async (characterName: string): Promise<CharacterRestDataSchema> => {
    try {
      const res = await axiosInstance.post(`/my/${characterName}/action/rest`)
      return res?.data?.data
    } catch (err) {
      handleError(err)
    }
  }
}