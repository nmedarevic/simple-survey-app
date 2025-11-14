# SIMPLE SURVEY APP

## How to start

While in the root folder, type `npm run start` and wait until the console starts showing the link for the frontend app.

## Login credentials

### Reviewer role

Email:
`admin@example.com`

Password: `admin123`

### RESPONDER role

Email: `user@example.com`

Password: `user123`

### Completion checklist

- ✅ Can log in as both seeded users (JWT works).  
- ✅ RESPONDER can fill and view only their own submissions.  
- ✅ REVIEWER sees all submissions and final summary.  
     - There is just a submission list
- ✅ Unauthorized API calls are blocked.  
- [ ] Custom SurveyJS question types work correctly.  
- [ ] Tailwind + Shadcn styling is consistent.
     - Tailwind used only for the app layout
- ✅ At least one meaningful test passes.  
     - Backend has tests. No tests were added on the frontend
- ✅ README is clear and complete.
     - Hopefuly :)


### Notes:

- Due to lack of time, only one simple SurveyJS was created
- No Shadcn components were used
- SurveyJS was not styled with tailwind
- No frontend tests were added
- Components were partially split according to the Atomic pattern