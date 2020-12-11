import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/IndexSections.module.css';

export default function IndexSections(props) {
   // Render list of sections and wipe article after new section is clicked
   const sections = (props.sectionsList).map(
       section => (
           <li className={styles.sectionList} key={section} data-testid="section" onClick={
               () => {
                   props.setSection(section);
                   //props.setArticle({title: '', extract: '', edited: ''});
                   props.setArticle();
               }
           }>
               {section}
           </li>
       )
   );
   return (
       <div className={styles.sectionList} id="section-list">
           <ul>
               {sections}
           </ul>
       </div>
   );
}

IndexSections.propTypes = {
  setSection: PropTypes.func.isRequired,
  setArticle: PropTypes.func.isRequired,
  sectionsList: PropTypes.array.isRequired
};
