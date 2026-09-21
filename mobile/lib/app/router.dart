import 'package:application_platform_mobile/features/auth/application/auth_controller.dart';
import 'package:application_platform_mobile/features/auth/presentation/login_page.dart';
import 'package:application_platform_mobile/features/auth/presentation/splash_page.dart';
import 'package:application_platform_mobile/features/home/presentation/home_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  late final GoRouter router;

  router = GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final auth = ref.read(authControllerProvider);
      final location = state.matchedLocation;

      if (auth.isInitializing) {
        return location == '/splash' ? null : '/splash';
      }

      if (!auth.isAuthenticated) {
        return location == '/login' ? null : '/login';
      }

      if (location == '/splash' || location == '/login') {
        return '/home';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomePage(),
      ),
    ],
  );

  ref.listen(authControllerProvider, (_, _) => router.refresh());
  ref.onDispose(router.dispose);
  return router;
});
