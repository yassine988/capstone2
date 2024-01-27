import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));
app.use('*/images',express.static('public/images'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", async (req, res) => {
  res.render("index.ejs");
});




app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
