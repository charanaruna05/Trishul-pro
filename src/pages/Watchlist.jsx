import React from 'react'

function Watchlist() {
  return (
    <div className="phone-frame">
      <div style={{ padding: '12px', borderBottom: '2px solid var(--gold)', background: 'var(--bg2)' }}>
        <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--gold)', textAlign: 'center' }}>⭐ WATCHLIST</div>
      </div>
      <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '12px', color: 'var(--text)' }}>Personal Watchlist Management</div>
      </div>
    </div>
  )
}

export default Watchlist
