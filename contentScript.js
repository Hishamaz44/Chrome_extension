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
    let allText = document.querySelector("main, article").innerText;
    let allTextFull = document.body.innerText;
    if (allText && allTextFull) {
      let textRatio = allText.length / allTextFull.length;
      // alert(textRatio);
      if (textRatio > 0.5) {
        console.log("Code is not going in else clause");
        return allText;
      } else {
        console.log("Code is going in else clause");
        return allTextFull;
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    let allTextFull = document.body.innerText;
    return allTextFull;
  }
}

function cleanData(text) {}
