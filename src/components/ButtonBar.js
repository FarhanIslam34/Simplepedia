/*
  ButtonBar.js

  Component for the button for Editor
*/

import PropTypes from 'prop-types';

export default function ButtonBar({handleClick, allowEdit}) {

    // If allowEdit is false, only render "Add" button
    if (!allowEdit){
        return ( <input 
                type="button" 
                aria-label="Add" 
                value={"Add Article"} 
                onClick={() => handleClick("add")}
            />
        )
    }

    // Otherwise, return all buttons
    return ( 
        <div>
            <input 
                type="button" 
                aria-label="Add" 
                value={"Add Article"} 
                onClick={() => handleClick("add")}
            />

            <input 
                type="button" 
                aria-label="Edit" 
                value={"Edit Article"} 
                onClick={() => handleClick("edit")}
            />

            <input 
                type="button" 
                aria-label="Delete" 
                value={"Delete Article"} 
                onClick={() => handleClick("delete")}
            />
        </div>
    )
}

ButtonBar.propTypes = {
    handleClick: PropTypes.func.isRequired,
    allowEdit: PropTypes.bool
};

