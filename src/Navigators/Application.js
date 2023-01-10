import React from 'react'
import { SafeAreaView, StatusBar, ImageBackground, AppState, Platform } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, Dimensions } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StartupContainer } from '@/Containers'
import { useTheme } from '@/Hooks'
import { LoginContainer } from '@/Containers'
import { ResellerHomeContainer } from '@/Containers'
import { ResellerProfileDrawerContainer } from '@/Containers'
import { ResellerPackageContainer1 } from '@/Containers'
import { ResellerDocumentsContainer } from '@/Containers'
import { ResellerApplicationFormContainer } from '@/Containers'
import { ResellerApplicationFormContainer1 } from '@/Containers'
import { StaffProfileContainer } from '@/Containers'
import MainNavigator from './Main'
import { navigationRef } from './utils'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

function ResellerHome() {
	const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()

	return (
		<Drawer.Navigator
			drawerContent={ResellerProfileDrawerContainer}
			screenOptions={{
				drawerPosition: 'right',
				//overlayColor: Colors.secondary,

			}}

		>
			<Drawer.Screen name="Reseller Map View" unmountOnBlur={true} component={ResellerHomeContainer} options={{
				headerShown: false, unmountOnBlur: true,
			}}
			/>
			<Drawer.Screen name="Reseller Profile Slider" component={ResellerProfileDrawerContainer} options={{
				headerShown: false,
			}}
			/>
		</Drawer.Navigator>

	);
}

function ResellerPackages() {
	const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()

	return (
		<Drawer.Navigator
			drawerContent={ResellerProfileDrawerContainer}
			screenOptions={{
				drawerPosition: 'right',
				//overlayColor: Colors.secondary,

			}}
		>
			<Drawer.Screen name="Reseller Package Selector" component={ResellerPackageContainer1} options={{
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

function ResellerApplication() {
	const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()

	return (
		<Drawer.Navigator
			drawerContent={ResellerProfileDrawerContainer}
			screenOptions={{
				drawerPosition: 'right',
				//overlayColor: Colors.secondary,

			}}
		>
			<Drawer.Screen name="Reseller Application Form" component={ResellerApplicationFormContainer1} options={{
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

function ResellerDocument() {
	const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()

	return (
		<Drawer.Navigator
			drawerContent={ResellerProfileDrawerContainer}
			screenOptions={{
				drawerPosition: 'right',
				//overlayColor: Colors.secondary,

			}}
		>
			<Drawer.Screen name="Reseller Document Upload" component={ResellerDocumentsContainer} options={{
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

function StaffHome() {
	const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()
	return (
		<Drawer.Navigator
			drawerContent={StaffProfileContainer}
			screenOptions={{
				drawerPosition: 'full screen'
			}}
		>
			<Drawer.Screen name="Staff Profile Slider" component={StaffProfileContainer} options={{
				headerShown: false,
			}}
			/>
		</Drawer.Navigator>
	);
}

// @refresh reset
const ApplicationNavigator = () => {
	const { Layout, darkMode, NavigationTheme, Images, Common } = useTheme()
	const { colors } = NavigationTheme

	let isAndroid = false;
	if (Platform.OS === "android") {
		isAndroid = true;
	}//if
	{/*
  StatusBar.setBarStyle("light-content");
	if (Platform.OS === "android") {
	  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
	  StatusBar.setTranslucent(true);
	}
	*/
	}

	return (
		<SafeAreaView style={[Layout.fill, { backgroundColor: colors.transparent }]}>
			<NavigationContainer theme={NavigationTheme} ref={navigationRef}>
				<StatusBar barStyle={'light-content'} backgroundColor={colors.primary} />
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Startup" component={StartupContainer} />
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
						name="Main"
						component={MainNavigator}
						options={{
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
					<Stack.Screen
						name="Reseller Packages"
						component={ResellerPackages}
						options={{
							tabBarIconStyle: { display: 'none' },
							tabBarLabelPosition: 'beside-icon',
							headerShown: false,
							animationEnabled: false,
						}}
						initialParams={{ allPackagesLoaded: false }}
					/>
					<Stack.Screen
						name="Reseller Application"
						component={ResellerApplication}
						options={{
							tabBarIconStyle: { display: 'none' },
							tabBarLabelPosition: 'beside-icon',
							headerShown: false,
							animationEnabled: false,
						}}
					/>
					<Stack.Screen
						name="Reseller Document"
						component={ResellerDocument}
						options={{
							tabBarIconStyle: { display: 'none' },
							tabBarLabelPosition: 'beside-icon',
							headerShown: false,
							animationEnabled: false,
						}}
					/>
					<Stack.Screen
						name="Staff Home"
						component={StaffHome}
						options={{
							tabBarIconStyle: { display: 'none' },
							tabBarLabelPosition: 'beside-icon',
							headerShown: false,
							animationEnabled: false,
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaView>
	)
}

export default ApplicationNavigator
