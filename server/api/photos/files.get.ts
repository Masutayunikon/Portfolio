import * as fs from "fs";
import path from "path";

export default defineEventHandler(async () => {

    // read all file from assets/photos
    const filePath = path.join(process.cwd(), 'assets/photos');

    const files = fs.readdirSync(filePath);

    return {
        files
    }

});
