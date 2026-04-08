import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../utils/constants.dart';

class ApiService {
  final storage = const FlutterSecureStorage();

  // Helper untuk mendapatkan token
  Future<String?> getToken() async {
    final token = await storage.read(key: Constants.tokenKey);
    print('🔑 Token retrieved: ${token != null ? 'Yes (${token.substring(0, min(20, token.length))}...)' : 'No'}');
    return token;
  }

  // Helper untuk menyimpan token
  Future<void> setToken(String token) async {
    print('💾 Saving token: ${token.substring(0, min(20, token.length))}...');
    await storage.write(key: Constants.tokenKey, value: token);
  }

  // Helper untuk menghapus token
  Future<void> removeToken() async {
    print('🗑️ Removing token');
    await storage.delete(key: Constants.tokenKey);
  }

  // Helper untuk menyimpan user
  Future<void> setUser(Map<String, dynamic> user) async {
    print('💾 Saving user: ${user['username']}');
    await storage.write(key: Constants.userKey, value: jsonEncode(user));
  }

  // Helper untuk mendapatkan user
  Future<Map<String, dynamic>?> getUser() async {
    final userStr = await storage.read(key: Constants.userKey);
    if (userStr != null) {
      return jsonDecode(userStr);
    }
    return null;
  }

  // Helper untuk menghapus user
  Future<void> removeUser() async {
    await storage.delete(key: Constants.userKey);
  }

  // GET request dengan token
  Future<Map<String, dynamic>> get(String endpoint) async {
    final url = Uri.parse('${Constants.baseUrl}$endpoint');
    final token = await getToken();

    print('📤 GET Request: $url');
    print('🔑 Has token: ${token != null}');

    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );

    print('📥 Response Status: ${response.statusCode}');
    print('📥 Response Body: ${response.body.substring(0, min(200, response.body.length))}');

    return _handleResponse(response);
  }

  // POST request
  Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('${Constants.baseUrl}$endpoint');
    final token = await getToken();

    print('📤 POST Request: $url');
    print('📦 Body: $data');

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );

    print('📥 Response Status: ${response.statusCode}');
    print('📥 Response Body: ${response.body.substring(0, min(200, response.body.length))}');

    return _handleResponse(response);
  }

  // PUT request
  Future<Map<String, dynamic>> put(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('${Constants.baseUrl}$endpoint');
    final token = await getToken();

    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );

    return _handleResponse(response);
  }

  // DELETE request
  Future<Map<String, dynamic>> delete(String endpoint) async {
    final url = Uri.parse('${Constants.baseUrl}$endpoint');
    final token = await getToken();

    final response = await http.delete(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );

    return _handleResponse(response);
  }

  // Handle response
  Map<String, dynamic> _handleResponse(http.Response response) {
    final data = jsonDecode(response.body);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    } else {
      throw Exception(data['message'] ?? 'Request failed');
    }
  }

  // ============ AUTH API ============
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await post(Constants.loginEndpoint, {
      'email': email,
      'password': password,
    });

    if (response['success'] == true) {
      await setToken(response['data']['token']);
      await setUser(response['data']['user']);
      print('✅ Token saved successfully');
    } else {
      print('❌ Login failed: ${response['message']}');
    }

    return response;
  }

  Future<Map<String, dynamic>> register(String username, String email, String password) async {
    final response = await post(Constants.registerEndpoint, {
      'username': username,
      'email': email,
      'password': password,
    });

    if (response['success'] == true) {
      await setToken(response['data']['token']);
      await setUser(response['data']['user']);
    }

    return response;
  }

  Future<void> logout() async {
    await removeToken();
    await removeUser();
  }

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }

  // ============ ITEMS API ============
  Future<Map<String, dynamic>> getItems({int page = 1, int limit = 10, String? category, String? search}) async {
    String url = '${Constants.itemsEndpoint}?page=$page&limit=$limit';
    if (category != null && category.isNotEmpty) url += '&category=$category';
    if (search != null && search.isNotEmpty) url += '&search=$search';
    return await get(url);
  }

  Future<Map<String, dynamic>> getItemById(int id) async {
    return await get('${Constants.itemsEndpoint}/$id');
  }

  Future<Map<String, dynamic>> createItem(Map<String, dynamic> itemData) async {
    return await post(Constants.itemsEndpoint, itemData);
  }

  Future<Map<String, dynamic>> updateItem(int id, Map<String, dynamic> itemData) async {
    return await put('${Constants.itemsEndpoint}/$id', itemData);
  }

  Future<Map<String, dynamic>> deleteItem(int id) async {
    return await delete('${Constants.itemsEndpoint}/$id');
  }

  Future<Map<String, dynamic>> getCategories() async {
    return await get(Constants.categoriesEndpoint);
  }

  // ============ ADMIN API ============
  Future<Map<String, dynamic>> getUsers({int page = 1, int limit = 10, String? search}) async {
    String url = '${Constants.usersEndpoint}?page=$page&limit=$limit';
    if (search != null && search.isNotEmpty) url += '&search=$search';
    return await get(url);
  }

  Future<Map<String, dynamic>> createUser(Map<String, dynamic> userData) async {
    return await post(Constants.usersEndpoint, userData);
  }

  Future<Map<String, dynamic>> updateUserRole(int userId, String role) async {
    return await put('${Constants.usersEndpoint}/$userId/role', {'role': role});
  }

  Future<Map<String, dynamic>> deleteUser(int userId) async {
    return await delete('${Constants.usersEndpoint}/$userId');
  }
}

int min(int a, int b) => a < b ? a : b;