import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:geolocator/geolocator.dart';

class LocationService {
  Future<Map<String, dynamic>?> getAddressFromCep(String cep) async {
    final url = Uri.parse('https://viacep.com.br/ws/$cep/json/');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    return null;
  }

  Future<Position?> getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return null;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return null;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return null;
    } 

    return await Geolocator.getCurrentPosition();
  }

  Future<Map<String, dynamic>?> getAddressFromCoordinates(Position position) async {
    final url = Uri.parse(
        'https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}');
    
    final response = await http.get(url);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    return null;
  }
}
