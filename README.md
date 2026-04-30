<div align="center">
  <img src="./docs/logo.png" width="500" alt="Eventat Logo" />
  <br/>
  <table><tr><td width="560" align="center">
  A React Native app for campus event discovery and social coordination, replacing scattered group chats and bulletin boards with one structured platform.
  </td></tr></table>
</div>


## Overview

University students have no reliable way to know what's happening on campus. Events get announced across department boards, group chats, and club pages, and most students miss them.

Eventat gives students one place to browse, RSVP, and track events. You can see which friends are attending, follow club activity, and comment on events. The app is campus-scoped and uses real building coordinates, so location data is actually useful.


## Features

- **Event RSVP with attendance tracking**: join or leave events, see a live attendee count with profile picture previews
- **Event creation with multi-image upload**: up to 6 images uploaded to Firebase Storage; supports date/time picker, faculty location selection mapped to real coordinates, and room number
- **Personal calendar view**: joined and created events grouped by month
- **Time-based event filtering**: filter by Today, Tomorrow, This Weekend, or Upcoming without manual date entry
- **In-app event search**: live filtering by event name on the explore screen
- **Interactive campus map**: events plotted on Google Maps using building coordinates; tap a pin to open event details
- **Club directory**: browse clubs with member count, event count, and club-specific event feeds
- **Comments on events**: full CRUD comment system per event
- **Social friend system**: send, accept, and reject friend requests; view friend profiles
- **Secure token-based auth**: JWT in the OS-level secure enclave via `expo-secure-store`; auto-login on relaunch
- **Edit events**: creators can update details post-publish


## Technical Highlights

**Redux + Thunk for shared state**
Redux manages state across 6 domains (auth, events, clubs, comments, friends, attendance). Async thunks handle all side effects, keeping components free of data-fetching logic.

**Axios interceptor for auth**
A single interceptor injects the JWT from `expo-secure-store` into every outgoing request. Auth handling never leaks into UI components.

**Secure token storage**
JWT and decoded user profile are stored in `expo-secure-store` rather than AsyncStorage, using OS-level encryption on supported devices.

**Feature-scoped component structure**
Components are grouped by feature (`Cards/`, `Headers/`, `ui/AuthUi/`, `ui/ProfileUi/`) rather than type. Related code stays together, unrelated code stays isolated.

**Hardcoded campus coordinates**
Faculty buildings are mapped to exact GPS coordinates in the location picker. No freeform input, no bad pins on the map.

**Firebase Storage for event images**
Images are picked via `expo-image-picker`, uploaded to Firebase Storage, and stored by URL. Upload state is kept separate from Redux to avoid blocking form submission.

**Responsive layout**
Card and screen layouts use `useWindowDimensions()` with a 411px breakpoint to adapt sizing across Android device widths.

**`groupEventsByMonth` utility**
Date grouping for the Calendar screen lives in a standalone utility, keeping that logic out of the component tree.


## Architecture

```
eventat-app-frontend/
├── API/
│   ├── action/         # Redux thunks + Axios API calls, one file per domain
│   ├── reducers/       # Domain reducers (auth, event, club, comment, friend)
│   └── actionTypes.js  # Shared action type constants
├── components/
│   ├── Cards/          # EventCard, AltEventCard, ClubCard
│   ├── Event Details/  # Comments, ImageSlider, DetailsFooter
│   ├── Headers/        # Per-screen header components
│   └── ui/             # Auth and Profile sub-components
├── screens/
│   ├── auth/           # LogIn, SignUp, ForgotPass
│   ├── tabs/           # Explore, Calendar, Create, ClubList, MapPage
│   └── *.js            # EventDetails, ClubDetails, Profile, Edit
├── navigators/
│   └── Tabs.js         # Bottom tab navigator configuration
├── src/constants/      # Colors, image references
├── utils/              # groupEventsByMonth helper
├── App.js              # Root: Redux Provider + conditional stack navigation
└── Configure.js        # Redux store setup
```

Auth state determines which stack mounts at the root: no route guards, just conditional rendering. All API calls live in `API/action/`, one file per resource, so screen components contain no fetch logic.


## Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="./docs/Exoplore%20Page.png" width="180" alt="Explore"/><br/><sub>Explore</sub></td>
      <td align="center"><img src="./docs/Event%20Details/EventDetails%20Page.png" width="180" alt="Event Details"/><br/><sub>Event Details</sub></td>
      <td align="center"><img src="./docs/Event%20Details/Comment.png" width="180" alt="Comments"/><br/><sub>Comments</sub></td>
    </tr>
    <tr>
      <td align="center"><img src="./docs/Attending/Attending%20-%20My%20Events.png" width="180" alt="My Events"/><br/><sub>My Events</sub></td>
      <td align="center"><img src="./docs/Attending/Attending%20Empty.png" width="180" alt="Attending Empty"/><br/><sub>Attending (Empty)</sub></td>
      <td align="center"><img src="./docs/Clubs/Club%20List%20Page.png" width="180" alt="Club List"/><br/><sub>Club List</sub></td>
    </tr>
    <tr>
      <td align="center"><img src="./docs/Clubs/ClubDetails%20Page.png" width="180" alt="Club Details"/><br/><sub>Club Details</sub></td>
      <td align="center"><img src="./docs/Settings.png" width="180" alt="Settings"/><br/><sub>Settings</sub></td>
      <td></td>
    </tr>
  </table>
  <p><sub>More screenshots available in the <a href="./docs">docs/</a> folder.</sub></p>
</div>


## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 53) |
| Language | JavaScript (React 19) |
| State Management | Redux + Redux Thunk |
| Server State | TanStack React Query (v5) |
| Navigation | React Navigation v7 (Native Stack + Bottom Tabs) |
| HTTP Client | Axios with request interceptor |
| Auth Storage | expo-secure-store (hardware-backed) |
| Image Storage | Firebase Storage |
| Maps | react-native-maps (Google Maps) |
| Date Handling | Moment.js + @react-native-community/datetimepicker |
| Backend | NestJS REST API, deployed on Vercel |


## Setup & Installation

```bash
git clone https://github.com/brullee/Eventat.git
cd eventsApp
npm install
npx expo start
```

Requires an Android emulator, iOS simulator, or Expo Go. Google Maps API key goes in `app.json` under `android.config.googleMaps.apiKey`. Firebase credentials go in `firebaseConfig.js` (gitignored).


## My Contribution

I was the primary frontend engineer, responsible for the full mobile application layer.

**UI architecture**: Designed the component hierarchy from scratch, separating reusable primitives (cards, headers) from feature-scoped components and full screens. Consistent dark theme enforced through a shared color constants file.

**Navigation**: Set up the conditional root navigator (auth stack vs. main stack based on persisted login state) and the bottom tab navigator with custom icons and styling.

**State management**: Defined all action types, wrote async thunks for every API call, and built domain reducers. Chose Redux over lighter options because auth, attendance, and profile data all affect multiple screens and needed a single source of truth.

**API integration**: Wired every backend endpoint into typed action functions via the Axios instance with async auth interceptor. Loading and error states handled per-operation in each reducer.

**Authentication flow**: Login, signup, and auto-login on relaunch — secure token storage, JWT decoding for profile extraction, and clean logout with store reset.

**Event creation**: The multi-step Create screen covers image picking and Firebase upload, date/time selection, coordinate-mapped location picker, and form validation before POST.

**Map**: Wired Google Maps to event coordinates, connected map pin taps to event detail navigation.

**Calendar and filtering**: Grouped-by-month Calendar view using `groupEventsByMonth`, plus the time-based filter bar (Today/Tomorrow/Weekend/Upcoming) on the Explore screen.


## Notes

Built as a graduation project in collaboration with [Firas Hani](https://github.com/FirasHani), who developed the NestJS REST API ([backend repository](https://github.com/FirasHani/eventat-app-backend)).

Selected for presentation at [NTP 2025](https://www.linkedin.com/in/abdalla-wohoush/overlay/Certifications/1965221544/treasury?profileId=ACoAAA_8wJcBnBHU-kOsS35VkzfnzjahMadEobY) and awarded [2nd place](https://www.linkedin.com/in/abdalla-wohoush/overlay/Honor/2080759075/treasury/?profileId=ACoAAA_8wJcBnBHU-kOsS35VkzfnzjahMadEobY) in the university’s graduation project competition.

The frontend was integrated and tested against the deployed backend during development.
