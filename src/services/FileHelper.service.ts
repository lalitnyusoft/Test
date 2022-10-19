const documentPath = '.';
const uploadsProfilePath = '/profile';
const uploadsDocumentsPath = '/documents';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

export class FileHelper {
    static customFileName(req, file, cb) {
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        //let fileExtension = "";
        // if (file.mimetype.indexOf("jpeg") > -1) {
        //     fileExtension = "jpg"
        // } else if (file.mimetype.indexOf("png") > -1) {
        //     fileExtension = "png";
        // }
        if(file.fieldname === 'profileDocument'){
            let filename: string =
                uploadsProfilePath + '/' + path.parse('profile-').name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
        }
        if(file.fieldname === 'licenseDocument'){
            let filename: string = uploadsDocumentsPath + '/' + path.parse('license-').name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
        }
    }

    static destinationPath(req, file, cb) {
        cb(null, '.' + documentPath)
    }
}