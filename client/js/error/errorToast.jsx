

import React from 'react';

export default React.createClass({
    render() {
        let error = this.props.error || '';

        return (
            <div id="errorToast" className={(this.props.error) ? 'in' : 'out'}>
                <span>{String(error)}</span>
            </div>
        );
    }
});
