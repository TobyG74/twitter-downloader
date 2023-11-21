# Twitter Downloader

-   Used to download video & image from Twitter
-   No login or password are required

## Installation

-   twitter-downloader requires Node.js v12+ to run.

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

TwitterDL(twitter_video_url)
    .then((result) => {
        console.log(result);
    })
    .catch((e) => {
        console.log(e);
    });
```

## Response

```ts
result?: {
    id: string
    createdAt: string
    description: string
    languange: string
    possiblySensitive: boolean
    possiblySensitiveEditable: boolean
    isQuoteStatus: boolean
    author: {
      username: string
      bio: string
      possiblySensitive: boolean
      verified: boolean
      location: string
      profileBannerUrl: string
      profileImageUrl: string
      url: string
      statistics: {
        favoriteCount: number
        followersCount: number
        friendsCount: number
        statusesCount: number
        listedCount: number
        mediaCount: number
      }
    }
    statistics: {
      replieCount: number
      retweetCount: number
      favoriteCount: number
      viewCount: number
    }
    media: Media[]
}
```
