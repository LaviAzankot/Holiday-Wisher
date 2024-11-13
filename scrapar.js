import chrome from "selenium-webdriver/chrome.js";
import {Key, By} from "selenium-webdriver";
import {question} from "readline-sync";

const ChromeDriverPath ="C:\Development\chromedriver.exe";
const VerticalMove = 1500;
let driver;

async function startDriver(){
    // Initialization
    let service = new chrome.ServiceBuilder()
      .loggingTo(ChromeDriverPath)
      .enableVerboseLogging()
      .build();
    
    let options = new chrome.Options();
    options.addArguments("--log-level=3");
    driver = chrome.Driver.createSession(options, service);

    // Enter to Whatsapp
    await driver.get("https://web.whatsapp.com/");
  }
  
async function getContacts(){
    // Get the scroll bar
    const scrollBar = await driver.findElement(
      By.id("pane-side")
    );
    let scrollTop = 0;
    const contacts = [];

    // While we are not at the end of the page:
    for (let i=0; i <= 15; i++){
        // Scroll down
        await driver.executeScript("arguments[0].scrollTop = arguments[1]", scrollBar, scrollTop);
        // Wait for 500ms
        await sleep(500);
        // Get contacts
        const results = await driver.findElements(
          By.css("._ak8o > ._ak8q > div > span")
        );

        if (results){
          results.forEach(result => {
            result.getText().then((text) => {
              contacts.push(text);
            })
          });
        }

        scrollTop += VerticalMove;
    }

    return contacts;
}

async function sendToContacts(contacts, startMessage, endMessage){
  // Get the seachBar
  const searchBar = await driver.findElement(
    By.css("div.x1hx0egp.x6ikm8r.x1odjw0f.x6prxxf.x1k6rcq7.x1whj5v")
  );
  console.log(searchBar);

  for (const contact of contacts) {
    const searchName = contact[0];
    const editedName = contact[1];

    // Search for the contact (Delete the pervious entry first)
    await searchBar.sendKeys(Key.chord(Key.CONTROL, "a") + Key.DELETE);
    sleep(100);
    console.log("Deleted succesfully");
    await searchBar.sendKeys(searchName, Key.ENTER);
    sleep(500);
    console.log("Searched succesfully");

    // Click on the input field and send the message with its name.
    const inputField = await driver.findElement(
      By.css("#main [contenteditable]")
    );
    const personalMsg = `${startMessage} ${editedName}  ${endMessage}`;
    await inputField.sendKeys(personalMsg, Key.ENTER);
    console.log("Sent succesfully");
    sleep(500);
  };


}

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

export {startDriver, getContacts, sendToContacts};