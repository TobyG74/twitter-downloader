import Axios from "axios";
import { Twitter, VideoVariants, Author, Statistics, Media } from "../types/twitter";
import { getGuestToken, getAuthorization } from "./index";

const _twitterapi = `https://twitter.com/i/api/graphql/DJS3BdhUhcaEpZ7B7irJDg/TweetResultByRestId`;
const variables = (id: string) => {
    return { tweetId: id, withCommunity: false, includePromotedContent: false, withVoice: false };
};
const features = {
    creator_subscriptions_tweet_preview_api_enabled: true,
    tweetypie_unmention_optimization_enabled: true,
    responsive_web_edit_tweet_api_enabled: true,
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
    view_counts_everywhere_api_enabled: true,
    longform_notetweets_consumption_enabled: true,
    responsive_web_twitter_article_tweet_consumption_enabled: false,
    tweet_awards_web_tipping_enabled: false,
    freedom_of_speech_not_reach_fetch_enabled: true,
    standardized_nudges_misinfo: true,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
    longform_notetweets_rich_text_read_enabled: true,
    longform_notetweets_inline_media_enabled: true,
    responsive_web_graphql_exclude_directive_enabled: true,
    verified_phone_label_enabled: false,
    responsive_web_media_download_video_enabled: false,
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    responsive_web_graphql_timeline_navigation_enabled: true,
    responsive_web_enhance_cards_enabled: false,
};

type Config = {
    authorization: string;
    cookie: string;
};

const millsToMinutesAndSeconds = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
};

export const TwitterDL = (url: string, config?: Config): Promise<Twitter> =>
    new Promise(async (resolve, reject) => {
        const id = url.match(/\/([\d]+)/);
        const regex = /^(https?:\/\/)?(www\.)?(m\.)?twitter\.com\/\w+/;
        /** Validate */
        if (!regex.test(url)) return reject("Invalid twitter url!");
        if (!id) return reject("There was an error getting twitter id. Make sure your twitter url is correct!");
        const guest_token = await getGuestToken();
        const csrf_token = config?.cookie ? config.cookie.match(/(?:^|; )ct0=([^;]*)/) : "";
        if (!guest_token)
            return resolve({
                status: "error",
                message: "Failed to get Guest Token. Authorization is invalid!",
            });
        /** Get Data */
        Axios(_twitterapi, {
            method: "GET",
            params: {
                variables: JSON.stringify(variables(id[1])),
                features: JSON.stringify(features),
            },
            headers: {
                Authorization: config?.authorization ? config.authorization : await getAuthorization(),
                Cookie: config?.cookie ? config.cookie : "",
                "x-csrf-token": csrf_token ? csrf_token[1] : "",
                "x-guest-token": guest_token,
                "user-agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
            },
        })
            .then(({ data }) => {
                if (!data.data.tweetResult?.result) {
                    return resolve({
                        status: "error",
                        message: "Tweet not found!",
                    });
                }
                if (data.data.tweetResult.result?.reason === "NsfwLoggedOut") {
                    /** Use Cookies to avoid errors */
                    return resolve({
                        status: "error",
                        message: "This tweet contains sensitive content!",
                    });
                }
                const result =
                    data.data.tweetResult.result.__typename === "TweetWithVisibilityResults"
                        ? data.data.tweetResult.result.tweet
                        : data.data.tweetResult.result;
                const statistics: Statistics = {
                    replieCount: result.legacy.reply_count,
                    retweetCount: result.legacy.retweet_count,
                    favoriteCount: result.legacy.favorite_count,
                    viewCount: result.views.count,
                };
                const user = result.core.user_results.result;
                const author: Author = {
                    username: user.legacy.screen_name,
                    bio: user.legacy.description,
                    possiblySensitive: user.legacy.possibly_sensitive,
                    verified: user.legacy.verified,
                    location: user.legacy.location,
                    profileBannerUrl: user.legacy.profile_banner_url,
                    profileImageUrl: user.legacy.profile_image_url_https,
                    url: "https://twitter.com/" + user.legacy.screen_name,
                    statistics: {
                        favoriteCount: user.legacy.favourites_count,
                        followersCount: user.legacy.followers_count,
                        friendsCount: user.legacy.friends_count,
                        statusesCount: user.legacy.statuses_count,
                        listedCount: user.legacy.listed_count,
                        mediaCount: user.legacy.media_count,
                    },
                };
                const media: Media[] = result.legacy.entities.media.map((v: any) => {
                    if (v.type === "photo") {
                        return { type: v.type, image: v.media_url_https, expandedUrl: v.expanded_url };
                    } else {
                        const videos: VideoVariants[] = v.video_info.variants
                            .filter((video: any) => video.content_type === "video/mp4")
                            .map((variants: any) => {
                                let quality = variants.url.match(/\/([\d]+x[\d]+)\//)[1];
                                return {
                                    bitrate: variants.bitrate,
                                    content_type: variants.content_type,
                                    quality,
                                    url: variants.url,
                                };
                            });
                        return {
                            type: v.type,
                            cover: v.media_url_https,
                            duration: millsToMinutesAndSeconds(v.video_info.duration_millis),
                            expandedUrl: v.expanded_url,
                            videos,
                        };
                    }
                });
                resolve({
                    status: "success",
                    result: {
                        id: result.legacy.id_str,
                        createdAt: result.legacy.created_at,
                        description: result.legacy.full_text,
                        languange: result.legacy.lang,
                        possiblySensitive: result.legacy.possibly_sensitive,
                        possiblySensitiveEditable: result.legacy.possibly_sensitive_editable,
                        isQuoteStatus: result.legacy.is_quote_status,
                        author,
                        statistics,
                        media,
                    },
                });
            })
            .catch((e) => {
                return resolve({
                    status: "error",
                    message: e.message,
                });
            });
    });
