let slot_s = new Date("2021-07-30T08:00:00.000Z")
let slot_e = new Date("2021-07-30T09:30:00.000Z")
let event_s = new Date("2021-07-30T08:00:00.000Z")
let event_e = new Date("2021-07-30T08:30:00.000Z")

// console.log(x, y, z, f)




console.log(overlaps(slot_s, slot_e, event_s, event_e))

function overlaps(s_s, s_e, e_s, e_e) {
    s_s = s_s.getTime()
    s_e = s_e.getTime()
    e_s = e_s.getTime()
    e_e = e_e.getTime()

    if (e_s - s_s >= s_s - s_e && s_e > e_s) {
        return true
    }
    else {
        return false
    }
    if (s_s < e_s && s_e < e_e) {
        console.log("case 1")
        return false;
    }
    if (s_s == e_s) {
        console.log("case 2")
        return true;
    }
    if (s_s > e_s && s_e <= e_e) {
        console.log("case 3")
        return true;
    }
    if (s_s > e_e) {
        console.log({ s_s, e_e })
        console.log("case 4")
        return false;
    }
    if (s_s < e_s && s_e < e_e) {
        console.log("case 5")
        return true;
    }
    if (s_s < e_s && s_e > e_s) {
        console.log("case 6")
        return true;
    }
    return false;
}