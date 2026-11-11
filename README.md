# ILS Currency Converter

A modern React Native and Expo mobile application for tracking and converting foreign currencies (USD, EUR) to Israeli New Shekel (ILS) in real time. Features live exchange rate updates, a responsive conversion interface, and native Android home screen widgets.

## Features

* **Live Exchange Rates:** Real-time calculation for USD to ILS and EUR to ILS.
* **Interactive Converter:** Dynamic input parsing that recalculates values instantly without screen clipping.
* **Android Home Screen Widget:** Native Android widget support to monitor live rates directly from your home screen.
* **Data Caching & Refetching:** Managed via TanStack React Query for efficient background updates and low data overhead.
* **Dedicated Backend Integration:** Powered by an Express.js server fetching live upstream data from the Frankfurter exchange rate service.

## Tech Stack

* **Frontend:** React Native, Expo (SDK 57), TypeScript, React Native Keyboard Controller
* **State Management & Querying:** TanStack React Query (`@tanstack/react-query`)
* **Widgets:** `react-native-android-widget`
* **Backend:** Express.js (`@workspace/api-server`)
* **Upstream Data Source:** [Frankfurter API](https://www.frankfurter.app/)

## Project Structure

```text
├── app/                       # Expo Router screens & main application UI
│   ├── _layout.tsx            # Global providers, fonts & API base URL setup
│   └── index.tsx              # Primary currency converter screen
├── widgets/                   # Widget logic and data persistence
│   └── android/               # Native Android widget layouts and update tasks
├── artifacts/
│   └── api-server/            # Express API server handling currency rates
└── android/                   # Native Android project files for Gradle compilation

```

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher)
* `pnpm` or `npm`
* [Android Studio](https://developer.android.com/studio) (for Android Emulator and native builds)

### Environment Configuration

Create or configure `.env.local` inside your project root:

```env
# Point to your deployed backend or local dev server
EXPO_PUBLIC_DOMAIN=ils-currencyconverter.onrender.com

```

> **Note for Android Emulator:** To test against a local API server running on your host machine, set `EXPO_PUBLIC_DOMAIN=10.0.2.2:3000`.

### Installation & Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/ils-currency-converter.git
cd ils-currency-converter

```


2. Install dependencies:
```bash
pnpm install

```


3. Start the Metro bundler:
```bash
npx expo start

```


4. Launch the application:
* Press **`a`** in the terminal to open the app on a connected Android Emulator.
* To test native home screen widgets, run the app directly through Android Studio or compile a Development Build.



## Building for Production (Android APK)

To compile a standalone `.apk` for testing or distribution via GitHub Releases:

1. Open PowerShell and navigate to the `android/` directory:
```powershell
cd android

```


2. Run the Gradle release task:
```powershell
.\gradlew assembleRelease

```


3. The generated installer file will be located at:
```text
android/app/build/outputs/apk/release/app-release.apk

```



## Deploying the Backend

The API server (`artifacts/api-server`) is designed for quick deployment on platforms like Render:

* **Build Command:** `pnpm install`
* **Start Command:** `pnpm --filter @workspace/api-server start`
* **Port Environment Variable:** `PORT=3000`

## License

This project is open source and available under the [MIT License](https://www.google.com/search?q=LICENSE).
