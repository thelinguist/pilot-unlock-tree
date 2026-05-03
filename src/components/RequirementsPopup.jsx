import { WRITTEN_TESTS } from './ResourcePanel'
import './RequirementsPopup.css'

const TEST_NAME = Object.fromEntries(WRITTEN_TESTS.map(t => [t.code, t.name]))

function Req({ met, children }) {
  return (
    <div className={`req-row ${met ? 'req-row--met' : 'req-row--unmet'}`}>
      <span className="req-icon">{met ? '✓' : '✗'}</span>
      {children}
    </div>
  )
}

export function RequirementsPopup({ node, prereqNodes, anyOf, resources, onClose }) {
  const cost = node.data.cost ?? {}

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="popup-backdrop" onClick={handleBackdrop}>
      <div className="popup">
        <div className="popup-header">
          <span className="popup-icon">{node.data.icon}</span>
          <div>
            <div className="popup-title">{node.data.label}</div>
            <div className="popup-sublabel">{node.data.sublabel}</div>
          </div>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>

        <div className="popup-body">
          {prereqNodes.length > 0 && (
            <section>
              <div className="popup-section-label">Prerequisites</div>
              {prereqNodes.map(p => (
                <Req key={p.id} met={p.unlocked}>
                  <span className="req-node-icon">{p.icon}</span>
                  <span>{p.label}</span>
                </Req>
              ))}
            </section>
          )}

          {(cost.age || cost.hours || cost.writtenTests?.length > 0 || anyOf?.length > 0) && (
            <section>
              <div className="popup-section-label">Requirements</div>

              {cost.age != null && (
                <Req met={resources.age >= cost.age}>
                  <span>Age {cost.age}+</span>
                  <span className="req-current">(you: {resources.age})</span>
                </Req>
              )}

              {cost.hours != null && (
                <Req met={resources.hours >= cost.hours}>
                  <span>{cost.hours} flight hours</span>
                  <span className="req-current">(you: {resources.hours})</span>
                </Req>
              )}

              {cost.writtenTests?.map(code => (
                <Req key={code} met={resources.writtenTests.has(code)}>
                  <span className="req-test-code">{code}</span>
                  <span>{TEST_NAME[code] ?? code} written</span>
                </Req>
              ))}

              {anyOf?.length > 0 && (
                <div className="req-any-of">
                  <div className="req-any-of-label">One of the following:</div>
                  {anyOf.map(item => (
                    <Req key={item.id} met={item.met}>
                      <span className="req-node-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </Req>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}