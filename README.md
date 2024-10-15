code runner based on judge0 api

wip

todo:
- [ ] full language support, judge0 already supports 70+ languages, so I just need to implement the drop down and id system.
- [ ] better error handling, i dont even know how i handle error right now lmfao
- [ ] stdin seems like not working?
- [ ] more lsp support, only python works for now. 
- [ ] styling. buttons dropdowns are straight unconfigured bootstrap lmfao
- [ ] share links, submissions are already registered with their corresponding ids. id column needs to be uuid tho

~~below needs to be done after mailgun replies me on dns problem~~
~~- [ ] email verification process~~
~~- [ ] save submissions, share stats, etc etc~~

we are using kinde for auth provider, I really dont want to setup github callbacks, email verifications, templates, etc. it is free for 10,000 monthly active users, and I bet my left and right balls this app wont have 10,000 monthly active users.

more to come
