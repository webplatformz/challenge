import React from 'react';

export default ({pairings = []}) => {
    return (
        <table className="pairings">
            <tbody>
            {pairings.map((pairing, index) => (
                    <tr key={pairing.id}>
                        <td>
                            {(() => {
                                if (pairing.firstPlayerWon) {
                                    return (
                                        <object className="winner"
                                                data="/images/star.svg"
                                                type="image/svg+xml"
                                        />);
                                }
                            })()}
                            {pairing.player1}
                        </td>
                        <td>
                            {(() => {
                                if (!pairing.firstPlayerWon) {
                                    return (
                                        <object className="winner"
                                                data="/images/star.svg"
                                                type="image/svg+xml"
                                        />);
                                }
                            })()}
                            {pairing.player2}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
