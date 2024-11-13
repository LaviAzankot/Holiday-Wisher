import express from "express";
import bodyParser from "body-parser";
import {startDriver, getContacts, sendToContacts} from "./scrapar.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let startMessage = "";
let endMessage = "";
let contacts;

app.get("/", (req, res) => {
  res.render("index.ejs", {message: startMessage});
});

app.post("/create-message", async (req, res) => {
  startMessage = req.body.startMessage;
  endMessage = req.body.endMessage;
  await startDriver();
  res.render("contacts.ejs");
});

app.get("/contacts", async (req, res) => {
  contacts = await getContacts();
  res.render("contacts.ejs", {contacts: contacts});
});

app.post("/edit", (req, res) => {
  const selectedContacts = req.body.selectedContacts.split(",");
  res.render("edit.ejs", {contacts: selectedContacts});
});

// Test route
app.get("/edit", (req, res) => {
  const selectedContacts = ["אברום הספר", "איתי", "מנחם בגין"];
  res.render("edit.ejs", {contacts: selectedContacts});
});

app.post("/send", async (req, res) => {
  const result = req.body.editedContacts.split(",");
  const editedContacts = [];
  // Change the format of the array to [[searchName, editedName], ]
  for (let i=0; i<result.length; i++){
    if (i % 2 !== 0){
      editedContacts.push([result[i - 1], result[i]]);
    }
  }

  await sendToContacts(editedContacts, startMessage, endMessage);
  res.redirect("/");
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

