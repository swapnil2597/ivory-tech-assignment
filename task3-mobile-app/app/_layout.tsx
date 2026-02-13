import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Ivory Assignment App' }} />
      </Stack>
    </SafeAreaProvider>
  );
}