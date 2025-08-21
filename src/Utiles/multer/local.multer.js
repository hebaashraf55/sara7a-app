import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";


export const localFileUpload = () => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, path.resolve("./uploads")); 
        },
        filename : (req, file, cb) => {
            const uniqueFileName = 
            Date.now() + "__" + Math.random()  + "__" + file.originalname
            
            cb(null, uniqueFileName)
        }})

    return multer({
        storage
    })
}

