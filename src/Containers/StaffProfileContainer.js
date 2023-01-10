import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand, DarkBrand, CustomTextInput, SearchInput } from '@/Components'
import { useTheme, useStaff } from '@/Hooks'
import { useReseller } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { useLazyAuthenticateQuery } from '@/Services/resellerAPI'
import { changeTheme } from '@/Store/Theme'
import { clearUser } from '@/Store/Staff'
import Animated, {
  FadeOutDown,
  FadeInUp,
  Layout,
  Easing,
  FadeInDown,
  SlideInDown,
} from 'react-native-reanimated'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { navigate } from '@/Navigators/utils'
import { navigateAndReset } from '@/Navigators/utils'
import LinearGradient from 'react-native-linear-gradient'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import ProgressBar from 'react-native-animated-progress'
import BottomSheet from '@gorhom/bottom-sheet'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import MapView, { Marker } from 'react-native-maps'
import MyToast from '@/Theme/components/ToastConfig'
import ImageUpload from '@/Theme/components/imageUpload'
import UserAvatar from 'react-native-user-avatar'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { Config } from '@/Config'
import ImagePicker from 'react-native-image-crop-picker'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const StaffProfileContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()
  const theStaffUser = useStaff()
  const [inProgress, setInProgress] = useState(false)
  const [signedIn, setSignedIn] = useState(true)
  const [staffFullName, setStaffFullName] = useState('Not Available')
  const [staffEmail, setStaffEmail] = useState('')
  const [staffGivenName, setStaffGivenName] = useState('')
  const [staffFamilyName, setStaffFamilyName] = useState('')
  const [staffPhoto, setStaffPhoto] = useState('')
  const [staffID, setStaffID] = useState('')
  const [Upload, setUpload] = useState(false)
  const [uploadedImage, setUploadedImage] = useState('')

  //console.log(theStaffUser)
  useEffect(() => {
    if (Object.keys(theStaffUser).length > 0) {
      setStaffFullName(theStaffUser.name)
      setStaffEmail(theStaffUser.email)
      setStaffGivenName(theStaffUser.givenName)
      setStaffFamilyName(theStaffUser.familyName)
      setStaffPhoto(theStaffUser.photo)
      setStaffID(theStaffUser.name)
    } //if
  }, [theStaffUser])
  useEffect(() => {
    if (uploadedImage.length > 0) {
      console.log(uploadedImage);
    } //if
  }, [uploadedImage])
  const addImage = () => {
    ImagePicker.openPicker({
      width: 512,
      height: 512,
      cropping: true,
      includeBase64: true,
			mediaType: 'photo',
    }).then(image => {
      const imageData = 'data:' + image.mime + ';base64,' + image.data;
      setUploadedImage(imageData)
    })
  }
  const takePicture = () => {
    ImagePicker.openCamera({
      width: 512,
      height: 512,
      cropping: true,
      includeBase64: true,
			mediaType: 'photo',
    }).then(image => {
      const imageData = 'data:' + image.mime + ';base64,' + image.data;
      setUploadedImage(imageData)

    })
  }
  const ProfileImageContent = (
    <View
      style={[
        Layout.fullWidth,
        Layout.colCenter,
        Gutters.largeHPadding,
        { backgroundColor: Colors.white, minHeight: '100%' },
      ]}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setUpload(false)
        }}
      >
        <View
          style={[
            Layout.colCenter,
            {
              backgroundColor: Colors.thirty_trans_black,
              borderColor: Colors.primary,
              borderWidth: 0,
              borderRadius: 15,
              height: 30,
              width: 30,
              position: 'absolute',
              top: 0,
              right: 6,
            },
          ]}
        >
          <FontAwesomeIcon icon="fa-times" color={Colors.white} size={22} />
        </View>
      </TouchableWithoutFeedback>
      <Text
        style={[
          Fonts.textRegular,
          Fonts.black_text,
          Fonts.montserrat_bold,
          { textAlign: 'center', position: 'absolute', top: 0 },
        ]}
      >
        {t('staff_upload_image_header')}
      </Text>
      <View
        style={[
          Common.button.rounded,
          Common.button.solidBackgroundPrimary,
          Gutters.regularBMargin,
          Layout.fullWidth,
          { height: 50 },
        ]}
      >
        <TouchableOpacity onPress={addImage}>
          <Text
            style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.white_text]}
          >
            Select From Gallery
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          Common.button.rounded,
          Common.button.solidBackgroundPrimary,
          Gutters.regularBMargin,
          Layout.fullWidth,
          { height: 50 },
        ]}
      >
        <TouchableOpacity onPress={takePicture}>
          <Text
            style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.white_text]}
          >
            Open Camera
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  const UploadRef = useRef(null)
  const snapPoints = useMemo(() => ['40%'], ['42%'])
  const resultsSheet = (
    <BottomSheet
      ref={UploadRef}
      initialSnapIndex={0}
      snapPoints={snapPoints}
      enableOverDrag={false}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      handleIndicatorStyle={{ display: 'none' }}
      backgroundStyle={[{ backgroundColor: Colors.white }]}
    >
      {ProfileImageContent}
    </BottomSheet>
  )

  const dispatch = useDispatch()
  //Theme
  const onChangeTheme = ({ theme, darkMode }) => {
    dispatch(changeTheme({ theme, darkMode }))
  }
  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn()
    //setState({ isLoginScreenPresented: !isSignedIn });
  }
  //clearUser
  const signOut = async () => {
    setInProgress(true)
    setSignedIn(false)
    GoogleSignin.configure(Config.GOOGLE_SIGN_IN_CONFIG)
    try {
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()

      dispatch(clearUser())
      navigate('Home')
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
  }
  return (
    <View style={[{ flex: 1 }, Layout.fullHeight, Layout.column]}>
      <KeyboardAwareScrollView
        scrollEnabled={true}
        resetScrollToCoords={{ x: 0, y: 0 }}
        style={[{ backgroundColor: Colors.solitude }]}
        contentContainerStyle={[
          Layout.fullSize,
          Layout.largeBMargin,
          Layout.largeBPadding,
        ]}
      >
        <View style={[{ height: 100, elevation: 10, zIndex: 10 }]}>
          <View style={[Layout.fullWidth, Layout.rowCenter, { flex: 1 }]}>
            <DarkBrand width={150} height={150} />
          </View>
        </View>
        {inProgress ? (
          <View
            style={[
              Layout.fullWidth,
              Layout.largeVPadding,
              Gutters.smallTMargin,
              { height: 60 },
            ]}
          >
            <ProgressBar
              indeterminate={true}
              height={2}
              backgroundColor={Colors.secondary}
              animated={true}
              trackColor={Colors.solitude}
            />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={[Layout.rowCenter, { height: 120 }]}>
              {signedIn ? (
                <View
                  style={[
                    {
                      borderRadius: 50,
                      height: 100,
                      width: 100,
                      backgroundColor: 'transparent',
                    },
                  ]}
                >
                  <UserAvatar
                    size={100}
                    name={staffFullName}
                    bgColors={[Colors.secondary]}
                    style={{ zIndex: 10 }}
                  />
                  <TouchableOpacity
                    style={[
                      {
                        zIndex: 20,
                        backgroundColor: Colors.white,
                        height: 30,
                        width: 30,
                        position: 'absolute',
                        bottom: -3,
                        right: -3,
                        borderRadius: 15,
                      },
                      Layout.center,
                    ]}
                    onPress={() => {
                      //Trigger Bottomsheet
                      setUpload(true)
                      console.log('Here')
                    }}
                  >
                    <FontAwesomeIcon
                      icon="fa-camera"
                      color={Colors.thirty_trans_black}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <View style={[Layout.colCenter, { height: 60 }]}>
              <Text
                style={[
                  Fonts.titleSmall,
                  Fonts.textCenter,
                  Fonts.montserrat_regular,
                ]}
              >
                {staffFullName}
              </Text>
              <Text
                style={[
                  Fonts.textRegular,
                  Fonts.textCenter,
                  Fonts.montserrat_regular,
                ]}
              >
                {staffEmail}
              </Text>
            </View>
            <View
              style={[
                Layout.fullWidth,
                Layout.colCenter,
                Gutters.regularHPadding,
                { flex: 1 },
              ]}
            >
              <TouchableOpacity
                style={[
                  Common.button.rounded,
                  Common.button.solidBackgroundPrimary,
                  Gutters.regularBMargin,
                  Layout.fullWidth,
                  { height: 50 },
                ]}
                onPress={() => signOut()}
              >
                <Text
                  style={[
                    Fonts.textRegular,
                    Fonts.montserrat_bold,
                    Fonts.white_text,
                  ]}
                >
                  {t('sign_out_user_label')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
      {Upload ? resultsSheet : null}
    </View>
  )
}

export default StaffProfileContainer
