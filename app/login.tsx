// Login/Register screen
// Auth pattern: https://medium.com/@david.ryan.hall/setting-up-a-basic-login-flow-for-an-expo-application-0b62b2b3e448
// SQLite offline login: https://github.com/quangvietntd/SQLiteDemo3
// Offline auth with password_hash: https://dev.to/tuliocalil/offline-auth-with-electron-sqlite-react-986
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { login, register } from '@/lib/auth';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from './_layout';

export default function LoginScreen() {
  const router = useRouter();
  const context = useContext(AppContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!context) return null;

  const { setCurrentUser } = context;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const user = await login(email, password);
      setCurrentUser(user);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      const user = await register(username, email, password);
      setCurrentUser(user);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Registration failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>JT</Text>
        </View>

        <ScreenHeader
          title={isRegistering ? 'Create account' : 'Welcome back'}
          subtitle={isRegistering ? 'Sign up to start tracking' : 'Log in to your account'}
        />

        {isRegistering && (
          <FormField
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
          />
        )}

        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
        />

        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
        />

        {isRegistering && (
          <FormField
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your password"
          />
        )}

        <View style={styles.buttons}>
          <PrimaryButton
            label={isRegistering ? 'Create account' : 'Log in'}
            onPress={isRegistering ? handleRegister : handleLogin}
          />

          <PrimaryButton
            label={isRegistering ? 'Already have an account? Log in' : 'No account? Sign up'}
            onPress={() => {
              setIsRegistering(!isRegistering);
              setUsername('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#185FA5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttons: {
    marginTop: 24,
  },
});