import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/item_provider.dart';
import 'providers/user_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/user/dashboard_screen.dart';
import 'screens/user/items_screen.dart';
import 'screens/user/item_form_screen.dart';
import 'screens/admin/admin_dashboard_screen.dart';
import 'screens/admin/admin_items_screen.dart';
import 'screens/admin/admin_users_screen.dart';
import 'screens/admin/user_form_screen.dart';
import 'screens/admin/admin_categories_screen.dart';
import 'screens/admin/admin_reports_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ItemProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: MaterialApp(
        title: 'Petrolab Inventory',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primaryColor: const Color(0xFF1A56DB),
          fontFamily: 'Roboto',
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF1A56DB),
            foregroundColor: Colors.white,
            elevation: 0,
          ),
        ),
        initialRoute: '/',
        onGenerateRoute: (settings) {
          print('📍 Route: ${settings.name}');

          // Route /
          if (settings.name == '/') {
            return MaterialPageRoute(builder: (_) => const AuthWrapper());
          }

          // Auth Routes
          if (settings.name == '/login') {
            return MaterialPageRoute(builder: (_) => const LoginScreen());
          }
          if (settings.name == '/register') {
            return MaterialPageRoute(builder: (_) => const RegisterScreen());
          }

          // User Routes
          if (settings.name == '/user') {
            return MaterialPageRoute(builder: (_) => const UserDashboardScreen());
          }
          if (settings.name == '/items') {
            return MaterialPageRoute(builder: (_) => const ItemsScreen());
          }
          if (settings.name == '/item/create') {
            return MaterialPageRoute(builder: (_) => const ItemFormScreen());
          }

          // Admin Routes
          if (settings.name == '/admin') {
            return MaterialPageRoute(builder: (_) => const AdminDashboardScreen());
          }
          if (settings.name == '/admin/items') {
            return MaterialPageRoute(builder: (_) => const AdminItemsScreen());
          }
          if (settings.name == '/admin/items/create') {
            return MaterialPageRoute(builder: (_) => const ItemFormScreen());
          }
          if (settings.name == '/admin/users') {
            return MaterialPageRoute(builder: (_) => const AdminUsersScreen());
          }
          if (settings.name == '/admin/users/create') {
            return MaterialPageRoute(builder: (_) => const UserFormScreen());
          }
          if (settings.name == '/admin/categories') {
            return MaterialPageRoute(builder: (_) => const AdminCategoriesScreen());
          }
          if (settings.name == '/admin/reports') {
            return MaterialPageRoute(builder: (_) => const AdminReportsScreen());
          }

          // Route untuk edit item (user) - /item/edit/5
          if (settings.name != null && settings.name!.contains('/item/edit/')) {
            final id = int.tryParse(settings.name!.split('/').last);
            if (id != null) {
              return MaterialPageRoute(
                builder: (_) => ItemFormScreen(itemId: id),
              );
            }
          }

          // Route untuk edit item (admin) - /admin/items/edit/5
          if (settings.name != null && settings.name!.contains('/admin/items/edit/')) {
            final id = int.tryParse(settings.name!.split('/').last);
            if (id != null) {
              print('✏️ Admin edit route - ID: $id');
              return MaterialPageRoute(
                builder: (_) => ItemFormScreen(itemId: id),
              );
            }
          }

          // Route untuk detail item (user) - /item/5
          if (settings.name != null && settings.name!.startsWith('/item/') && !settings.name!.contains('/edit')) {
            final id = int.tryParse(settings.name!.split('/').last);
            if (id != null) {
              return MaterialPageRoute(
                builder: (_) => ItemFormScreen(itemId: id),
              );
            }
          }

          // Fallback
          return MaterialPageRoute(builder: (_) => const AuthWrapper());
        },
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    if (authProvider.isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (authProvider.isAuthenticated) {
      if (authProvider.user?.isAdmin == true) {
        return const AdminDashboardScreen();
      } else {
        return const UserDashboardScreen();
      }
    } else {
      return const LoginScreen();
    }
  }
}