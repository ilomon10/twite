import ReactDOMServer from "react-dom/server"
import { Link } from "./Link"

const Anchor = ({ text, href, variant = "blue", title }) => {
  return (<Link variant={variant} href={href} title={title}>{text}</Link>);
}

export const tweetProcessor = (text, urls, options) => {
  let opts = {
    tcl: null,
    keepLastUrl: false,
    highlight: true,
    ...options
  }
  let { tcl, highlight, keepLastUrl } = opts;
  try {
    if (tcl !== null) {
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
            href: url,
            variant: !highlight && ""
          }));
          text = text.replace(displayText, anchor);
        });
      }
    }
    urls.map(({ display_url, url, expanded_url }, idx) => {
      let anchor = ReactDOMServer.renderToString(Anchor({
        text: display_url,
        href: url,
        variant: !highlight && "",
        title: expanded_url
      }));
      if (!keepLastUrl) if (idx === urls.length - 1) anchor = "";
      text = text.replace(url, anchor);
    });
  } catch (err) {
    // do nothing
  }

  return text;
}