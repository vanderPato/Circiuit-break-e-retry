const axios = require("axios")
const app = axios.create({
    baseURL:'https://cdn.apicep.com/file/apicep/'
})

module.exports = app;