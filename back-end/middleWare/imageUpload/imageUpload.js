import multer from "multer";
import fs from "fs";
import path from "path";

// 📁 Upload folder path
const uploadPath = path.join("uploads", "doctors");

// 🔹 Create folder automatically if not exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// 🔹 Storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// 🔹 File filter (only images allowed)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

// 🔹 Upload middleware
const uploadDoctorImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default uploadDoctorImage;