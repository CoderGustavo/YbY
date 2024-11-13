import 'package:app_yby/screens/home_screen.dart';
import 'package:app_yby/screens/login_screen.dart';
import 'package:app_yby/screens/register_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'screens/welcome_screen.dart';
import 'providers/user_provider.dart';

Future<void> main() async {
  // Garante que o Flutter esteja inicializado
  WidgetsFlutterBinding.ensureInitialized();

  // Carrega as variáveis de ambiente do arquivo .env
  await dotenv.load();

  // Inicializa o app
  runApp(YBYApp());
}

class YBYApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: MaterialApp(
        title: 'YBY',
        theme: ThemeData(
          primaryColor: const Color(0xFF395723),
          colorScheme: ColorScheme.fromSwatch().copyWith(
            secondary: const Color(0xFF7e6000),
          ),
        ),
        // home: WelcomeScreen(),
        initialRoute: "/",
        routes: {
          "/": (ctx) => WelcomeScreen(),
          "/login": (ctx) => LoginScreen(),
          "/register": (ctx) => RegisterScreen(),
          "/home": (ctx) => HomeScreen()
        },
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
