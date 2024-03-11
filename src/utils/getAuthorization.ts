import Axios from "axios";

// I use pastebin to update authorization when it can't be used anymore
export const getGuestTokenAuthorization = async () => {
    const { data } = await Axios.get("https://pastebin.com/raw/nz3ApKQM");
    return data;
};

export const getTwitterAuthorization = async () => {
    const { data } = await Axios.get("https://pastebin.com/raw/Bu7XFnpE");
    return data;
};
