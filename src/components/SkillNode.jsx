import { Handle, Position } from '@xyflow/react'
import './SkillNode.css'

const CATEGORY_STYLES = {
  certificate: { border: '#f59e0b', glow: '#f59e0b', text: '#fcd34d', badge: '#78350f' },
  rating:      { border: '#22d3ee', glow: '#22d3ee', text: '#67e8f9', badge: '#164e63' },
  none:        { border: '#6b7280', glow: '#4b5563', text: '#9ca3af', badge: '#374151' },
}

export function SkillNode({ data }) {
  const s = CATEGORY_STYLES[data.category] ?? CATEGORY_STYLES.none
  const locked = !data.unlocked && !data.unlockable && !data.available

  const className = [
    'skill-node',
    data.unlocked   ? 'skill-node--unlocked'   : '',
    data.available  ? 'skill-node--available'  : '',
    data.unlockable ? 'skill-node--unlockable' : '',
    locked          ? 'skill-node--locked'     : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={className}
      style={{
        '--border': s.border,
        '--glow': s.glow,
        '--label-color': s.text,
        '--badge-bg': s.badge,
      }}
      onClick={() => {
        if (data.available) data.onUnlock?.()
        else data.onLockedClick?.()
      }}
    >
      <Handle type="target" position={Position.Bottom} className="skill-handle" />

      {data.unlocked && <div className="skill-node__check">✓</div>}
      {locked && <div className="skill-node__lock">🔒</div>}

      <div className="skill-node-icon">{data.icon}</div>

      <div className="skill-node-body">
        <div className="skill-node-label">{data.label}</div>
        <div className="skill-node-sublabel">{data.sublabel}</div>

        {data.hours != null && (
          <span className="skill-node-badge">{data.hours} hrs</span>
        )}

        <ul className="skill-node-perks">
          {data.perks.map(p => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <Handle type="source" position={Position.Top} className="skill-handle" />
      <Handle type="source" position={Position.Right} id="right" className="skill-handle" />
    </div>
  )
}