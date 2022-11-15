const jsonServer = require('json-server')
const router = jsonServer.router('db.json')
const cors = require("cors");

const middlewares = jsonServer.defaults()
const server = jsonServer.create()
server.use(middlewares)
server.use(router)
app.use(cors());

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Database running on port ${port}`)
})