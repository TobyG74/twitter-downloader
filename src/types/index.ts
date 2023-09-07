export interface Twitter {
    code: number;
    message: string;
    tweet?: {
        id: string;
        text: string;
        created_at: string;
        created_timestamp: number;
        replies: number;
        retweets: number;
        likes: number;
        possibly_sensitive: false;
        url: string;
        author: Author;
        lang: string;
        twitter_card: string;
        media: Photos[] | Videos[];
    };
}

export interface TwitterResult {
    status: "success" | "error";
    message?: string;
    result?: {
        id: string;
        created_at: string;
        caption: string;
        created_timestamp: number;
        replies: number;
        retweets: number;
        likes: number;
        possibly_sensitive: false;
        url: string;
        author: Author;
        type: string;
        media: Photos[] | Videos[];
    };
}

export interface Author {
    id: string;
    name: string;
    username: string;
    avatar_url: string;
    banner_url: string;
}

interface Photos {
    type: string;
    url: string;
    altText: string;
}

interface Videos {
    videos_urls: VideoVariants[];
    thumbnail_url: string;
    duration: string;
    type: string;
}

export interface VideoVariants {
    bitrate: number;
    content_type: string;
    resolution: string;
    url: string;
}
