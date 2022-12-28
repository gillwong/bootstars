import axios from 'axios';

const baseUrl = "https://8888-2001-448a-2071-107-19dc-d410-ab-4a18.ap.ngrok.io/courses";  // http://localhost:8000

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
}

const create = (newObj) => {
  const request = axios.post(baseUrl, newObj);
  return request.then(response => response.data);
}

const update = (newObj) => {
  const request = axios.put(`${baseUrl}/${newObj.id}`, newObj);
  return request.then(response => response.data);
}

const delData = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(response => response.data);
}

const getData = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then(response => response.data);
}

const coursesServices = { getAll, create, update, delData, getData };

export default coursesServices;