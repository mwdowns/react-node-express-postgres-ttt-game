const express = require('express'),
    pgp = require('pg-promise')(),
    // bodyParser = require('body-parser'),
    router = express.Router(),
    db = pgp('ttt_db');

router.get('/:id', function(req, res) {
    let player = req.params.id;
    db.query('SELECT name FROM player WHERE player.id = $1', player)
    .then(data => {
        res.json({data: data});
    })
    .catch(error => {
        res.json({error: error});
    })
})

router.get('/players', function (req, res) {
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

router.post('/savegame', function (req, res) {
    let player = req.body.player;
    let win = req.body.win === ''
                ? null
                : req.body.win;
    let body = req.body;
    let date = new Date();
    let board = Object.keys(body).map(function(key) {
        return body[key];
    }).slice(2);
    board.map(function(step){
        for (var i = 0; i < 9; i++ ) {
            if (step[i] === '') {
                step[i] = null;
            }
        }
    });
    console.log(board);
    if (req.body.player === undefined) {
        console.log('problem');
        res.json({message: 'problem'});
    } else {
        db.query('INSERT INTO game VALUES (default, $1, $2, $3) RETURNING id', [date, win, board])
        .then(data => {
            db.query('INSERT INTO player_link_game VALUES (default, $1, $2)', [player, data[0].id])
                .then(data => {
                    res.json({ message: 'inserted and inserted' });
                })
        })
        .catch(error => {
            console.log(error);
            res.json({ error: error });
        });
    }
})

router.get('/allsaves', function (req, res) {
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

router.get('/onesave/:id', function (req, res) {
    let gameID = req.params.id;
    db.query('SELECT date, win, board FROM game WHERE game.id = $1', gameID)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json({ error: error });
        })
})

module.exports = router;