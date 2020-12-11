/*
  Editor.js

  Component for creating new articles
*/

import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function Editor({complete, article}) {

   let articleVariable = null;
   
   // If no article is given, create an empty article
   if (article === undefined){
      articleVariable = {title: '', extract: '', edited: ''};
   }else{
       articleVariable = {...article};
   }

   // Initialize state for title and body
   const [title, changeTitle] = useState(articleVariable.title);
   const [body, changeBody] = useState(articleVariable.extract);

   const makeArticle = () => {
       articleVariable.title = title
       articleVariable.extract = body
       articleVariable.edited = Date.now()
       return articleVariable
   }

   return  (
       <div>
           <div>
               <input 
                   id="title" 
                   aria-label="title"
                   placeholder="Enter a title"
                   value={title}
                   onChange={(event) =>{
                       changeTitle(event.target.value);
                       }
                   }
               /> 
           </div>
           <div>
               <input 
                   id="body" 
                   aria-label="body"
                   placeholder="Enter content for article"
                   value={body}
                   onChange={(event) =>{
                       changeBody(event.target.value);
                       }
                   }
               /> 
           </div>
           <div>
               <input 
                   type="button"
                   aria-label="Save"
                   placeholder="Save"
                   disabled = {(!title)}
                   value={"Save"}
                   onClick={() => {
                       complete(makeArticle())
                       }
                   }
               />

               <input 
                   type="button"
                   aria-label="Cancel"
                   placeholder="Cancel"
                   value={"Cancel"}
                   onClick={() => complete()}
               />
           </div>

       </div>
   )
}

Editor.propTypes = {
    complete: PropTypes.func.isRequired,
    article: PropTypes.object
};
