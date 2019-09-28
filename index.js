const _ = require("lodash");
const jsonpatch = require("json-patch");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const Path = require("path");

const { generateAuthToken, validateUser } = require("./Auth/validate");
const auth = require("./middlewares/auth");
const { resize, downloadImage } = require("./utility/imageFunc");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/logintest", auth, (req, res) => {
  console.log("Authenticated successfully");
  res.status(200).send("success authticated");
});

app.get("/", (req, res) => {
  res.send("hello world");
});

//POST Api to login and recieve a JWT for authentication
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = _.pick(req.body, ["username", "password"]);
  console.log(user);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const token = generateAuthToken(user);

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["username", "password"]));
});


//POST route to apply patch to a json document using json patch
app.post("/api/applyPatch", auth, async (req, res) => {
  const { doc, patch } = req.body;
  try {
    const newDoc = await jsonpatch.apply(doc, patch);
    res.status(200).send(newDoc);
  } catch (err) {
    res.status(400).send(err);
  }
});

//POST route to resize and store image in Images Directory
app.post("/api/imageResize", auth, async (req, res) => {
  const { url } = req.body;
  const outputStream = Path.join(__dirname, "./images", "resizedTest.jpg");

  const input = await downloadImage(url);
  const output = await resize(input, outputStream);

  res.status(200).send(output);
});




const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started at Port: ${PORT}`);
});
