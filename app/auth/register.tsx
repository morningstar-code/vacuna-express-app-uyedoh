
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rnc: '',
    cedula: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, rnc, cedula, address, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !phone || !rnc || !cedula || !address || !password) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Registration data:', formData);
      
      Alert.alert(
        'Registro Exitoso',
        'Su cuenta ha sido creada exitosamente',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/(home)/'),
          },
        ]
      );
    }, 2000);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[commonStyles.title, styles.title]}>Crear Cuenta</Text>
            <Text style={[commonStyles.textSecondary, styles.subtitle]}>
              Complete la información para registrarse
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                  style={[commonStyles.input, styles.input]}
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChangeText={(value) => updateField('firstName', value)}
                  autoCapitalize="words"
                />
              </View>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Apellido *</Text>
                <TextInput
                  style={[commonStyles.input, styles.input]}
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChangeText={(value) => updateField('lastName', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Teléfono *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="(809) 000-0000"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>RNC *</Text>
                <TextInput
                  style={[commonStyles.input, styles.input]}
                  placeholder="000-00000-0"
                  value={formData.rnc}
                  onChangeText={(value) => updateField('rnc', value)}
                />
              </View>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Cédula *</Text>
                <TextInput
                  style={[commonStyles.input, styles.input]}
                  placeholder="000-0000000-0"
                  value={formData.cedula}
                  onChangeText={(value) => updateField('cedula', value)}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dirección *</Text>
              <TextInput
                style={[commonStyles.input, styles.input, styles.textArea]}
                placeholder="Dirección completa"
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Contraseña *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="Repita la contraseña"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[buttonStyles.primary, styles.registerButton]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={[commonStyles.buttonText, styles.buttonText]}>
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Text>
            </TouchableOpacity>
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
    paddingVertical: 16,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
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
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
