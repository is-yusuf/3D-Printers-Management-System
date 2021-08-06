check exact date
return !(this.eventArr.some((event) => {
    return this.overlaps(startDate, endDate, event.start, event.end)
}))


convert event Array

this.eventArr.reduce((event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
})