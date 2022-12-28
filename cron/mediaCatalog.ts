const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.MEDIA_KEY,
    'X-RapidAPI-Host': process.env.MEDIA_HOST,
  },
};

const newMedia = async function () {
  const mediaData = await fetch(
    'https://unogsng.p.rapidapi.com/search?start_year=1972&orderby=rating&audiosubtitle_andor=and&limit=1&subtitle=english&countrylist=78%2C46&audio=english&country_andorunique=unique&offset=0&end_year=2019',
    options
  );
  return await mediaData.json();
};

export { newMedia };
