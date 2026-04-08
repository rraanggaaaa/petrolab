class ItemModel {
  final int id;
  final String name;
  final String? description;
  final int quantity;
  final double price;
  final String? category;
  final int userId;
  final String createdAt;
  final String updatedAt;

  ItemModel({
    required this.id,
    required this.name,
    this.description,
    required this.quantity,
    required this.price,
    this.category,
    required this.userId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ItemModel.fromJson(Map<String, dynamic> json) {
    // Parse price dengan aman (bisa String atau double)
    double parsedPrice;
    final priceValue = json['price'];
    if (priceValue is String) {
      parsedPrice = double.parse(priceValue);
    } else if (priceValue is num) {
      parsedPrice = priceValue.toDouble();
    } else {
      parsedPrice = 0.0;
    }

    return ItemModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'],
      quantity: json['quantity'] ?? 0,
      price: (json['price'] is String)
          ? double.parse(json['price'])
          : (json['price'] ?? 0).toDouble(),
      category: json['category'],
      userId: json['user_id'] ?? 0,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }

  bool get isLowStock => quantity < 5 && quantity > 0;
  bool get isOutOfStock => quantity == 0;
}