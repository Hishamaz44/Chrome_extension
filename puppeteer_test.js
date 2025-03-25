import puppeteer from "puppeteer";
import fs from "fs";
import stopword from "stopword";
import nlp from "compromise";

let allText, allTextFull;
let collectedInfo = [];
let collectedErrors = [];

const websitesWithText = [
  "https://www.nytimes.com", // In-depth journalism
  "https://www.oecd.org",
  "https://www.cnn.com",
  "https://www.medium.com",
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
    // connect to extension and open puppeteer browser
    const pathToExtension =
      "/Users/hisha/OneDrive/Desktop/Chrome-extension/Chrome_extension/";
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    //go to chosen URL
    const page = await browser.newPage();
    await page.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    //inject functionality into opened browser and tab
    let { extractedText, textRatio } = await page.evaluate(() => {
      try {
        allText =
          document.querySelector("main, article, section")?.innerText || " ";
        allTextFull = document.body.innerText;
        //compare main and article tags to all text present.
        //if ratio is less than 0.8 it means we might miss a good percentage of text,
        //so we go for the entire text
        if (allText && allTextFull) {
          textRatio = allText.length / allTextFull.length;
          if (textRatio > 0.8) {
            return { extractedText: allText, textRatio };
          } else {
            return { extractedText: allTextFull, textRatio };
          }
        } else {
          return { extractedText: allTextFull, textRatio };
        }
      } catch (err) {
        console.log(err);
        return { error: err, textRatio };
      }
    });
    // save everything in collectedInfo array
    let extractedText2 = cleanText(extractedText);
    collectedInfo.push({ url, text: extractedText2, textRatio });
    await browser.close();
  } catch (error) {
    collectedErrors.push({ url, error: error.message });
  }
}

function cleanText(extractedText) {
  let text = nlp(extractedText);
  text.normalize;
  console.log(text.out("text"));
}

//call function for multiple websites
(async () => {
  for (const url of websitesWithText) {
    await testPuppeteer(url);
  }
  //save files in .json file for analysis
  fs.writeFileSync(
    "extracted_text.json",
    JSON.stringify(collectedInfo, null, 2)
  );
  fs.writeFileSync(
    "extracted_errors.json",
    JSON.stringify(collectedErrors, null, 2)
  );
})();
