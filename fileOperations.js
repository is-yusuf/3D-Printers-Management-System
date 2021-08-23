const path = require("path");
const fs = require("fs");
/**
 * Renames and saves file to the folder Gcodes in the main directory.
 * @param {File} file the file to rename and save
 * @param {String} name the name of the new file.
 * @returns {Object} status: the status code, contentType: the content type of the response, end: message to be displayed
 */
exports.saveFile = function saveFile(file, name) {

    const tempPath = file.path;
    const targetPath = path.join(__dirname, "./Gcodes/", name);

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
                end: "Only .gcode files are allowed!"
            }
        });
    }
}
/**
 * 
 * @param {String} name The file name to be deleted with or without .gcode at the end. 
 */
exports.deleteFile = function deleteFile(name) {
    if (!name.includes(".gcode")) {
        name += ".gcode"
    }
    fs.unlink(__dirname + "/Gcodes/" + name, err => {
        if (err) {
            console.error(err);
        }
    })
}