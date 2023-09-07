import axios from "axios";
import { Twitter, VideoVariants, TwitterResult, Author } from "../types";

const _twitterapi = (id: string) =>
    `https://info.tweeload.site/status/${id}.json`;

// I use pastebin to update authorization when it can't be used anymore
const getAuthorization = async () => {
    const { data } = await axios.get("https://pastebin.com/raw/SnCfd4ru");
    return data;
};

// const getGuestToken = async () => {
//     try {
//         const { data } = await axios("https://api.twitter.com/1.1/guest/activate.json", {
//             method: "POST",
//             headers: {
//                 Authorization: await getAuthorization(),
//             },
//         });
//         return data.guest_token;
//     } catch {
//         return null;
//     }
// };

export const TwitterDL = (url: string): Promise<TwitterResult> =>
    new Promise(async (resolve, reject) => {
        const id = url.match(/\/([\d]+)/);
        if (!id)
            return resolve({
                status: "error",
                message:
                    "There was an error getting twitter id. Make sure your twitter url is correct!",
            });
        axios(_twitterapi(id[1]), {
            method: "GET",
            headers: {
                Authorization: await getAuthorization(),
                // "x-guest-token": await getGuestToken(),
                "user-agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
            },
        })
            .then(({ data }) => {
                if (data.code !== 200) {
                    return resolve({
                        status: "error",
                        message: "An error occurred while sending the request.",
                    });
                }
                const author: Author = {
                    id: data.tweet.author.id,
                    name: data.tweet.author.name,
                    username: data.tweet.author.screen_name,
                    avatar_url: data.tweet.author.avatar_url,
                    banner_url: data.tweet.author.banner_url,
                };
                let media = [];
                let type;
                if (data.tweet?.media?.videos) {
                    type = "video";
                    data.tweet.media.videos.forEach((v) => {
                        const resultVideo: VideoVariants[] = [];
                        v.video_urls.forEach((z) => {
                            resultVideo.push({
                                bitrate: z.bitrate,
                                content_type: z.content_type,
                                resolution: z.url.match(
                                    /([\d ]{2,5}[x][\d ]{2,5})/
                                )[0],
                                url: z.url,
                            });
                        });
                        if (resultVideo.length !== 0) {
                            media.push({
                                type: v.type,
                                duration: v.duration,
                                thumbnail_url: v.thumbnail_url,
                                result:
                                    v.type === "video" ? resultVideo : v.url,
                            });
                        }
                    });
                } else {
                    type = "photo";
                    data.tweet.media.photos.forEach((v) => {
                        media.push(v);
                    });
                }
                resolve({
                    status: "success",
                    result: {
                        id: data.tweet.id,
                        caption: data.tweet.text,
                        created_at: data.tweet.created_at,
                        created_timestamp: data.tweet.created_timestamp,
                        replies: data.tweet.replies,
                        retweets: data.tweet.retweets,
                        likes: data.tweet.likes,
                        url: data.tweet.url,
                        possibly_sensitive: data.tweet.possibly_sensitive,
                        author,
                        type,
                        media: media.length !== 0 ? media : null,
                    },
                });
            })
            .catch((e) => reject(e));
    });
