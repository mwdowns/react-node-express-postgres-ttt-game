import React from 'react';

class Header extends React.Component {
    
    render() {
        const playerID = this.props.playerID;
        return (
            <div>
                Hello {playerID}!
            </div>
        );
    }
}

export default Header;