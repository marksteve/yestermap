import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useHistory } from '../stores/history'
import styles from '../styles/HistoryControl.module.css'

export class ControlContainer {
  onAdd(map) {
    this.map = map
    this.container = document.createElement('div')
    this.container.className = 'mapboxgl-ctrl'
    return this.container
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container)
    this.map = undefined
  }
}

export function HistoryControl(props) {
  const interval = useRef()

  const yearsAgo = useHistory((state) => state.yearsAgo)
  const setYearsAgo = useHistory((state) => state.setYearsAgo)
  const setData = useHistory((state) => state.setData)

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current)
    }
    fetchHistory()
    interval.current = setInterval(fetchHistory, 60 * 1000)
  }, [yearsAgo])

  async function fetchHistory() {
    console.log('Fetching history...')
    const params = new URLSearchParams()
    params.set('yearsAgo', yearsAgo)
    const res = await fetch(`/api/history?${params.toString()}`)
    const { history } = await res.json()
    setData({
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

  return ReactDOM.createPortal(
    <div className={styles.container}>
      <h1>Yestermap</h1>
      <p>
        A map that shows where I was{' '}
        <select value={yearsAgo} onChange={(e) => setYearsAgo(e.target.value)}>
          <option value="1">1 year</option>
          <option value="2">2 years</option>
          <option value="3">3 years</option>
          <option value="4">4 years</option>
          <option value="5">5 years</option>
          <option value="6">6 years</option>
          <option value="7">7 years</option>
          <option value="8">8 years</option>
        </select>{' '}
        ago.
      </p>
    </div>,
    props.container
  )
}
