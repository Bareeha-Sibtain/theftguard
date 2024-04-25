// Anywhere in your authenticated screens, e.g., SettingsScreen.js
import { Button, Text, View } from 'react-native';
import { useUser } from '../context/userContext';
import auth from '@react-native-firebase/auth';

const SettingScreen = ({ navigation }) => {
  const { user } = useUser();


  return (
    <View>
      <Text>Settings {user ? user.displayName : "guest"}</Text>
    </View>
  );
};

export default SettingScreen