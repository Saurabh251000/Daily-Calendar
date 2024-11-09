"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// import { format, parse, startOfWeek, getDay } from 'date-fns'
// import { enUS } from 'date-fns/locale'
import AddEvent from './AddEvent'
import EditEvent from './EditEvent'
import { deleteEventAPI, getEventAPI, editEventAPI } from '@/ApiCall'
import { CustomEvent, CustomDnDProps, CustomAgendaEventProps } from '@/interface'
import { useUser } from '@clerk/nextjs';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
// import 'react-big-calendar/lib/css/react-big-calendar.css';


// import {  } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);


const DnDCalendar = withDragAndDrop(Calendar)

// const locales = {
//   'en-US': enUS,
// }

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

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
  const [events, setEvents] = useState<CustomEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user,isLoaded } =  useUser(); 
  const username = user?.username; 

// Get Event
  useEffect(() => {
    const fetchEvents = async () => {
      if (username) {
        const fetchedEvents = await getEventAPI(username);
        if (fetchedEvents) {
          // console.log(fetchedEvents.events); ---> events
          setEvents(fetchedEvents.events);
        } else {
          console.error('Failed to load events');
        }
      }
    };
    fetchEvents();
  }, [username]);

  if (!isLoaded || loading) {
    return <div className='text-white text-xl'>Loading...</div>; 
  }

// Resize Event
  const onEventResize: CustomDnDProps['onEventResize'] = async(data) => {
    const { start, end, event } = data
    setLoading(true)
    const response = await editEventAPI({
      username,
      event: { _id: event._id, title: event.title , start: moment(start).toDate(), end: moment(end).toDate()  },
    });

    console.log("Resize Event Updated",  response);
  
    setLoading(false)

    setEvents(currentEvents =>
      currentEvents.map(e =>
        e.start === event.start ? { ...e, start: new Date(start), end: new Date(end) } : e
      ) as CustomEvent[]
    )
  }

  // Drag and Drop Event
  const onEventDrop: CustomDnDProps['onEventDrop'] = async(data) => {
    const { start, end, event } = data

    setLoading(true)
    const response = await editEventAPI({
      username,
      event: { _id: event._id, title: event.title , start: moment(start).toDate(), end: moment(end).toDate()  },
    });

    console.log("Resize Event Updated",  response);
    setLoading(false)

    setEvents(currentEvents =>
      currentEvents.map(e =>
        e.title === event.title ? { ...e, start: new Date(start), end: new Date(end) } : e
      ) as CustomEvent[]
    )
  }

  // Add New Event
  const addEvent = (event:CustomEvent) => {
    setEvents([
      ...events, event,
    ])
  }

  // Edit Event --> IT ensure edit component is visible or not
  const editEvent = (event: CustomEvent) => {
    setSelectedEvent(event);
    setIsEditing(true);
  };

  // Update edited event
  const updateEvent = (updatedEvent: CustomEvent) => {
    setEvents(events.map(e => e.title === selectedEvent?.title ? updatedEvent : e));
    setIsEditing(false);
    setSelectedEvent(null);
  };
  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedEvent(null);
  };

  // Delete Event
  const deleteEvent = async (event: CustomEvent) => {
    if (!event._id) {
      console.error("Event ID is missing or undefined");
      return;  
    }
    const deletedEvent = await deleteEventAPI({username: username ?? '', id: event._id});
    if (deletedEvent) {
      setEvents(events.filter(e => e._id !== event._id));
    } else {
      console.error('Error deleting event');
    }
  };



  return (
    <div className="flex flex-col lg:flex-row gap-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full lg:w-1/4">
        {isEditing ? (
          selectedEvent && (
            <EditEvent username={username}  event={selectedEvent} onUpdateEvent={updateEvent} onCancel={cancelEdit} />
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




