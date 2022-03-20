This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

![Screenshot Website](https://i.imgur.com/DXKdPvY.png "twite.vercel.app")

## Getting Started

First, add Twitter API key:

```env
# .env.local
TWITTER_ACCESS_TOKEN = CHANGE_THIS_WITH_TWITTER_API_KEY
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Routes

### **GET**: Tweet

`http://localhost:3000/api/tweet/[tweet_id]`

Return value:

```json
{
  "id": "string",
  "text": "string",
  "media": [{
    "type": "enum",
    "height": "number",
    "width": "number",
    "preview_image_url": "string",
    "media_key": "string",
  }],
  "created_at": "date",
  "source": "string",
  "urls": [{
    "start": "number",
    "display_url": "string",
    "expanded_url": "string",
    "url": "string",
    "end": "number"
  }],
  "name": "string",
  "username": "string",
  "profile_image_url": "string",
  "verified": "boolean",
  "retweet_count": "number",
  "reply_count": "number",
  "like_count": "number"
}
```


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
