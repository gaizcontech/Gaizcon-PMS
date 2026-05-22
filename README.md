# GAIZCON Portal (codespaces-react)

This project is a React + Vite single-page application for managing projects and defects with a JIRA-like interface. It includes dashboards, sprint boards, defect tracking, comments, bulk operations, drag-and-drop reordering, and CSV export.

Features
- Dashboard, Projects, Sprint, Defects, Reports, Team views
- Inline editable issue drawer with comments
- Bulk actions (assign, status change, add label)
- Drag-and-drop between columns and within columns
- Filtered CSV export and simple reports
- Local persistence via `localStorage`

License

This project is released under the MIT License — see the `LICENSE` file.

Publishing

To publish this repository publicly on GitHub, run the following (replace OWNER as needed):

```bash
# create repo and push (using the GitHub CLI, authenticated user must have permission)
gh repo create OWNER/codespaces-react --public --source=. --remote=origin --push

# or create repo on github.com and push manually:
git remote add origin git@github.com:OWNER/codespaces-react.git
git push -u origin main
```

If you want me to retry creating the GitHub repo, grant `gh` the correct permissions or provide the target owner/org and I'll attempt the create again.
# Project & Defect Management App

This repository is now a modern React workflow dashboard with:

- Login and sign-up authentication flows
- Multi-view dashboard with Projects, Defects, Reports, and Team pages
- Project creation, editing, and removal
- Defect lifecycle management and status board
- Team workload reporting and activity tracking
- Browser persistence via localStorage for application state
- Reset workspace data button to recover from broken or old local storage state
- Dark mode support and responsive layout

Run the app with `npm start`, test with `npm test`, and build with `npm run build`.

