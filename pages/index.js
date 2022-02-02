import Head from 'next/head'
import { Box } from '../components/Box'
import { Container } from '../components/Container'
import { Flex } from '../components/Flex'
import { Text } from '../components/Text'
import { TweetLoader } from '../components/TweetLoader'
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { IconButton } from '../components/IconButton'

export async function getStaticProps() {
  const data = {}

  return {
    props: data
  }
}

export default function Home(props) {

  return (
    <Box>
      <Head>
        <title>TWITE</title>
        <meta name="description" content="An open source tweet snapshot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="1" css={{ my: "$2" }}>
        <Flex align="center" justify={"between"}>
          <Box>
            <Text>TWITE</Text>
          </Box>
          <Box>
            <Text>
              <IconButton
                as="a"
                target="_blank"
                href="https://github.com/ilomon10/twite"
                size="2"
              >
                <GitHubLogoIcon />
              </IconButton>
            </Text>
          </Box>
        </Flex>
      </Container>

      <TweetLoader />
    </Box>
  )
}
