import { serve } from 'inngest/next';
import { Inngest } from 'inngest';
import getRatings from './cron/inngestFunctions/rating';
import getGenres from './cron/inngestFunctions/genre';

export const inngest = new Inngest({ name: 'streamorskip' });
export default serve(inngest, [getRatings, getGenres]);
