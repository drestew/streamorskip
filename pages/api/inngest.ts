import { serve } from 'inngest/next';
import getRatings from './cron/inngestFunctions/rating';
import getGenres from './cron/inngestFunctions/genre';

export default serve('streamorskip', [getRatings, getGenres]);
