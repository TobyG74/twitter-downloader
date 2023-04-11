# Twitter Downloader

-   Used to download video & image from Twitter
-   No login or password are required

## Installation

-   twitter-downloader requires Node.js v10+ to run.

### Install from NPM

```
npm install twitter-downloader
```

### Install from YARN

```
yarn add twitter-downloader
```

## Usage

```js
const { TwitterDL } = require("twitter-downloader");

const twitter_video_url = "https://twitter.com/AnimeWithRJ/status/1645156770266923008";
const twitter_image_url = "https://twitter.com/GenshinImpact/status/1645308130857820161";

TwitterDL(twitter_video_url).then((result) => {
    console.log(result);
});
```

## Response

```ts
{
  status: "success" | "error"
  message?: string
  result?: {
    id: number
    createdAt: string
    caption: string
    hastags: string[]
    statistics: {
      retweetCount: number
      favoriteCount: number
      hastagCount: number
    },
    author: {
      username: string
      fullname: string
      bio: string
      url: string
      createdAt: string
      verified: boolean
      bannerImage: string
      avatarImage: string
      statistics: {
        followerCount: string
        followingCount: string
        listedCount: string
        favoriteCount: string
        statusCount: string
        mediaCount: string
      }
    },
    media: string[]
  }
}
```
