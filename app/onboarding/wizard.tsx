
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
import { colors, commonStyles, buttonStyles, spacing, borderRadius } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingWizardScreen() {
  const { profile, updateProfile } = useAuth();
  const [businessName, setBusinessName] = useState(profile?.business_name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteOnboarding = async () => {
    if (!businessName.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre de su centro o negocio');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Completing onboarding with business name:', businessName);
      const { error } = await updateProfile({
        business_name: businessName.trim(),
        onboarding_completed: true,
      });

      if (error) {
        console.error('Onboarding completion error:', error);
        Alert.alert('Error', 'No se pudo completar el proceso de configuración. Intente nuevamente.');
      } else {
        console.log('Onboarding completed successfully');
        Alert.alert(
          '¡Bienvenido!',
          'Su cuenta ha sido configurada exitosamente.',
          [
            {
              text: 'Continuar',
              onPress: () => router.replace('/(tabs)/(home)/'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Onboarding exception:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
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
              <IconSymbol name="building.2.fill" size={48} color={colors.primary} />
            </View>
            <Text style={[commonStyles.title, styles.title]}>¡Casi listo!</Text>
            <Text style={[commonStyles.textSecondary, styles.subtitle]}>
              Complete la configuración de su cuenta para comenzar
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.stepIndicator}>
              <View style={styles.stepActive}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={[commonStyles.textSecondary, styles.stepText]}>
                Información del negocio
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre del Centro/Negocio *</Text>
              <Text style={[commonStyles.textSmall, styles.helpText]}>
                Este nombre aparecerá en sus pedidos y facturas
              </Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="Ej: Clínica San Rafael, Centro Médico ABC"
                value={businessName}
                onChangeText={setBusinessName}
                autoCapitalize="words"
                autoFocus
              />
            </View>

            <View style={styles.infoCard}>
              <IconSymbol name="info.circle.fill" size={24} color={colors.info} />
              <View style={styles.infoContent}>
                <Text style={[commonStyles.textBold, styles.infoTitle]}>
                  ¿Por qué necesitamos esta información?
                </Text>
                <Text style={[commonStyles.textSecondary, styles.infoText]}>
                  El nombre de su centro o negocio nos ayuda a personalizar su experiencia y 
                  aparecerá en todos sus documentos oficiales.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[buttonStyles.primary, styles.continueButton]}
              onPress={handleCompleteOnboarding}
              disabled={isLoading || !businessName.trim()}
            >
              <Text style={[commonStyles.buttonText, styles.buttonText]}>
                {isLoading ? 'Configurando...' : 'Completar Configuración'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[commonStyles.textSmall, styles.footerText]}>
              Podrá modificar esta información más tarde en su perfil
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
    width: 80,
    height: 80,
    backgroundColor: colors.card,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...commonStyles.shadow,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  stepActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  helpText: {
    marginBottom: 8,
    lineHeight: 18,
  },
  input: {
    fontSize: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
    ...commonStyles.shadow,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  continueButton: {
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
