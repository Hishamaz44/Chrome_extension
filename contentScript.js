document.addEventListener("DOMContentLoaded", () => {
    const retrieveButton = document.getElementById("button");
    if (retrieveButton) {
      retrieveButton.addEventListener("click", () => {
        // Query the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            // Inject script into the active tab
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id},
                func: extractTextFromPage
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
  
  // Function to extract all text from the webpage
  function extractTextFromPage() {
    let allText = document.querySelector("main, article").innerText.trim();
    let allTextFull = document.body.innerText.trim();
    // console.log("Code goes here if website is not amazon", allText);
    let textRatio = allText.length / allTextFull.length;
    // alert(textRatio);
    if (textRatio > 0.5) {
      return allText;
    }
    else {
      return allTextFull;
    }
  }

  function cleanData(text){

  }