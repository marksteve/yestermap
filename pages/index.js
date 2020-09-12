import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  const mapRef = useRef();
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/marksteve/ckeznuxx31uox19nyua9akkkp',
      center: [-74.5, 40],
      center: [121.7, 12.9],
      zoom: 5,
    });
  }, [mapRef]);
  return <div className={styles.map} ref={mapRef} />;
}
