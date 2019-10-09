const SERVICE_URL = 'api.giphy.com/v1/gifs/';

search = async () => {
    const response = await fetch(SERVICE_URL + '/search', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    const data = await response.JSON();
    return data;
}