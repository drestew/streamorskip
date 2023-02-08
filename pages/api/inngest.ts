import { serve } from 'inngest/next';
import addToCatalog from './cron/inngest/functions';

export default serve('My app name', [addToCatalog]);
