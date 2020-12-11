import IndexBar from './IndexBar';
import { screen, fireEvent, render } from '@testing-library/react';

const articles = [
  {
    title: 'Alpha Centauri',
    extract: 'An alien diplomat with an enormous egg shaped head',
    edited: '2017-05-08',
  },
  {
    title: 'Dominators',
    extract: 'Galactic bullies with funny robot pals.',
    edited: '2017-05-08',
  },
  {
    title: 'Cybermen',
    extract:
      'Once like us, they have now replaced all of their body parts with cybernetics',
    edited: '2017-05-08',
  },
  {
    title: 'Auton',
    extract: 'Platic baddies driven by the Nestine consciousness',
    edited: '2017-05-08',
  },
  {
    title: 'Dalek',
    extract: 'Evil little pepperpots of death',
    edited: '2017-05-08',
  },
];

export const sampleSections = [
  ...new Set(articles.map((article) => article.title.charAt(0).toUpperCase())),
].sort();

describe('IndexBar initialization', () => {
  test('Handles empty array without error', () => {
    const handler = jest.fn();
    render(<IndexBar collection={[]} select={handler} />);
  });
});

describe('Basic IndexBar functionality', () => {
  let selectFunction;

  beforeEach(() => {
    selectFunction = jest.fn();
    render(<IndexBar collection={articles} select={selectFunction} />);
  });

  test('Fetches and displays sections', async () => {
    const items = await screen.findAllByRole('listitem');

    expect(items).toHaveLength(sampleSections.length);
    sampleSections.forEach((section) => {
      expect(screen.getByText(section)).toBeVisible();
    });
  });

  test('Clicking on a section displays titles', async () => {
    const section = await screen.findByText(sampleSections[0]);

    fireEvent.click(section);

    const titles = await screen.findAllByTestId('title');

    const expectedArticles = articles.filter(
      (article) => article.title.charAt(0).toUpperCase() === sampleSections[0]
    );

    expect(titles).toHaveLength(expectedArticles.length);

    expectedArticles.forEach((article) => {
      expect(screen.getByText(article.title)).toBeVisible();
    });
  });

  test('Changing sections changes the titles', async () => {
    let section = await screen.findByText(sampleSections[0]);

    fireEvent.click(section);

    section = await screen.findByText(sampleSections[1]);

    fireEvent.click(section);

    const titles = await screen.findAllByTestId('title');
    const expectedArticles = articles.filter(
      (article) => article.title.charAt(0).toUpperCase() === sampleSections[1]
    );
    expect(titles).toHaveLength(expectedArticles.length);

    expectedArticles.forEach((article) => {
      expect(screen.getByText(article.title)).toBeInTheDocument();
    });
  });

  test('Clicking a title selects the article', async () => {
    const section = await screen.findByText('D');
    fireEvent.click(section);
    const title = await screen.findByText('Dalek');

    fireEvent.click(title);

    expect(selectFunction).toHaveBeenCalledWith(articles[4]);
  });
});

/************* Assignment three tests ***********************/

describe('IndexBar with currentArticle', () => {
  let selectFunction;

  beforeEach(() => {
    selectFunction = jest.fn();
  });

  test('currentArticle sets the current section', () => {
    render(
      <IndexBar
        collection={articles}
        select={selectFunction}
        currentArticle={articles[1]}
      />
    );

    expect(screen.queryByText(articles[1].title)).toBeInTheDocument();
  });

  test('Changing currentArticle updates section', () => {
    const { rerender } = render(
      <IndexBar
        collection={articles}
        select={selectFunction}
        currentArticle={articles[1]}
      />
    );
    expect(screen.queryByText(articles[1].title)).toBeInTheDocument();
    expect(screen.queryByText(articles[0].title)).not.toBeInTheDocument();

    rerender(
      <IndexBar
        collection={articles}
        select={selectFunction}
        currentArticle={articles[0]}
      />
    );
    expect(screen.queryByText(articles[1].title)).not.toBeInTheDocument();
    expect(screen.queryByText(articles[0].title)).toBeInTheDocument();
  });
});
