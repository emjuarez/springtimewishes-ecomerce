import '../styles/contact.css';
import {useEffect} from "react";

export default function AboutPage() {
  useEffect(() => {
    const key = document.querySelector('.key-image');
    const parrafo = document.querySelector('.parrafo');
    const mist = document.querySelector('.BlackMist');

    if (!key) return;

    key.addEventListener('click', () => {
      // 1. Desvanecer llave
      key.classList.add('fade-out');

      // 2. Elevar el fondo negro (curtain reveal)
      setTimeout(() => {
        mist.classList.add('reveal');
      }, 100);

      // 3. Animar texto (subir)
      setTimeout(() => {
        parrafo.classList.add('animate');
      },100);
    });
  }, []);

  return (
    <div className="about-page">
      <section className="about-hero">
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
      </section>
    </div>
  );
}
