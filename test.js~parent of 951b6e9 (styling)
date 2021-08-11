let slot_s = new Date("2021-07-30T19:00:00.000Z")
let slot_e = new Date("2021-07-30T20:30:00.000Z")
let event_s = new Date("2021-07-30T14:30:00.000Z")
let event_e = new Date("2021-07-30T18:30:00.000Z")

// console.log(x, y, z, f)




console.log(overlaps(slot_s, slot_e, event_s, event_e))

function overlaps(s_s, s_e, e_s, e_e) {
    s_s = s_s.getTime()
    s_e = s_e.getTime()
    e_s = e_s.getTime()
    e_e = e_e.getTime()
    if (s_s > e_e || s_e < e_s) {
        return false
    }

    else {
        return true
    }
}