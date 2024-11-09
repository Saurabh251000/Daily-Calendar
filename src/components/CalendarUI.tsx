"use client"
import React from 'react'
import { useState } from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import AddEvent from './AddEvent'
import EditEvent from './EditEvent'
import { CustomAgendaEventProps } from '@/interface'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const DnDCalendar = withDragAndDrop(Calendar)

const CustomAgendaEvent = ({ event, onEdit, onDelete } : CustomAgendaEventProps) => (
  <span className='flex justify-between flex-wrap gap-2'>
    <strong className=' flex flex-wrap break-words' >{event.title}</strong>
    <div className="flex gap-2">
      <button onClick={() => onEdit(event)} className="text-blue-500 hover:underline">Edit</button>
      <button onClick={() => onDelete(event)} className="text-red-500 hover:underline">Delete</button>
    </div>
  </span>
)

export const CalendarUI = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const editEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditing(true);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(e => e.title === selectedEvent?.title ? updatedEvent : e));
    setIsEditing(false);
    setSelectedEvent(null);
  };
  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedEvent(null);
  };

  const deleteEvent = (event:Event) => {

    setEvents(events.filter(e => e.title !== event.title))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full lg:w-1/4">
        {isEditing ? (
          selectedEvent && (
            <EditEvent event={selectedEvent} onUpdateEvent={updateEvent} onCancel={cancelEdit} />
          )
        ) : (
          <AddEvent onAddEvent={addEvent} />
        )}
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
            agenda: {
              event: (props) => (
                <CustomAgendaEvent 
                  {...props} 
                  onEdit={editEvent} 
                  onDelete={deleteEvent} 
                />
              )
            },
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
                    Events
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
