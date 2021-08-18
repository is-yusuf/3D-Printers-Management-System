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
 * @param {String} filename the database file name including the .json at the end. 
 * @param {String} entry th
 * @param {String} property 
 */

exports.createEntry = function createEntry(filename, entry, property) {
    let file = require(`${__dirname}/${filename}`)
    JSON.stringify(file)
    if (!file[entry]) {
        file[entry] = {}
    }
    file[entry][property] = true;
    fs.writeFile(`${__dirname}/${filename}`, JSON.stringify(file, null, 2), (err) => { console.error(err); })
}
/**
 * Returns the value of a property in the .json file.
 * @param {String} filename database filename of the .JSON file including .json at the end. 
 * @param {String} entry the .gcode file name without .gcode at the end
 * @param {String} property the property of the .gcode file (printer, admin, user)
 * @returns 
 */
exports.getProperty = function getProperty(filename, entry, property) {
    let file = require(`${__dirname}/${filename}`)
    JSON.stringify(file);
    return file[entry][property]
}