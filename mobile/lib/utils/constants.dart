class Constants {
  // Untuk LDPlayer - ganti dengan IP laptop Anda
  static const String baseUrl = 'http://192.168.1.19:5000/api';

  // Endpoints
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String itemsEndpoint = '/items';
  static const String categoriesEndpoint = '/items/categories';
  static const String usersEndpoint = '/admin/users';

  // Storage Keys (penting untuk secure storage)
  static const String tokenKey = 'token';
  static const String userKey = 'user';

  // App info
  static const String appName = 'Petrolab Inventory';
  static const String appVersion = '1.0.0';
}