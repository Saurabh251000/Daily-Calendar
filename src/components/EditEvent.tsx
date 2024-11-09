"use client"
import { useState, useEffect } from 'react';
import { EditEventProps } from '@/interface';

const EditEvent = ({ event, onUpdateEvent, onCancel }: EditEventProps) => {
  const [title, setTitle] = useState(event.title || '');
  const [startDate, setStartDate] = useState(event.start ? event.start.toISOString().split('T')[0] : '');
  const [startTime, setStartTime] = useState(event.start ? event.start.toISOString().split('T')[1].slice(0, 5) : '06:00');
  const [endDate, setEndDate] = useState(event.end ? event.end.toISOString().split('T')[0] : '');
  const [endTime, setEndTime] = useState(event.end ? event.end.toISOString().split('T')[1].slice(0, 5) : '23:00');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setStartDate(event.start ? event.start.toISOString().split('T')[0] : '');
      setStartTime(event.start ? event.start.toISOString().split('T')[1].slice(0, 5) : '06:00');
      setEndDate(event.end ? event.end.toISOString().split('T')[0] : '');
      setEndTime(event.end ? event.end.toISOString().split('T')[1].slice(0, 5) : '23:00');
    }
  }, [event]);

  const getDateTime = (date: string, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  const handleSubmit = () => {
    const startDateTime = getDateTime(startDate, startTime);
    const endDateTime = getDateTime(endDate, endTime);

    if (title && startDateTime < endDateTime) {
      onUpdateEvent({
        ...event,
        title,
        start: startDateTime,
        end: endDateTime,
      });
    } else {
      alert('Please ensure the title is filled and end time is after start time.');
    }
  };

  return (
    <div className="shadow-md rounded-lg my-4">
      <h3 className="text-xl font-semibold mb-4 text-white">Edit Event</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white">Event Title</label>
          <input
            id="title"
            type="text"
            value={String(title) || ''}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-white">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-white">Start Time</label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-white">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-white">End Time</label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save Changes</button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
