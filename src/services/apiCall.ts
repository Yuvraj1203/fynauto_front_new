// src/utils/api.ts
import axios from "axios";

export const apiCall = async (url: string, method: string, data: any) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error with API call:", error);
    throw error;
  }
};
