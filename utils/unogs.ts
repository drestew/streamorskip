interface jsonResponse {
  method: string;
  headers: {
    [key: string]: string;
  };
}

export const options: jsonResponse = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.CATALOG_KEY,
    'X-RapidAPI-Host': process.env.CATALOG_HOST,
  },
};
