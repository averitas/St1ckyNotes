# St1ckyNotes

## Bootstrap
<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

```sh
npx create-react-native-app -t with-typescript
```

TypeScript is a superset of JavaScript which gives you static types and powerful tooling in Visual Studio Code including autocompletion and useful inline warnings for type errors.

## Run in local environment

```
yarn install
yarn web
```

## 🚀 How to use

#### Creating a new project

- Install the CLI: `npm i -g expo-cli`
- Create a project: `npx create-react-native-app -t with-typescript` or
`npx create-expo-app -t expo-template-blank-typescript`
- `cd` into the project

### Adding TypeScript to existing projects

- Create a blank TypeScript config: `touch tsconfig.json`
- Run `yarn start` or `npm run start` to automatically configure TypeScript
- Rename files to TypeScript, `.tsx` for React components and `.ts` for plain typescript files

> 💡 You can disable the TypeScript setup in Expo CLI with the environment variable `EXPO_NO_TYPESCRIPT_SETUP=1 expo start`

### Run your project
To run your project, navigate to the directory and run one of the following yarn commands.

- yarn android
Before you run app on Android emulator, follow [This](https://docs.expo.dev/workflow/android-studio-emulator/)
- yarn ios # you need to use macOS to build the iOS project - use the Expo app if you need to do iOS development without a Mac
- yarn web

### Build
- eas build --local

#### Build APK
[Build reference](https://docs.expo.dev/build-reference/apk/)
```javascript
eas.json
{
  "cli": {
    "version": ">= 3.13.3"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

Build APK
```
yarn prebuild
# Build manually:
cd android && ./gradlew assembleRelease
# Build with eas-cli:
eas build -p android --profile preview
```

## 📝 Notes

- [Expo TypeScript guide](https://docs.expo.dev/versions/latest/guides/typescript/)
