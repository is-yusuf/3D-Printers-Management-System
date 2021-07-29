


let simulate = async function (num, callbackfunc) {
    return 1
};


function wrapper() {
    return simulate(1, () => {
        return simulate(1, () => {
            return 1
        })
    })
}

wrapper().then((res) => {
    console.log(res);
})