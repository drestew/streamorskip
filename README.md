# Stream or Skip
***
Have you ever scrolled for longer than five minutes on Netflix, trying to find something good to watch? I have, too many times to count! That is where I got the idea for Stream or Skip, it's essentially a crowdsourced rating system to help others find the best content to watch (or stay away from!) on Netflix.

![stream or skip landing page](https://hcoxdhdqhkhtynyvbdpv.supabase.co/storage/v1/object/public/readme/streamorskip-landing-page.png)




## Link to project
https://streamorskip.com<br><br>



## Technologies and Tools Used
Typescript, React, NextJS, Styled-Components, Supabase, Cloudflare Workers, Storybook, Cypress
<br><br>
## Project Planning
#### User Stories
![user stories](https://hcoxdhdqhkhtynyvbdpv.supabase.co/storage/v1/object/public/readme/user-stories.png)
<br><br>

#### Tasks
![tasks](https://hcoxdhdqhkhtynyvbdpv.supabase.co/storage/v1/object/public/readme/tasks.png)
<br><br>

#### Initial Wireframes

![wiframes](https://hcoxdhdqhkhtynyvbdpv.supabase.co/storage/v1/object/public/readme/wireframes.png)
<br><br>

#### Component UI Stories
[streamorskip.chromatic.com](https://65cc26c55667dc3ccecc0168-lqugyeeywv.chromatic.com/?path=/story/catalog-card--default)
<br><br>

## Optimizations
- Tanstack Query for caching and keeping managing server state
- Runtypes for validating types coming from external api 
- Migration from Vercel Serverless Functions to Cloudflare Worker to have more control over cron jobs
- UI components built with Radix-UI for improved accessibility

## Lessons Learned:
- When stuck on a problem for an extended period of time, it is always best to take a break and come back to it later with fresh eyes. 
- Try to write code with the intention that you'll come back to it a year later and know what's going on.
- Managing server state is not as straightforward as client state.
- Documentation tutorials is one of the best ways to learn the basics of a library quickly.


## Future Updates:
- A sort feature that allows a user to sort by number of streams, number of votes, release date, etc.
- The ability to share a content card on social media to drive engagement.
- Sociable user profiles that allow a user to follow people that they know have good taste in content to watch.
