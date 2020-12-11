/*
  Article.js

  The Article displays the contents of an article. It uses the `date-fns` library to
  display the date as relative to the current date. Styled-jsx is used to style the 
  component with embedded CSS.

  props:
    article - the article to render (required)
*/

import PropTypes from 'prop-types';
import styles from '../styles/Article.module.css';

export default function Article({ article }) {
  // Correctly format date
  const date = new Date(article.edited).toLocaleString();

  return (
    <div className={styles.article}>
      <div className="article-title"><h1>{article.title}</h1></div>
      <div className="article-text">{article.extract}</div>
      <div className="article-timestamp">{date}</div>
    </div>
  );
}

Article.propTypes = {
  article: PropTypes.object.isRequired,
};
