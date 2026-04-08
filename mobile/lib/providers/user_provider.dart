import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/user_model.dart';

class UserProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<UserModel> _users = [];
  bool _isLoading = false;
  String? _error;

  List<UserModel> get users => _users;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchUsers({String? search, String? role}) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.getUsers(search: search);

      if (response['success'] == true) {
        final usersData = response['data']['users'] as List;
        _users = usersData.map((u) => UserModel.fromJson(u)).toList();

        // Filter by role if specified
        if (role != null && role.isNotEmpty) {
          _users = _users.where((u) => u.role == role).toList();
        }
      } else {
        _error = response['message'] ?? 'Failed to fetch users';
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createUser({
    required String username,
    required String email,
    required String password,
    required String role,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.createUser({
        'username': username,
        'email': email,
        'password': password,
        'role': role,
      });

      if (response['success'] == true) {
        await fetchUsers();
        return true;
      } else {
        _error = response['message'] ?? 'Failed to create user';
        return false;
      }
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateUserRole(int userId, String role) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.updateUserRole(userId, role);

      if (response['success'] == true) {
        await fetchUsers();
        return true;
      } else {
        _error = response['message'] ?? 'Failed to update role';
        return false;
      }
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> deleteUser(int userId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.deleteUser(userId);

      if (response['success'] == true) {
        await fetchUsers();
        return true;
      } else {
        _error = response['message'] ?? 'Failed to delete user';
        return false;
      }
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}