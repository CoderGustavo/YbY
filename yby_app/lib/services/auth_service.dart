import 'package:http/http.dart' as http;
import 'dart:convert';
import 'secure_storage_service.dart';
import 'api_service.dart';

class AuthService {
  final SecureStorageService _secureStorage = SecureStorageService();

  Future<bool> login(String email, String password) async {
    final url = ApiService.getUri('users/login');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      await _secureStorage.saveToken(data['token']);
      return true;
    } else {
      return false;
    }
  }

  Future<bool> register(Map<String, String> userData) async {
    final url = ApiService.getUri('users/register');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode(userData),
    );

    return response.statusCode == 200;
  }

  Future<void> logout() async {
    await _secureStorage.deleteToken();
  }

  Future<bool> isLoggedIn() async {
    String? token = await _secureStorage.getToken();
    return token != null;
  }
}
