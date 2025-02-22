import { axiosInstance } from "../axios.js";

export const moveCharacter = async (characterName: string, x: number, y: number) => {
  const data = {
    x: x,
    y: y
  }
  
  axiosInstance.post(`/my/${characterName}/action/move`, data)
    .then((response) => {
      const movementResp = response.data.data as CharacterMovementDataSchema;
      // console.log("move resp: ", movementResp);
      const x = movementResp.destination.x;
      const y = movementResp.destination.y;
      console.log(movementResp.character.name + " moved to " + x + ", " + y + " - " +  movementResp.destination.name);
    }).catch((error) => {
      console.error(error);
    })
}

