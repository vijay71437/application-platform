import 'package:application_platform_mobile/core/network/api_client.dart';
import 'package:application_platform_mobile/core/storage/secure_session_storage.dart';
import 'package:application_platform_mobile/features/auth/domain/auth_session.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    ref.read(dioProvider),
    ref.read(secureSessionStorageProvider),
  );
});

class AuthRepository {
  AuthRepository(this._dio, this._storage);

  final Dio _dio;
  final SecureSessionStorage _storage;

  Future<AuthSession?> restoreSession() => _storage.read();

  Future<AuthSession> login({
    required String username,
    required String password,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/login',
        data: {'username': username, 'password': password},
      );
      final data = _dataFrom(response.data);
      final session = AuthSession.fromJson(data);
      await _storage.write(session);
      return session;
    } on DioException catch (error) {
      throw AuthException(_messageFrom(error.response?.data));
    } on FormatException {
      throw const AuthException('The server returned an invalid response.');
    }
  }

  Future<void> logout(AuthSession? session) async {
    try {
      if (session != null) {
        await _dio.post<void>(
          '/auth/logout',
          data: {'refreshToken': session.refreshToken},
        );
      }
    } on DioException {
      // Clear the local session even when the device is offline.
    } finally {
      await _storage.clear();
    }
  }

  Map<String, dynamic> _dataFrom(Map<String, dynamic>? body) {
    if (body == null || body['success'] != true) {
      throw const FormatException();
    }

    final data = body['data'];
    if (data is! Map<String, dynamic>) {
      throw const FormatException();
    }
    return data;
  }

  String _messageFrom(Object? body) {
    if (body case {'message': final String message}) {
      return message;
    }
    return 'Unable to sign in. Check your connection and try again.';
  }
}

class AuthException implements Exception {
  const AuthException(this.message);

  final String message;
}
