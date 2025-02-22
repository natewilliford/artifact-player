import axios, { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "../axios.js";


interface MoveResp {
  data: CharacterMovementDataSchema
}

interface FightResp {
  data: CharacterFightDataSchema
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

export default {
  moveCharacter: async (characterName: string, x: number, y: number): Promise<CharacterMovementDataSchema> => {
    try {
      const res: AxiosResponse<MoveResp> = await axiosInstance.post(`/my/${characterName}/action/move`, {
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
      const res: AxiosResponse<FightResp> = await axiosInstance.post(`/my/${characterName}/action/fight`)
      return res?.data?.data
    } catch (err) {
      handleError(err)
    }
      // .then((response) => {
      //   const fightResp = response.data.data as CharacterFightDataSchema;
      //   console.log("Result: " + fightResp.fight.result + " - " + fightResp.fight.logs[0]);
      // }).catch((error) => {
      //   console.error(error);
      // })
  }
}