import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
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
  const [page, setPage] = useState(1);
  const [petsAllowed, setPetsAllowed] = useState(false);

  const { data: events, isLoading, error } = useQuery(['events', page, petsAllowed], () =>
    fetchEvents().then((events) => {
      // Apply pagination
      const itemsPerPage = 3;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedEvents = events.slice(startIndex, endIndex);

      // Apply petsAllowed filter
      const filteredEvents = petsAllowed
        ? paginatedEvents.filter((event) => event.petsAllowed)
        : paginatedEvents;

      return filteredEvents;
    })
  );

  const navigate = useNavigate();

  const handlePageChange = (newPage) => {
    setPage(newPage);
    navigate(`?page=${newPage}`, { replace: true });
  };

  const handleFilterChange = (event) => {
    setPetsAllowed(event.target.checked);
    setPage(1);
    navigate(`?page=1`, { replace: true });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>All Events</h2>
      <label>
        Pets Allowed
        <input
          type="checkbox"
          checked={petsAllowed}
          onChange={handleFilterChange}
        />
      </label>
      {events.map((event) => (
        <div key={event.id}>
          <h3>
            <Link to={`/event/${event.id}`}>{event.title}</Link>
          </h3>
          <p>{event.description}</p>
        </div>
      ))}
      <div>
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous Page
        </button>
        <button
          disabled={events.length < 3}
          onClick={() => handlePageChange(page + 1)}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

const EventDetail = () => {
  const { id: eventId } = useParams();
  const { data: events, isLoading, error } = useQuery('events', fetchEvents);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const event = events.find((e) => e.id === parseInt(eventId));

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
    <Router>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
