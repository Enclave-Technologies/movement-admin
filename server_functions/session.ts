import { API_BASE_URL } from "@/configs/constants";
import axios from "axios";

const createSession = async (req, res) => {};

export const updateSession = async (client_id, data) => {
  await axios.put(
    `${API_BASE_URL}/mvmt/v1/client/session`,
    {
      client_id,
      data,
    },
    { withCredentials: true }
  );
  return true;
};
