import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LoginContainer } from '@/Containers'
import { ResellerLoginContainer } from '@/Containers'
import { ResellerHomeContainer } from '@/Containers'
import { ResellerProfileDrawerContainer } from '@/Containers'
import { useTheme } from '@/Hooks'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Button,
} from 'react-native'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

function ResellerHome(){
	const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()
	
	return (
		<Drawer.Navigator
			drawerContent={ResellerProfileDrawerContainer}
			screenOptions={{
				drawerPosition: 'right',
				//overlayColor: Colors.secondary,
				
			  }}
		>
		  <Drawer.Screen name="Reseller Map View" component={ResellerHomeContainer} options={{
			  headerShown: false,
			}}
		  />
		  <Drawer.Screen name="Reseller Profile Slider" component={ResellerProfileDrawerContainer} options={{
			  headerShown: false,
			}}
		  />
		</Drawer.Navigator>
	);
}

// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={LoginContainer}
        options={{
          tabBarIconStyle: { display: 'none' },
          tabBarLabelPosition: 'beside-icon',
		  headerShown: false,
        }}
      />
	  <Stack.Screen
        name="Reseller Login"
        component={ResellerLoginContainer}
        options={{
          tabBarIconStyle: { display: 'none' },
          tabBarLabelPosition: 'beside-icon',
		  headerShown: false,
		  animationEnabled: false,
        }}
      />
	  <Stack.Screen
			name="Reseller Home"
			component={ResellerHome}
			options={{
			  tabBarIconStyle: { display: 'none' },
			  tabBarLabelPosition: 'beside-icon',
			  headerShown: false,
			  animationEnabled: false,
			}}
			/>
    </Stack.Navigator>
  )
}

export default MainNavigator
