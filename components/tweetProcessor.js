import ReactDOMServer from "react-dom/server"
import { Link } from "./Link"

const Anchor = ({ text, href, variant, title }) => {
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
    const urlsInText = text.match(/(https?:\/\/[^\s]+)/g);
    if (urlsInText) {
      for (let [index, url] of urlsInText.entries()) {
        const u = urls.find(u => u.url === url);
        let anchor = ReactDOMServer.renderToString(Anchor({
          text: u.display_url,
          href: u.url,
          variant: highlight && "blue",
          title: u.expanded_url
        }));
        if (!keepLastUrl) if (index === urlsInText.length - 1) anchor = "";
        text = text.replace(url, anchor);
      }
    }
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
            variant: highlight && "blue"
          }));
          text = text.replace(displayText, anchor);
        });
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error(err.message);
    } else {
      // do nothing
    }
  }

  return text;
}