import '../styles/about.css';
import {useEffect} from 'react';
import {useLoaderData} from 'react-router';
import {Suspense} from 'react';
import {useTranslation} from '~/hooks/useTranslation';
import { ImageCarousel } from '~/components/ImageCarousel';

export async function loader({context}) {
  const {storefront} = context;

  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  return {
    collections: collections.nodes,
  };
}

const COLLECTIONS_QUERY = `#graphql
  query AllCollections(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
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
  const {t} = useTranslation(); // ✅ Hook de traducción

  useEffect(() => {
    const key = document.querySelector('.key-image');
    const parrafo = document.querySelector('.parrafo');

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
      {/* <Suspense fallback={<div>{t('common.loading')}</div>}>
        <CollectionsMarquee collections={collections ?? []} />
      </Suspense> */}
      <TextMarquee/>
      <div className="mist"></div>
      <div className="about-hero">
        {/* <img className="key-image" src="/images/about/llave.png" alt="key" />
        <p className="parrafo title">
          {t('about.text').split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p> */}
        <ImageCarousel
          images={[
            {src: '/images/carousel/1.JPG', alt: 'About 1'},
            {src: '/images/carousel/2.JPG', alt: 'About 2'},
            {src: '/images/carousel/3.JPG', alt: 'About 3'},
          ]}
        />
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
        {[...Array(5)].map((_, i) =>
          collections.map((collection) => (
            <span
              key={`${collection.id}-${i}`}
              // className={`marquee-item ${i >= 2 ? 'info' : 'title'}`}
              className='marquee-item title'
            >
              <img
                className="spider"
                src="/images/about/arania.png"
                alt=""
              />
              {collection.title}
            </span>
          )),
        )}
      </div>
    </div>
  );
}
function TextMarquee() {
  const {t} = useTranslation(); // ✅ Hook de traducción
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <p className="title">
          {t('about.text2')}
        </p>
        <p className="title">
          {t('about.text2')}
        </p>
        <p className="title">
          {t('about.text2')}
        </p>
      </div>
    </div>
  );
}