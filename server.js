import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 4000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use('/images', express.static('public/images'));

// In-memory data store
let posts = [
  {
    id: 1,
    image: "/images/images/0.jpeg", // Relative path to the image
    title: "Full metal alchemist brotherhood ",
    content:
      "Abandoned by their father as kids, two young brothers, Edward and Alphonse Elric lived with their mother in a small town called Resembool. After losing their mother to a terminal illness, they try to resurrect her using alchemy - a science which allows you to transform physical matter from one form to another.",
    author: "Hiromu Arakawa",
    date: "2024-01-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Attack on titan",
    image: "/images/images/1.jpeg", // Relative path to the image
    content:
      " After his hometown is destroyed and is traumatized, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction. Humans are nearly exterminated by giant creatures called Titans.",
    author: "Hajime Isayama",
    date: "2024-01-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Monster",
    image: "/images/images/2.jpeg", // Relative path to the image
    content:
      "Dr. Kenzo Tenma is a young Japanese brain surgeon, working at Eisler Memorial Hospital in Düsseldorf, West Germany. Tenma is dissatisfied with the political bias of the hospital in treating patients, and seizes the chance to change things after a massacre brings fraternal twins Johan and Anna Liebert into the hospital.",
    author: "Naoki Urasawa",
    date: "2024-01-10T09:15:00Z",
  },
];
let lastId = 3;





// GET all posts
app.get("/posts", (req, res) => {
  console.log(posts);
  res.json(posts);
});



// GET a specific post by id
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST a new post
app.post("/posts", upload.any('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Please upload a file');
  }

  const newId = lastId += 1;
  const post = {
    id: newId,
    title: req.body.title,
    file : `<img src="/uploads/${file.filename}" alt="Uploaded Image">`,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };

  // Update lastId and add post to posts array
  console.log(post);
  lastId = newId;
  posts.push(post);

  // Send response
  res.status(201).json(post);
});

// PATCH a post when you just want to update one parameter
app.patch("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author) post.author = req.body.author;

  res.json(post);
});

// DELETE a specific post by providing the post id
app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
