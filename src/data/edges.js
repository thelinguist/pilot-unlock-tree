const edgeDefaults = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#f59e0b', strokeWidth: 2 },
}

const ratingEdge = {
  ...edgeDefaults,
  style: { stroke: '#22d3ee', strokeWidth: 2 },
}

const instructorEdge = {
  ...edgeDefaults,
  style: { stroke: '#818cf8', strokeWidth: 2 },
}

export const initialEdges = [
  // Foundation
  { id: 'e-nocert-student',     source: 'no-cert',    target: 'student',      ...edgeDefaults },
  { id: 'e-nocert-basicgi',     source: 'no-cert',    target: 'basic-gi',     sourceHandle: 'right', ...instructorEdge },

  // From Student
  { id: 'e-student-sport',      source: 'student',    target: 'sport',        ...edgeDefaults },
  { id: 'e-student-rec',        source: 'student',    target: 'recreational', ...edgeDefaults },
  { id: 'e-student-private',    source: 'student',    target: 'private',      ...edgeDefaults },

  // Sport branch
  { id: 'e-sport-cfisport',     source: 'sport',      target: 'cfi-sport',    ...instructorEdge },

  // Private branches
  { id: 'e-private-commercial', source: 'private',    target: 'commercial',   ...edgeDefaults },
  { id: 'e-private-instrument', source: 'private',    target: 'instrument',   ...ratingEdge },
  { id: 'e-private-visionjet',  source: 'private',    target: 'vision-jet-type', ...ratingEdge },

  // Ground Instructor chain
  { id: 'e-basicgi',      source: 'no-cert',   target: 'instrument-gi', sourceHandle: 'right',  ...instructorEdge },
  { id: 'e-instgi',      source: 'no-cert',   target: 'advanced-gi', sourceHandle: 'right',  ...instructorEdge },

  // CFI requires both Commercial AND Instrument
  { id: 'e-commercial-cfi',     source: 'commercial', target: 'cfi',          ...instructorEdge },
  { id: 'e-instrument-cfi',     source: 'instrument', target: 'cfi',          ...instructorEdge },

  // CFI side quest chain → MEI → ATP
  { id: 'e-cfi-cfii',           source: 'cfi',        target: 'cfi-i',        ...ratingEdge },

  { id: 'e-comm-atp',           source: 'commercial', target: 'atp',          ...edgeDefaults }
]
