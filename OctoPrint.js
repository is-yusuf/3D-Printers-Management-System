const fetch = require('node-fetch');
const credentials = require("./views/assets/credentials-cal.json")

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
    getPrinterStatus() {
        return fetch(this.link + "/api/printer", this.options)
            .then(res => {
                return res.json()
            }).then(resfinal => {
                return !!resfinal.sd.ready && !(!!resfinal.state.flags.printing) && !!resfinal.state.flags.ready;
            })
    }

    selectFile(name, print) {
        let assignOptions = Object.assign(this.options);
        assignOptions["command"] = "select";
        assignOptions["print"] = print;
        fetch(this.link + "api/files/sdcard/toPrint" + name, assignOptions)
    }

    uploadFile(file, filename) {
        console.log("making request...");
        fetch(this.link + "api/files/sdcard", {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Api-Key': this.ApiKey
            },
            body: {
                formdata
            }
        }).then(res => {
            console.log("then");
            return res.json()
        }).then(resfinal => {
            console.log(resfinal);
        })
    }


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


// Class instance of print id
// attribute user.confirm = true
// 