import 'package:application_platform_mobile/app/router.dart';
import 'package:application_platform_mobile/app/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class Application extends ConsumerWidget {
  const Application({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'Application Platform',
      debugShowCheckedModeBanner: false,
      theme: applicationTheme,
      routerConfig: router,
    );
  }
}
