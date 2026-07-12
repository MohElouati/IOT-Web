import api from '../api'

function ScrollControl({ onScroll }) {
  const scroll = async (direction) => {
    await api.post(`/scroll/${direction}`)
    onScroll()
  }

  return (
    <div className="card">
      <h3>Contrôle Scroll</h3>
      <div className="scroll-buttons">
        <button className="btn-up" onClick={() => scroll('up')}>
          ⬆ Scroll Up
        </button>
        <button className="btn-down" onClick={() => scroll('down')}>
          ⬇ Scroll Down
        </button>
      </div>
    </div>
  )
}

export default ScrollControl