const API_KEY = 'qnvnEumCMSDClNcGyAn5L3UX1igxrIkb';

const search = async (query, pageSize, offset) => {
  const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=${query.replace(' ', '+')}&api_key=${API_KEY}&limit=${pageSize}&offset=${pageSize * offset}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
};

export default search;
