/*
  Editor.js

  This provides a basic editor with space for entering a title and a body.

  The interface has two buttons. If "Cancel" is clicked, the `complete` callback
  is called with no arguments. If the "Save" button is clicked, the `complete` callback
  is called with a new article object with `title`, `extract`, and `date`. 

  If the optional `article` prop is set, the `title` and `extract` fields of the component
  are pre-loaded with the values. In addition, all other properties of the object are 
  included in the returned article object. 

  props:
    article - object with `title` and `extract` properties at minimum
    complete - function to call on completion (required)
*/




export default function Editor({ article, complete }) {


  return (
    <></>
  );
}

