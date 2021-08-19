const fetch = require('node-fetch');
const credentials = require("./credentials-cal.json")
const { exec } = require("child_process");

const { FormData } = require('formdata-node');
const fs = require('fs')
const { createEntry, getProperty, editEntry } = require("./fileOperations")
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

    }
    /**
     * Prints a file in the local storage in 2Print folder.
     * @param {String} entry the filename to print. 
     * @returns {Boolean} true if mission successful, false otherwise.
     */
    print(entry) {
        console.log("Printing");
        if (!entry.includes(".gcode")) {
            entry += ".gcode"
        }
        if (!getProperty("./confirmation.json", entry, "printed") && getProperty("./confirmation.json", entry, "admin") && getProperty("./confirmation.json", entry, "user")) {

            fetch(`${this.link}api/files/local/2Print/${entry}`, {

                headers: {
                    "X-Api-Key": this.ApiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    command: "select",
                    print: true
                })


            })
            //IF  THE ABOVE IS NOT WORKING, UNCOMMENT THIS PART AND RUN ON LINUX ONLY

            // exec(`curl -d '{"command": "select", "print": true}' -H "X-Api-Key: ${this.ApiKey}" -H "Content-Type: application/json" -X POST http://137.22.30.138/api/files/local/2Print/${entry + ".gcode"}`, (error, stdout, stderr) => {
            //     if (error) {
            //         console.log(`error: ${error.message}`);
            //         return;
            //     }
            //     if (stderr) {
            //         console.log(`stderr: ${stderr}`);
            //         return;
            //     }
            //     console.log(`stdout: ${stdout}`);
            // });


            // editEntry("./confirmation.json", "phy.ysf1629297000000", "admin", true)
            // // TO DO => remove file form local storage
            // return true;
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
        exec(`curl -k -H "X-Api-Key: ${this.ApiKey}" -F "print=${print}" -F "file=@${__dirname}/Gcodes/${file}" -F path="2Print" "http://137.22.30.138/api/files/local"`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
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
    /**
     * 
     * @param {String} filename The filename to delete inside local/2Print including the .gcode at the end. 
     */
    deleteFile(filename) {
        fetch(`${this.link}api/files/local/2Print/${filename}`, {
            headers: {
                'X-Api-Key': this.ApiKey
            },
            method: "delete",
        }).then(res => {
            console.log(res)
        })
    }

    getInfo(filename) {
        return fetch(`${this.link}api/files/local/2Print/${filename}`, {
            headers: {
                'X-Api-Key': this.ApiKey
            },
            method: "GET",
        }).then(res => {
            return res.json();
        }).then(res => {
            console.log(res);
            return {
                name: res.display,
                printDuration: res.gcodeAnalysis.estimatedPrintTime

            }
        })
    }
}