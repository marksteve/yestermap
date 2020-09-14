import ReactDOM from 'react-dom'
import styles from '../styles/HistoryControl.module.css'
import { useHistory } from '../stores/history'

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
  const yearsAgo = useHistory((state) => state.yearsAgo)
  const setYearsAgo = useHistory((state) => state.setYearsAgo)

  return ReactDOM.createPortal(
    <div className={styles.container}>
      <h1>Yestermap</h1>
      <p>This map shows where I was {yearsAgo} years ago.</p>
    </div>,
    props.container
  )
}
