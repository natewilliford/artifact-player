import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://api.artifactsmmo.com',
  timeout: 1000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.API_TOKEN
  }
});

export { axiosInstance }