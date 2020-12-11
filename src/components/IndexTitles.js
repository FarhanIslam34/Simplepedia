import React from 'react';
import PropTypes from 'prop-types';

export default function IndexTitles(props){
   // Render list of titles
   const titles = props.articlesList.map(
       title => (
           <li data-testid="title" key={title.title}  onClick={() => props.setArticle(title)}>
               {title.title}
           </li>
       )
   );
   return (
       <div>
           <ul>
               {titles}
           </ul>
       </div>
   );
}
           
IndexTitles.propTypes = {
  articlesList: PropTypes.array.isRequired,
  setArticle: PropTypes.func.isRequired,
};
