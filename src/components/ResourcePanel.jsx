import { useState } from 'react'
import './ResourcePanel.css'

const STATS = [
  { key: 'age',   icon: '🎂', label: 'Age',          max: 99   },
  { key: 'hours', icon: '🕐', label: 'Flight Hours',  max: 9999 },
]

export const WRITTEN_TESTS = [
  { code: 'PAR',  name: 'Private Pilot' },
  { code: 'CAX',  name: 'Commercial Pilot' },
  { code: 'IRA',  name: 'Instrument Rating' },
  { code: 'FOI',  name: 'Fundamentals of Instructing' },
  { code: 'FIA',  name: 'Flight Instructor – Airplane' },
  { code: 'FII',  name: 'Flight Instructor – Instrument' },
  { code: 'BGI',  name: 'Basic Ground Instructor' },
  { code: 'AGI',  name: 'Advanced Ground Instructor' },
  { code: 'IGI',  name: 'Instrument Ground Instructor' },
  { code: 'ATP',  name: 'Airline Transport Pilot' },
  { code: 'SPA',  name: 'Sport Pilot' },
  { code: 'RPA',  name: 'Recreational Pilot' },
  { code: 'SPFI', name: 'Sport Pilot Flight Instructor' },
  { code: 'TEACH', name: 'Teaching Certificate' },
]

export function ResourcePanel({ resources, onStat, onTest }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="resource-panel">
      <div className="resource-panel-title" onClick={() => setCollapsed(c => !c)}>
        <span>📊 Your Resources</span>
        <span className="resource-collapse-btn">{collapsed ? '▲' : '▼'}</span>
      </div>

      {!collapsed && <>
        <div className="resource-section">
          {STATS.map(({ key, icon, label, max }) => (
            <div key={key} className="resource-stat-row">
              <span className="resource-icon">{icon}</span>
              <span className="resource-label">{label}</span>
              <div className="resource-controls">
                <button
                  className="resource-btn"
                  onClick={() => onStat(key, resources[key] - 1)}
                >−</button>
                <input
                  className="resource-input"
                  type="number"
                  min={0}
                  max={max}
                  value={resources[key]}
                  onChange={e => onStat(key, Number(e.target.value))}
                />
                <button
                  className="resource-btn"
                  onClick={() => onStat(key, resources[key] + 1)}
                >+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="resource-divider" />

        <div className="resource-section">
          <div className="resource-section-label">📝 Written Tests Passed</div>
          {WRITTEN_TESTS.map(({ code, name }) => {
            const checked = resources.writtenTests.has(code)
            return (
              <label key={code} className={`resource-test-row ${checked ? 'is-checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onTest(code)}
                />
                <span className="resource-test-code">{code}</span>
                <span className="resource-test-name">{name}</span>
              </label>
            )
          })}
        </div>
      </>}
    </div>
  )
}