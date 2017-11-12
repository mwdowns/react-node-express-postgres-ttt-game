const express = require('express'),
    bodyParser = require('body-parser'),
    // server = require('http'),
    bcrypt = require('bcrypt'),
    uuid = require('uuid'),
    pgp = require('pg-promise')(),
    dotenv = require('dotenv').config();

app = express();
app.use(bodyParser.json());

const db = pgp('ttt_db');
// const db = pgp({
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD
// });

app.get('/players', function (req, res) {
    let players = [];
    db.query('SELECT * FROM player')
        .then(data => {
            data.map(function (player) {
                players.push(player);
                return player;
            });
            res.json(players);
        })
        .catch(error => {
            res.json({ error: error });
        });
});

app.post('/savegame', function (req, res) {
    let board = req.body.board;
    let win = req.body.win;
    let date = new Date();
    db.query('INSERT INTO game VALUES (default, $1, $2, $3) RETURNING id', [date, win, board])
        .then(data => {
            console.log(data[0].id);
            db.query('INSERT INTO player_link_game VALUES (default, $1, $2)', [2, data[0].id])
                .then(data => {
                    res.json({ message: 'inserted and inserted' });
                })
        })
        .catch(error => {
            console.log(error);
            res.json({ error: error });
        });
})

app.get('/allsaves', function (req, res) {
    //will get this from a cookie or whatever
    let userID = 2;
    let saves = [];
    db.query('SELECT date, win, board FROM game, player_link_game WHERE player_link_game.player_id = $1 AND game.id = player_link_game.game_id', userID)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json({ error: error });
        })
})

app.get('/onesave/:id', function (req, res) {
    let gameID = req.params.id;
    db.query('SELECT date, win, board FROM game WHERE game.id = $1', gameID)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json({ error: error });
        })
})

module.exports = app;