import { render, screen, fireEvent } from '@testing-library/react';
import Editor from './Editor';

describe('Editor tests', () => {
  let article;
  const handler = jest.fn();

  beforeEach(() => {
    article = {
      title: 'Title of sample article',
      extract: 'Body of the sample article',
      edited: new Date('2020-06-10T14:54:40Z').toISOString(),
    };

    handler.mockReset();
  });

  test('editor is populated by article', () => {
    render(<Editor article={article} complete={handler} />);
    expect(screen.getByDisplayValue(article.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(article.title)).toBeVisible();
    expect(screen.getByDisplayValue(article.extract)).toBeInTheDocument();
    expect(screen.getByDisplayValue(article.extract)).toBeVisible();
  });

  test('Save button is disabled without title', () => {
    render(<Editor complete={handler} />);

    const titleInput = screen.getByRole('textbox', { name: 'title' });
    expect(titleInput).toHaveValue('');

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();

    fireEvent.change(titleInput, { target: { value: article.title } });

    expect(titleInput).toHaveValue(article.text);
    expect(saveButton).toBeEnabled();
  });

  test('Save button is disabled if title removed', () => {
    render(<Editor article={article} complete={handler} />);

    const titleInput = screen.getByRole('textbox', { name: 'title' });
    expect(titleInput).toHaveValue(article.text);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeEnabled();

    fireEvent.change(titleInput, { target: { value: '' } });

    expect(titleInput).toHaveValue('');
    expect(saveButton).toBeDisabled();
  });

  test('Cancel button calls complete function with no arguments', () => {
    render(<Editor complete={handler} />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    fireEvent.click(cancelButton);

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith();
  });

  test('Editor returns new article', () => {
    render(<Editor complete={handler} />);
    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const extractInput = screen.getByRole('textbox', { name: 'body' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(titleInput, { target: { value: article.title } });
    fireEvent.change(extractInput, { target: { value: article.extract } });
    fireEvent.click(saveButton);

    expect(handler).toHaveBeenCalled();

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with

    expect(newArticle.title).toEqual(article.title);
    expect(newArticle.extract).toEqual(article.extract);
  });

  test('New article has current date', () => {
    const referenceDate = new Date();
    render(<Editor complete={handler} />);
    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const extractInput = screen.getByRole('textbox', { name: 'body' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(titleInput, { target: { value: article.title } });
    fireEvent.change(extractInput, { target: { value: article.extract } });

    fireEvent.click(saveButton);

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with
    const dateDiff = new Date(newArticle.edited) - referenceDate;
    expect(dateDiff).toBeGreaterThanOrEqual(0);
  });

  test('Article contents are updated', () => {
    render(<Editor complete={handler} article={article} />);

    const newTitle = 'New title';
    const newBody = 'New content';

    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const extractInput = screen.getByRole('textbox', { name: 'body' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(extractInput, { target: { value: newBody } });

    fireEvent.click(saveButton);

    expect(handler).toHaveBeenCalled();

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with

    expect(newArticle.title).toEqual(newTitle);
    expect(newArticle.extract).toEqual(newBody);
  });

  test('Updated article has current date', () => {
    const referenceDate = new Date();
    render(<Editor complete={handler} article={article} />);

    const newTitle = 'New title';
    const newBody = 'New content';

    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const extractInput = screen.getByRole('textbox', { name: 'body' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(extractInput, { target: { value: newBody } });
    fireEvent.click(saveButton); // don't need to wait -- title already set

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with
    const dateDiff = new Date(newArticle.edited) - referenceDate;
    expect(dateDiff).toBeGreaterThanOrEqual(0);
  });

  test('Updated article retains old title if unchanged', () => {
    render(<Editor complete={handler} article={article} />);

    const newBody = 'New content';

    const extractInput = screen.getByRole('textbox', { name: 'body' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(extractInput, { target: { value: newBody } });
    fireEvent.click(saveButton); // don't need to wait -- title already set

    expect(handler).toHaveBeenCalled();

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with

    expect(newArticle.title).toEqual(article.title);
  });

  test('Updated article retains other fields', () => {
    article = { ...article, id: 1 };
    render(<Editor complete={handler} article={article} />);

    const newBody = 'New content';
    const extractInput = screen.getByRole('textbox', { name: 'body' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(extractInput, { target: { value: newBody } });
    fireEvent.click(saveButton); // don't need to wait -- title already set

    expect(handler).toHaveBeenCalled();

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with

    expect(newArticle.id).toEqual(article.id);
  });
});
