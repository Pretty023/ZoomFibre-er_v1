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
  Image,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import { useStaff } from '@/Hooks'
import { setUser } from '@/Store/Staff'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { changeTheme } from '@/Store/Theme'
import Animated, { FadeOutDown, FadeInUp, Layout, Easing, FadeInDown, SlideInDown } from 'react-native-reanimated'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { navigate } from '@/Navigators/utils'
import { navigateAndReset } from '@/Navigators/utils'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { Config } from '@/Config'
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from 'react-native-animated-progress'

const LoginContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()
  const dispatch = useDispatch()
  const theUser = useStaff()

  const [userId, setUserId] = useState('9')
  const [isActive, setIsActive] = useState(false)
  const [fetchOne, { data, isSuccess, isLoading, isFetching, error }] =
    useLazyFetchOneQuery()
  {/*
    useEffect(() => {
    fetchOne(userId)
  }, [fetchOne, userId])
  */}
  

  const onChangeTheme = ({ theme, darkMode }) => {
    dispatch(changeTheme({ theme, darkMode }))
  }

  const signIn = async () => {
    setIsActive(!isActive);
    GoogleSignin.configure(Config.GOOGLE_SIGN_IN_CONFIG);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //console.log(userInfo)
      const userID = userInfo.user.id;
      //console.log(userID);
      const userEmail = userInfo.user.email;
      const userGivenName = userInfo.user.givenName;
      const userFamilyName = userInfo.user.familyName;
      const userPhoto = userInfo.user.photo;
      const userName = userInfo.user.name;

      dispatch(setUser({ id: userID, email: userEmail, givenName: userGivenName, familyName: userFamilyName, photo: userPhoto, name: userName, user_keep_logged_in: true }))
      setIsActive(false);
      navigate('Staff Home')
    } catch (error) {
      //console.log(error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {

      }
    }
  };

  return (
    <ImageBackground source={Images.bg} resizeMode="cover" style={Common.image}>
      <ScrollView
        style={Layout.fill}
        contentContainerStyle={[
          Layout.fill,
          Layout.colCenter,
          Gutters.smallHPadding,
        ]}
      >

        <Animated.View style={[[Layout.colCenter, Gutters.smallHPadding]]} entering={SlideInDown.duration(1000).withInitialValues({ originY: global.logo_default_y })} >
          <Brand width={250} height={250} />
        </Animated.View>
        {/*
      <View
        style={[
          Layout.row,
          Layout.rowHCenter,
          Gutters.smallHPadding,
          Gutters.largeVMargin,
          Common.backgroundPrimary,
        ]}
      >
	  
        <Text style={[Layout.fill, Fonts.textCenter, Fonts.textSmall]}>
          {t('example.labels.userId')}
        </Text>
        <TextInput
          onChangeText={setUserId}
          editable={!isLoading}
          keyboardType={'number-pad'}
          maxLength={1}
          value={userId}
          selectTextOnFocus
          style={[Layout.fill, Common.textInput]}
        />
		
      </View>
		
	  
      <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>DarkMode :</Text>
	  
	  
      <TouchableOpacity
        style={[Common.button.rounded, Gutters.regularBMargin]}
        onPress={() => onChangeTheme({ darkMode: null })}
      >
        <Text style={Fonts.textRegular}>Auto</Text>
      </TouchableOpacity>
	  */}
        <Animated.View style={[[Layout.colCenter, Gutters.smallHPadding, Layout.fullWidth, Gutters.smallVPadding], { flex: 1 }, { justifyContent: 'flex-end' }]} entering={FadeInDown.delay(1500)}>
          {(isLoading || isFetching) && <ActivityIndicator color={Colors.semi_trans_white} style={Gutters.largeVPadding} />}
          {!isSuccess ? (
            <Text style={[Fonts.whiteTextRegular, Gutters.largeVPadding]}>{error}</Text>
          ) : (
            <Text style={[Fonts.whiteTextRegular, Fonts.montserrat_regular, Gutters.largeVPadding]}>
              {t('main_loading')}
            </Text>
          )}
          {/*
      <TouchableOpacity
        style={[Common.button.solidBackgroundPrimary, Gutters.regularBMargin, Layout.fullWidth, {height:60}]}
        onPress={() => onChangeTheme({ darkMode: true })}
      >
        <Text style={[Fonts.white_text, Fonts.montserrat_bold, {fontSize: 16}]}>DARK</Text>
      </TouchableOpacity>
		*/}

          <TouchableOpacity
            style={[Common.button.rounded, Common.button.solidBackgroundSecondary, Gutters.regularBMargin, Layout.fullWidth, { height: 50 }]}
            onPress={() =>
              navigate('Reseller Login')
            }
          >
            <Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.white_text]}>{t('username_login')}</Text>
          </TouchableOpacity>
          {/*
          <View style={[Layout.fullWidth, Common.button.rounded, Common.button.solidBackgroundWhite, Layout.colCenter,Gutters.regularHPadding,{height:55}]}>
              <GoogleSigninButton
                style={{ width: 312, height: 60 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={() =>
                  signIn()
                
            }
           
                //disabled={isSigninInProgress}
                 />
         </View>
          */}


          {isActive ?
            <View style={[Layout.fullWidth, Layout.largeVPadding, Gutters.smallTMargin, {height:50}]}>
              <ProgressBar
                indeterminate={true}
                height={2}
                backgroundColor={Colors.secondary}
                animated={true}
                trackColor={Colors.solitude}
              />
            </View>
            :
            <TouchableOpacity
              style={[Common.button.rounded, Common.button.solidBackgroundWhite, Gutters.regularBMargin, Layout.fullWidth, { height: 50 }]}
              onPress={() =>
                signIn()
              }
            >
              <View style={[Layout.rowCenter, Layout.fullWidth]}>
                <Image
                  style={[Gutters.tinyHPadding, { height: '100%', resizeMode: 'contain', width: '30%' }]}
                  source={Images.google_logo}
                  PlaceholderContent={<ActivityIndicator size={'large'} color={Colors.solitude} />}
                />
                <Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.semi_trans_black, width: '70%', marginRight: 8 }]}>{t('sign_in_g_button_label')}</Text>
              </View>
            </TouchableOpacity>
          }



        </Animated.View>
      </ScrollView>
    </ImageBackground>
  )
}



export default LoginContainer
