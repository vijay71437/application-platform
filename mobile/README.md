# Application Platform Mobile

Native iOS application built with Flutter. It connects to the Spring Boot API
in `../backend` using the `/api/v1` contract.

## Run on the iOS Simulator

Start the backend first, then run:

```bash
flutter run
```

The default API address is `http://localhost:8080/api/v1`, which is suitable
for the iOS Simulator running on this Mac.

For a real iPhone or another environment, use an HTTPS API address:

```bash
flutter run --dart-define=API_BASE_URL=https://api.example.com/api/v1
```

Do not commit production addresses or secrets to this repository.

## Commands

```bash
flutter analyze
flutter test
flutter run
```

## Initial structure

```text
lib/
├── app/       # app shell, routing, theme
├── core/      # HTTP client and secure storage
└── features/  # independently owned product features
```

Authentication uses `flutter_secure_storage`, which stores the persisted
session in the iOS Keychain. The next authentication improvement should be an
authenticated API interceptor with refresh-token handling for 401 responses.
