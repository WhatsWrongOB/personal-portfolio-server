import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// mkdirSync(`${__dirname.slice(0, 41)}/uploads`);
const uploadDirPath = `${__dirname.slice(0, 41)}/uploads`;
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        return callback(null, uploadDirPath);
    },
    filename: function (req, file, callback) {
        return callback(null, `${file.originalname}`);
    },
});
const upload = multer({ storage });
export default upload;
export { uploadDirPath };