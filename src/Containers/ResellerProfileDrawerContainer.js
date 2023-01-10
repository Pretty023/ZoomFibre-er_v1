import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Platform, 
  StatusBar
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand, DarkBrand, CustomTextInput, SearchInput } from '@/Components'
import { useTheme } from '@/Hooks'
import { useReseller } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { useLazyAuthenticateQuery } from "@/Services/resellerAPI";
import { changeTheme } from '@/Store/Theme'
import { setReseller } from '@/Store/Reseller'
import { clearReseller } from '@/Store/Reseller'
import Animated, { FadeOutDown, FadeInUp, Layout, Easing, FadeInDown, SlideInDown } from 'react-native-reanimated'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { navigate } from '@/Navigators/utils'
import { navigateAndReset } from '@/Navigators/utils'
import LinearGradient from 'react-native-linear-gradient';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ProgressBar from 'react-native-animated-progress'
import Toast, {BaseToast, ErrorToast } from 'react-native-toast-message';
import MapView, {Marker} from 'react-native-maps';
import MyToast  from '@/Theme/components/ToastConfig'
import UserAvatar from 'react-native-user-avatar';

const ResellerProfileDrawerContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()
  const theReseller  = useReseller()
  const theResellerFullName = theReseller.first_name + " " + theReseller.last_name;
  const theResellerEmail = theReseller.email_address;
  
  const dispatch = useDispatch()
//Theme
  const onChangeTheme = ({ theme, darkMode }) => {
    dispatch(changeTheme({ theme, darkMode }))
  }
  //clearReseller
  const doLogout = () => { 
    dispatch(clearReseller());
    navigate('Home')
  }

  return (
  <View style={[{flex:1}, Layout.fullHeight, Layout.column]}>
	<KeyboardAwareScrollView scrollEnabled={true} resetScrollToCoords={{ x: 0, y: 0 }} style={[{backgroundColor: Colors.solitude}]} contentContainerStyle={[Layout.fullSize, Layout.largeBMargin, Layout.largeBPadding]}>
	<View style={[{height:100, elevation:10, zIndex:10}]}>
		<View style={[Layout.fullWidth, Layout.rowCenter, {flex:1}]}>
			<DarkBrand width={150} height={150}/>
		</View>
	</View>
	<View style={[Layout.rowCenter, {height:120}]}>
		<UserAvatar size={100} name={theResellerFullName} bgColors={[Colors.secondary]}/>
	</View>
	<View style={[Layout.colCenter, {height:60}]}>
		<Text style={[Fonts.titleSmall, Fonts.textCenter, Fonts.montserrat_regular, ]}>{theResellerFullName}</Text>
		<Text style={[Fonts.textRegular, Fonts.textCenter, Fonts.montserrat_regular, ]}>{theResellerEmail}</Text>
	</View>
	 <View style={[Layout.fullWidth, Layout.colCenter,Gutters.regularHPadding, {flex:1}]}>
     <TouchableOpacity
        style={[Common.button.rounded, Common.button.solidBackgroundPrimary, Gutters.regularBMargin, Layout.fullWidth, {height:50}]}
        onPress={() =>
          doLogout()
		}
      >
        <Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.white_text]}>{t('sign_out_button_label')}</Text>
      </TouchableOpacity>
	  </View>
		
	</KeyboardAwareScrollView>
	<MyToast/>
  </View>
  )
}


export default ResellerProfileDrawerContainer