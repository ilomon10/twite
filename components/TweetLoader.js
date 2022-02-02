import { useCallback, useEffect, useRef, useState } from "react"
import { Box } from "./Box"
import { TextField } from "./TextField"
import { match } from "path-to-regexp"
import axios from "axios"
import { Container } from "./Container"
import { Link } from "./Link"
import { CameraIcon, MagnifyingGlassIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"

import ReactDOMServer from "react-dom/server"
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

const separator = match("/:username/status/:tweetId");

const Anchor = ({ text, href }) => {
  return (<Link variant="blue" href={href}>{text}</Link>);
}

export const TweetLoader = () => {
  const canvasRef = useRef(null);

  const [url, setUrl] = useState("https://twitter.com/Jack/status/20");
  const [tweetId, setTweetId] = useState("20");
  const [loading, setLoading] = useState(false);
  const [tweet, setTweet] = useState(null);
  const [ratio, setRatio] = useState(1);
  const [options, setOptions] = useState({
    forceVerified: false,
    darkMode: false
  })

  const onChange = useCallback((e) => {
    setUrl(e.target.value);
    try {
      const uri = new URL(e.target.value);
      const tweetUrl = separator(uri.pathname);
      console.log(tweetUrl);
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

      try {
        for (let sectionKey in tcl.regex) {
          const matches = text.match(tcl.regex[sectionKey]);
          if (matches === null) continue;
          matches.map((displayText) => {
            let url = `https://twitter.com/${displayText.substring(1)}`;
            if (displayText[0] === "#") {
              url = `https://twitter.com/hashtag/${displayText.substring(1)}`
            }
            let anchor = ReactDOMServer.renderToString(Anchor({
              text: displayText,
              href: url
            }));
            text = text.replace(displayText, anchor);
          });
        }
        tweet.data.urls.map(({ display_url, url }, idx) => {
          let anchor = ReactDOMServer.renderToString(Anchor({ text: display_url, href: url }));
          if (idx === tweet.data.urls.length - 1) anchor = "";
          text = text.replace(url, anchor);
        });
      } catch (err) {
        // do nothing
      }

      tweet.data.text = text;

      setTweet(tweet.data);
    } catch (err) {
      // do nothing
    }
    setLoading(false);
    console.log(loading);
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
  }, []);

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
            <Flex align="center" justify={"between"} css={{ mb: "$4" }}>
              <Box>
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
              <Flex>
                <Switch
                  id="force-verified"
                  onCheckedChange={(e) => {
                    setOptions(opt => ({ ...opt, forceVerified: e }));
                  }}
                />
                <Text as="label" for="force-verified" css={{ ml: "$2" }}>Force verified</Text>
              </Flex>
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