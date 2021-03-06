import { Box } from "./Box"
import { Avatar } from "./Avatar"
import { Text } from "./Text"
import { Flex } from "./Flex"
import { VerifiedBadge } from "./VerifiedBadge"
import { Container } from "./Container"
import { Paragraph } from "./Paragraph"

import moment from "moment"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { useEffect, useRef, useState } from "react"
import { TweetCanvasMedia } from "./TweetCanvasMedia"

export const TweetCanvas = ({ tweet, ratio, canvasRef, options }) => {
  const contentRef = useRef(null);
  const [scale, setScale] = useState(null);

  useEffect(() => {
    setScale(null);
    const canvasHeight = canvasRef.current.clientHeight;
    const canvasWidth = canvasRef.current.clientWidth;
    const contentHeight = contentRef.current.clientHeight;
    const contentWidth = contentRef.current.clientWidth;

    let factor;

    if (contentHeight > contentWidth) {
      factor = contentHeight > canvasHeight
        ? canvasHeight / contentHeight
        : contentHeight / canvasHeight;
    } else {
      factor = contentWidth > canvasWidth
        ? canvasWidth / contentWidth
        : contentWidth / canvasWidth;
    }
    factor = factor * 100;

    setScale(factor / 100);
  }, [ratio, canvasRef]);

  return (
    <Container size="1" css={{ mb: "$8" }}>
      <AspectRatio ratio={ratio} asChild={true} ref={canvasRef}>
        <Flex
          align="center"
          justify="center"
          css={{
            overflow: "hidden",
            backgroundColor: "white",
            borderRadius: "$3",
            border: "1px solid $slate5",
            boxShadow: "0px 0px 50px -25px var(--colors-shadowDark)"
          }}
        >
          <Container
            ref={contentRef}
            css={{
              maxWidth: "570px",
              position: "relative"
            }}
          >
            <Box css={{
              py: "$4",
              px: "$2",
              transform: `scale(${scale ? scale : 1})`
            }}>
              <Flex align="center" css={{ mb: "$2" }}>
                <Box>
                  <Avatar size={4} src={tweet.profile_image_url} />
                </Box>
                <Box css={{ ml: "$2" }}>
                  <Flex>
                    <Text size="3" css={{ fontWeight: "bold", lineHeight: "16px" }}>{tweet.name}</Text>
                    {(options.verified) &&
                      <VerifiedBadge css={{ ml: "$1" }} />}
                  </Flex>
                  <Text size="3">@{tweet.username}</Text>
                </Box>
              </Flex>
              <Box css={{ mb: "$2" }}>
                <Paragraph
                  css={{
                    fontSize: 23,
                    lineHeight: "28px",
                    whiteSpace: "pre-line"
                  }}
                  dangerouslySetInnerHTML={{ __html: tweet.text }}
                />
              </Box>
              {tweet.quote && tweet.quote.map((quote) => {
                return (
                  <Box
                    key={quote.id}
                    css={{
                      p: "$2",
                      border: "1px solid $slate6",
                      borderRadius: "$3",
                      overflow: "hidden"
                    }}
                  >
                    <Flex align="center" css={{ mb: "$1" }}>
                      <Box>
                        <Avatar size="1" src={quote.profile_image_url} />
                      </Box>
                      <Flex css={{ ml: "$1", alignItems: "center" }}>
                        <Text size="2" css={{ fontWeight: "bold", lineHeight: "16px" }}>{quote.name}</Text>
                        {(quote.verified === true || options.forceVerified) &&
                          <VerifiedBadge css={{ ml: "$1" }} />}
                        <Text size="2" css={{ ml: "$1" }}>@{quote.username}</Text>
                        <Text size="2">
                          <Box as="span" css={{ mx: "$1" }}>??</Box>
                          <span>{moment(tweet.created_at).format(`D MMM${moment(tweet.created_at).year() < moment().year() ? "YYYY" : ""}`)}</span>
                        </Text>
                      </Flex>
                    </Flex>
                    <Box>
                      <Paragraph
                        size="0"
                        css={{
                          whiteSpace: "pre-line"
                        }}
                        dangerouslySetInnerHTML={{ __html: quote.text }}
                      />
                    </Box>
                  </Box>
                )
              })}
              {tweet.media &&
                <TweetCanvasMedia tweet={tweet} />}
              <Box
                css={{
                  mt: "$3",
                  opacity: 0.75,
                }}
              >
                <Text size="3" css={{
                  "> *": {
                    whiteSpace: "nowrap"
                  }
                }}>
                  {options.time &&
                    <>
                      <span>{moment(tweet.created_at).format("hh:mm A")}</span>
                      <Box as="span" css={{ mx: "$1" }}>??</Box>
                      <span>{moment(tweet.created_at).format("D MMM yyyy")}</span>
                    </>}
                  {options.time && options.source &&
                    <Box as="span" css={{ mx: "$1" }}>??</Box>}
                  {options.source &&
                    <span>{tweet.source}</span>}
                </Text>
              </Box>
            </Box>
          </Container>
          {options.watermark &&
            <Box css={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              "&:before": {
                content: '""',
                position: "absolute",
                top: "100%",
                left: 9,
                right: 9,
                backgroundColor: "$slate7",
                height: 10,
                borderRadius: "0 0 $2 $2"
              }
            }}>
              <Box css={{
                backgroundColor: "$slate7",
                py: 5,
                px: 16,
                color: "white",
                fontSize: "$1",
                "&:before, &:after": {
                  width: 10,
                  content: '""',
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  backgroundColor: "white"
                },
                "&:before": {
                  borderRadius: "0 50% 0 0",
                  left: -1,
                },
                "&:after": {
                  borderRadius: "50% 0 0 0",
                  right: -1,
                }
              }} >
                <Box css={{
                  position: "relative",
                  mb: -10
                }}>Snap with <Box as="span" css={{ fontWeight: "bold" }}>TWITE</Box></Box>
              </Box>
            </Box>}
        </Flex>
      </AspectRatio>
    </Container >
  )
}