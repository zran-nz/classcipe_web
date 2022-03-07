let eventGuid = 0
const todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
const BG_COLORS = ['#cff7e2', '#fff1cf', '#d3d9f0', '#ef4136', '#54C7B0', '#F47920', '#194283', '#59C754']
const FONT_COLORS = ['#4b7903', '#d9011b', '#f49a23', '#aaaaaa']

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'History of England',
    start: todayStr + 'T09:00:00',
    end: todayStr + 'T12:00:00',
    backgroundColor: BG_COLORS[0],
    textColor: FONT_COLORS[0]
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T13:00:00',
    end: todayStr + 'T14:00:00',
    backgroundColor: BG_COLORS[1],
    textColor: FONT_COLORS[1]
  },
  {
    id: createEventId(),
    title: 'History of England',
    start: '2022-03-12T10:00:00',
    end: '2022-03-12T13:30:00',
    backgroundColor: BG_COLORS[2],
    textColor: FONT_COLORS[2]
  },
  {
    id: createEventId(),
    title: 'History of England',
    start: '2022-03-12T13:00:00',
    end: '2022-03-12T17:30:00',
    backgroundColor: BG_COLORS[3],
    textColor: FONT_COLORS[3]
  }
]

export function createEventId() {
  return String(eventGuid++)
}
