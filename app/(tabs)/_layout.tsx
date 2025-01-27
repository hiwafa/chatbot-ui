import { TouchableOpacity } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {

  const router = useRouter();
  const path_name = usePathname();
  console.log("path_name: ", path_name);


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#48ffa4',
        headerStyle: {
          backgroundColor: '#141e3a',
        },
        headerLeft: ()=> (
          <TouchableOpacity onPress={() => router.back()} style={{top: 2, left: 5, marginRight: 5, alignItems: 'center', alignSelf: 'center'}}>
            <Ionicons name="arrow-back" size={24} color="#48ffa4" />
          </TouchableOpacity>
        ),
        headerTintColor: '#48ffa4',
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: '#141e3a',
          borderColor: '#141e3a',
          display: path_name.startsWith('/dictionary/') && !path_name.endsWith('undefined') && path_name.length > 21 ? 'none' : 'flex'
        }
      }}
    >
      <Tabs.Screen
        name="dictionary"
        options={{
          title: 'Dictionary',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
