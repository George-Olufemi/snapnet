import React from 'react';
import { useQuery } from 'react-query';

const fetchEvents = async () => {
  const response = await fetch(
    'https://my-json-server.typicode.com/Code-Pop/Touring-Vue-Router/events'
  );
  const data = await response.json();

  let eventsArray = Array.isArray(data) ? data : [data];

  if (!Array.isArray(eventsArray)) {
    throw new Error('Invalid response format');
  }

  return eventsArray;
};



const EventList = () => {
  const { data: events, isLoading, error } = useQuery('events', fetchEvents);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>All Events</h2>
      {events.map((event: any) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
};

const EventDetail = ({ eventId }: { eventId: number }) => {
  const { data: event, isLoading, error } = useQuery(
    ['event', eventId],
    () => fetchEvents().then((events) => events.find((e: any) => e.id === eventId))
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <h2>Event Details</h2>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <EventList />
      <EventDetail eventId={123} />
    </div>
  );
};

export default App;
