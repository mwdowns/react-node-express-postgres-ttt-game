import React from 'react';
import Board from './board.js';
import $ from 'jquery';

class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            saveGame: [Array(9).fill(null)],
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        this.state.saveGame.push(squares);
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = (this.state.xIsNext ? 'X' : 'O');
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2) === 0,
        })
    }

    saveGame(id, save, win) {
        console.log('i want to save this id: ' + id);
        console.log(save);
        $.ajax({
            method: "POST",
            url: "http://localhost:8000/savegame",
            data: {
                player: id,
                win: win,
                board: save
            }
        }).done(() => {
            this.resetGame();
        })


    }

    resetGame() {
        console.log('i want to reset');
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            saveGame: [Array(9).fill(null)],
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const cat = this.state.stepNumber >= 9;
        const sendSave = this.state.saveGame;

        const moves = history.map((step, move) => {
            const desc = move ?
            "Go to move #" + move :
            "Go to game start";
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let save;
        let status;
        // let historyArr = [];
        let win;
        let saveButton = <button onClick={() =>this.saveGame(id, sendSave, win)}>Save Game</button>;
        let reset = <button onClick={() => this.resetGame()}>Reset Game</button>;
        // this id will be gotten by a token or something
        let id = 1;
        if (winner) {
            // historyArr = history.map(function(x) {
            //     return x.squares;
            // });
            console.log(sendSave[0]);
            status = 'Winner, Winner, Chicken dinner: ' + winner;
            win = true;
            save = saveButton;
        } else if (cat) {
            // historyArr = history.map(function(x) {
            //     return x.squares;
            // });
            status = "Cat!"
            win = null;
            save = saveButton;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick ={(i) => this.handleClick(i)}
                        winner = {winner}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <div>{reset}</div>
                    <div>{save}</div>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    let linsLen = lines.length;
    for (let i = 0; i < linsLen; i++) {
        const [a, b, c] = lines[i];
        if (threeInARow(squares, a, b, c)) {
            return squares[a];
        }
    }
    return null;
}

function threeInARow(squares, a, b, c) {
    return squares[a] && squares[a] === squares[b] && squares[a] === squares[c];
}

export default Game;