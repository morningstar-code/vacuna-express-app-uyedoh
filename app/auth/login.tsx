
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        let errorMessage = 'Error al iniciar sesión. Verifique sus credenciales.';
        
        if (error.message) {
          if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Por favor confirme su correo electrónico antes de iniciar sesión.';
          } else if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Credenciales inválidas. Verifique su correo y contraseña.';
          } else {
            errorMessage = error.message;
          }
        }
        
        Alert.alert('Error', errorMessage);
      } else {
        console.log('Login successful');
        // Navigation will be handled by the auth context and root index
      }
    } catch (error) {
      console.error('Login exception:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/275cdcdc-16f7-40a5-9e26-952a84e33f75.jpeg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.brandingContainer}>
              <Text style={[commonStyles.title, styles.brandName]}>Vacuna</Text>
              <Text style={[commonStyles.title, styles.brandExpress]}>Express</Text>
            </View>
            <Text style={[commonStyles.textSecondary, styles.subtitle]}>
              Distribución de vacunas a domicilio
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="Ingrese su contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[buttonStyles.primary, styles.loginButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={[commonStyles.buttonText, styles.buttonText]}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={commonStyles.divider} />
              <Text style={[commonStyles.textSecondary, styles.dividerText]}>o</Text>
              <View style={commonStyles.divider} />
            </View>

            <TouchableOpacity
              style={[buttonStyles.outline, styles.registerButton]}
              onPress={handleRegister}
            >
              <Text style={[commonStyles.buttonTextOutline, styles.registerButtonText]}>
                Crear Nueva Cuenta
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[commonStyles.textSmall, styles.footerText]}>
              Al continuar, acepta nuestros términos y condiciones
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.card,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...commonStyles.shadow,
    overflow: 'hidden',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  brandingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginRight: 8,
  },
  brandExpress: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF6B35', // Orange color from the logo
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  registerButton: {
    marginBottom: 32,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
