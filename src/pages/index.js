

import Head from 'next/head';


import styles from '../styles/Home.module.css';

export default function Home() {
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Simplepedia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Simplepedia</h1>
        <p>Replace this with some content</p>
      </main>

      <footer>CS 312 Assignment 4</footer>
    </div>
  );
}
