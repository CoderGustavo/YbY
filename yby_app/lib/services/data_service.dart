import 'package:http/http.dart' as http;
import 'dart:convert';
import 'api_service.dart';
import 'secure_storage_service.dart';

class DataService {
  final SecureStorageService _secureStorage = SecureStorageService();

  Future<List<dynamic>> getSensors() async {
    final url = ApiService.getUri('sensors');

    // Obtém o token do SecureStorageService
    final String? token = await _secureStorage.getToken();

    if (token == null) {
      throw Exception('Token de autenticação não encontrado');
    }

    final headers = {
      'x-access-token': '$token',
      'Content-Type': 'application/json',
    };

    final response = await http.get(url, headers: headers);

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao buscar sensores: ${response.statusCode} na url: ${url}');
    }
  }

  Future<List<dynamic>> getSensor(id) async {
    final url = ApiService.getUri('sensors/$id');

    // Obtém o token do SecureStorageService
    final String? token = await _secureStorage.getToken();

    if (token == null) {
      throw Exception('Token de autenticação não encontrado');
    }

    final headers = {
      'x-access-token': '$token',
      'Content-Type': 'application/json',
    };

    final response = await http.get(url, headers: headers);

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao buscar dados: ${response.statusCode}');
    }
  }
}
