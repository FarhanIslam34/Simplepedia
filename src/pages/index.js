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
  const [mode, setMode] = useState("view");

  const getData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/articles`);
      if (!response.ok) {
          throw new Error(response.statusText);
      }
      const filmData = await response.json();
      changeCollection(filmData)
  }

  useEffect(() => {
      getData()
  }
  , [])

  const handleClick = (string) => {
      if (string === "add"){
          setMode("add")
      }
      if (string === "view"){
          setMode("view")
      }
      if (string === "edit"){
          setMode("edit")
      }
      if (string === "delete"){
          const deleteArticle = async () => {
              const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/articles/${selectedArticle.id}`, {
                   method: 'DELETE',
                   body: JSON.stringify({...selectedArticle}),
                   headers: new Headers({ 'Content-type': 'application/json'}),
              });
              if (!response.ok){
                  throw new Error(response.statusText);
              }
              const newCollection = collection.filter(obj => obj !== selectedArticle);
              changeCollection(newCollection);
              select(undefined)
          }
          deleteArticle()
      }
  }


  const complete = (article) => {
      
      if (article){

          if (mode === 'add'){

              const post = async () => {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/articles`, {
                         method: 'POST',
                         body: JSON.stringify({...article}),
                         headers: new Headers({ 'Content-type': 'application/json'}),
                  });

                  if (!response.ok){
                      throw new Error(response.statusText);
                  }

                  const articleData = await response.json()

                  const newCollection = [... collection]
                  newCollection.push(articleData)
                  changeCollection(newCollection)
                  select(articleData)
              }
              post()
          }

          else if (mode === 'edit'){
              const edit = async () => {

                  const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/articles/${article.id}`, {
                         method: 'PUT',
                         body: JSON.stringify({...article}),
                         headers: new Headers({ 'Content-type': 'application/json'}),
                  });

                  if (!response.ok){
                      throw new Error(response.statusText);
                  }

                  const newArticle ={...selectedArticle} 
                  newArticle.title = article.title
                  newArticle.extract = article.extract
                  const newCollection = collection.filter(obj => obj !== selectedArticle);
                  newCollection.push(newArticle);
                  changeCollection(newCollection);
                  select(newArticle);
              }
              edit()
          }
      }
      handleClick("view")
  }

  // Init article and content component as empty
  let articleComponent = "";
  let content = "";

  // Only render component if an article has been selected
  if (selectedArticle){
      articleComponent = <Article article={selectedArticle}/>
  }


  if (mode === "add"){
      content = (
          <div>
              <Editor complete={complete}/>
          </div>
      )
  }
  if (mode === "edit"){
      content =  (
          <div>
              <Editor complete={complete} article={selectedArticle}/>
          </div>
      )
  }
  if (mode === "view"){

      if (!selectedArticle){
          content = (
              <div>
                  <IndexBar collection={collection} select={select} currentArticle={selectedArticle}/>
                  {articleComponent}
                  <ButtonBar handleClick={handleClick} allowEdit={false}/>
              </div>
          )
      }else{
          content = (
              <div>
                  <IndexBar collection={collection} select={select} currentArticle={selectedArticle}/>
                  {articleComponent}
                  <ButtonBar handleClick={handleClick} allowEdit={true}/>
              </div>
          )
      }
  }

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
