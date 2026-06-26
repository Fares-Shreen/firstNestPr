import multer from "multer";
import { multer_enum, store_type_enum } from "../enum/multer.enum";
import { Request } from "express";
import { tmpdir } from "os";


export const multerCloud = ( {
    store_type = store_type_enum.memory, custom_types = multer_enum.image,
}: {
    store_type?: string;
    custom_types?: string[];
} = {}) => {
    console.log("multerCloud", store_type, custom_types);

    const storage = store_type === store_type_enum.memory ? multer.memoryStorage() : multer.diskStorage({
        destination: function (req: Request, file: Express.Multer.File, cb: Function) {
            cb(null, tmpdir()); 
        },
        filename: function (req: Request, file: Express.Multer.File, cb: Function) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + "-" + file.originalname);
        },
    });

    function fileFilter(req: Request, file: Express.Multer.File, cb: Function) {
        if (!custom_types.includes(file.mimetype)) {
            cb(new Error("Invalid file type"));
        } else {
            cb(null, true);
        }
    };

    return { storage, fileFilter }

}