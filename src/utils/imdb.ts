interface jsonResponse {
  method: string;
  headers: {
    [key: string]: string;
  };
}

export const options: jsonResponse = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.IMDB_KEY,
    'X-RapidAPI-Host': process.env.IMDB_HOST,
  },
};
