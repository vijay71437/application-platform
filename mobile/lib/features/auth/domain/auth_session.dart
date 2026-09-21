class AuthSession {
  const AuthSession({
    required this.accessToken,
    required this.refreshToken,
    required this.userId,
    required this.username,
    required this.roles,
    required this.permissions,
  });

  final String accessToken;
  final String refreshToken;
  final int userId;
  final String username;
  final List<String> roles;
  final List<String> permissions;

  factory AuthSession.fromJson(Map<String, dynamic> json) {
    return AuthSession(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      userId: (json['userId'] as num).toInt(),
      username: json['username'] as String,
      roles: _stringList(json['roles']),
      permissions: _stringList(json['permissions']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'userId': userId,
      'username': username,
      'roles': roles,
      'permissions': permissions,
    };
  }

  static List<String> _stringList(Object? value) {
    return (value as List<dynamic>? ?? const [])
        .map((item) => item as String)
        .toList(growable: false);
  }
}
