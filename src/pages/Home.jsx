import React, { useState, useEffect } from 'react'
import axios from 'axios'

const axiosInstance = axios.create({
  timeout: 10000
})

function Home({ user }) {
  const [indices, setIndices] = useState([])
  const [sectors, setSectors] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    let isMounted = true
    let pollInterval = null
    let retryCount = 0
    const maxRetries = 3

    const fetchData = async () => {
      if (loading || retryCount >= maxRetries) return

      setLoading(true)
      try {
        setError(null)
        
        const [indRes, secRes] = await Promise.all([
          axiosInstance.get('/api/market/indices'),
          axiosInstance.get('/api/market/sectors')
        ])

        if (!isMounted) return

        setIndices(indRes.data?.data || [])
        setSectors(secRes.data?.data || [])
        setLastUpdate(new Date())
        retryCount = 0
      } catch (err) {
        if (!isMounted) return

        retryCount++
        const errorMsg = err.code === 'ECONNABORTED' 
          ? 'Request timeout - server not responding'
          : err.message || 'Failed to load market data'
        
        setError(errorMsg)
        console.error('Market data fetch error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()

    pollInterval = setInterval(() => {
      if (!loading && retryCount < maxRetries) {
        fetchData()
      }
    }, 10000)

    return () => {
      isMounted = false
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [])

  return (
    <div className="phone-frame">
      <div style={styles.header}>
        <span style={styles.title}>🔱 TRISHUL PRO</span>
        {lastUpdate && <div style={styles.lastUpdate}>Last: {lastUpdate.toLocaleTimeString()}</div>}
      </div>
      
      <div style={styles.content}>
        {error && <div style={styles.error}>{error}</div>}
        {loading && <div style={styles.loading}>Loading...</div>}
        
        <h3 style={styles.sectionTitle}>MARKET INDICES</h3>
        <div style={styles.grid}>
          {indices && indices.length > 0 ? (
            indices.map((idx) => (
              <div key={`idx-${idx.name}`} style={styles.card}>
                <div style={styles.cardLabel}>{idx.name}</div>
                <div style={styles.cardValue}>{idx.value?.toLocaleString() || '--'}</div>
                <div style={{ ...styles.cardChange, color: (idx.change || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {(idx.change || 0) >= 0 ? '▲' : '▼'} {Math.abs(idx.percent || 0).toFixed(2)}%
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No data available</div>
          )}
        </div>
        
        <h3 style={styles.sectionTitle}>SECTOR HEATMAP</h3>
        <div style={styles.sectorGrid}>
          {sectors && sectors.length > 0 ? (
            sectors.map((sec) => (
              <div key={`sec-${sec.name}`} style={{ ...styles.sectorBox, background: (sec.up || 0) > (sec.down || 0) ? '#083018' : '#300400' }}>
                <div>{sec.name}</div>
                <div style={styles.sectorStats}>
                  <span style={{ color: 'var(--green)' }}>▲{sec.up || 0}</span>
                  <span style={{ color: 'var(--red)' }}>▼{sec.down || 0}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No sectors available</div>
          )}
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
  lastUpdate: {
    fontSize: '8px',
    color: 'var(--dim)',
    marginTop: '4px'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px'
  },
  error: {
    background: 'rgba(255, 61, 61, 0.1)',
    border: '1px solid var(--red)',
    color: 'var(--red)',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '11px',
    marginBottom: '12px'
  },
  loading: {
    textAlign: 'center',
    color: 'var(--gold)',
    fontSize: '12px',
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
  emptyState: {
    textAlign: 'center',
    color: 'var(--dim)',
    fontSize: '12px',
    padding: '20px'
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
