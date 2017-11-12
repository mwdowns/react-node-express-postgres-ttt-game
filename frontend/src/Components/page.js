import React from 'react';
import Header from './header.js';
import Game from './game.js';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playerID: 1
        }
    }

    render() {
        return (
            <div>
                <div className="header">
                    <Header 
                        playerID={this.state.playerID}
                    />
                </div>
                <div className="game">
                    <Game 
                        playerID={this.state.playerID}
                    />
                </div>
            </div>
        );

    }

}


export default Page;