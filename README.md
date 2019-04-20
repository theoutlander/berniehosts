# Bernie-Hosts

# Stack
- NodeJS
- React
- ReactRouter
- Hosted on Linode (Ubuntu w/Nginx + PM2)

# Request Access To
[Development Copy of BERNIE 2020 EVENT SUPPORT HUB](https://docs.google.com/spreadsheets/d/1nkUvaJwM7PWA_BUM8Yj2eMwHNqPBDulViaN9CvtjHEc/edit?userstoinvite=dvdgeisert@gmail.com&ts=5cba6bf3&actionButton=1#gid=0)


# Purpose
Create a UI to make it easier for callers to easily find the next host to call and stay within a single screen where they can take notes and (optionally) follow the script. In addition, it should make things a bit easier to maintain for the campaign managers.

Some of the high-level features that we're looking to implement:
- Slack Auth
- Google Spreadsheet based data store (accessed via NodeJS)
- Support for a dynamically generated UI 
- UI that is loaded conditionally based on values of the earlier selections
- Phone Script Integration
- Automatically hide hosts based off current time and their timezone so they aren't bothererd outside predetermined hours


# Getting Started
- npm install

# Dev Build Watch & Run
- npm run client-watch
- npm run server-watch

Currently, the app is configured to call into a specific callback url as defined in the Slack App. However, it doesn't appear to work so a work-around is to bypass auth during development by returning true in the isAuthenticated() method.
