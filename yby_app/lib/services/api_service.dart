import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
  static final String baseUrl = dotenv.env['API_BASE_URL'] ?? '';

  // Headers para requisições seguras
  static Map<String, String> getHeaders(String? token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': token != null ? 'Bearer $token' : '',
    };
  }
  
  // Método para montar a URL com endpoint
  static Uri getUri(String endpoint) {
    return Uri.parse('$baseUrl/$endpoint');
  }
}
