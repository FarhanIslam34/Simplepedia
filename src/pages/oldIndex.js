import { useState, useEffect } from 'react';

import Head from 'next/head';

import styles from '../styles/Home.module.css';

//import data from '../../data/seed.json';

import IndexBar from '../components/IndexBar';
import Article from '../components/Article';
import Editor from '../components/Editor';
import ButtonBar from '../components/ButtonBar'

export default function Home() {


  // Allocate state for collection, selectedArticle, and mode
  //const [collection, changeCollection] = useState(data);
  const [collection, changeCollection] = useState([]);
  const [selectedArticle, select] = useState();
  const [mode, handleClick] = useState("view");

    
  const getData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/articles`);  

      if (!response.ok) {
          throw new Error(response.statusText);
      } 
   
      const filmData = await response.json();
      changeCollection(filmData)
      console.log(filmData);
  }
    
  useEffect (() => getData(), []) 

  // Init article component as empty
  let articleComponent = "";

  const complete = async (article) => {
      console.log(article.id)
      if (!article){
          handleClick("view");
          return
      }

      if (mode === 'add'){

          const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/articles`,
              {
                  method: 'POST',
                  body: JSON.stringify(article),
                  headers: new Headers({ 'Content-type': 'application/json'})
              });

          if (!response.ok) {
              throw new Error(response.statusText);
          }

          const articleData = await response.json

          const newCollection = [];
          collection.map((object) => newCollection.push(object));
          newCollection.push(articleData)
          changeCollection(newCollection)
          select(article)
          handleClick("view")
      }

      if (mode === 'edit'){
          const newCollection = [];
          const newArticle ={...selectedArticle} 

          newArticle.title = article.title
          newArticle.extract = article.extract

          const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/articles/${article.id}`,
              {
                  method: 'PUT',
                  body: JSON.stringify(newArticle),
                  headers: new Headers({ 'Content-type': 'application/json'})
              });

          if (!response.ok) {
              throw new Error(response.statusText);
          }

          collection.map((object) => {
              if (object.id !== selectedArticle.id){
                  newCollection.push(object)
              }
                              }
          )
          newCollection.push(newArticle);
          changeCollection(newCollection);
          select(newArticle);
          handleClick("view")
      }

      if (mode === 'delete'){

          const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/articles/${article.id}`,
              {
                  method: 'DELETE',
                  body: JSON.stringify(article),
                  headers: new Headers({ 'Content-type': 'application/json'})
              });

          if (!response.ok) {
              throw new Error(response.statusText);
          }

          const newCollection = [];
          collection.map((object) => {
              if (object !== selectedArticle){
                  newCollection.push(object)
              }
          })
          changeCollection(newCollection);
          select(undefined)
      }

  }

  //Conditionally render content depending on mode
  const createContent = () => {
     if (mode === "add"){
         return (
             <div>
                 <Editor complete={complete}/>
             </div>
         )
     }
     if (mode === "edit"){
         return (
             <div>
                 <Editor complete={complete} article={selectedArticle}/>
             </div>
         )
     }
     if (mode === "view"){

         if (!selectedArticle){
             return (
                 <div>
                     <IndexBar collection={collection} select={select} currentArticle={selectedArticle}/>
                     {articleComponent}
                     <ButtonBar handleClick={handleClick} allowEdit={false}/>
                 </div>
             )
         }

         return (
             <div>
                 <IndexBar collection={collection} select={select} currentArticle={selectedArticle}/>
                 {articleComponent}
                 <ButtonBar handleClick={handleClick} allowEdit={true}/>
             </div>
         )
     }

     if (mode === "delete"){
         complete(selectedArticle)
         handleClick("view")
         return (
             <div>
                 <IndexBar collection={collection} select={select} currentArticle={selectedArticle}/>
                 {articleComponent}
                 <ButtonBar handleClick={handleClick} allowEdit={false}/>
             </div>
         )
     }
  };




  // Only render component if an article has been selected
  if (selectedArticle){
      articleComponent = <Article article={selectedArticle}/>
  }

  const content = createContent()

  return (
    <div className={styles.container}>
      <Head>
        <title>Simplepedia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Simplepedia</h1>
        {content}
      </main>

      <footer>CS 312 Assignment 2</footer>
    </div>
  );
}
