import axios from "axios"

const tweetProcessor = (data, includes) => {
  const user = includes.users.find(u => u.id === data.author_id);
  const quote = data.referenced_tweets && data.referenced_tweets.filter((tweet) => tweet.type === "quoted")
  return {
    id: data.id,
    text: data.text,
    media: includes.media,
    created_at: data.created_at,
    source: data.source,

    urls: data.entities && data.entities.urls,
    quote: (quote && quote.length > 0) && quote
      .map((refTweet) => includes.tweets.find((tweet) => refTweet.id === tweet.id))
      .map((tweet) => {
        return tweetProcessor(tweet, includes);
      }),

    name: user.name,
    username: user.username,
    profile_image_url: user.profile_image_url,
    verified: user.verified,

    retweet_count: data.public_metrics.retweet_count,
    reply_count: data.public_metrics.reply_count,
    like_count: data.public_metrics.like_count,

  }
}


const http = axios.create({
  baseURL: "https://api.twitter.com/",
  headers: {
    "Authorization": `Bearer ${process.env.TWITTER_ACCESS_TOKEN}`
  }
})

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const raw = await http.request({
      url: `2/tweets/${id}`,
      method: "get",
      params: {
        "tweet.fields": "created_at,source,public_metrics,context_annotations,entities,referenced_tweets",
        "expansions": "attachments.media_keys,author_id,attachments.poll_ids,referenced_tweets.id.author_id",
        "user.fields": "profile_image_url,verified",
        "media.fields": "media_key,url,height,width,preview_image_url,alt_text"
      }
    });
    const { data, includes } = raw.data;
    const tweet = tweetProcessor(data, includes);
    res.status(raw.status).json(tweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "error" });
  }
}