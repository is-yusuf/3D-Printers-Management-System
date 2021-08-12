const path = require("path");
const fs = require("fs");
exports.saveFile = function saveFile(file) {

    const tempPath = file.path;
    const targetPath = path.join(__dirname, "./Gcodes/Gcode.gcode");

    if (path.extname(file.originalname).toLowerCase() === ".gcode") {
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);

        });
        return {
            status: 200,
            contentType: "text/plain",
            end: "File uploaded!"
        }
    } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);
            return {
                status: 403,
                contentType: "text/plain",
                end: "Only .png files are allowed!"
            }
        });
    }
}