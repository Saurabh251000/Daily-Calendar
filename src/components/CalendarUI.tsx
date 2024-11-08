"use client"
import { useState } from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import AddEvent from './AddEvent'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'


const DnDCalendar = withDragAndDrop(Calendar)

export const CalendarUI = () => {
  const [events, setEvents] = useState<Event[]>([])

  const onEventResize: withDragAndDropProps['onEventResize'] = data => {
    const { start, end, event } = data
    setEvents(currentEvents =>
      currentEvents.map(e =>
        e.start === event.start ? { ...e, start: new Date(start), end: new Date(end) } : e
      ) as Event[]
    )
  }

  const onEventDrop: withDragAndDropProps['onEventDrop'] = data => {
    const { start, end, event } = data
    setEvents(currentEvents =>
      currentEvents.map(e =>
        e.title === event.title ? { ...e, start: new Date(start), end: new Date(end) } : e
      ) as Event[]
    )
  }

  const addEvent = (title: string, start: Date, end: Date) => {
    setEvents([
      ...events,
      {
        title,
        start,
        end,
      },
    ])
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full lg:w-1/4 ">
        <AddEvent onAddEvent={addEvent} />
      </div>
      
      <div className="w-full lg:w-3/4">
        <DnDCalendar
          className="w-full"
          selectable
          defaultView='month'
          views={['month', 'agenda']}
          events={events}
          localizer={localizer}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          style={{ height: '500px', color: '#ffffff' }}
          components={{
            toolbar: ({ label, onNavigate, onView }) => (
              <div className="flex flex-col gap-3 lg:flex-row justify-between items-center py-2 text-white">
                <div className='border border-white rounded'>
                  <button
                    className="hover:bg-gray-400 focus:bg-gray-100 text-white focus:text-gray-800 py-2 px-4 border-r"
                    onClick={() => onNavigate('TODAY')}
                  >
                    Today
                  </button>
                  <button
                    className="hover:bg-gray-400 focus:bg-gray-100 text-white focus:text-gray-800 py-2 px-4"
                    onClick={() => onNavigate('PREV')}
                  >
                    Back
                  </button>
                  <button
                    className="hover:bg-gray-400 focus:bg-gray-100 text-white focus:text-gray-800 py-2 px-4 border-l"
                    onClick={() => onNavigate('NEXT')}
                  >
                    Next
                  </button>
                </div>
                
                <span className="text-lg">{label}</span>
                
                <div className='border border-white rounded'>
                  <button
                    className="hover:bg-gray-400 focus:bg-gray-100 text-white focus:text-gray-800 py-2 px-4 border-r"
                    onClick={() => onView('month')}
                  >
                    Month
                  </button>
                  <button
                    className="hover:bg-gray-400 focus:bg-gray-100 text-white focus:text-gray-800 py-2 px-4"
                    onClick={() => onView('agenda')}
                  >
                    Agenda
                  </button>
                </div>
              </div>
            ),
          }}
        />
      </div>
    </div>
  )
}

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
