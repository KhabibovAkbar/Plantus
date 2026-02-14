# Plantus - React Native

A comprehensive plant care companion app built with React Native (Expo). This is a complete conversion of the Flutter Plantus app to React Native with all features preserved.

## Features

### 🌱 Plant Identification
- Take a photo to instantly identify any plant
- Get detailed information about care requirements
- Save identified plants to your garden

### 🔬 Disease Diagnosis
- Diagnose plant health issues with AI
- Get treatment recommendations
- Track plant health over time

### 🤖 AI Assistant (Mr. Oliver)
- Chat with an AI botanist 24/7
- Get personalized plant care advice
- Share photos for identification and diagnosis

### 🏡 My Garden
- Track all your plants in one place
- Organize plants into groups
- View plant care history and journals

### ⏰ Care Reminders
- Set watering reminders
- Schedule fertilizing notifications
- Repotting reminders with custom schedules

### 🌤️ Weather Integration
- Local weather display
- Temperature unit preferences (Celsius/Fahrenheit)
- Location-based weather data

### 💎 Pro Subscription
- Unlimited plant scans
- Unlimited AI chat
- Advanced reminders
- Ad-free experience

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and build tools
- **TypeScript** - Type-safe JavaScript
- **Zustand** - State management
- **React Navigation** - Navigation library
- **Supabase** - Backend and authentication
- **RevenueCat** - Subscription management
- **Expo Camera** - Plant scanning
- **Expo Notifications** - Push notifications

## Project Structure

```
plantus-react-native/
├── App.tsx                 # Main app entry point
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── tabs/           # Main tab screens
│   │   ├── scanner/        # Scanner screens
│   │   ├── plant/          # Plant detail screens
│   │   ├── chat/           # AI chat screens
│   │   ├── settings/       # Settings screens
│   │   ├── reminders/      # Reminder screens
│   │   ├── subscription/   # Pro subscription
│   │   └── legal/          # Legal pages
│   ├── services/           # API and backend services
│   │   ├── api.ts          # External API calls
│   │   ├── supabase.ts     # Supabase client
│   │   ├── revenueCat.ts   # RevenueCat integration
│   │   └── notifications.ts # Local notifications
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, etc.
└── app.json               # Expo configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Navigate to the project directory:
```bash
cd plantus-react-native
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on iOS:
```bash
npx expo run:ios
```

5. Run on Android:
```bash
npx expo run:android
```

## Configuration

### Supabase
The Supabase URL and anon key are configured in `src/services/supabase.ts`. Update these values if using a different Supabase project.

### RevenueCat
RevenueCat API keys for iOS and Android are configured in `src/services/revenueCat.ts`. Update these for your own subscription products.

### OpenAI (Plant Identification)
The plant identification API uses OpenAI's Vision API. Update the API key in `src/services/api.ts`.

### Google Maps
For reverse geocoding, update the Google Maps API key in `src/services/api.ts`.

## Database Schema (Supabase)

The app uses the following Supabase tables:

- `users` - User profiles
- `garden` - User's plants
- `groups` - Plant groups/collections
- `ai` - AI chat conversations
- `article` - Plant care articles
- `snaps` - Scanned plants
- `support` - Support tickets

## Building for Production

### iOS
```bash
npx expo build:ios
# or with EAS
eas build --platform ios
```

### Android
```bash
npx expo build:android
# or with EAS
eas build --platform android
```

## Features Mapping (Flutter → React Native)

| Flutter Feature | React Native Implementation |
|----------------|----------------------------|
| Provider | Zustand |
| go_router | React Navigation |
| Supabase Flutter | @supabase/supabase-js |
| RevenueCat Flutter | react-native-purchases |
| Camera | expo-camera |
| Image Picker | expo-image-picker |
| Local Notifications | expo-notifications |
| Location | expo-location |
| SharedPreferences | @react-native-async-storage |
| FlutterFlow Theme | Custom theme system |

## License

This project is proprietary. All rights reserved.

## Support

For support, email support@plantus.app
