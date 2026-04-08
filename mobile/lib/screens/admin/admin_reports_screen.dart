import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/item_provider.dart';

class AdminReportsScreen extends StatefulWidget {
  const AdminReportsScreen({super.key});

  @override
  State<AdminReportsScreen> createState() => _AdminReportsScreenState();
}

class _AdminReportsScreenState extends State<AdminReportsScreen> {
  String _reportType = 'items';
  String _format = 'pdf';
  bool _isGenerating = false;

  @override
  Widget build(BuildContext context) {
    final itemProvider = Provider.of<ItemProvider>(context);
    final items = itemProvider.items;
    final totalItems = items.length;
    final totalQuantity = items.fold<int>(0, (sum, item) => sum + item.quantity);
    final totalValue = items.fold<double>(0, (sum, item) => sum + (item.price * item.quantity));

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Reports'),
        backgroundColor: const Color(0xFF1A56DB),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Summary Cards
            _buildSummaryCard('Total Items', totalItems.toString(), Icons.inventory, Colors.blue),
            const SizedBox(height: 12),
            _buildSummaryCard('Total Stock', totalQuantity.toString(), Icons.warehouse, Colors.green),
            const SizedBox(height: 12),
            _buildSummaryCard('Total Value', 'Rp ${totalValue.toStringAsFixed(0)}', Icons.attach_money, Colors.orange),

            const SizedBox(height: 24),
            const Divider(),
            const SizedBox(height: 16),

            // Report Type
            const Text(
              'Report Type',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _buildRadioCard(
                    'Items Report',
                    'items',
                    Icons.inventory,
                    'Complete list of all inventory items',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildRadioCard(
                    'Categories Report',
                    'categories',
                    Icons.category,
                    'Summary by category',
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Format
            const Text(
              'Export Format',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _buildFormatCard('PDF', 'pdf', Icons.picture_as_pdf, Colors.red),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildFormatCard('Excel', 'excel', Icons.table_chart, Colors.green),
                ),
              ],
            ),

            const SizedBox(height: 32),

            // Generate Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isGenerating ? null : _generateReport,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1A56DB),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isGenerating
                    ? const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                )
                    : const Text(
                  'Generate Report',
                  style: TextStyle(fontSize: 16, color: Colors.white, fontWeight: FontWeight.w600),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Preview
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.preview, color: Color(0xFF1A56DB)),
                      const SizedBox(width: 8),
                      const Text(
                        'Preview',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (_reportType == 'items')
                    Column(
                      children: items.isEmpty
                          ? [const Text('No items to display')]
                          : items.take(5).map((item) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Text(
                          '• ${item.name} - Stock: ${item.quantity} - Rp ${item.price.toStringAsFixed(0)}',
                          style: const TextStyle(fontSize: 12),
                        ),
                      )).toList(),
                    )
                  else
                    Column(
                      children: itemProvider.categories.isEmpty
                          ? [const Text('No categories to display')]
                          : itemProvider.categories.map((cat) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Text('• $cat', style: const TextStyle(fontSize: 12)),
                      )).toList(),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [color.withOpacity(0.1), Colors.white],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(color: Colors.grey[600], fontSize: 12),
              ),
              Text(
                value,
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRadioCard(String title, String value, IconData icon, String subtitle) {
    final isSelected = _reportType == value;
    return InkWell(
      onTap: () {
        setState(() {
          _reportType = value;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF1A56DB).withOpacity(0.1) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFF1A56DB) : Colors.grey[300]!,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: isSelected ? const Color(0xFF1A56DB) : Colors.grey),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: isSelected ? const Color(0xFF1A56DB) : Colors.grey[700],
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(fontSize: 10, color: Colors.grey[500]),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormatCard(String title, String value, IconData icon, Color color) {
    final isSelected = _format == value;
    return InkWell(
      onTap: () {
        setState(() {
          _format = value;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.1) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? color : Colors.grey[300]!,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: isSelected ? color : Colors.grey),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: isSelected ? color : Colors.grey[700],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _generateReport() async {
    setState(() => _isGenerating = true);

    // Simulate report generation
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '${_reportType.toUpperCase()} report generated as $_format',
          ),
          backgroundColor: Colors.green,
        ),
      );
    }

    setState(() => _isGenerating = false);
  }
}