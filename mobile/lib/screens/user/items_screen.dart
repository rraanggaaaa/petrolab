import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/item_provider.dart';
import '../../providers/auth_provider.dart';

class ItemsScreen extends StatefulWidget {
  const ItemsScreen({super.key});

  @override
  State<ItemsScreen> createState() => _ItemsScreenState();
}

class _ItemsScreenState extends State<ItemsScreen> {
  final _searchController = TextEditingController();
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final itemProvider = Provider.of<ItemProvider>(context, listen: false);
    await itemProvider.fetchItems();
    await itemProvider.fetchCategories();
  }

  Future<void> _refreshData() async {
    final itemProvider = Provider.of<ItemProvider>(context, listen: false);
    await itemProvider.fetchItems();
  }

  void _searchItems() {
    final itemProvider = Provider.of<ItemProvider>(context, listen: false);
    itemProvider.fetchItems(search: _searchController.text);
  }

  void _filterByCategory(String? category) {
    setState(() {
      _selectedCategory = category;
    });
    final itemProvider = Provider.of<ItemProvider>(context, listen: false);
    itemProvider.fetchItems(category: category);
  }

  void _clearFilters() {
    setState(() {
      _searchController.clear();
      _selectedCategory = null;
    });
    final itemProvider = Provider.of<ItemProvider>(context, listen: false);
    itemProvider.fetchItems();
  }

  Future<void> _deleteItem(int id, String name) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Item'),
        content: Text('Are you sure you want to delete "$name"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final itemProvider = Provider.of<ItemProvider>(context, listen: false);
      final success = await itemProvider.deleteItem(id);  // ← ini yang penting

      if (mounted) {
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Item deleted successfully'),
              backgroundColor: Colors.green,
            ),
          );
          // Refresh data setelah delete
          await itemProvider.fetchItems();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(itemProvider.error ?? 'Failed to delete item'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }
  void _editItem(int id) {
    // Navigate ke halaman edit
    Navigator.pushNamed(context, '/item/edit/$id').then((_) {
      // Refresh data setelah kembali
      _refreshData();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final itemProvider = Provider.of<ItemProvider>(context);
    final isAdmin = authProvider.user?.isAdmin ?? false;
    final items = itemProvider.items;
    final categories = itemProvider.categories;
    final isLoading = itemProvider.isLoading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Items'),
        backgroundColor: const Color(0xFF1A56DB),
        foregroundColor: Colors.white,
        actions: [
          if (isAdmin)
            IconButton(
              icon: const Icon(Icons.admin_panel_settings),
              onPressed: () {
                Navigator.pushNamed(context, '/admin');
              },
              tooltip: 'Admin Panel',
            ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search items...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0),
                    ),
                    onSubmitted: (_) => _searchItems(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: _clearFilters,
                  tooltip: 'Clear filters',
                ),
              ],
            ),
          ),

          // Category Filter
          if (categories.isNotEmpty)
            SizedBox(
              height: 50,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                children: [
                  FilterChip(
                    label: const Text('All'),
                    selected: _selectedCategory == null,
                    onSelected: (_) => _filterByCategory(null),
                  ),
                  const SizedBox(width: 8),
                  ...categories.map((category) => Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(category),
                      selected: _selectedCategory == category,
                      onSelected: (_) => _filterByCategory(category),
                    ),
                  )),
                ],
              ),
            ),

          // Items List
          Expanded(
            child: RefreshIndicator(
              onRefresh: _refreshData,
              child: isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : items.isEmpty
                  ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.inventory,
                        size: 64, color: Colors.grey),
                    SizedBox(height: 16),
                    Text(
                      'No items found',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              )
                  : ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: items.length,
                itemBuilder: (context, index) {
                  final item = items[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: () {
                        Navigator.pushNamed(
                            context, '/item/${item.id}');
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            // Item Icon
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                color: Colors.blue[50],
                                borderRadius:
                                BorderRadius.circular(10),
                              ),
                              child: Icon(
                                Icons.inventory_2,
                                color: Colors.blue[700],
                              ),
                            ),
                            const SizedBox(width: 12),

                            // Item Info
                            Expanded(
                              child: Column(
                                crossAxisAlignment:
                                CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.name,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Category: ${item.category ?? "Uncategorized"}',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets
                                            .symmetric(
                                          horizontal: 8,
                                          vertical: 2,
                                        ),
                                        decoration: BoxDecoration(
                                          color: item.isLowStock
                                              ? Colors.orange
                                              .withOpacity(0.2)
                                              : Colors.green
                                              .withOpacity(0.2),
                                          borderRadius:
                                          BorderRadius.circular(
                                              12),
                                        ),
                                        child: Text(
                                          'Stock: ${item.quantity}',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: item.isLowStock
                                                ? Colors.orange[700]
                                                : Colors.green[700],
                                            fontWeight:
                                            FontWeight.w500,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        'Rp ${item.price.toStringAsFixed(0)}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),

                            // Action Buttons
                            Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.edit,
                                      color: Colors.blue),
                                  onPressed: () => _editItem(item.id),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.delete,
                                      color: Colors.red),
                                  onPressed: () =>
                                      _deleteItem(item.id, item.name),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/item/create');
        },
        backgroundColor: const Color(0xFF1A56DB),
        child: const Icon(Icons.add),
      ),
    );
  }
}