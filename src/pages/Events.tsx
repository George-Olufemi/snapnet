// EventList.js
import React from 'react';
import { useQuery } from 'react-query';
import { getEvents } from '../services/eventService';

const EventList = () => {
  const { data: events, isLoading, isError } = useQuery('events', getEvents);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading events</div>;
  }

  return (
    <div>
      <h1>Event List</h1>
      {events.map((event) => (
        <div key={event.id}>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;
