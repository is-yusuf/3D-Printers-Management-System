
async function testing() {
    return await testing2().then((res) => {
        return res;
    })
}


async function testing2() {
    return "text we want"
}

testing().then((text) => {
    console.log(text);
})