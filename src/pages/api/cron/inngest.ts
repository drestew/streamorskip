import { serve } from 'inngest/next';
import { Inngest } from 'inngest';
import getRatings from './inngestFunctions/rating';
import getGenres from './inngestFunctions/genre';

export const inngest = new Inngest({ name: 'streamorskip' });
export default serve(inngest, [getRatings, getGenres]);
