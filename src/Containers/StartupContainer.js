import React, { useEffect } from 'react'
import { ActivityIndicator, View, Text, ImageBackground, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { useReseller } from '@/Hooks'
import { useStaff } from '@/Hooks'
import { setUser } from '@/Store/Staff'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { navigate } from '@/Navigators/utils'
import { navigateAndReset } from '@/Navigators/utils'
import { Config } from '@/Config'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux'


const StartupContainer = () => {
  const { Layout, Gutters, Fonts, Images, Common, Colors } = useTheme()
  const dispatch = useDispatch()
  const theReseller = useReseller()
  const theUser = useStaff()

  const { t } = useTranslation()

  const init = async () => {

    //console.log(theUser)
    if (theUser.id == null) {
      await new Promise(resolve =>
        setTimeout(() => {
          resolve(true)
        }, 2000),
      )
    }//if
    else {
      GoogleSignin.configure(Config.GOOGLE_SIGN_IN_CONFIG);
      try {
        const userInfo = await GoogleSignin.signInSilently();
        //console.log(userInfo)
        //const currentUser = await GoogleSignin.getCurrentUser();
        const userID = userInfo.user.id;
        const userEmail = userInfo.user.email;
        const userGivenName = userInfo.user.givenName;
        const userFamilyName = userInfo.user.familyName;
        const userPhoto = userInfo.user.photo;
        const userName = userInfo.user.name;

        dispatch(setUser({ id: userID, email: userEmail, givenName: userGivenName, familyName: userFamilyName, photo: userPhoto, name: userName, user_keep_logged_in: true }))
      } catch (error) {
        //console.log(error)
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          // user has not signed in yet
          navigateAndSimpleReset('Main')
        } else {
          // some other error
          navigateAndSimpleReset('Main')
        }
      }
    }//else
    await setDefaultTheme({ theme: 'default', darkMode: null })

    if (theReseller.is_logged_in) {
      navigate('Reseller Home', { screen: 'Reseller Map View' })
    }//if
    else {
      if (theUser.is_logged_in) {
        navigate('Staff Home')
      }//if
      else {
        navigateAndSimpleReset('Main')
      }//else

    }//else

  }


  useEffect(() => {
    init()
  })

  return (
    <ImageBackground source={Images.bg} resizeMode="cover" style={Common.image}>
      <View style={[Layout.fill, Layout.colCenter]}>
        <Brand width={250} height={250} />
        <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} color={Colors.semi_trans_white} />
        <Text style={[Fonts.textCenter, Fonts.white_text, Fonts.montserrat_regular, { fontSize: 16 }]}>{t('welcome')}</Text>
      </View>
    </ImageBackground>
  )
}

export default StartupContainer
