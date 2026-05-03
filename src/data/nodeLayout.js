// col: horizontal column (0 = center, negative = left, positive = right)
// rank: vertical tier (0 = bottom, higher = top)

export const NODE_LAYOUT = {
    'no-cert':       { col:  0, rank: 0 },
    'student':       { col:  0, rank: 1 },
    'recreational':  { col: -2, rank: 2 },
    'sport':         { col: -1, rank: 2 },
    'private':       { col:  0, rank: 3 },
    'basic-gi':      { col:  2, rank: 3 },
    'cfi-sport':     { col: -1, rank: 3 },
    'vision-jet-type': { col: -2, rank: 4 },
    'commercial':    { col:  0, rank: 4 },
    'instrument':    { col:  1, rank: 4 },
    'advanced-gi':   { col:  3, rank: 4 },
    'cfi':           { col:  1, rank: 5 },
    'instrument-gi': { col:  4, rank: 4 },
    'cfi-i':         { col:  1, rank: 6 },
    'atp':           { col:  0, rank: 7 },
}
