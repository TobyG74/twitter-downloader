import Axios from "axios";

// I use pastebin to update authorization when it can't be used anymore
export const getAuthorization = async () => {
    const { data } = await Axios.get("https://pastebin.com/raw/nz3ApKQM");
    return data;
};
