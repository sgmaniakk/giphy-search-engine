const API_KEY = 'qnvnEumCMSDClNcGyAn5L3UX1igxrIkb';

const search = async (query) => {
  const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=${query.replace(' ', '+')}&api_key=${API_KEY}&limit=8`, {
    method: 'GET',
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export default search;
