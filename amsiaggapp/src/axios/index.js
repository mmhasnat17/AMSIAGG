import axios from "axios";

const instance = axios.create({
  baseURL: "https://services.metricsamsi.com/v1.0/dealers",
  headers: {
    accept: "*/*"
  },
});

export default instance;