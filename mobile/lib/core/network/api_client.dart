import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Override at launch, for example:
/// flutter run --dart-define=API_BASE_URL=https://api.example.com/api/v1
const apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:8080/api/v1',
);

final dioProvider = Provider<Dio>((ref) {
  return Dio(
    BaseOptions(
      baseUrl: apiBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: const {'Accept': 'application/json'},
    ),
  );
});
