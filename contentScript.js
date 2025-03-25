document.addEventListener("DOMContentLoaded", () => {
  const retrieveButton = document.getElementById("button");
  if (retrieveButton) {
    retrieveButton.addEventListener("click", () => {
      // Query the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          // Inject script into the active tab
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              func: extractTextFromPage,
            },
            (results) => {
              // Display the extracted text
              const textContent = results[0]?.result || "No text found!";
              document.getElementById("output").textContent = textContent;
            }
          );
        }
      });
    });
  } else {
    console.error("Button with ID 'retrieveText' not found!");
  }
});

function extractTextFromPage() {
  try {
    //compare main and article tags to all text present.
    //if ratio is less than 0.8 it means we might miss a good percentage of text,
    //so we go for the entire text
    let allText =
      document.querySelector("main, article, section")?.innerText || " ";
    let allTextFull = document.body.innerText;
    textRatio = allText.length / allTextFull.length;
    console.log(textRatio);
    if (textRatio > 0.8) {
      console.log("Code is not going in else clause");
      return allText;
    } else {
      console.log("Code is going in else clause");
      return allTextFull;
    }
  } catch (err) {
    console.log(err);
  }
}

function cleanData(text) {}
