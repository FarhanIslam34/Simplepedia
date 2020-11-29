/*
  ButtonBar.js

  The `ButtonBar` component is a simple collection of buttons.

  The bar has two states determined by `allowEdit`. If false, only an "Add" button is shown.
  If true, then "Add", "Edit" and "Delete" are all shown. 

  When a button is clicked, `handleClick` is called with "add", "edit" or "delete".

  props:
    allowEdit - a Boolean indicating if there is something that could be edited (required)
    handleClick - a function called when a button is clicked (required)
*/



export default function ButtonBar({ allowEdit, handleClick }) {
  return (
    <></>
  );
}

