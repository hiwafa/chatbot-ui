import { Tabs, useRouter, useNavigation, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {

  const path_name = usePathname();
  console.log("path_name: ", path_name);


  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          // backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        // headerTintColor: '#fff',
        tabBarStyle: {
        // backgroundColor: '#25292e',
          display: path_name.startsWith('/dictionary/') && !path_name.endsWith('undefined') && path_name.length > 21 ? 'none' : 'flex'
        },
      }}
    >
      <Tabs.Screen
        name="dictionary"
        options={{
          title: 'Dictionary',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
