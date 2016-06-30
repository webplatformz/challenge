import React from 'react';

export default ({error = ''}) => {
    return (
        <div id="errorToast" className={(error) ? 'in' : 'out'}>
            <span>{String(error)}</span>
        </div>
    );
};
