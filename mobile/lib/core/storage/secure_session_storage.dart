import 'dart:convert';

import 'package:application_platform_mobile/features/auth/domain/auth_session.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final secureSessionStorageProvider = Provider<SecureSessionStorage>((ref) {
  return const SecureSessionStorage();
});

class SecureSessionStorage {
  const SecureSessionStorage();

  static const _sessionKey = 'application_platform.auth_session';
  static const _storage = FlutterSecureStorage();

  Future<AuthSession?> read() async {
    final rawSession = await _storage.read(key: _sessionKey);
    if (rawSession == null) {
      return null;
    }

    try {
      return AuthSession.fromJson(
        jsonDecode(rawSession) as Map<String, dynamic>,
      );
    } on FormatException {
      await clear();
      return null;
    }
  }

  Future<void> write(AuthSession session) {
    return _storage.write(
      key: _sessionKey,
      value: jsonEncode(session.toJson()),
    );
  }

  Future<void> clear() => _storage.delete(key: _sessionKey);
}
