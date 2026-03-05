import '../styles/about.css';
import {useEffect} from "react";
import {useLoaderData} from 'react-router';
import {Suspense} from 'react';

export async function loader({context}) {
  const {storefront} = context;

  const {collections} = await storefront.query(COLLECTIONS_QUERY);

  // En react-router moderno, solo retorna el objeto directamente
  return {
    collections: collections.nodes,
  };
}

const COLLECTIONS_QUERY = `#graphql
  query AllCollections {
    collections(first: 50, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;

export default function AboutPage() {
  const {collections} = useLoaderData();

  useEffect(() => {
    const key = document.querySelector('.key-image');
    const parrafo = document.querySelector('.parrafo');
    const mist = document.querySelector('.BlackMist');

    if (!key) return;

    key.addEventListener('click', () => {
      key.classList.add('fade-out');
      setTimeout(() => {
        parrafo.classList.add('animate');
      }, 100);
    });
  }, []);

  return (
    <div className="about-page">
      <Suspense fallback={<div>Cargando colecciones...</div>}>
        <CollectionsMarquee collections={collections ?? []} />
      </Suspense>
      <div className='mist'></div>
      <div className="about-hero">
        <img className="key-image" src="/images/about/llave.png" alt="key" />
        <p className="parrafo title">
          Welcome to Chapter I – Whispers of the Forest<br/>

          A beginning woven in silence, shadow, and light.<br/>
          Each garment a verse—echoes of time, stitched with care and memory.<br/>

          We are drawn to the quiet strength of the past.<br/>
          Our pieces are inspired by medieval silhouettes—gowns that grazed mossy earth, corsets that held breath and resolve, skirts that moved like water through trees.
          But these are not costumes. They are interpretations: garments shaped for the present, softened by time, and made to be lived in.<br/>

          We believe in clothing as ritual.<br/>
          In textures that carry the hush of leaves, the weight of dusk, and the bloom of morning.<br/>
          Fragments of the past embedded in the present.<br/>
          The lapse of the seasons told through our garments.<br/>

          Springtime Wishes is an ongoing tale.<br/>
          This is its first breath.<br/>

          Designed and sewn in Mexico.
        </p>
        <div className="BlackMist"></div>
      </div>
    </div>
  );
}

function CollectionsMarquee({collections}) {
  if (!Array.isArray(collections)) return null;

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {collections.map((collection) => (
          <span key={collection.id} className="marquee-item">
            <img className="spider" src="/images/about/arania.png" alt="key" />
            {collection.title}
          </span>
        ))}
        {collections.map((collection) => (
          <span key={collection.id} className="marquee-item">
            <img className="spider" src="/images/about/arania.png" alt="key" />
            {collection.title}
          </span>
        ))}
        {collections.map((collection) => (
          <span key={collection.id} className="marquee-item info">
            <img className="spider" src="/images/about/arania.png" alt="key" />
            {collection.title}
          </span>
        ))}
        {collections.map((collection) => (
          <span key={collection.id} className="marquee-item info">
            <img className="spider" src="/images/about/arania.png" alt="key" />
            {collection.title}
          </span>
        ))}
        {collections.map((collection) => (
          <span key={collection.id} className="marquee-item info">
            <img className="spider" src="/images/about/arania.png" alt="key" />
            {collection.title}
          </span>
        ))}
      </div>
    </div>
  );
}
