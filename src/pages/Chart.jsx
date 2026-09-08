import React from 'react'

function Chart() {
  return (
    <div className="phone-frame">
      <div style={{ padding: '12px', borderBottom: '2px solid var(--gold)', background: 'var(--bg2)' }}>
        <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--gold)', textAlign: 'center' }}>📊 CHARTS & INDICATORS</div>
      </div>
      <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '12px', color: 'var(--text)' }}>Trading View Integration</div>
      </div>
    </div>
  )
}

export default Chart
