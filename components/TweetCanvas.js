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

export const TweetCanvas = ({ tweet, ratio, canvasRef, options }) => {
  const contentRef = useRef(null);
  const [scale, setScale] = useState(null);

  useEffect(() => {
    setScale(null);
    const canvasHeight = canvasRef.current.clientHeight;
    const contentHeight = contentRef.current.clientHeight;

    if (window.innerWidth < 467) return;

    let factor;
    if (canvasHeight > contentHeight) {
      factor = canvasHeight - contentHeight;
      factor = (factor / canvasHeight) * 100;
      factor = 100 + factor;
      if (factor > 150) factor = 150;
    } else {
      factor = (contentHeight / canvasHeight) * 100;
      factor = 100 - factor;
      factor = 100 + factor;
    }

    setScale(factor / 100);
  }, [ratio, canvasRef]);

  return (
    <Container size="2" css={{ mb: "$4" }}>
      <AspectRatio ratio={ratio} asChild={true} ref={canvasRef}>
        <Flex
          align="center"
          css={{
            overflow: "hidden",
            backgroundColor: "white",
            borderRadius: "$3",
            border: "1px solid $slate5"
          }}
        >
          <Container
            ref={contentRef}
            css={{
              maxWidth: "467px"
            }}
          >
            <Box css={{
              py: "$4",
              px: "$2",
              transform: `scale(${scale ? scale : 1})`
            }}>
              <Flex align="center" css={{ mb: "$2" }}>
                <Box>
                  <Avatar size="4" src={tweet.profile_image_url} />
                </Box>
                <Box css={{ ml: "$2" }}>
                  <Flex>
                    <Text size="2" css={{ fontWeight: "bold", lineHeight: "16px" }}>{tweet.name}</Text>
                    {(tweet.verified === true || options.forceVerified) &&
                      <VerifiedBadge css={{ ml: "$1" }} />}
                  </Flex>
                  <Text size="2">@{tweet.username}</Text>
                </Box>
              </Flex>
              <Box css={{ mb: "$2" }}>
                <Paragraph
                  css={{
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
                      <Flex css={{ ml: "$1" }}>
                        <Text size="2" css={{ fontWeight: "bold", lineHeight: "16px" }}>{quote.name}</Text>
                        {(quote.verified === true || options.forceVerified) &&
                          <VerifiedBadge css={{ ml: "$1" }} />}
                        <Text size="2">@{quote.username}</Text>
                        <Text size="2">
                          <Box as="span" css={{ mx: "$1" }}>·</Box>
                          <span>{moment(tweet.created_at).format(`D MMM${moment(tweet.created_at).year() < moment().year() ? "YYYY" : ""}`)}</span>
                        </Text>
                      </Flex>
                    </Flex>
                    <Box>
                      <Paragraph
                        size={0}
                        css={{
                          whiteSpace: "pre-line"
                        }}
                        dangerouslySetInnerHTML={{ __html: quote.text }}
                      />
                    </Box>
                  </Box>
                )
              })}
              {tweet.media && tweet.media.map((media) => {
                return (
                  <Box
                    key={media.media_key}
                    css={{
                      border: "1px solid $slate6",
                      borderRadius: "$3",
                      overflow: "hidden"
                    }}
                  >
                    <Box
                      as={AspectRatio}
                      ratio={media.width / media.height}
                    >
                      <Box as="img"
                        css={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%"
                        }}
                        src={media.url}
                        alt={tweet.name}
                      />
                    </Box>
                  </Box>
                )
              })}
              <Flex
                align="center"
                css={{
                  mt: "$2",
                  opacity: 0.75,
                }}
              >
                <Text size="2">
                  <span>{moment(tweet.created_at).format("hh:mm A")}</span>
                  <Box as="span" css={{ mx: "$1" }}>·</Box>
                  <span>{moment(tweet.created_at).format("D MMM yyyy")}</span>
                  <Box as="span" css={{ mx: "$1" }}>·</Box>
                  <span>{tweet.source}</span>
                </Text>
              </Flex>
            </Box>
          </Container>
        </Flex>
      </AspectRatio>
    </Container >
  )
}