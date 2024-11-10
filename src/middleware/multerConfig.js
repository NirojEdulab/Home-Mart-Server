const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the correct path to the 'public/uploads' folder at the root level
    const uploadPath = path.join(__dirname, "..", "public", "uploads"); // The correct folder path at the root

    // Check if the folder exists, if not, create it
    fs.exists(uploadPath, (exists) => {
      if (!exists) {
        // Create the folder if it doesn't exist
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
          if (err) {
            return cb(new Error("Could not create uploads folder."));
          }
          cb(null, uploadPath); // Proceed with the file upload
        });
      } else {
        cb(null, uploadPath); // Proceed with the file upload if the folder exists
      }
    });
  },
  filename: (req, file, cb) => {
    // Save files with a unique name (timestamp + original filename)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create a multer upload instance with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("File type not allowed. Only images are allowed!"));
    }
  },
});

module.exports = upload;
