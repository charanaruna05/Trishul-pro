import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Home({ user }) {
  const [indices, setIndices] = useState([])
  const [sectors, setSectors] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const indRes = await axios.get('/api/market/indices')
        setIndices(indRes.data.data)
        
        const secRes = await axios.get('/api/market/sectors')
        setSectors(secRes.data.data)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="phone-frame">
      <div style={styles.header}>
        <span style={styles.title}>🔱 TRISHUL PRO</span>
      </div>
      
      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>MARKET INDICES</h3>
        <div style={styles.grid}>
          {indices.map((idx, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardLabel}>{idx.name}</div>
              <div style={styles.cardValue}>{idx.value.toLocaleString()}</div>
              <div style={{ ...styles.cardChange, color: idx.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {idx.change >= 0 ? '▲' : '▼'} {Math.abs(idx.percent).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
        
        <h3 style={styles.sectionTitle}>SECTOR HEATMAP</h3>
        <div style={styles.sectorGrid}>
          {sectors.map((sec, i) => (
            <div key={i} style={{ ...styles.sectorBox, background: sec.up > sec.down ? '#083018' : '#300400' }}>
              <div>{sec.name}</div>
              <div style={styles.sectorStats}>
                <span style={{ color: 'var(--green)' }}>▲{sec.up}</span>
                <span style={{ color: 'var(--red)' }}>▼{sec.down}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={styles.nav}>
        <button style={styles.navBtn}>🏠 HOME</button>
        <button style={styles.navBtn}>📡 SIGNAL</button>
        <button style={styles.navBtn}>⚡ POWER</button>
        <button style={styles.navBtn}>📊 CHART</button>
        <button style={styles.navBtn}>⭐ WATCH</button>
      </div>
    </div>
  )
}

const styles = {
  header: {
    textAlign: 'center',
    padding: '12px',
    borderBottom: '2px solid var(--gold)',
    background: 'var(--bg2)'
  },
  title: {
    fontSize: '20px',
    fontWeight: '900',
    color: 'var(--gold)',
    letterSpacing: '2px'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px'
  },
  sectionTitle: {
    fontSize: '12px',
    color: 'var(--dim)',
    letterSpacing: '1px',
    fontWeight: '700',
    marginBottom: '8px',
    marginTop: '12px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginBottom: '12px'
  },
  card: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center'
  },
  cardLabel: {
    fontSize: '9px',
    color: 'var(--dim)',
    marginBottom: '4px'
  },
  cardValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text)'
  },
  cardChange: {
    fontSize: '10px',
    marginTop: '4px'
  },
  sectorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px'
  },
  sectorBox: {
    padding: '8px',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '10px',
    border: '1px solid transparent'
  },
  sectorStats: {
    fontSize: '9px',
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
    marginTop: '4px'
  },
  nav: {
    display: 'flex',
    borderTop: '2px solid var(--gold)',
    background: 'var(--bg2)',
    flexShrink: 0
  },
  navBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text)',
    padding: '8px',
    fontSize: '10px',
    cursor: 'pointer',
    textAlign: 'center'
  }
}

export default Home
