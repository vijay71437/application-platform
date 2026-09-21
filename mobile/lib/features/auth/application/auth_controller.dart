import 'package:application_platform_mobile/features/auth/data/auth_repository.dart';
import 'package:application_platform_mobile/features/auth/domain/auth_session.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authControllerProvider =
    NotifierProvider<AuthController, AuthState>(AuthController.new);

class AuthController extends Notifier<AuthState> {
  AuthRepository get _repository => ref.read(authRepositoryProvider);

  @override
  AuthState build() {
    Future<void>.microtask(restore);
    return const AuthState(isInitializing: true);
  }

  Future<void> restore() async {
    AuthSession? session;
    try {
      session = await _repository.restoreSession();
    } finally {
      state = AuthState(session: session);
    }
  }

  Future<void> signIn({
    required String username,
    required String password,
  }) async {
    state = AuthState(isLoading: true, session: state.session);

    try {
      final session = await _repository.login(
        username: username,
        password: password,
      );
      state = AuthState(session: session);
    } on AuthException catch (error) {
      state = AuthState(session: state.session, errorMessage: error.message);
    }
  }

  Future<void> signOut() async {
    final currentSession = state.session;
    state = const AuthState();
    await _repository.logout(currentSession);
  }
}

class AuthState {
  const AuthState({
    this.isInitializing = false,
    this.isLoading = false,
    this.errorMessage,
    this.session,
  });

  final bool isInitializing;
  final bool isLoading;
  final String? errorMessage;
  final AuthSession? session;

  bool get isAuthenticated => session != null;
}
