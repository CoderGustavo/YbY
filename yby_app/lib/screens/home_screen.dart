import 'package:app_yby/services/auth_service.dart';
import 'package:app_yby/services/data_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:intl/intl.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:fl_chart/fl_chart.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final MapController _mapController;
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
    await _fetchChartData(null);
    setState(() {
      isLoading = false;
    });
  }

  String formatDate(String dateString) {
    DateTime dateTime = DateTime.parse(dateString);
    var formatter = DateFormat('dd/MM/yyyy HH:mm');
    return formatter.format(dateTime);
  }

  Future<void> _fetchChartData(id) async {
    try {
      List<dynamic> data;
      if (id == null) {
        List<dynamic> sensor = await DataService().getSensors();
        data = sensor[0]["humidityData"];
      } else {
        data = await DataService().getSensor(id);
      }

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
                      toY: double.parse(entry.value["humidityValue"]),
                      color: double.parse(entry.value["humidityValue"]) < 40
                          ? Colors.blue
                          : (double.parse(entry.value["humidityValue"]) <= 60)
                              ? Colors.orange
                              : Colors.red,
                      width: 20,
                    ),
                  ],
                ),
              )
              .toList();

          _barTitles = data
              .map<String>((item) => formatDate(item['created_at'].toString()))
              .toList();
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
    final List<dynamic> data = await DataService().getSensors();

    // Verifica se os dados estão vazios
    if (data.isEmpty) return [];

    // throw Exception(data);

    // Populando o formatted_data com os markers
    List<Marker> formattedData = data.map((item) {
      // Verifica se os campos locX, locY e name estão presentes
      final double locX = double.tryParse(item['locX'] ?? '') ?? 0.0;
      final double locY = double.tryParse(item['locY'] ?? '') ?? 0.0;
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
                      child: FlutterMap(
                        mapController: _mapController,
                        options: MapOptions(
                          initialCenter: const LatLng(-22.2901704, -46.6103562),
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
                                    child: Text('Nenhum sensor encontrado!'));
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
                      padding: const EdgeInsets.only(left: 8, right: 8, bottom: 20, top: 8),
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
                                          return Padding(padding: EdgeInsets.only(bottom: 0), child: SideTitleWidget(
                                            axisSide: meta.axisSide,
                                            angle: 75,
                                            child:
                                                Text(_barTitles[value.toInt()]),
                                          ));
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
