// eventService.js
import axios from 'axios';

const BASE_URL = 'https://my-json-server.typicode.com/Code-Pop/Touring-VueRouter';

const getEvents = async () => {
  const response = await axios.get(`${BASE_URL}/events`);
  return response.data;
};

const getEventById = async (eventId) => {
  const response = await axios.get(`${BASE_URL}/events/${eventId}`);
  return response.data;
};

export { getEvents, getEventById };
