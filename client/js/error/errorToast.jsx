import React from 'react';

export default (props) => {
    let error = props.error || '';

    return (
        <div id="errorToast" className={(props.error) ? 'in' : 'out'}>
            <span>{String(error)}</span>
        </div>
    );
};
