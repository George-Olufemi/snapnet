import { useState, ChangeEvent } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
// import { css, SerializedStyles } from '@emotion/react';
import { BounceLoader } from 'react-spinners';

const fetchEvents = async () => {
  const response = await fetch(
    'https://my-json-server.typicode.com/Code-Pop/Touring-Vue-Router/events'
  );
  const data = await response.json();

  const eventsArray = Array.isArray(data) ? data : [data];

  if (!Array.isArray(eventsArray)) {
    throw new Error('Invalid response format');
  }

  return eventsArray;
};

// const override: SerializedStyles = css`
//   display: block;
//   margin: 0 auto;
//   margin-top: 20px;
// `;

const EventList = () => {
  const [page, setPage] = useState<number>(1);
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);

  const { data: events, isLoading, error } = useQuery<any, Error>(['events', page, petsAllowed], () =>
    fetchEvents().then((events) => {
      const itemsPerPage = 3;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedEvents = events.slice(startIndex, endIndex);
      const filteredEvents = petsAllowed
        ? paginatedEvents.filter((event: any) => event.petsAllowed)
        : paginatedEvents;

      return filteredEvents;
    })
  );

  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    navigate(`?page=${newPage}`, { replace: true });
  };

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPetsAllowed(event.target.checked);
    setPage(1);
    navigate(`?page=1`, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 h-screen text-center">
        <BounceLoader color="#646cff" size={60} />
      </div>
    );
  }

  if (error) {
    return <div className="bg-white p-4 shadow h-screen">Error: {error.message}</div>;
  }

  return (
    <div className="bg-white p-4 h-screen">
      <h2 className="text-2xl font-bold mb-4">All Events</h2>
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          className="mr-2"
          checked={petsAllowed}
          onChange={handleFilterChange}
        />
        Pets Allowed
      </label>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event: any) => (
          <div key={event.id} className="p-4 border border-gray-300 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">
              <Link
                to={`/event/${event.id}`}
                className="text-indigo-600 border-b border-indigo-600"
              >
                {event.title}
              </Link>
            </h3>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="px-4 py-2 rounded bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Previous Page
        </button>
        <button
          disabled={events.length < 3}
          onClick={() => handlePageChange(page + 1)}
          className="px-4 py-2 rounded bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

const EventDetail = () => {
  const { id } = useParams();
  const { data: event, isLoading, error } = useQuery<any, Error>(['event', id], () =>
    fetchEvents().then((events) => events.find((e: any) => e.id.toString() === id))
  );

  if (isLoading) {
    return (
      <div className="bg-white p-4 shadow text-center h-screen">
        <BounceLoader color="#646cff" size={60} />
      </div>
    );
  }

  if (error) {
    return <div className="bg-white p-4 h-screen">Error: {error.message}</div>;
  }

  if (!event) {
    return <div className="bg-white p-4 h-screen">Event not found</div>;
  }

  return (
    <div className="bg-white p-4 h-screen">
      <h2 className="text-2xl font-bold mb-4">Event Details</h2>
      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
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
