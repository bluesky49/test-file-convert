import express from "express";
import cors from "cors";
import multer from "multer";
import groupdocs_conversion_cloud from "groupdocs-conversion-cloud";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const client_id = process.env.client_id || "ed84a80a-c590-4454-a020-423905563d4c";
const client_secret = process.env.client_secret || "78e6e6543753cbbfeabe5df1766995dc";

const app = express();
app.use(cors({ maxAge: 6000 }));

const port = 4000;
app.listen(port, () => console.log(`Api is listening at ${port} port`));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage }).single("file");

app.get("/", (req, res) => {
  return res.send("File conversion api")
})
app.post("/convert", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      try {
        const file = fs.readFileSync(req.file.path);
        const request = new groupdocs_conversion_cloud.ConvertDocumentDirectRequest("docx", file);
        const convertApi = groupdocs_conversion_cloud.ConvertApi.fromKeys(client_id, client_secret);
        const result = await convertApi.convertDocumentDirect(request);
        fs.writeFile(`output/converted.docx`, result, "binary", function (err) {
          fs.unlinkSync(req.file.path)
          res.download(`output/converted.docx`, (err) => {
            fs.unlinkSync(`output/converted.docx`)
          });
        });
      } catch (err) {
        console.log(err)
        return res.status(500).send("internal server error")
      }
    }
  })
});