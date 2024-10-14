import { Request } from "express";
import { existsSync, mkdirSync } from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const uploadDirPath = path.join(__dirname, 'uploads');
const uploadDirPath = `${__dirname.slice(0, 41)}/uploads`;

if (!existsSync(uploadDirPath)) {
  mkdirSync(uploadDirPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req: Request, file, callback) {
    return callback(null, uploadDirPath);
  },
  filename: function (req: Request, file, callback) {
    return callback(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
export { uploadDirPath };
