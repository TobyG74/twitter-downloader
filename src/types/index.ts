export type TwitterResult = {
    status: "success" | "error";
    message?: string;
    result?: {
        id: string;
        createdAt: string;
        caption: string;
        hashtags: string;
        statistics: Statistics;
        author: Author;
        media: Media[];
    };
};

interface Statistics {
    retweetCount: string;
    favoriteCount: string;
    hashtagCount: string;
}

interface Author {
    username: string;
    fullname: string;
    location: string;
    bio: string;
    url: string;
    createdAt: string;
    verified: boolean;
    bannerImage: string | null;
    avatarImage: string | null;
    statistics: AuthorStatistic;
}

interface AuthorStatistic {
    followerCount: string;
    followingCount: string;
    listedCount: string;
    favoriteCount: string;
    statusCount: string;
    mediaCount: string;
}

interface Media {
    type: string;
    url: string;
    duration: string;
    result: VideoVariants[] | string;
}

export type VideoVariants = {
    bitrate: string;
    content_type: string;
    resolution: string;
    url: string;
};
