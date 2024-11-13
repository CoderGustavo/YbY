import 'package:app_yby/services/auth_service.dart';
import 'package:app_yby/services/data_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:fl_chart/fl_chart.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final MapController _mapController;
  Position? _currentPosition;
  List<BarChartGroupData> _barChartData = [];
  List<String> _barTitles = [];
  bool isLoading = true;
  bool isDarkMode = false;

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
    _initializeData();
  }

  Future<void> _initializeData() async {
    await _getCurrentLocation();
    await _fetchChartData();
    setState(() {
      isLoading = false;
    });
  }

  Future<void> _getCurrentLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }
      if (permission == LocationPermission.deniedForever) return;

      Position position = await Geolocator.getCurrentPosition();
      setState(() {
        _currentPosition = position;
        _mapController.move(
          LatLng(position.latitude, position.longitude),
          13.0,
        );
      });
    } catch (e) {
      print("Erro ao obter localização: $e");
    }
  }

  Future<void> _fetchChartData() async {
    try {
      List<dynamic> data = await DataService().getData();

      if (data.isNotEmpty) {
        setState(() {
          _barChartData = data
              .asMap()
              .entries
              .map(
                (entry) => BarChartGroupData(
                  x: entry.key,
                  barRods: [
                    BarChartRodData(
                      toY: entry.value['value'].toDouble(),
                      color: Colors.blueAccent,
                      width: 20,
                    ),
                  ],
                ),
              )
              .toList();

          _barTitles =
              data.map<String>((item) => item['label'].toString()).toList();
        });
      }
    } catch (e) {
      print('Erro ao buscar dados da API: $e');
    }
  }

  Future<void> _logout() async {
    await AuthService().logout();
    Navigator.of(context).pushReplacementNamed('/');
  }

Future<List<Marker>> _markers() async {
  // Obtém os dados da API
  final List<dynamic> data = await DataService().getData();

  // Verifica se os dados estão vazios
  if (data.isEmpty) return [];

  // Populando o formatted_data com os markers
  List<Marker> formattedData = data.map((item) {
    // Verifica se os campos locX, locY e name estão presentes
    final double locX = item['locX']?.toDouble() ?? 0.0;
    final double locY = item['locY']?.toDouble() ?? 0.0;
    final String name = item['name'] ?? 'N/A';

    // Cria o marker com os primeiros 3 caracteres do campo 'name'
    return Marker(
      point: LatLng(locX, locY),
      width: 80,
      height: 80,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.location_pin,
            color: Colors.red,
            size: 40,
          ),
          Text(
            name.substring(0, 3), // Exibe os 3 primeiros caracteres
            style: const TextStyle(
              color: Colors.black,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }).toList();

  return formattedData;
}


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: isDarkMode ? darkTheme : lightTheme,
      home: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
          title: Image.asset(
            'lib/assets/images/logo.png',
            height: 40,
          ),
          centerTitle: true,
          actions: [
            Row(
              children: [
                const Icon(Icons.light_mode),
                Switch(
                  value: isDarkMode,
                  onChanged: (value) {
                    setState(() {
                      isDarkMode = value;
                    });
                  },
                ),
                const Icon(Icons.dark_mode),
              ],
            ),
          ],
        ),
        body: isLoading
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: [
                  Expanded(
                      flex: 4,
                      child: _currentPosition == null
                          ? const Center(child: CircularProgressIndicator())
                          : FlutterMap(
                              mapController: _mapController,
                              options: MapOptions(
                                initialCenter: _currentPosition != null
                                    ? LatLng(_currentPosition!.latitude,
                                        _currentPosition!.longitude)
                                    : const LatLng(-22.2901704, -46.6103562),
                                initialZoom: 13.0,
                              ),
                              children: [
                                TileLayer(
                                  urlTemplate: isDarkMode
                                      ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                                      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                                  userAgentPackageName: 'com.example.yby',
                                ),
                                FutureBuilder<List<Marker>>(
                                  future: _markers(),
                                  builder: (context, snapshot) {
                                    if (snapshot.connectionState ==
                                        ConnectionState.waiting) {
                                      return const Center(
                                          child: CircularProgressIndicator());
                                    } else if (snapshot.hasError) {
                                      return const Center(
                                          child: Text(
                                              'Nenhum sensor encontrado!'));
                                    } else if (!snapshot.hasData ||
                                        snapshot.data!.isEmpty) {
                                      return const SizedBox();
                                    }

                                    return MarkerLayer(
                                      markers: snapshot.data!,
                                    );
                                  },
                                ),
                              ],
                            )),

                  // Alerta (cor fixa para o texto)
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Container(
                      color: Colors.yellow[700],
                      padding: const EdgeInsets.all(8.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.warning, color: Colors.black),
                          SizedBox(width: 8),
                          Text(
                            'Atenção: Você está em uma área monitorada!',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Gráfico de Barras
                  Expanded(
                    flex: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: _barChartData.isEmpty
                          ? const Center(child: Text('Nenhum dado disponível'))
                          : BarChart(
                              BarChartData(
                                borderData: FlBorderData(show: false),
                                titlesData: FlTitlesData(
                                  bottomTitles: AxisTitles(
                                    sideTitles: SideTitles(
                                      showTitles: true,
                                      getTitlesWidget:
                                          (double value, TitleMeta meta) {
                                        if (value.toInt() < _barTitles.length) {
                                          return Text(
                                              _barTitles[value.toInt()]);
                                        }
                                        return const Text('');
                                      },
                                    ),
                                  ),
                                ),
                                barGroups: _barChartData,
                              ),
                            ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

// Definição de temas
final ThemeData lightTheme = ThemeData(
  brightness: Brightness.light,
  primaryColor: Colors.blue,
  scaffoldBackgroundColor: Colors.white,
  appBarTheme: const AppBarTheme(
    backgroundColor: Colors.white,
    foregroundColor: Colors.black,
  ),
);

final ThemeData darkTheme = ThemeData(
  brightness: Brightness.dark,
  primaryColor: Colors.grey[900],
  scaffoldBackgroundColor: Colors.black,
  appBarTheme: const AppBarTheme(
    backgroundColor: Colors.black,
    foregroundColor: Colors.white,
  ),
);
