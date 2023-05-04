# Introduction

This project is an response to the lack of open source world-building tools. This is supposed to help world-builder to create, manage, and share their worlds. This project is still in its early stage, so there are still a lot of features that are not implemented yet.

## AI

Optional, but significant, you can use AI to be your assistant. With the powerful AI models from [NovelAI](https//:www.novelai.net). Currently, the AI only helps you write your entry, but I plan to make it more useful in the future.

## Features

- [x] Create, edit, and delete entry
- [x] Infobox
- [x] Generate with AI
- [x] AI memory
- [x] Share your world
- [x] Mardown support
- [x] Dashboard
- [ ] Create, edit, and delete category
- [ ] Search
- [ ] Writer management
- [ ] Manage images
- [ ] Manage files
- [ ] AI settings
- [ ] Private entries
- [ ] Complete navbar
- [ ] Hosting instructions
- [ ] Generated writing prompts

# Hosting

This app requires an [Supabase](https://supabase.com/) account. You can host it on your own server, or use [Vercel](https://vercel.com/). The [Supabase](https://supabase.com/) and [Vercel](https://vercel.com/) combination is super easy to use, and it's free.

## Instructions

Here will be the instructions how to set up the app on [Supabase](https://supabase.com/) and [Vercel](https://vercel.com/). Easy for anyone to follow.

### Vercel

1. Choose "use third party repository"
2. Enter the repository URL: https://github.com/SalokinGreen/Nexus-Forge.git
3. Enter the environment variables
   ![Environment variables](https://prnt.sc/BzJEDjxYcHuA)
   NEXT_PUBLIC_SUPABASE_URL = your supabase url
   NEXT_PUBLIC_SUPABASE_URL_IMG = your supabase url without the "https://"
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your supabase anon key
4. Enjoy
