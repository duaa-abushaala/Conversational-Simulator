# Conversational Simulator: An Educational Mobile App
The app is designed to help users improve conversational and social skills through interactive theory modules, daily challenges, quizzes, and gamified rewards.

## Features

- Onboarding with animated walkthrough
- User authentication (signup/login)
- Theory content for categories like Small Talk, Networking, Public Speaking, etc.
- Daily challenge system with points
- Badge-based awards
- Progress tracking
- User settings

## Getting Started

### Prerequisites

- Node.js
- Expo CLI

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npx start
```

Make sure your iOS/Android emulator is running or connect a physical device via Expo Go.

## Project Structure

```
fourth_year_project/
├── src/              # Main application screens and firebase config
├── assets/           # Animations and images
├── run.sh            # Quick script to install and run the app
└── README.md         # You are here!
```

## Dependencies

- React Native
- Expo
- Firebase
- Lottie for animations
- React Native Reanimated
- React Navigation

## Notes

- All animations and images should stay in the assets/ folder.
- This app requires an internet connection to interact with Firebase services (auth, database). Offline use is not supported.
-  A working `firebase.js` file is included and configured for this app. No setup is needed.

<h2>App Images:</h2>

<p align="center">
Splash Screen and Login: <br/>
<img src="https://imgur.com/2PmPyWK.png" height="80%" width="80%" alt="ConvSim Steps"/>
<br />
<br />
Onboarding and Main Menu:  <br/>
<img src="https://imgur.com/HfkelTX" height="80%" width="80%" alt="ConvSim Steps"/>
<br />
<br />
Lessons (Information, Quizzes and Reflections): <br/>
<img src="https://imgur.com/muTuM71.png" height="80%" width="80%" alt="ConvSim Steps"/>
<br />
<br />
Settings, Badges and Daily Challenges:  <br/>
<img src="https://imgur.com/OzsXwhg.png"height="80%" width="80%" alt="ConvSim Steps"/>
<br />
<br />
</p>

---
