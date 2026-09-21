import 'package:application_platform_mobile/features/auth/application/auth_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final session = auth.session!;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Application Platform'),
        actions: [
          IconButton(
            tooltip: 'Sign out',
            onPressed: ref.read(authControllerProvider.notifier).signOut,
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hello, ${session.username}',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text('Signed in as user #${session.userId}'),
            const SizedBox(height: 32),
            Text('Roles', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: session.roles
                  .map((role) => Chip(label: Text(role)))
                  .toList(growable: false),
            ),
          ],
        ),
      ),
    );
  }
}
