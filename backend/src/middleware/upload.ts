import multer from "multer";
import path from "path";

interface StorageCallback {
  (error: Error | null, destination: string): void;
}

interface FilenameCallback {
  (error: Error | null, filename: string): void;
}

const storage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: StorageCallback) => {
    cb(null, "uploads/");
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: FilenameCallback) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

export default upload;