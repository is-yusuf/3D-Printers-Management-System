const fetch = require('node-fetch');
const credentials = require("./views/assets/credentials-cal.json")
const ApiKey = credentials['X-Api-Key'];

exports.fetchUser = function fetchUsers() {
    fetch("http://137.22.30.138/api/access/users", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': ApiKey
        },
    }).then(res => {
        return res.json()
    }).then(resfinal => {
        console.log(resfinal)
    })
}

