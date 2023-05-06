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
- [x] Get NovelAI access key
- [x] AI assistant
- [x] Hosting instructions
- [ ] Create, edit, and delete category
- [ ] Search
- [ ] Writer management
- [ ] Manage images
- [ ] Manage files
- [ ] AI settings
- [ ] Private entries
- [ ] Complete navbar
- [ ] Generated writing prompts

# Hosting

This app requires an [Supabase](https://supabase.com/) account. You can host it on your own server, or use [Vercel](https://vercel.com/). The [Supabase](https://supabase.com/) and [Vercel](https://vercel.com/) combination is super easy to use, and it's free.

## Instructions

Here will be the instructions how to set up the app on [Supabase](https://supabase.com/) and [Vercel](https://vercel.com/). Easy for anyone to follow.

### Vercel

1. Choose "use third party repository"
2. Enter the repository URL: https://github.com/SalokinGreen/Nexus-Forge.git
3. Enter the environment variables
   NEXT_PUBLIC_SUPABASE_URL = your supabase url
   NEXT_PUBLIC_SUPABASE_URL_IMG = your supabase url without the "https://"
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your supabase anon key
4. Enjoy

### Supabase

1. Create a new project
2. Use your supabase url and anon key in the environment variables
3. Go to the table editor
4. Create a new table called "articles" with following settings:

- id: default
- created_at: default
- contet: text
- title: text
- type: text
- author: text
- memory: text
- images: json, as array enabled
- keywords: text, as array enabled
- form: json, as array enabled
- chat: json, as array enabled
- public: boolean, default true
- favorite: boolean, default false

5. View its policies and create new policies with following settings:

- select: allowed operation (select), target roles (none), using expression (true), with check expression (true). _This should exist as default, but make sure it's there._
- all: allowed operation (all), target roles (authenticated), using expression (true), with check expression (true)

6. Create a new table called "invites" with following settings:

- id: default
- created_at: default
- code: text
- is_used: boolean, default false

7. View its policies and create new policies with following settings:

- select: allowed operation (select), target roles (none), using expression (true), with check expression (true). _This should exist as default, but make sure it's there._
- all: allowed operation (all), target roles (authenticated), using expression (true), with check expression (true)

8. Create a new **public** bucket in the storage called "images"
9. Edit the bucket and create a new policies with following settings:

- select: target roles(none), using expression ((bucket_id = 'images'::text))
- insert: target roles(authenticated), using expression ((bucket_id = 'images'::text))
- update: target roles(authenticated), using expression ((bucket_id = 'images'::text))
- delete: target roles(authenticated), using expression ((bucket_id = 'images'::text))

10. Go to the authentication tab and add user "create new user". You will have to create your own account like that, further accounts can be created naturally.
11. Enjoy

\*_Note: Things might change during the project, and you might have to change the database structure. I will try to keep this up to date._

# AI

Need help world-building? You can use AI to help you. With the powerful AI models from [NovelAI](https://www.novelai.net), you can generate your entry with AI. You can also use the AI to help you write your entry. You can also use the AI to generate writing prompts. And you can chat with the AI to help you with your world-building.

### NAI Access

You need a NovelAI sub to use the AI. You can get it [here](https://www.novelai.net/). Then just log in with your NAI data, and you're good to go.

## AI Generations

You don't know what to write? Just hit generate and you the AI takes over.

### AI Memory

Put your world-building data into the AI memory, and the AI will use it to generate your entry. It will always remember what's in your memory.

## AI Companions

You can chat with many different AI assistants to help you with your world-building. Ask it questions, and it will answer them.

### Master Wong

An ancient sage who knows everything about the world. He can answer all your questions.

### Lily Stark

A burtish woman who can tell you everything about the monsters she slayed.

### Willhelm Fennick

An old detective who's too old for everything.

### Mary Daniels

A loving housewife and caring mother who can tell you everything about the good in the world.

### King Arthur

The legendary king of Camelot. He can tell you everything about the world.
