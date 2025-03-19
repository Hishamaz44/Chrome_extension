import puppeteer from "puppeteer";
import fs from "fs";

let allText, allTextFull;
let collectedInfo = [];
let collectedErrors = [];

const websitesWithText = [
  "https://www.nytimes.com", // In-depth journalism
  "https://www.oecd.org",
];
const websitesWithText2 = [
  "https://www.wikipedia.org", // Encyclopedia
  "https://www.bbc.com/news", // News articles
  "https://www.nytimes.com", // In-depth journalism
  "https://www.cnn.com", // News articles
  "https://www.theguardian.com", // Global news
  "https://www.forbes.com", // Business & financial articles
  "https://www.reddit.com/r/AskReddit", // User-generated discussions
  "https://www.medium.com", // Blog articles
  "https://www.quora.com", // Long-form Q&A
  "https://www.ted.com", // Talk transcripts
  "https://www.nationalgeographic.com", // Science & environment articles
  "https://www.imdb.com/news", // Movie news & interviews
  "https://www.rottentomatoes.com/news", // Film reviews & analysis
  "https://www.coursera.org/articles", // Educational articles
  "https://www.khanacademy.org", // Free educational lessons
  "https://www.edx.org/course", // Course descriptions & articles
  "https://www.nature.com", // Scientific research
  "https://www.sciencedirect.com", // Science & academic papers
  "https://arxiv.org", // Open-access research papers
  "https://plato.stanford.edu", // Stanford Encyclopedia of Philosophy
  "https://www.gutenberg.org", // Free classic books
  "https://www.howstuffworks.com", // Explainers on various topics
  "https://www.npr.org", // Public radio articles
  "https://www.fivethirtyeight.com", // Data-driven journalism
  "https://www.theatlantic.com", // In-depth analysis
  "https://www.vox.com", // Explainer journalism
  "https://www.economist.com", // Business & world news
  "https://www.wsj.com", // Business & financial news
  "https://www.nasa.gov", // Space & science articles
  "https://www.history.com", // Historical articles
  "https://www.biography.com", // Biographical articles
  "https://www.healthline.com", // Health & medical information
  "https://www.webmd.com", // Medical advice & guides
  "https://www.mayoclinic.org", // Medical & health articles
  "https://www.psychologytoday.com", // Psychology & self-help articles
  "https://www.who.int", // World Health Organization reports
  "https://www.worldbank.org", // Economic & social development reports
  "https://www.un.org/en/", // UN articles & global reports
  "https://www.oecd.org", // Economic cooperation & research
  "https://www.statista.com", // Data & statistics reports
  "https://www.ourworldindata.org", // Global data & trends
  "https://www.nationalreview.com", // Political & cultural analysis
  "https://www.smithsonianmag.com", // History & science articles
  "https://www.artsy.net", // Art history & analysis
  "https://www.metmuseum.org/blogs", // Art & museum articles
  "https://www.louvre.fr/en/explore", // Museum articles
  "https://www.goodreads.com", // Book reviews & literary analysis
  "https://www.scientificamerican.com", // Science journalism
  "https://www.newscientist.com", // Science & technology news
  "https://www.wired.com", // Tech & digital culture articles
  "https://developer.mozilla.org", // Programming & web dev documentation
];

async function testPuppeteer(url) {
  try {
    const pathToExtension =
      "/Users/hisha/OneDrive/Desktop/Chrome-extension/Chrome_extension/";
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    const page = await browser.newPage();
    await page.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    let { extractedText, textRatio } = await page.evaluate(() => {
      try {
        console.log("text goes into 2nd try");
        allText = document.querySelector("main, article").innerText;
        allTextFull = document.body.innerText;
        if (allText && allTextFull) {
          textRatio = allText.length / allTextFull.length;
          if (textRatio > 0.5) {
            return { extractedText: allText, textRatio };
          } else {
            return { extractedText: allTextFull, textRatio };
          }
        } else {
          return { extractedText: allTextFull, textRatio };
        }
      } catch (err) {
        console.log(err);
      }
    });
    collectedInfo.push({ url, text: extractedText, textRatio });
    await browser.close();
  } catch (error) {
    collectedErrors.push({ url, error: error.message });
  }
}

(async () => {
  for (const url of websitesWithText2) {
    await testPuppeteer(url);
  }
  fs.writeFileSync(
    "extracted_text.json",
    JSON.stringify(collectedInfo, null, 2)
  );
  fs.writeFileSync(
    "extracted_errors.json",
    JSON.stringify(collectedErrors, null, 2)
  );
})();
