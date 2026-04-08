import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/item_model.dart';

class ItemProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<ItemModel> _items = [];
  List<String> _categories = [];
  bool _isLoading = false;
  String? _error;
  int _currentPage = 1;
  int _totalPages = 1;
  int _totalItems = 0;

  List<ItemModel> get items => _items;
  List<String> get categories => _categories;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get currentPage => _currentPage;
  int get totalPages => _totalPages;
  int get totalItems => _totalItems;
  bool get hasNextPage => _currentPage < _totalPages;
  bool get hasPrevPage => _currentPage > 1;

  Future<void> fetchItems(
      {int page = 1, int limit = 10, String? category, String? search}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    print('🔄 Fetching items: page=$page, limit=$limit, category=$category, search=$search');

    try {
      final response = await _apiService.getItems(
        page: page,
        limit: limit,
        category: category,
        search: search,
      );

      print('📦 Fetch items response success: ${response['success']}');

      if (response['success'] == true) {
        final itemsData = response['data']['items'] as List;

        // Parse items satu per satu dengan try-catch
        final List<ItemModel> parsedItems = [];
        for (var itemJson in itemsData) {
          try {
            parsedItems.add(ItemModel.fromJson(itemJson));
          } catch (e, stackTrace) {
            print('❌ Error parsing item: $e');
            print('Item JSON: $itemJson');
          }
        }

        _items = parsedItems;
        _currentPage = response['data']['pagination']['page'];
        _totalPages = response['data']['pagination']['totalPages'];
        _totalItems = response['data']['pagination']['total'];

        print('✅ Items loaded: ${_items.length} items, total: $_totalItems');
      } else {
        _error = response['message'] ?? 'Failed to fetch items';
        print('❌ Error: $_error');
      }
    } catch (e) {
      _error = e.toString();
      print('❌ Exception: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  Future<void> fetchCategories() async {
    try {
      final response = await _apiService.getCategories();
      if (response['success'] == true) {
        _categories = List<String>.from(response['data']['categories']);
        print('✅ Categories loaded: ${_categories.length} categories');
        notifyListeners();
      }
    } catch (e) {
      print('Error fetching categories: $e');
    }
  }

  Future<bool> createItem(Map<String, dynamic> itemData) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.createItem(itemData);
      if (response['success'] == true) {
        await fetchItems();
        return true;
      } else {
        _error = response['message'] ?? 'Failed to create item';
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

  Future<bool> updateItem(int id, Map<String, dynamic> itemData) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.updateItem(id, itemData);
      if (response['success'] == true) {
        await fetchItems(page: _currentPage);
        return true;
      } else {
        _error = response['message'] ?? 'Failed to update item';
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

  Future<bool> deleteItem(int id) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.deleteItem(id);
      if (response['success'] == true) {
        // Hapus dari list lokal
        _items.removeWhere((item) => item.id == id);
        _totalItems = _items.length;
        notifyListeners();
        return true;
      } else {
        _error = response['message'] ?? 'Failed to delete item';
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

  void nextPage() {
    if (hasNextPage) {
      fetchItems(page: _currentPage + 1);
    }
  }

  void prevPage() {
    if (hasPrevPage) {
      fetchItems(page: _currentPage - 1);
    }
  }
}