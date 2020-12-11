import { render } from '@testing-library/react';
import Article from './Article';

describe('Article tests', () => {
  let article;

  beforeEach(() => {
    article = {
      title: 'Title of sample article',
      extract: 'Body of the sample article',
      edited: new Date('2020-06-10T14:54:40Z').toISOString(),
    };
  });

  test('title is displayed', () => {
    const { getByText } = render(<Article article={article} />);
    expect(getByText(article.title)).toBeInTheDocument();
    expect(getByText(article.title)).toBeVisible();
  });

  test('body is displayed', () => {
    const { getByText } = render(<Article article={article} />);
    expect(getByText(article.extract)).toBeInTheDocument();
    expect(getByText(article.extract)).toBeVisible();
  });

  test('date is displayed', () => {
    const { getByText } = render(<Article article={article} />);
    const expectedDate = new Date(article.edited).toLocaleString();
    expect(getByText(expectedDate)).toBeInTheDocument();
    expect(getByText(expectedDate)).toBeVisible();
  });
});
