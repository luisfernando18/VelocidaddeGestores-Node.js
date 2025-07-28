import "dotenv/config";
import Express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import router from "./src/routes/products.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Express();

app.use(Express.static(path.join(__dirname, "src", "static")));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.text());
app.use(cors());

// Show the index.html file when accessing the root URL
// This is the main entry point of the application
app.get("/", (req, res) => {
  res.sendFile(path.resolve("src/static/index.html"));
});

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("Access the application at http://localhost:3000");
});
