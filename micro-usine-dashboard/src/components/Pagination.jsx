function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={styles.container}>
      <button
        style={styles.btn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          style={{
            ...styles.btn,
            ...(page === currentPage ? styles.active : {})
          }}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        style={styles.btn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    marginTop: '16px',
  },
  btn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #333',
    backgroundColor: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  active: {
    backgroundColor: '#e94560',
    border: '1px solid #e94560',
  }
}

export default Pagination