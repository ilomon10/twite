import { Box } from "./Box"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Flex } from "./Flex"

const MediaPreview = ({ media, name }) => {
  return (
    <Box as="img"
      css={{
        objectFit: "cover",
        width: "100%",
        height: "100%"
      }}
      src={media.url}
      alt={name}
    />
  )
}

export const TweetCanvasMedia = ({ tweet }) => {
  let result;
  switch (tweet.media.length) {
    case 2:
      result = (
        <Box
          as={tweet.media.length > 1 ? AspectRatio : "div"}
          ratio={tweet.media.length > 1 ? 16 / 9 : undefined}
        >
          <Flex direction="column" css={{ height: "100%" }}>
            <Flex css={{ height: "100%" }}>
              <Box css={{ width: "50%", pr: 2 }}>
                <MediaPreview
                  media={tweet.media[0]}
                  name={tweet.name}
                />
              </Box>
              <Box css={{ width: "50%" }}>
                <MediaPreview
                  media={tweet.media[1]}
                  name={tweet.name}
                />
              </Box>
            </Flex>
          </Flex>
        </Box>
      );
      break;

    case 3:
      result = (
        <Box
          as={tweet.media.length > 1 ? AspectRatio : "div"}
          ratio={tweet.media.length > 1 ? 16 / 9 : undefined}
        >
          <Flex direction="row" css={{ height: "100%" }}>
            <Flex direction="column" css={{ height: "100%", width: "50%", pr: 2 }}>
              <MediaPreview
                media={tweet.media[0]}
                name={tweet.name}
              />
            </Flex>
            <Flex direction="column" css={{ height: "100%", width: "50%" }}>
              <Box css={{ height: "50%", pb: 2 }}>
                <MediaPreview
                  media={tweet.media[1]}
                  name={tweet.name}
                />
              </Box>
              <Box css={{ height: "50%" }}>
                <MediaPreview
                  media={tweet.media[2]}
                  name={tweet.name}
                />
              </Box>
            </Flex>
          </Flex>
        </Box>
      );
      break;

    case 4:
      result = (
        <Box
          as={tweet.media.length > 1 ? AspectRatio : "div"}
          ratio={tweet.media.length > 1 ? 16 / 9 : undefined}
        >
          <Flex direction="column" css={{ height: "100%" }}>
            <Flex css={{ height: "50%", pb: 2 }}>
              <Box css={{ width: "50%", pr: 2 }}>
                <MediaPreview
                  media={tweet.media[0]}
                  name={tweet.name}
                />
              </Box>
              <Box css={{ width: "50%" }}>
                <MediaPreview
                  media={tweet.media[1]}
                  name={tweet.name}
                />
              </Box>
            </Flex>
            <Flex css={{ height: "50%" }}>
              <Box css={{ width: "50%", pr: 2 }}>
                <MediaPreview
                  media={tweet.media[2]}
                  name={tweet.name}
                />
              </Box>
              <Box css={{ width: "50%" }}>
                <MediaPreview
                  media={tweet.media[3]}
                  name={tweet.name}
                />
              </Box>
            </Flex>
          </Flex>
        </Box>
      );
      break;
    default:
      result = (tweet.media.map((media) => {
        return (
          <Box
            key={media.media_key}
            as={AspectRatio}
            ratio={media.width / media.height}
          >
            <MediaPreview
              media={media}
              name={tweet.name}
            />
          </Box>
        )
      }));
  }
  return (
    <Box
      css={{
        border: "1px solid $slate7",
        borderRadius: "$3",
        overflow: "hidden"
      }}
    >
      {result}
    </Box>
  )
}