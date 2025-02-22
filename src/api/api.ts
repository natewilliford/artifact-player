import { axiosInstance } from "../axios.js";

export const moveCharacter = async (characterName: string, x: number, y: number): Promise<CharacterMovementDataSchema> => {
  const data = {
    x: x,
    y: y
  }

  const resp = await axiosInstance.post(`/my/${characterName}/action/move`, data)
  .catch((error) => {
    console.error(error);
  })
  if (resp) {
    const movementResp = resp.data.data as CharacterMovementDataSchema;
    // console.log("move resp: ", movementResp);
    const newX = movementResp.destination.x;
    const newY = movementResp.destination.y;
    console.log(movementResp.character.name + " moved to " + newX + ", " + newY + " - " +  movementResp.destination.name);
    return movementResp
  }
  return null
}

export const fight = async (characterName: string) => {
  axiosInstance.post(`/my/${characterName}/action/fight`)
    .then((response) => {
      const fightResp = response.data.data as CharacterFightDataSchema;
      console.log("Result: " + fightResp.fight.result + " - " + fightResp.fight.logs[0]);
    }).catch((error) => {
      console.error(error);
    })
}

