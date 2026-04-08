class UserModel {
  final int id;
  final String username;
  final String email;
  final String role;
  final String? createdAt;
  final String? updatedAt;

  UserModel({
    required this.id,
    required this.username,
    required this.email,
    required this.role,
    this.createdAt,
    this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'user',
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'role': role,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }

  bool get isAdmin => role == 'admin';
  bool get isUser => role == 'user';
}