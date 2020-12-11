/*
  IndexBar.js

  This component provides the section and title display that allows the user to 
  browse the available articles and select one for display. 
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IndexSections from './IndexSections';
import IndexTitles from './IndexTitles';

export default function IndexBar({ collection, select, currentArticle}) {

  // Make state for currently selected section
  const [section, setSection] = useState('');  

  // Make function to change section
  useEffect(() => {
      if (currentArticle){
          if (currentArticle.title !== undefined){
              setSection(currentArticle.title.charAt(0).toUpperCase())
          }
      }
  }
  , [currentArticle])
  

  // Create list of sections and sort
  const sectionsList = [];
  collection.forEach((art) => {
    if (!sectionsList.includes(art.title[0])){
        sectionsList.push(art.title[0]);
    }
  });

  sectionsList.sort();

  // Create list of articles and sort
  const articlesList = [];
  collection.forEach((art) => {
    if (art.title[0] === section){
        articlesList.push(art);
    }
  });
  
  articlesList.sort();
 
  return (
   <div>   
      <IndexSections 
          sectionsList={sectionsList}
          setSection={setSection}
          setArticle={select}
      />
      <IndexTitles
          articlesList={articlesList}
          setArticle={select}
      />
   </div> 
  );
}

IndexBar.propTypes = {
  collection: PropTypes.array.isRequired,
  select: PropTypes.func.isRequired,
  currentArticle: PropTypes.object
};
