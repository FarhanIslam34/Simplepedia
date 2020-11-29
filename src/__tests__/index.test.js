/*
 Tests of our top-level component.

 Because of the way that Next.js works, we can't leave a test file in the 
 'pages' directory, so we need to relocate it somewhere else.

If you decide that you want to go for "exceeds" for this assignment, you will need to switch tests suites.

The difference between the two is fairly radical, so the tests are mutually exclusive. 


 */

import { render, screen, fireEvent, waitFor, act, waitForElementToBeRemoved } from '@testing-library/react';
import fetchMock from "fetch-mock-jest";


import { sampleArticles, sampleSections } from "test-data";


import Home from '../pages/index';

// simplify the hostname (and make sure the variable is being used)
process.env.NEXT_PUBLIC_HOSTNAME='/';

const newArticle = {
  title: '321',
  extract: 'contact',
};

const selectArticle = async (article) => {
  const section = screen.getByText(article.title[0].toUpperCase());
  fireEvent.click(section);

  const title = await screen.findByText(article.title);
  fireEvent.click(title);
  await screen.findByText(article.extract);
};


const toSection = function titleToSection(article) {
  return article.title[0].toUpperCase();
};


describe('Basic functionality tests', () => {


  beforeEach(async () => {
    fetchMock.get('/api/articles',()=>{
        return sampleArticles.map((article)=>({...article}))
    });

    await act(async ()=>{
      render(<Home />);
      // wait until the changes from the server have propagated through
      await screen.findAllByRole('listitem');
    });
  });

  afterEach(()=>{
    fetchMock.reset()
  });

  test('Article collection is fetched from the server', async ()=>{
    // code called fetch on the server
    expect(fetchMock.lastUrl()).toBe('/api/articles');

    const items = screen.getAllByRole('listitem');

    // all of the sections are visible
    expect(items).toHaveLength(sampleSections.length);
    sampleSections.forEach((section) => {
      expect(screen.getByText(section)).toBeVisible();
    });

    // make sure we can select an article
    const testArticle = sampleArticles[0];
    await selectArticle(testArticle);

    
    expect(screen.getAllByText(testArticle.title)).toHaveLength(2);
    expect(screen.getByText(testArticle.extract)).toBeInTheDocument();

  });

  describe('POST used to add new articles', ()=>{
    const createNewArticle = async () => {
      const button = screen.queryByRole('button', { name: 'Add' });
      fireEvent.click(button);
      const titleEditor = screen.queryByRole('textbox', { name: 'title' });
      const extractEditor = screen.queryByRole('textbox', { name: 'body' });

      fireEvent.change(titleEditor, {
        target: { value: newArticle.title },
      });
      fireEvent.change(extractEditor, {
        target: { value: newArticle.extract },
      });

      const save = screen.queryByRole('button', { name: 'Save' });
      fireEvent.click(save);

      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: 'Cancel' })
        ).not.toBeInTheDocument();
      });
    };

    beforeEach( async()=>{
      fetchMock.post(`/api/articles`, (url, options)=>{
        const article = { ...JSON.parse(options.body), id: 101 };
        return article;
      });

      await createNewArticle();
      
    });


    test('Saving new article uses POST', async () => {
      

      expect(fetchMock.lastUrl()).toBe(`/api/articles`);
      expect(fetchMock.lastOptions().method).toBe('POST');
      
      const data = JSON.parse(fetchMock.lastOptions().body);

      expect(data.title).toBe(newArticle.title);
      expect(data.extract).toBe(newArticle.extract);
    });

    test('New articles still are in the collection', async () => {
      await selectArticle(sampleArticles[2]);

      await selectArticle(newArticle);
      expect(screen.getAllByText(newArticle.title)).toHaveLength(2);
    });

    test('New articles become current article', async () => {
      expect(screen.getAllByText(newArticle.title)).toHaveLength(2);
    });


  });

describe('PUT used to update articles', ()=>{
const editArticle = async (title, extract) => {
      const button = screen.queryByRole('button', { name: 'Edit' });
      fireEvent.click(button);
      const titleEditor = screen.queryByRole('textbox', { name: 'title' });
      const extractEditor = screen.queryByRole('textbox', { name: 'body' });

      fireEvent.change(titleEditor, {
        target: { value: title },
      });
      fireEvent.change(extractEditor, {
        target: { value: extract },
      });

      const save = screen.queryByRole('button', { name: 'Save' });
      fireEvent.click(save);

      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: 'Cancel' })
        ).not.toBeInTheDocument();
      });
    };

    let oldArticle;

    beforeEach(async () => {
      oldArticle = { ...sampleArticles[0] };
      fetchMock.put(`/api/articles/${oldArticle.id}`, (url, options)=>{
        const article = { ...JSON.parse(options.body) };
        return article;
      });

      await selectArticle(oldArticle);

      await editArticle(newArticle.title, newArticle.extract);
    });

      test('Updating article uses PUT', async () => {
      

      expect(fetchMock.lastUrl()).toBe(`/api/articles/${oldArticle.id}`);
      expect(fetchMock.lastOptions().method).toBe('PUT');
      
      const data = JSON.parse(fetchMock.lastOptions().body);

      expect(data.title).toBe(newArticle.title);
      expect(data.extract).toBe(newArticle.extract);
      expect(data.id).toBe(oldArticle.id);
    });

  test('Updated articles still are in the collection', async () => {
      await selectArticle(sampleArticles[2]);

      await selectArticle(newArticle);
      expect(screen.getAllByText(newArticle.title)).toHaveLength(2);
    });

    test('Updated articles become current article', async () => {
      expect(screen.getAllByText(newArticle.title)).toHaveLength(2);
    });

});

describe('DELETE used to delete articles', ()=>{
  let oldArticle;
 beforeEach(async () => {
      oldArticle = { ...sampleArticles[0] };
      fetchMock.delete(`/api/articles/${oldArticle.id}`, ()=>{
        return 200;
      });

      await selectArticle(oldArticle);

      const button = screen.queryByRole('button', { name: 'Delete' });
      fireEvent.click(button);

      await waitFor(()=>{
        expect(screen.queryAllByText(oldArticle.title)).toHaveLength(0);
      })
    });

    test('Deleting article uses DELETE', async () => {
      expect(fetchMock.lastUrl()).toBe(`/api/articles/${oldArticle.id}`);
      expect(fetchMock.lastOptions().method).toBe('DELETE');
    });

    test('Article is deleted', async ()=>{
      const section = screen.getByText(oldArticle.title[0].toUpperCase());
      fireEvent.click(section);

      expect(screen.queryByText(oldArticle.title)).not.toBeInTheDocument();
    });

});

});


describe.skip('Advanced functionality tests', ()=>{
  let data;
  const getId = (url) => +/\d+$/.exec(url)[0];

  beforeEach(async () => {
    // reinitialize the data
    data = sampleArticles.map((article)=>({...article}));

    // mock sections route
    fetchMock.get(`/api/sections`, ()=>{
      return [
        ...new Set(data.map((article) => article.title.charAt(0).toUpperCase())),
      ].sort();   
    });

    // mock titles route
    fetchMock.get(`express:/api/titles/:section`, (url) =>{
      const section = url.charAt(url.length - 1);
      const articles = data.filter(
        (article) => article.title.charAt(0) === section
      );

      return articles.map((article) => ({
        title: article.title,
        id: article.id,
      }));
    });

    // mock article fetch route
    fetchMock.get('express:/api/articles/:id', (url)=>{
      const id = getId(url);

      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          return data[i];
        }
      }

      return 404;   
    });



    await act(async ()=>{
      render(<Home />);
      // wait until the changes from the server have propagated through
      await screen.findAllByRole('listitem');
    });
  });

  afterEach(()=>{
    fetchMock.reset()
  });


  describe('New GET routes are used', ()=>{
    test('Article sections are fetched from the server', async ()=>{
        // code called fetch on the server
        expect(fetchMock.lastUrl()).toBe(`/api/sections`);

        const items = screen.getAllByRole('listitem');

        // all of the sections are visible
        expect(items).toHaveLength(sampleSections.length);
        sampleSections.forEach((section) => {
          expect(screen.getByText(section)).toBeVisible();
        });
      });

    test('Titles are fetched from the server', async()=>{

      const section = sampleArticles[0].title[0].toUpperCase();

      fireEvent.click(screen.getByText(section));

      await screen.findByText(sampleArticles[0].title);

      expect(fetchMock.lastUrl()).toBe(`/api/titles/${section}`);

      const expectedArticles = sampleArticles.filter((article)=> toSection(article) === section);

      expectedArticles.forEach((article)=>{
        expect(screen.getByText(article.title)).toBeInTheDocument();
      })

    });


    test('Articles are fetched from the server', async()=>{
      await selectArticle(sampleArticles[0]);

      expect(fetchMock.called(`/api/articles/${sampleArticles[0].id}`)).toBeTruthy();

      expect(screen.getByText(sampleArticles[0].extract)).toBeInTheDocument();
    });


  });
  


  describe('POST used to add new articles', ()=>{
    const createNewArticle = async () => {
      const button = screen.queryByRole('button', { name: 'Add' });
      fireEvent.click(button);
      const titleEditor = screen.queryByRole('textbox', { name: 'title' });
      const extractEditor = screen.queryByRole('textbox', { name: 'body' });

      fireEvent.change(titleEditor, {
        target: { value: newArticle.title },
      });
      fireEvent.change(extractEditor, {
        target: { value: newArticle.extract },
      });

      const save = screen.queryByRole('button', { name: 'Save' });
      fireEvent.click(save);

      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: 'Cancel' })
        ).not.toBeInTheDocument();
      });
    };

    beforeEach( async()=>{
      fetchMock.post(`/api/articles`, (url, options)=>{
        const article = { ...JSON.parse(options.body), id: 101 };
        data = [...data, article];
        return article;
      });

      await createNewArticle();
      
    });


    test('Saving new article uses POST', async () => {
      const callData = fetchMock.lastCall(`/api/articles`);

      expect(callData).not.toBeUndefined();


      expect(callData[1].method).toBe('POST');
      
      const payload = JSON.parse(callData[1].body);

      expect(payload.title).toBe(newArticle.title);
      expect(payload.extract).toBe(newArticle.extract);
    });

    test('New articles still are in the collection', async () => {
      await selectArticle(sampleArticles[2]);

      await selectArticle(newArticle);
      expect(screen.getAllByText(newArticle.title)).toHaveLength(2);
    });

    test('New articles become current article', async () => {
      expect(screen.getAllByText(newArticle.title)).toHaveLength(2);
    });


  });

  describe('PUT used to update articles', ()=>{
  const editArticle = async (title, extract) => {
        const button = screen.queryByRole('button', { name: 'Edit' });
        fireEvent.click(button);
        const titleEditor = screen.queryByRole('textbox', { name: 'title' });
        const extractEditor = screen.queryByRole('textbox', { name: 'body' });

        fireEvent.change(titleEditor, {
          target: { value: title },
        });
        fireEvent.change(extractEditor, {
          target: { value: extract },
        });

        const save = screen.queryByRole('button', { name: 'Save' });
        fireEvent.click(save);

        await waitFor(() => {
          expect(
            screen.queryByRole('button', { name: 'Cancel' })
          ).not.toBeInTheDocument();
        });
      };

      let oldArticle;

      beforeEach(async () => {
        oldArticle = { ...sampleArticles[0] };
        fetchMock.put(`/api/articles/${oldArticle.id}`, (url, options)=>{
          const article = { ...JSON.parse(options.body) };
          data = data.map((item)=>{
            return item.id === article.id? article : item;
          })
          return article;
        });

        await selectArticle(oldArticle);

        await editArticle(newArticle.title, newArticle.extract);
      });

      test('Updating article uses PUT', async () => {
        const callData = fetchMock.lastCall(`/api/articles/${oldArticle.id}`);

        expect(callData).not.toBeUndefined();
        expect(callData[1].method).toBe('PUT');
      
        const payload = JSON.parse(callData[1].body);

        expect(payload.title).toBe(newArticle.title);
        expect(payload.extract).toBe(newArticle.extract);
        expect(payload.id).toBe(oldArticle.id);
      });

    test('Updated articles still are in the collection', async () => {
        await selectArticle(sampleArticles[2]);

        await selectArticle(newArticle);
        expect(screen.getAllByText(newArticle.title)).toHaveLength(2);
      });

      test('Updated articles become current article', async () => {
        expect(screen.getAllByText(newArticle.title)).toHaveLength(2);
      });

  });

  describe('DELETE used to delete articles', ()=>{
    let oldArticle;
    beforeEach(async () => {
        oldArticle = { ...sampleArticles[0] };
        fetchMock.delete(`/api/articles/${oldArticle.id}`, ()=>{
          data = data.filter((article)=>article.id !== oldArticle.id);
          return 200;
        });

        await selectArticle(oldArticle);

        const body = screen.getByText(oldArticle.extract);
        const button = screen.queryByRole('button', { name: 'Delete' });
        fireEvent.click(button);

        await waitForElementToBeRemoved(body);
      });

      test('Deleting article uses DELETE', async () => {
        const callData = fetchMock.lastCall(`/api/articles/${oldArticle.id}`);

        expect(callData).not.toBeUndefined();
        expect(callData[1].method).toBe('DELETE');
      });

      test('Article is deleted', async ()=>{

 
        const section = screen.getByText(oldArticle.title[0].toUpperCase());
        fireEvent.click(section);

        expect(screen.queryByText(oldArticle.title)).not.toBeInTheDocument();
      });

  });


});

