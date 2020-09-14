import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import { ControlContainer, HistoryControl } from '../components/HistoryControl'
import styles from '../styles/Home.module.css'
import { useHistory } from '../stores/history'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function Home() {
  const container = useRef()
  const map = useRef()
  const interval = useRef()

  const [history, setHistory] = useState({
    type: 'FeatureCollection',
    features: [],
  })
  const [controlContainer, setControlContainer] = useState(null)

  const yearsAgo = useHistory((state) => state.yearsAgo)

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/marksteve/ckeznuxx31uox19nyua9akkkp',
      center: [-74.5, 40],
      center: [121.7, 12.9],
      zoom: 3,
    })

    map.current.on('load', () => {
      map.current.addSource('history', {
        type: 'geojson',
        data: history,
      })

      map.current.addLayer({
        id: 'history',
        type: 'symbol',
        source: 'history',
        paint: {
          'icon-opacity': [
            'interpolate',
            ['linear'],
            ['get', 'index'],
            0,
            1,
            4,
            0.5,
          ],
          'text-color': '#4a3f22',
          'text-halo-color': '#d4c6a0',
          'text-halo-width': 2,
        },
        layout: {
          'icon-image': 'marker',
          'text-font': ['Playfair Display Bold'],
          'text-field': ['get', 'timestamp'],
          'text-offset': [0, 1.25],
          'text-anchor': 'top',
        },
      })

      map.current.loadImage('/marker.png', (err, image) => {
        if (err) throw err
        map.current.addImage('marker', image)
        fetchHistory()
        interval.current = setInterval(fetchHistory, 60 * 1000)
      })

      const controlContainer = new ControlContainer()
      map.current.addControl(controlContainer, 'top-left')
      setControlContainer(controlContainer.container)
    })
  }, [container])

  useEffect(() => {
    const source = map.current.getSource('history')
    if (!source) {
      return
    }
    source.setData(history)
    const [lng, lat] = history.features[0].geometry.coordinates
    map.current.fitBounds(new mapboxgl.LngLat(lng, lat).toBounds(5000))
  }, [history])

  async function fetchHistory() {
    const params = new URLSearchParams()
    params.set('yearsAgo', yearsAgo)
    const res = await fetch(`/api/history?${params.toString()}`)
    const { history } = await res.json()
    setHistory({
      type: 'FeatureCollection',
      features: history.map((location, i) => ({
        type: 'Feature',
        properties: { ...location, index: i },
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      })),
    })
  }

  let control = null
  if (controlContainer) {
    control = <HistoryControl container={controlContainer} />
  }

  return (
    <div className={styles.map} ref={container}>
      {control}
    </div>
  )
}
