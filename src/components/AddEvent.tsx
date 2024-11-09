"use client";
import { useState } from 'react';
import { AddEventProps } from '@/interface';
import { AddEventAPI } from '@/ApiCall';
import { useUser } from '@clerk/nextjs';

const AddEvent = ({ onAddEvent}: AddEventProps ) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('06:00');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState<string>('23:00');
  const { user, isLoaded } = useUser(); 

  if (!isLoaded) {
    return <div className='text-white text-xl'>Loading...</div>; 
  }
  const username = user?.username; 
  
  const getStartDateTime = (date: string, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    const newStartDate = new Date(date);
    newStartDate.setHours(hours, minutes, 0, 0);
    return newStartDate;
  };

  const getEndDateTime = (date: string, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    const newEndDate = new Date(date);
    newEndDate.setHours(hours, minutes, 0, 0);
    return newEndDate;
  };

  const handleSubmit = async () => {
    if (title && startTime && endTime) {
      const startDateTime = getStartDateTime(startDate, startTime);
      const endDateTime = getEndDateTime(endDate, endTime);
  
      if (startDateTime < endDateTime) {
        const event = {
          title,
          start: startDateTime,
          end: endDateTime,
        };
  
        try {
          // Call API 
          if(!username){
            return alert("Something went wrong")
          }
          const data = await AddEventAPI({ username, event });
  
          if (data) {
            onAddEvent(data.event);
            alert(data.message); 
  
            // Reset form fields 
            setTitle('');
            setStartDate(new Date().toISOString().split('T')[0]);
            setStartTime('09:00');
            setEndDate(new Date().toISOString().split('T')[0]);
            setEndTime('10:00');
          } else {
            alert('Error: Error on add event');
          }
        } catch (error) {
          console.error('Error adding event:', error);
          alert('An error occurred while adding the event.');
        }
      } else {
        alert('End time must be after start time.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="shadow-md rounded-lg my-4">
      <h3 className="text-xl font-semibold mb-4 text-white">Add New Event</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white">Event Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            className="mt-2 p-2 w-full border border-gray-300 background-none rounded-md"
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
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
