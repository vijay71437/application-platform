import 'package:flutter/material.dart';

const _seedColor = Color(0xFF1D4ED8);

final applicationTheme = ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: _seedColor,
    brightness: Brightness.light,
  ),
  useMaterial3: true,
  inputDecorationTheme: const InputDecorationTheme(
    border: OutlineInputBorder(),
    enabledBorder: OutlineInputBorder(),
  ),
);
