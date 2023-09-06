import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/images`)
    },
    filename: (req,file,cb) => {
        console.log(file);
        cb(null, `${Date.now()}---${file.originalname}`)
    }
})

export const uploader = multer({storage})
export default __dirname;