'use strict';

let React = require('react'),
    GameMode = require('../../../shared/game/gameMode');

module.exports = React.createClass({

    render: function () {
        let mode = this.props.mode,
            color = this.props.color,
            imagePath;

        switch (mode) {
            case GameMode.TRUMPF:
                imagePath = '/images/trumpf/french/' + color.toLowerCase() + '.png';
                break;
            case GameMode.OBEABE:
                imagePath = '';
                break;
            case GameMode.UNDEUFE:
                imagePath = '';
                break;
            case GameMode.SCHIEBE:
                imagePath = '';
                break;
        }

        return (
            <img id="trumpf" className={(!mode && !color) ? 'hidden' : ''} src={imagePath} />
        );
    }
});
