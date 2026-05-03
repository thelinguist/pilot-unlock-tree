import { useState, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { initialNodes } from './data/nodes'
import { initialEdges } from './data/edges'
import { SkillNode } from './components/SkillNode'
import { ResourcePanel, WRITTEN_TESTS } from './components/ResourcePanel'
import { RequirementsPopup } from './components/RequirementsPopup'
import './App.css'
import { NODE_LAYOUT } from './data/nodeLayout.js'

const NODE_WIDTH = 220
const NODE_HEIGHT = 140
const COL_SEP = NODE_WIDTH + 80
const RANK_SEP = NODE_HEIGHT + 70

const MAX_RANK = Math.max(...Object.values(NODE_LAYOUT).map(l => l.rank))

function getArrangedGraphElements(nodes, edges) {
  return {
    nodes: nodes.map(node => {
      const { col, rank } = NODE_LAYOUT[node.id] ?? { col: 0, rank: 0 }
      return {
        ...node,
        position: {
          x: col * COL_SEP - NODE_WIDTH / 2,
          y: (MAX_RANK - rank) * RANK_SEP - NODE_HEIGHT / 2,
        },
      }
    }),
    edges,
  }
}

// Map each node to the list of node IDs it requires (derived from edges)
const prereqMap = {}
initialEdges.forEach(({ source, target }) => {
  prereqMap[target] ??= []
  prereqMap[target].push(source)
})

const nodeTypes = { skill: SkillNode }

const LOCKED_EDGE_STYLE = { stroke: '#2a2a4a', strokeWidth: 1.5 }

// Unlocking a key node also auto-unlocks these implied nodes
const CASCADE_UNLOCKS = {
  'sport':       ['recreational'],
  'private':     ['sport', 'recreational'],
  'cfi':         ['cfi-sport', 'basic-gi', 'advanced-gi'],
  'cfi-i':       ['instrument-gi'],
  'advanced-gi': ['basic-gi'],
}

export default function App() {
  const [unlockedIds, setUnlockedIds] = useState(new Set(['no-cert']))
  const [resources, setResources] = useState({ age: 21, hours: 0, writtenTests: new Set() })
  const [lockedNodeId, setLockedNodeId] = useState(null)

  const layouted = useMemo(() => getArrangedGraphElements(initialNodes, initialEdges), [])

  const { nodes, edges } = useMemo(() => {
    const nodes = layouted.nodes.map(node => {
      const unlocked = unlockedIds.has(node.id)
      const prereqs = prereqMap[node.id] ?? []
      const prereqsMet = prereqs.every(id => unlockedIds.has(id))

      const cost = node.data.cost ?? {}
      const meetsResources =
        (cost.age ?? 0) <= resources.age &&
        (cost.hours ?? 0) <= resources.hours &&
        (cost.writtenTests ?? []).every(t => resources.writtenTests.has(t)) &&
        (!cost.anyOf || cost.anyOf.some(item =>
          resources.writtenTests.has(item) || unlockedIds.has(item)
        ))

      const available = !unlocked && prereqsMet && meetsResources
      const unlockable = !unlocked && prereqsMet && !meetsResources

      return {
        ...node,
        data: {
          ...node.data,
          unlocked,
          available,
          unlockable,
          onUnlock: () => setUnlockedIds(prev => {
            const next = new Set([...prev, node.id])
            CASCADE_UNLOCKS[node.id]?.forEach(id => next.add(id))
            return next
          }),
          onLockedClick: () => setLockedNodeId(node.id),
        },
      }
    })

    const edges = layouted.edges.map(edge =>
      unlockedIds.has(edge.source)
        ? edge
        : { ...edge, animated: false, style: LOCKED_EDGE_STYLE }
    )

    return { nodes, edges }
  }, [unlockedIds, resources, layouted])

  const TEST_NAME = useMemo(
    () => Object.fromEntries(WRITTEN_TESTS.map(t => [t.code, t.name])),
    []
  )

  const lockedNodeInfo = useMemo(() => {
    if (!lockedNodeId) return null
    const node = initialNodes.find(n => n.id === lockedNodeId)
    const prereqIds = prereqMap[lockedNodeId] ?? []
    const prereqNodes = prereqIds.map(id => {
      const n = initialNodes.find(n => n.id === id)
      return { id, label: n?.data.label, icon: n?.data.icon, unlocked: unlockedIds.has(id) }
    })
    const anyOf = (node.data.cost?.anyOf ?? []).map(item => {
      const n = initialNodes.find(n => n.id === item)
      if (n) return { id: item, label: n.data.label, icon: n.data.icon, met: unlockedIds.has(item) }
      return { id: item, label: TEST_NAME[item] ?? item, icon: '📝', met: resources.writtenTests.has(item) }
    })
    return { node, prereqNodes, anyOf }
  }, [lockedNodeId, unlockedIds, resources, TEST_NAME])

  const handleStat = (key, value) =>
    setResources(prev => ({ ...prev, [key]: Math.max(0, Number(value) || 0) }))

  const handleTest = (code) =>
    setResources(prev => {
      const next = new Set(prev.writtenTests)
      next.has(code) ? next.delete(code) : next.add(code)
      return { ...prev, writtenTests: next }
    })

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <span className="app-header-icon">✈️</span>
        <h1>Pilot Certification Tree</h1>
        <span className="app-header-sub">FAA Certificate &amp; Rating Progression</span>
      </header>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.3}
          maxZoom={2}
          nodesDraggable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="#1a1a4e"
            size={1.5}
            gap={24}
          />
          <Controls
            style={{
              background: 'rgba(6, 8, 30, 0.9)',
              border: '1px solid #1e1e5e',
              borderRadius: 10,
            }}
          />
        </ReactFlow>

        <ResourcePanel
          resources={resources}
          onStat={handleStat}
          onTest={handleTest}
        />

        {lockedNodeInfo && (
          <RequirementsPopup
            node={lockedNodeInfo.node}
            prereqNodes={lockedNodeInfo.prereqNodes}
            anyOf={lockedNodeInfo.anyOf}
            resources={resources}
            onClose={() => setLockedNodeId(null)}
          />
        )}
      </div>

      <footer className="app-legend">
        {[
          { color: '#f59e0b', label: 'Certificate' },
          { color: '#22d3ee', label: 'Rating' },
        ].map(({ color, label }) => (
          <div key={label} className="legend-item">
            <span className="legend-dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
            {label}
          </div>
        ))}
      </footer>
    </div>
  )
}