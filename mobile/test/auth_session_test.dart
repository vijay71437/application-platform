import 'package:application_platform_mobile/features/auth/domain/auth_session.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('AuthSession round-trips through JSON', () {
    const session = AuthSession(
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      userId: 42,
      username: 'vijay',
      roles: ['ROLE_USER'],
      permissions: ['USER_READ'],
    );

    final restored = AuthSession.fromJson(session.toJson());

    expect(restored.username, 'vijay');
    expect(restored.userId, 42);
    expect(restored.roles, ['ROLE_USER']);
    expect(restored.permissions, ['USER_READ']);
  });
}
