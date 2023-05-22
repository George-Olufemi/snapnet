// EventDetail.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getEventById } from '../services/eventService';

interface EventParams {
  eventId: string;
}

const EventDetail: React.FC = () => {
  const { eventId } = useParams<EventParams>();
  const { data, isLoading, isError } = useQuery(['event', eventId], () => getEventById(Number(eventId)));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading event</div>;
  }

  const event = data;

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
    </div>
  );
};

export default EventDetail;
