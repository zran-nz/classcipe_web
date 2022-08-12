let eventGuid = 0
const todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
const BG_COLORS = ['#f03132', '#0072bb', '#91191a', '#4d91f9', '#002056', '#f68e54', '#329933', '#3333cc']

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'History of England',
    start: todayStr + 'T09:00:00',
    end: todayStr + 'T12:00:00',
    backgroundColor: BG_COLORS[0],
    extendedProps: {
      classId: 1,
      status: 0
    }
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T13:00:00',
    end: todayStr + 'T14:00:00',
    backgroundColor: BG_COLORS[1],
    extendedProps: {
      classId: 2,
      status: 1
    }
  },
  {
    id: createEventId(),
    title: 'History of England',
    start: '2022-03-12T07:00:00',
    end: '2022-03-12T09:30:00',
    backgroundColor: BG_COLORS[2],
    extendedProps: {
      classId: 3,
      status: 1
    }
  },
  {
    id: createEventId(),
    title: 'History of England',
    start: '2022-03-12T10:00:00',
    end: '2022-03-12T13:30:00',
    backgroundColor: BG_COLORS[2],
    extendedProps: {
      classId: 3,
      status: 1
    }
  },
  {
    id: createEventId(),
    title: 'History of England',
    start: '2022-03-12T13:00:00',
    end: '2022-03-12T14:30:00',
    backgroundColor: BG_COLORS[3],
    extendedProps: {
      classId: 4,
      status: 0
    }
  },
  {
    id: createEventId(),
    title: 'History of England',
    start: '2022-03-12T14:30:00',
    end: '2022-03-12T17:30:00',
    backgroundColor: BG_COLORS[0],
    extendedProps: {
      classId: 1,
      status: 0
    }
  }
]

export function createEventId() {
  return String(eventGuid++)
}
