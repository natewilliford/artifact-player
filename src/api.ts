import { axiosInstance } from "./axios.js";

export const moveCharacter = async (characterName: string, x: number, y: number) => {
  const data = {
    x: x,
    y: y
  }
  
  axiosInstance.post(`/my/${characterName}/action/move`, data)
    .then((response) => {
      // console.log("resp data: "ns, response.data);
      console.log(response.data);
    }).catch((error) => {
      console.error(error);
    })
}

