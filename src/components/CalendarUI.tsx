"use client"
import {  useState } from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import {format,parse, startOfWeek, getDay, addHours, startOfHour} from 'date-fns'
import {enUS} from 'date-fns/locale/en-US'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'


export const CalendarUI = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      title: 'Learn cool stuff',
      start,
      end,
    },
  ])

  const onEventResize: withDragAndDropProps['onEventResize'] = data => {
    const { start, end } = data

    setEvents(currentEvents => {
      const firstEvent = {
        start: new Date(start),
        end: new Date(end),
      }
      return [...currentEvents, firstEvent]
    })
  }

  const onEventDrop: withDragAndDropProps['onEventDrop'] = data => {
    console.log(data)
  }

  return (
    <DnDCalendar
      defaultView='month'
      events={events}
      localizer={localizer}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      resizable
      style={{ height: '100vh', color:'#ffffff'}}
    />
  )
}

const locales = {
  'en-US': enUS,
}
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1)
const now = new Date()
const start = endOfHour(now)
const end = addHours(start, 2)
// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})


const DnDCalendar = withDragAndDrop(Calendar)
