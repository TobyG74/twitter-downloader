import Axios from "axios";
import { getGuestTokenAuthorization } from "./getAuthorization";

export const getGuestToken = async (authToken?: string) => {
  try {
    const { data } = await Axios(
      "https://api.twitter.com/1.1/guest/activate.json",
      {
        method: "POST",
        headers: {
          Authorization: authToken
            ? authToken
            : await getGuestTokenAuthorization(),
        },
      }
    );
    return data.guest_token;
  } catch {
    return null;
  }
};
