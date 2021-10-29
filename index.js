const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const port = process.env.PORT;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const publicPath = path.resolve(__dirname, 'public');
const Bands = require('./models/bands');
const Band = require('./models/band');
const bands = new Bands();
app.use(express.static(publicPath));
bands.addBand(new Band("jafet ruiz"));
bands.addBand(new Band("Tercer Cielo"));
bands.addBand(new Band("Samuel Hernandez"));
bands.addBand(new Band("Any Puello"));

io.on('connection', cliente => {
    cliente.emit('activeBand', bands.getBands());

    console.log('servidor Conectado');
    cliente.on('disconnect', () => {
        console.log('servidor desconectad');
    });
    cliente.on('mensaje', (data) => {
        console.log(`mensaje ${data}`);
    });
    cliente.on('mensaje-flutter', (data) => {
        console.log(`mensaje ${data}`);
        cliente.broadcast.emit('mensaje-flutter', data);
    });
    cliente.on('addVotes', (payload) => {
        console.log(payload);
        bands.voteBand(payload['id']);
        io.emit('activeBand', bands.getBands());
    })
    cliente.on('add-band', (payload) => {
        let objAdd = new Band(payload["name"]);
        bands.addBand(objAdd);
        io.emit('activeBand', bands.getBands());
    });
    cliente.on('deleteBand', (payload) => {
        bands.deleteBand(payload["id"]);
        io.emit('activeBand', bands.getBands());
    })
    io.emit('mensaje', { mensaje: "bienvenido de nuevo" });
})

server.listen(port || 6380, (err) => {
    if (err) throw new Error(err);
    console.log(`servidor corriendo y ejecutandose en puerto ${port}`)
});