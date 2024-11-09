"use client"
import { useState, useEffect } from 'react';
import { EditEventProps } from '@/interface';
import { editEventAPI } from '../ApiCall';
import moment, { Moment } from 'moment';

const EditEvent = ({ username, event, onUpdateEvent, onCancel }: EditEventProps) => {
  const [title, setTitle] = useState(event.title || '');

  // Initialize state
  const [startDate, setStartDate] = useState(event.start ? moment(event.start).format('YYYY-MM-DD') : '');
  const [startTime, setStartTime] = useState(event.start ? moment(event.start).format('HH:mm') : '06:00');
  const [endDate, setEndDate] = useState(event.end ? moment(event.end).format('YYYY-MM-DD') : '');
  const [endTime, setEndTime] = useState(event.end ? moment(event.end).format('HH:mm') : '23:00');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setStartDate(event.start ? moment(event.start).format('YYYY-MM-DD') : '');
      setStartTime(event.start ? moment(event.start).format('HH:mm') : '06:00');
      setEndDate(event.end ? moment(event.end).format('YYYY-MM-DD') : '');
      setEndTime(event.end ? moment(event.end).format('HH:mm') : '23:00');
    }
  }, [event]);

  const getDateTime = (date: string, time: string): Moment | null => {
    if (!date) return null;
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = moment(date);
    newDate.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
    return newDate;
  };

  const handleSubmit = async () => {
    const startDateTime = getDateTime(startDate, startTime);
    const endDateTime = getDateTime(endDate, endTime);

    if (title && startDateTime && endDateTime && startDateTime.isBefore(endDateTime)) {
      setLoading(true);
      setError(null);
      
      const response = await editEventAPI({
        username,
        event: { _id: event._id, title, start: startDateTime.toDate(), end: endDateTime.toDate() },
      });

      // console.log(response);
      

      setLoading(false);

      if (response.success) {
        onUpdateEvent({
          ...event,
          title,
          start: startDateTime.toDate(),
          end: endDateTime.toDate(),
        });
        onCancel();
      } else {
        setError(response.message);
      }
    } else {
      setError('Please ensure the title is filled and the end time is after the start time.');
    }
  };

  return (
    <div className="shadow-md rounded-lg my-4">
      <h3 className="text-xl font-semibold mb-4 text-white">Edit Event</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
