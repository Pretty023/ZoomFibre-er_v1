import React, { useState, useEffect, useRef } from 'react'
import {
	View,
	ActivityIndicator,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
	StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand, CustomTextInput, CustomModal } from '@/Components'
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
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import MyToast from '@/Theme/components/ToastConfig'


const ResellerLoginContainer = () => {
	const { t } = useTranslation()
	const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()

	const theReseller = useReseller()

	const dispatch = useDispatch()
	const [isActive, setIsActive] = useState(false)
	//Default Fake User
	const [userId, setUserId] = useState('9')
	const [fetchOne, { data, isSuccess, isLoading, isFetching, error }] =
		useLazyFetchOneQuery()

	useEffect(() => {
		fetchOne(userId)
	}, [fetchOne, userId])

	const isFirstRender = useRef(true);


	//Reseller
	const [inputs, setInputs] = useState({ resellerUsername: '', resellerPassword: '' });
	const [keepLoggedIn, setKeepLoggedIn] = useState(false)

	const [authReseller, result] = useLazyAuthenticateQuery()

	const handleOnchange = (text, input) => {

		setInputs(prevState => ({ ...prevState, [input]: text }));
	}

	const [fields, setFieldsStatus] = useState();
	const [invalidField, setFieldFailed] = useState(false);
	const [formValid, setFormValid] = useState('');
	const validState = (inputField, inputState) => {
		setFieldsStatus(prevState => ({ ...prevState, [inputField]: inputState }));
	};
	const [modalVisible, setModalVisible] = useState(false);
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return
		}//if
		if (formValid == 'false') {
			setFormValid('')
			setModalVisible(true);
		}//if
		else if (formValid == 'true') {
			setFormValid('')
			setModalVisible(false);
			resellerLogin()

		}//else

	}, [formValid]);

	const validateForm = () => {
		let numFields = Object.keys(fields).length;
		let fieldIsInvalid = false;
		const fieldValidation = Object.keys(fields).map((key, index) => {
			if (fields[key] == false) {
				setFormValid('false')
				fieldIsInvalid = true;
			}//if
			if (numFields == index + 1 && !fieldIsInvalid) {
				setFormValid('true')
			}//if
		});
	}

	const resellerLogin = async () => {
		const resellerUsername = inputs.resellerUsername;
		const resellerPassword = inputs.resellerPassword;
		//console.log(fields);
		setIsActive(!isActive);
		const authResults = await authReseller({ 'au': resellerUsername, 'ap': resellerPassword })
		//console.log(authResults);
		if (authResults.data.status == 200) {
			const authResultsMessage = authResults.data.messages;

			if (authResultsMessage.success == "Login Failed") {

				dispatch(clearReseller())

				Toast.show({
					type: 'error',
					text1: t('auth_failed_header'),
					text2: t('auth_failed_instruction'),
					position: 'bottom',
					autoHide: true,
					visibilityTime: 4000
				});
				await new Promise(resolve =>
					setTimeout(() => {
						resolve(true)
					}, 4500),
				)
				setIsActive(false);
			}//if
			else if (typeof (authResultsMessage.success) === "object") {
				const resellerID = authResultsMessage.success.id;
				const resellerUsername = authResultsMessage.success.username;
				const resellerFirstName = authResultsMessage.success.first_name;
				const resellerLastName = authResultsMessage.success.last_name;
				const resellerEmail = authResultsMessage.success.email;
				const resellerCompany = authResultsMessage.success.related_reseller;
				const resellerUserGroup = authResultsMessage.success.user_group;

				dispatch(setReseller({ reseller_id: resellerID, reseller_username: resellerUsername, reseller_password: resellerPassword, reseller_first_name: resellerFirstName, reseller_last_name: resellerLastName, reseller_email_address: resellerEmail, reseller_company: resellerCompany, reseller_user_group: resellerUserGroup, reseller_keep_logged_in: keepLoggedIn }))
				setIsActive(false);
				navigate('Reseller Home', { screen: 'Reseller Map View' })
			}//else if
		}//if

	}

	//Theme
	const onChangeTheme = ({ theme, darkMode }) => {
		dispatch(changeTheme({ theme, darkMode }))
	}
	return (
		<View style={[{ flex: 1 }, Layout.fullHeight]}>
			<KeyboardAwareScrollView scrollEnabled={true} resetScrollToCoords={{ x: 0, y: 0 }} style={[{ backgroundColor: Colors.solitude }]} contentContainerStyle={[Layout.scrollSpaceBetween, Layout.largeBMargin, Layout.largeBPadding]}>
				<View style={[{ height: 320 }]}>

					<ImageBackground source={Images.bg} resizeMode="cover" style={[Common.image, Layout.colCenter, Layout.justifyContentBetween]} imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
						<View style={[Layout.fullWidth, Layout.rowCenter, { flex: 1 }]}>
							<TouchableOpacity
								style={[Common.button.backgroundReset, Gutters.regularBMargin, { height: 60, width: 12, left: -40, top: 0 }]}
								onPress={() =>
									navigate('Home')
								}
							>
								<FontAwesomeIcon icon="fa-angle-left" color={'white'} size={26} />
							</TouchableOpacity>
							<Brand width={250} height={250} />
						</View>
						<View style={[Layout.fullWidth, Layout.colCenter, { flex: 1 }]}>
							<Text style={[Fonts.whiteTextRegular, Fonts.montserrat_bold, Gutters.regularVPadding]}>{t('reseller_login_welcome')}</Text>
							<Text style={[Fonts.textSmall, Fonts.montserrat_regular, Fonts.white_text, Fonts.textCenter, Gutters.regularVPadding]}>{t('reseller_login_instruction')}</Text>
						</View>
					</ImageBackground>
				</View>

				<ScrollView style={[{ backgroundColor: Colors.solitude }, Gutters.smallVPadding, Gutters.smallHPadding]}
					contentContainerStyle={[Layout.scrollSpaceBetween]}>
					<View>

						<CustomTextInput name="Username" label="Username" value={inputs.resellerUsername} onChangeText={text => handleOnchange(text, 'resellerUsername')} lblBgColor={Colors.solitude} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
						<CustomTextInput name="Password" label="Password" value={inputs.resellerPassword} onChangeText={text => handleOnchange(text, 'resellerPassword')} lblBgColor={Colors.solitude} isPassword={true} requiredField={true} validState={validState} />
						<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.tinyHPadding, Gutters.smallTMargin, { flex: 1 }]}>

							<BouncyCheckbox
								size={35}
								fillColor={Colors.primary}
								unfillColor={Colors.solitude}
								text={t('remember_me')}
								iconStyle={{ borderColor: Colors.solitude }}
								innerIconStyle={{ borderWidth: 2 }}
								textStyle={{ fontFamily: "Montserrat-Regular" }}
								onPress={(keepLoggedIn) => { setKeepLoggedIn(!!keepLoggedIn) }}
								disableText={true}
							/>
							<Text style={[Gutters.smallLMargin, Fonts.black_text, Fonts.montserrat_regular, Fonts.textSmall, { textAlign: 'right' }]}>{t('remember_me')}</Text>
						</View>

						<TouchableOpacity
							style={[Gutters.regularBMargin, Layout.fullWidth, { height: 50, top: 60 }]}
							onPress={() =>
								validateForm()
							}
						>
							{isActive ?
								<View style={[Layout.fullWidth, Layout.largeVPadding, Gutters.smallTMargin]}>
									<ProgressBar
										indeterminate={true}
										height={2}
										backgroundColor={Colors.secondary}
										animated={true}
										trackColor={Colors.solitude}
									/>
								</View>
								:
								<LinearGradient colors={[Colors.primary_gradient_start, Colors.primary_gradient_mid]} style={[Common.button.rounded, Layout.colCenter, { height: '100%' }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
									<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.white_text]}>{t('sign_in_button_label')}</Text>
								</LinearGradient>
							}

						</TouchableOpacity>
						{/*
			  <View style={[Layout.fullWidth, Layout.colCenter, {flex:1}]}>
					<TouchableOpacity
						style={[Common.button.backgroundReset, Gutters.regularBMargin, Gutters.regularTMargin, Layout.fullWidth, {height:60, top:60}]}
						
					  >
						<Text style={[Fonts.textRegular, Fonts.black_text, Fonts.montserrat_bold, {textAlign:'right'}]}>{t('forgot_password')}</Text>
					</TouchableOpacity>
				</View>
			  */}
						<View style={[{ height: 12 }]}></View>

					</View>
				</ScrollView>
			</KeyboardAwareScrollView>
			<CustomModal visible={modalVisible}>
				<View style={[{ alignItems: "center" }, Common.modal.header]}>
					<TouchableOpacity onPress={() => setModalVisible(false)}>
						<View>
							<FontAwesomeIcon icon="fa-times" color={Colors.semi_trans_black} size={30} />
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ alignItems: "center" }}>
					<FontAwesomeIcon icon="fa-circle-exclamation" color={Colors.secondary} size={100} style={{ marginVertical: 10 }} />
				</View>
				<Text style={[Fonts.textRegular, Fonts.black_text, Fonts.montserrat_regular, { textAlign: "center", marginVertical: 30 }]}>{t('form_invalid_text')}</Text>
			</CustomModal>
			<MyToast />
		</View>
	)
}


export default ResellerLoginContainer
