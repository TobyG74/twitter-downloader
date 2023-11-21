export interface Twitter {
    status: "success" | "error";
    message?: string;
    result?: {
        id: string;
        createdAt: string;
        description: string;
        languange: string;
        possiblySensitive: boolean;
        possiblySensitiveEditable: boolean;
        isQuoteStatus: boolean;
        author: Author;
        statistics: Statistics;
        media: Media[];
    };
}

export interface Statistics {
    replieCount: number;
    retweetCount: number;
    favoriteCount: number;
    viewCount: number;
}

export interface Author {
    username: string;
    bio: string;
    possiblySensitive: boolean;
    verified: boolean;
    location: string;
    profileBannerUrl: string;
    profileImageUrl: string;
    url: string;
    statistics: AuthorStatistics;
}

export interface AuthorStatistics {
    favoriteCount: number;
    followersCount: number;
    friendsCount: number;
    statusesCount: number;
    listedCount: number;
    mediaCount: number;
}

export interface Media {
    type: string;
    url: string;
    expandedUrl: string;
    cover?: string;
    duration?: string;
    variants?: VideoVariants[];
}

export interface VideoVariants {
    bitrate: number;
    content_type: string;
    quality: string;
    url: string;
}
