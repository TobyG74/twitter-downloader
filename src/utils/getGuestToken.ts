import Axios from "axios";
import { getAuthorization } from "./getAuthorization";

export const getGuestToken = async () => {
    try {
        const { data } = await Axios("https://api.twitter.com/1.1/guest/activate.json", {
            method: "POST",
            headers: {
                Authorization: await getAuthorization(),
            },
        });
        return data.guest_token;
    } catch {
        return null;
    }
};
