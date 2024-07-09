<h1 align="center">
 Twitter Media Downloader
</h1>

<div align="center">
  <a href="https://github.com/TobyG74/twitter-downloader/graphs/contributors" title="contributors"><img src="https://img.shields.io/github/contributors/TobyG74/twitter-downloader.svg?style=for-the-badge"></img></a>
  <a href="https://github.com/TobyG74/twitter-downloader/network/members" title="forks"><img src="https://img.shields.io/github/forks/TobyG74/twitter-downloader.svg?style=for-the-badge"></img></a>
  <a href="https://github.com/TobyG74/twitter-downloader/issues" title="issues"><img src="https://img.shields.io/github/issues/TobyG74/twitter-downloader.svg?style=for-the-badge"></img></a>
  <a href="https://github.com/TobyG74/twitter-downloader/stargazers" title="stargazer"><img src="https://img.shields.io/github/stars/TobyG74/twitter-downloader.svg?style=for-the-badge"></img></a>
</div>
<br>
<div align="center">
  <a href="https://nodei.co/npm/twitter-downloader" title="npm"><img src="https://nodei.co/npm/twitter-downloader.png?downloads=true&downloadRank=true&stars=true"></img></a>
</div>

<br>

# Table of Contents

-   [Description](#description)
-   [How to Get Cookie](#how-to-get-cookie)
-   [Installation](#installation)
    -   [From NPM](#from-npm)
    -   [From Yarn](#from-yarn)
    -   [From Github](#from-github)
-   [Usage](#usage)
-   [Response](#response)

# Description

-   Used to download video & image from Twitter
-   Use cookies to view sensitive / nsfw content

## How to Get Cookie

-   Go to https://twitter.com/login
-   Then right click on the mouse and select "Inspect" or press "CTRL + SHIFT + I"

<br>
<img src="https://i.ibb.co/bsWVzyB/Tobz-Twitter-Inspect.png" height="500" width="550">
<br>
<br>

-   Then you log in first to go to Home
-   Then go to Network and the search filter becomes https://twitter.com/home
-   If it doesn't appear, refresh the page

<br>
<img src="https://i.ibb.co/xsn3xNj/Tobz-Twitter-Network.png" height="640" width="626">
<br>
<br>

-   Copy the Cookie and use it

## Installation

-   twitter-downloader requires Node.js v12+ to run.

### From NPM

```
npm install twitter-downloader
```

### From YARN

```
yarn add twitter-downloader
```

### From Github

```
npm install github:TobyG74/twitter-downloader
```

## Usage

```js
const { TwitterDL } = require("twitter-downloader");

const twitter_video_url = "https://twitter.com/AnimeWithRJ/status/1645156770266923008";
const twitter_image_url = "https://twitter.com/GenshinImpact/status/1645308130857820161";

const options = {
  authorization?: "YOUR_AUTHORIZATION", // undefined == use default authorization
  cookie?: "YOUR_COOKIE" // to display sensitive / nsfw content (no default cookies)
  proxy?: "YOUR_PROXY" // support http, https, socks5
}

TwitterDL(twitter_video_url, options)
    .then((result) => {
        console.log(result);
    })
    .catch((e) => {
        console.log(e);
    });
```

## Options

-   `authorization` - Authorization header for request
-   `cookie` - Cookie for view sensitive / nsfw content
-   `proxy` - Proxy for request (http, https, socks5)

## Response

```ts
status: "success" | "error"
message?: string
result?: {
    id: string
    createdAt: string
    description: string
    languange: string
    possiblySensitive: boolean
    possiblySensitiveEditable: boolean
    isQuoteStatus: boolean
    mediaCount: number
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
      bookmarkCount: number
      viewCount: number
    }
    media: Media[]
}

/** Image Media */
{
  type: string
  image: string
  expandedUrl: string
}[]

/** Video Media */
{
  type: string
  expandedUrl: string
  cover: string
  duration: string
  videos: {
    bitrate: number
    content_type: string
    quality: string
    url: string
  }[]
}[]
```

## Contributing

This project is open to contributions. Whether you are a beginner or an experienced developer, you can contribute to this project. If you are interested in contributing to this project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
