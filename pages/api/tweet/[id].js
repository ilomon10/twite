import axios from "axios"


const http = axios.create({
  baseURL: "https://api.twitter.com/",
  headers: {
    "Authorization": `Bearer ${process.env.TWITTER_ACCESS_TOKEN}`
  }
})

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const tweet = await http.request({
      url: `2/tweets/${id}`,
      method: "get",
      params: {
        "tweet.fields": "created_at,source,public_metrics,context_annotations,entities",
        "expansions": "attachments.media_keys,author_id,attachments.poll_ids",
        "user.fields": "profile_image_url,verified",
        "media.fields": "media_key,url,height,width,preview_image_url,alt_text"
      }
    });
    const { data, includes } = tweet.data;
    
    res.status(tweet.status).json({
      id: data.id,
      text: data.text,
      media: includes.media,
      created_at: data.created_at,
      source: data.source,

      urls: data.entities && data.entities.urls,

      name: includes.users[0].name,
      username: includes.users[0].username,
      profile_image_url: includes.users[0].profile_image_url,
      verified: includes.users[0].verified,

      retweet_count: data.public_metrics.retweet_count,
      reply_count: data.public_metrics.reply_count,
      like_count: data.public_metrics.like_count,

    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ text: "error" });
  }
}