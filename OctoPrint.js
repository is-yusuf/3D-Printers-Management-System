const fetch = require('node-fetch');
const credentials = require("./views/assets/credentials-cal.json")
const { exec } = require("child_process");

const { FormData } = require('formdata-node');
const fs = require('fs')
const { createEntry, getProperty } = require("./fileOperations")
exports.OctoPrint = class OctoPrint {

    constructor() {
        this.link = "http://137.22.30.138/"
        this.ApiKey = credentials['X-Api-Key'];
        this.options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': 300,
                'X-Api-Key': this.ApiKey
            },
        }
        this.adminconfirm = false;
        this.userconfirm = false;

    }
    /**
     * Prints a file in the local storage in 2Print folder.
     * @param {String} filename the filename to print. 
     * @returns {Boolean} true if mission successful, false otherwise.
     */
    print(filename) {
        if (this.adminconfirm && this.adminconfirm && !getProperty("./confirmation.json", filename, "printed")) {
            let assignOptions = Object.assign(this.options);
            assignOptions["command"] = "select";
            assignOptions["print"] = true;
            fetch(this.link + "api/files/local/2Print/" + filename, assignOptions).then(res => res.json()).then((resfinal) => {
                console.log(resfinal);
            })
            createEntry(filename, "printed", true)
            // TO DO => remove file form local storage
            return true;
        }
        return false;
    }
    /**
     * 
     * @returns boolean true if the printer is ready to print, false otherwise.
     */
    getPrinterStatus() {
        return fetch(this.link + "/api/printer", this.options)
            .then(res => {
                return res.json()
            }).then(resfinal => {
                return !!resfinal.sd.ready && !(!!resfinal.state.flags.printing) && !!resfinal.state.flags.ready;
            })
    }

    /**
     * Uploads a file from the folder Gcodes to OctoPrint server.
     * @param {String} file The string of the file name. Accepts both ending with .gcode or not.
     * @param {Boolean} print Boolean Value to specify if true uploads and prints file if false uploads only, defaults to false. 
     */
    uploadFile(file, print = false) {
        console.log({ filename: file });

        if (!file.includes(".gcode")) {
            file += ".gcode"
        }
        exec(`curl -k -H "X-Api-Key: ${this.ApiKey}" -F "print=${print}" -F "file=@C:/Users/phyys/Desktop/Mkr/form/Gcodes/${file} path="2Print" "http://137.22.30.138/api/files/local"`, (error, stdout, stderr) => {
            if (error) {
                // console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                // console.log(`stderr: ${stderr}`);
                return;
            }
            // console.log(`stdout: ${stdout}`);
        });



    }

    /**
     * Returns a lisk of users with their permissions
     */
    getUsersList() {
        console.log(`${this.link}api/access/users`);
        fetch(`${this.link}api/access/users`, this.options)
            .then(res => {
                return res.json()
            }).then(resfinal => {
                console.log(resfinal)
            })
    }
}

