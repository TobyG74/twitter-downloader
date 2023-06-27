import axios from "axios";
import { VideoVariants, TwitterResult } from "../types";

const _twitterapi = (id: string) => `https://api.twitter.com/1.1/statuses/show/${id}.json?tweet_mode=extended`;

// I use pastebin to update authorization when it can't be used anymore
const getAuthorization = async () => {
    const { data } = await axios.get("https://pastebin.com/raw/nz3ApKQM");
    return data;
};

const getTokens = async () => {
    try {
        const authToken = await getAuthorization();
        const { data } = await axios("https://api.twitter.com/1.1/guest/activate.json", {
            method: "POST",
            headers: {
                Authorization: authToken,
            },
        });
        return [data.guest_token, authToken];
    } catch {
        return null;
    }
};

export const TwitterDL = (url: string): Promise<TwitterResult> =>
    new Promise(async (resolve, reject) => {
        const id = url.match(/\/([\d]+)/);
        if (!id)
            return resolve({
                status: "error",
                message: "There was an error getting twitter id. Make sure your twitter url is correct!",
            });
        const [guestToken, authToken] = await getTokens();
        axios(_twitterapi(id[1]), {
            method: "GET",
            headers: {
                Authorization: authToken,
                "x-guest-token": guestToken,
                "user-agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
            },
        })
            .then(({ data }) => {
                const author = {
                    username: data.user.screen_name,
                    fullname: data.user.name,
                    location: data.user.location,
                    bio: data.user.description,
                    url: "https://twitter.com" + data.user.screen_name,
                    createdAt: data.user.created_at,
                    verified: data.user.verified,
                    bannerImage: data.user.profile_banner_url,
                    avatarImage: data.user.profile_image_url_https,
                    statistics: {
                        followerCount: data.user.followers_count,
                        followingCount: data.user.friends_count,
                        listedCount: data.user.listed_count,
                        favoriteCount: data.user.favourites_count,
                        statusCount: data.user.statuses_count,
                        mediaCount: data.user.media_count,
                    },
                };
                const statistics = {
                    retweetCount: data.retweet_count,
                    favoriteCount: data.favorite_count,
                    hashtagCount: data.entities.hashtags.length,
                };
                const media = [];
                data.extended_entities.media.forEach((v) => {
                    const resultVideo: VideoVariants[] = [];
                    if (v.video_info) {
                        v.video_info.variants = v.video_info.variants.filter((x) => x.content_type === "video/mp4");
                        v.video_info.variants.forEach((z) => {
                            resultVideo.push({
                                bitrate: z.bitrate,
                                content_type: z.content_type,
                                resolution: z.url.match(/([\d ]{2,5}[x][\d ]{2,5})/)[0],
                                url: z.url,
                            });
                        });
                        media.push({
                            type: v.type,
                            url: v.url,
                            duration: new Date(v.video_info.duration_millis).toISOString().slice(11, 19),
                            result: v.type === "video" ? resultVideo : v.media_url_https,
                        });
                    } else {
                        media.push({
                            type: v.type,
                            url: v.url,
                            result: v.type === "video" ? resultVideo : v.media_url_https,
                        });
                    }
                });
                resolve({
                    status: "success",
                    result: {
                        id: data.id,
                        createdAt: data.created_at,
                        caption: data.full_text,
                        hashtags: data.entities.hashtags,
                        statistics,
                        author,
                        media,
                    },
                });
            })
            .catch((e) => resolve({ status: "error", message: e.message }));
    });
