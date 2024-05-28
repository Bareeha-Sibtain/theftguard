import 'react-native-gesture-handler';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import HomeScreen from '../screen/HomeScreen';
import HistoryScreen from '../screen/HistoryScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Entypo';
import ChatListScreen from '../screen/ChatListScreen';
import ChatScreen from '../screen/ChatScreen';
import SettingScreen from '../screen/SettingScreen';




const AppStack = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        statusBarColor: '#0163d2',
        headerStyle: {
          backgroundColor: '#0163d2',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerLeft: () => {
            return (
              <Icon
                name="menu"
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                size={30}
                color="#fff"
              />
            );
          },
        }}
      />
     
      <Stack.Screen name='ChatList' component={ChatListScreen} />
      <Stack.Screen name='History' component={HistoryScreen} />
      <Stack.Screen name='Setting' component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default AppStack