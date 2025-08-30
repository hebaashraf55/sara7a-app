import multer from "multer";
import path from "path";
import fs from "node:fs";


export const fileValidation = {
    images : ["image/png", "image/jpg", "image/jpeg"],
    vedio : ["video/mp4", "video/mpeg", "video/quicktime"],
    audio : ["audio/mpeg", "audio/wav", "audio/ogg"],
    documents : [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text',
        'application/vnd.oasis.opendocument.presentation',
        'application/vnd.oasis.opendocument.spreadsheet',
        'application/vnd.oasis.opendocument.graphics',
        'application/vnd.oasis.opendocument.chart',
        'application/vnd.oasis.opendocument.formula',
        'application/vnd.oasis.opendocument.image',
        'application/vnd.oasis.opendocument.text-master',
        'application/vnd.oasis.opendocument.text-template',
        'application/vnd.oasis.opendocument.text-web',
    ]
}


export const localFileUpload = ({customPath = "general" , validation = []}) => {

    let basePath = `uploads/${customPath}`

    const storage = multer.diskStorage({
        destination: (req, file, cb) =>{
            if(req.user?._id) basePath+= `/${req.user._id}`
            const fullPath = path.resolve(`./src/${basePath}`)
            if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath , { recursive: true }) 
            cb(null, path.resolve(fullPath)); 
        },
        filename : (req, file, cb) => {
            const uniqueFileName = 
            Date.now() + "__" + Math.random()  + "__" + file.originalname;
            file.finalPath = `${basePath}/${uniqueFileName}`
            cb(null, uniqueFileName)
        }});
        const fileFilter = (req, file , cb) => {
            if(validation.includes(file.mimetype)) {
                cb(null, true)
            }else{
               return cb(new Error("Invalid file type"), false)
            }
        };

    return multer({
        fileFilter,
        storage,
    })
}

