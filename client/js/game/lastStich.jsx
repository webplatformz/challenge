import React from 'react';
import { GameState } from './gameStore';

let cards = [],
    startingPlayerIndex = 0,
    playerSeating = ['a', 'b', 'c', 'd'];

export default React.createClass({

    getInitialState() {
        return {
            showLastStich: false
        };
    },
    toggleShowLastStich() {
        let currentShow = this.state.showLastStich;
        this.setState({ showLastStich: !currentShow });
    },
    render() {
        if (this.props.state === GameState.STICH) {
            cards = this.props.cards;
            startingPlayerIndex = this.props.startingPlayerIndex;
            playerSeating = this.props.playerSeating;
        }
        let imagePath = '/images/cards/' + this.props.cardType + '/';
        return (
            <div id="lastStich" className={(cards.length !== 4) ? 'hidden' : ''}>
                <img src="./images/carddeck.svg"
                  onClick={this.toggleShowLastStich}
                  className={(this.state.showLastStich) ? 'hidden' : ''}
                />
                <div className={(this.state.showLastStich) ? '' : 'hidden'}>
                    <img src="./images/close.svg"
                      onClick={this.toggleShowLastStich}
                      id="closeButton"
                    />
                    <div>{cards.map((card, index) => {
                        let actPlayerIndex = (startingPlayerIndex + index) % 4;
                        return (
                            <img key={card.color + '_' + card.number} className={'card-' + playerSeating[actPlayerIndex]}
                              src={imagePath + card.color.toLowerCase() + '_' + card.number + '.gif'}
                            />
                        );
                    })}
                    </div>
                </div>
            </div>
        );
    }
});
