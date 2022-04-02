import { useCallback, useEffect, useRef, useState } from "react"
import { Box } from "./Box"
import { TextField } from "./TextField"
import { match } from "path-to-regexp"
import axios from "axios"
import { Container } from "./Container"
import { CameraIcon, MagnifyingGlassIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"

import { useDebouncedCallback } from "use-debounce"
import { ControlGroup } from "./ControlGroup"
import { Button } from "./Button"
import { TweetCanvas } from "./TweetCanvas"
import { Flex } from "./Flex"
import { Text } from "./Text"
import { IconButton } from "./IconButton"

import { toPng } from "html-to-image"
import { Switch } from "./Switch"
import { Badge } from "./Badge"
import { tweetProcessor } from "./tweetProcessor"

const separator = match("/:username/status/:tweetId");

const defaultUrl = "https://twitter.com/Jack/status/20";

export const TweetLoader = () => {
  const canvasRef = useRef(null);

  const [url, setUrl] = useState(defaultUrl);
  const [tweetId, setTweetId] = useState("20");
  const [loading, setLoading] = useState(false);
  const [tweet, setTweet] = useState(null);
  const [ratio, setRatio] = useState(1);
  const [options, setOptions] = useState({
    verified: false,
    darkMode: false,
    keepLastUrl: true,
    time: true,
    source: true,
    watermark: true,
  })

  const onChange = useCallback((e) => {
    setUrl(e.target.value);
    try {
      const uri = new URL(e.target.value);
      const tweetUrl = separator(uri.pathname);
      setTweetId(tweetUrl.params["tweetId"]);
    } catch (err) {
      console.error(err);
      setTweetId(null);
    }
  }, []);

  const fetch = useDebouncedCallback(async (tweetId) => {
    if (loading) return;
    if (tweetId === null) return;
    setLoading(true);
    setTweet(null);
    try {
      const tweet = await axios.request({
        url: `api/tweet/${tweetId}`,
      });

      let text = tweet.data.text;
      let tcl = {
        regex: {
          hashtag: /(?!\s)#[A-Za-z]\w*\b/g,
          username: /((?=[^\w!])@\w+\b)/g
        }
      }

      tweet.data.text = tweetProcessor(text, tweet.data.urls, {
        tcl,
        highlight: true,
        keepLastUrl: options.keepLastUrl
      });
      if (tweet.data.quote) {
        for (let quote of tweet.data.quote) {
          quote.text = tweetProcessor(quote.text, quote.urls, {
            keepLastUrl: true
          })
        }
      }

      if (tweet.data.media) {
        for (let media of tweet.data.media) {
          if (["animated_gif", "video"].indexOf(media.type) >= 0) {
            media.url = media.preview_image_url;
          }
        }
      }

      setOptions(opt => ({ ...opt, verified: tweet.data.verified }))

      setTweet(tweet.data);
    } catch (err) {
      // do nothing
    }
    setLoading(false);
  }, 100);

  const onKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      fetch(tweetId);
    }
  }, [fetch, tweetId]);

  const takeSnapshot = useCallback(() => {
    const el = canvasRef.current;
    let width = 1080;
    let height = 1080;
    height = (100 / ratio) / 100 * width;

    toPng(el, {
      canvasWidth: width,
      canvasHeight: height
    }).then((dataUrl) => {
      let anchorDownload = document.createElement("a");
      anchorDownload.download = `${tweet.id}.png`;
      anchorDownload.href = dataUrl;
      anchorDownload.click();
    });
  }, [tweet, ratio]);

  useEffect(() => {
    fetch(tweetId);
  }, [options["keepLastUrl"]]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Container size="1">
        <ControlGroup css={{ mb: "$4" }}>
          <TextField
            disabled={loading}
            value={url}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <Button
            disabled={!tweetId}
            onClick={() => {
              fetch(tweetId);
            }}
          >
            <MagnifyingGlassIcon />
          </Button>
        </ControlGroup>
        {tweet &&
          <Box css={{ mb: "$4" }}>
            <Flex align="center" css={{ mb: "$4" }}>
              <Box css={{ flexGrow: 1 }}>
                <ControlGroup>
                  <Button
                    variant={ratio === 1 ? "blue" : "gray"}
                    onClick={() => {
                      setRatio(1);
                    }}
                  >1:1 Square</Button>
                  <Button
                    variant={ratio === 9 / 16 ? "blue" : "gray"}
                    onClick={() => {
                      setRatio(9 / 16);
                    }}
                  >9:16 Stories</Button>
                </ControlGroup>
              </Box>
            </Flex>
            <Box css={{ mb: "$2" }}>Attributes</Box>
            <Flex wrap={"wrap"} css={{ mb: "$4" }}>
              {[
                { label: "Verified", name: "verified" },
                { label: "Source", name: "source" },
                { label: "Time", name: "time" },
                { label: "Watermark", name: "watermark" },
              ].map(({ label, name }) =>
                <Flex align={"center"} css={{ pr: "$3", mb: "$3" }}>
                  <Switch
                    id={`f-${name}`}
                    checked={options[name]}
                    onCheckedChange={(e) => {
                      setOptions(opt => ({ ...opt, [name]: e }));
                    }}
                  />
                  <Text as="label" htmlFor={`f-${name}`} css={{ display: "inline-block", ml: "$2" }}>{label}</Text>
                </Flex>)}
            </Flex>
            <Flex align="center" justify={"between"}>
              <Flex align="center">
                <IconButton
                  variant="raised"
                  size="2"
                  onClick={takeSnapshot}
                  title="Capture"
                >
                  <CameraIcon />
                </IconButton>
                <Badge css={{ ml: "$2" }} size="1">Capture</Badge>
              </Flex>
              <Flex align="center">
                <Badge css={{ mr: "$2" }} size="1">Dark mode soon</Badge>
                <IconButton
                  size="2"
                  state="waiting"
                  onClick={() => {
                    setOptions(opt => ({ ...opt, darkMode: !opt.darkMode }));
                  }}
                  title="Dark Mode"
                >
                  {options.darkMode && <SunIcon />}
                  {!options.darkMode && <MoonIcon />}
                </IconButton>
              </Flex>
            </Flex>
          </Box>}
      </Container>
      {tweet && <TweetCanvas options={options} tweet={tweet} ratio={ratio} canvasRef={canvasRef} />}
    </Box >
  )
}