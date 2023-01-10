import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense, createRef } from 'react'
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
	StatusBar,
	TouchableWithoutFeedback,
	FlatList,
	Image,
	Dimensions,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand, CustomTextInput, SearchInput, CustomModal } from '@/Components'
import { useTheme } from '@/Hooks'
import { useReseller } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { useLazyAuthenticateQuery } from "@/Services/resellerAPI";
import { useLazyPremisesearchQuery, useLazyAreavalidationQuery, useLazyPremiselookupQuery, useLazyPremiseservicesQuery } from "@/Services/aexAPI";
import { changeTheme } from '@/Store/Theme'
import { setReseller } from '@/Store/Reseller'
import { clearReseller } from '@/Store/Reseller'
import Animated, { FadeOutDown, FadeInUp, FadeIn, Layout, Easing, FadeInDown, SlideInDown, SlideInLeft, SlideInUp, BounceInUp, BounceInDown } from 'react-native-reanimated'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { navigate } from '@/Navigators/utils'
import { navigateAndReset } from '@/Navigators/utils'
import { navigateOpenDrawer } from '@/Navigators/utils'
import { CommonActions } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ProgressBar from 'react-native-animated-progress'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import MyToast from '@/Theme/components/ToastConfig'
import { Config } from '@/Config'
import _ from 'lodash'
import { FlashList } from "@shopify/flash-list";
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import SignatureCapture from 'react-native-signature-capture';
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-date-picker'
import ToggleSwitch from 'rn-toggle-switch'


const ResellerApplicationFormContainer1 = ({ navigation, route }) => {

	let screenWidth = Dimensions.get('window').width;

	let todaysDate = new Date();
	//let todaysStartDate = todaysDate;
	//todaysStartDate.setHours(8);
	//todaysStartDate.setMinutes(0);
	//let todaysEndDate = todaysDate;
	//todaysEndDate.setHours(17);
	//todaysEndDate.setMinutes(0);


	//const [selectedPremise, setSelectedPremise] = useState(route.params.selectedPremise)
	//const [selectedPackage, setSelectedPackage] = useState(route.params.package)
	//const [allThePackages, setAllPackage] = useState(route.params.all_packages)

	const [selectedPremise, setSelectedPremise] = useState(global.selectedPremise)
	const [selectedPackage, setSelectedPackage] = useState(global.selectedPackage)
	const [allThePackages, setAllPackage] = useState(global.allAEXPackages)

	const [headerZIndex, setHeaderZIndex] = useState(1)
	const [headerBackgroundZIndex, setHeaderBackgroundZIndex] = useState(2)
	const [headerLeftNavZIndex, setHeaderLeftNavZIndex] = useState(3)

	const [billingAdrressSameAsPhysical, setBillingAddressSameAsPhysical] = useState(false)
	const [clientTandCAccepted, setClientTandCAccepted] = useState(false)
	const [clientPOPIAgreement, setClientPOPIAgreement] = useState(false)
	const [clientAgreedUpfrontPaymentRequest, setClientAgreedUpfrontPaymentRequest] = useState(false)
	const [clientNoUpfrontPaymentMade, setClientNoUpfrontPaymentMade] = useState(false)
	const [agreementsValid, setAgreementsValid] = useState(false)
	const [uploadsValid, setUploadsValid] = useState(false)
	const [invalidPopUpText, setInvalidPopupText] = useState('')

	const [preferredContactStartTime, setPreferredContactStartTime] = useState('Select Time');
	const [preferredContactEndTime, setPreferredContactEndTime] = useState('Select Time');
	const [showStartTimePicker, setShowStartTimePicker] = useState(false);
	const [showEndTimePicker, setShowEndTimePicker] = useState(false);
	const [preferredContactStartDate, setPreferredContactStartDate] = useState(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), 8, 0, 0))
	const [preferredContactEndDate, setPreferredContactEndDate] = useState(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), 17, 0, 0))
	const [roaCurrentPromotions, setRoaCurrentPromotions] = useState('NO')
	const [roaMonthlyPremium, setRoaMonthlyPremium] = useState('NO')
	const [roaNewExistingClient, setRoaNewExistingClient] = useState('NEW')
	const [roaContractDuration, setRoaContractDuration] = useState('NO')
	const [roaFees, setRoaFees] = useState('NO')

	const [showAction, setShowAction] = useState(false)
	const [doSignatureAction, setDoSignatureAction] = useState(false)
	const [doUploadAction, setDoUploadAction] = useState(false)
	const [signaturePadDrawing, setSignaturePadDrawing] = useState(false)
	const [signatureValid, setSignatureValid] = useState(false)
	const [signatureImage, setSignatureImage] = useState('')

	const [documentValid, setDocumentValid] = useState(false)
	const [documentPage1Image, setDocumentPage1Image] = useState('')
	const [documentPage2Image, setDocumentPage2Image] = useState('')
	const [documentPage1ImageSet, setDocumentPage1ImageSet] = useState(false)
	const [documentPage2ImageSet, setDocumentPage2ImageSet] = useState(false)

	const [formValid, setFormValid] = useState('');
	const [modalVisible, setModalVisible] = useState(false);

	const [formFields, setFormFields] = useState(
		[
			{ 'id': 0, 'name': 'PersonalDetailsHeader' },
			{ 'id': 1, 'name': 'PersonalDetailsFName' },
			{ 'id': 2, 'name': 'PersonalDetailsLName' },
			{ 'id': 3, 'name': 'PersonalDetailsIDNumber' },
			{ 'id': 4, 'name': 'PersonalDetailsEmail' },
			{ 'id': 5, 'name': 'PersonalDetailsMobileNumber' },
			{ 'id': 7, 'name': 'PersonalDetailsHomeNumber' },
			{ 'id': 8, 'name': 'PersonalDetailsWorkNumber' },
			{ 'id': 9, 'name': 'BusinessDetailsHeader' },
			{ 'id': 10, 'name': 'BusinessDetailsName' },
			{ 'id': 11, 'name': 'BusinessDetailsVatNumber' },
			{ 'id': 12, 'name': 'AddressDetailsHeader' },
			{ 'id': 13, 'name': 'PhysicalAddressStreet' },
			{ 'id': 14, 'name': 'PhysicalAddressSuburb' },
			{ 'id': 15, 'name': 'PhysicalAddressCity' },
			{ 'id': 16, 'name': 'PhysicalAddressPCode' },
			{ 'id': 17, 'name': 'PhysicalAddressProvince' },
			{ 'id': 18, 'name': 'PhysicalAddressCountry' },
			{ 'id': 19, 'name': 'PhysicalandBillngAddressSame' },
			{ 'id': 20, 'name': 'BillingAddressStreet' },
			{ 'id': 21, 'name': 'BillingAddressSuburb' },
			{ 'id': 22, 'name': 'BillingAddressCity' },
			{ 'id': 23, 'name': 'BillingAddressPCode' },
			{ 'id': 24, 'name': 'BillingAddressProvince' },
			{ 'id': 25, 'name': 'BillingAddressCountry' },
			{ 'id': 26, 'name': 'RoAHeader' },
			{ 'id': 27, 'name': 'RoAContactTime' },
			{ 'id': 28, 'name': 'RoAPremium' },
			{ 'id': 29, 'name': 'RoAClientType' },
			{ 'id': 30, 'name': 'RoAContractDuration' },
			{ 'id': 31, 'name': 'RoAFees' },
			{ 'id': 32, 'name': 'AgreementsHeader' },
			{ 'id': 33, 'name': 'AgreementsTandC' },
			{ 'id': 34, 'name': 'AgreementsContactConsent' },
			{ 'id': 35, 'name': 'AgreementsUpfrontPayment' },
			{ 'id': 36, 'name': 'AgreementsNoUpfrontPaymentMade' },
			{ 'id': 37, 'name': 'SignatureCapture' },
			{ 'id': 38, 'name': 'SignatureFormSeperator' },
			{ 'id': 39, 'name': 'AppFormCapture' },
			{ 'id': 40, 'name': 'CancelButton' },
			{ 'id': 41, 'name': 'SubmitButton' },
		]
	);

	const { t } = useTranslation()
	const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()
	const theReseller = useReseller()

	const dispatch = useDispatch()

	const icon_height = 30;
	const item_margin_bottom = 20;
	const item_padding = 10;
	const item_size = icon_height + item_padding * 2 + item_margin_bottom;

	const isFirstRender = useRef(true);
	const isFirstRendered = useRef(true);
	const isFirstRendered1 = useRef(true);
	const actionSheetRef = useRef(null);
	const snapPoints = useMemo(() => ['46%', '52%']);

	const HEADER_MAX_HEIGHT = 240;
	const HEADER_MIN_HEIGHT = 48;
	const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

	const scrollY = useRef(new Animated.Value(0)).current;

	const headerTranslateY = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [0, -HEADER_SCROLL_DISTANCE],
		extrapolate: 'clamp',
	});

	const imageOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 1, 0],
		extrapolate: 'clamp',
	});
	const imageTranslateY = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 100],
		extrapolate: 'clamp',
	});

	const titleScale = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 1, 0.9],
		extrapolate: 'clamp',
	});

	const titleTranslateY = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
		outputRange: [140, 0, -8],
		extrapolate: 'clamp',
	});

	const headerNavTranslateY = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
		outputRange: [70, 20, 26],
		extrapolate: 'clamp',
	});

	const borderRadiusTransform = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
		outputRange: [20, 10, 0],
		extrapolate: 'clamp',
	});

	const mapStyle = [];
	const styles = StyleSheet.create({
		container: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			alignItems: 'center',
			justifyContent: 'flex-end',
		},
		mapStyle: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
		},
		suggestions: {
			padding: 0,
			marginLeft: 5,
			marginRight: 5,
			backgroundColor: Colors.white,
			marginTop: 5,
			marginBottom: 5,
		},
		suggestionsText: {
			flex: 1,
			marginLeft: 10,
			justifyContent: 'center',
		},
		item: {
			flexDirection: 'row',
			marginBottom: item_margin_bottom,
			borderRadius: 10,
			backgroundColor: '#fff',
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 10
			},
			shadowOpacity: .3,
			shadowRadius: 20,
			padding: item_padding,
			elevation: 20,
			justifyContent: 'center'
		},
		header: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			backgroundColor: Colors.primary,
			overflow: 'hidden',
			height: HEADER_MAX_HEIGHT,
			borderBottomLeftRadius: 20,
			borderBottomRightRadius: 20,
			zIndex: headerZIndex,
		},
		headerBackground: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			width: null,
			height: HEADER_MAX_HEIGHT,
			resizeMode: 'cover',
			zIndex: headerBackgroundZIndex,
		},
		topBar: {
			marginTop: 10,
			height: 40,
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			zIndex: headerBackgroundZIndex,
		},
		headerImage: {
			marginTop: 0,
			height: 40,
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			top: -90,
			left: 0,
			right: 0,
			zIndex: headerBackgroundZIndex,
		},
		headerLeftNav: {
			marginTop: 0,
			height: 40,
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			top: 0,
			left: -250,
			right: 0,
			zIndex: headerLeftNavZIndex,
		},
		signature: {
			flex: 1,
			borderColor: Colors.solitude,
			borderWidth: 1,
			borderRadius: 9,
		},
	});

	const [fields, setFieldsStatus] = useState();

	const [inputs, setInputs] = useState({
		clientFirstName: '',
		clientLastName: '',
		clientIDNumber: '',
		clientEmailAddress: '',
		clientMobileNumber: '',
		clientHomeNumber: '',
		clientWorkNumber: '',
		clientBusinessName: '',
		clientBusinessVATNumber: '',
		clientPhysicalAddressStreet: '',
		clientPhysicalAddressSuburb: '',
		clientPhysicalAddressCity: '',
		clientPhysicalAddressPCode: '',
		clientPhysicalAddressProvince: '',
		clientPhysicalAddressCountry: '',
		clientBillingAddressStreet: '',
		clientBillingAddressSuburb: '',
		clientBillingAddressCity: '',
		clientBillingAddressPCode: '',
		clientBillingAddressProvince: '',
		clientBillingAddressCountry: '',
		clientSignature: '',
		clientApplicationForm: '',
	});
	const handleOnchange = (text, input) => {

		setInputs(prevState => ({ ...prevState, [input]: text }));
	}
	const validState = (inputField, inputState) => {
		setFieldsStatus(prevState => ({ ...prevState, [inputField]: inputState }));
	};

	useEffect(() => {
		if (Object.keys(selectedPremise).length > 0) {
			const tmpAddressString = selectedPremise.full_text;
			let tmpAddressArray = tmpAddressString.split(',');
			let tmpAddressStreet = tmpAddressArray[0].trim() + " " + tmpAddressArray[1].trim();
			let tmpAddressSuburb = tmpAddressArray[2].trim();
			let tmpAddressCity = tmpAddressArray[3].trim();
			let tmpAddressPCode = tmpAddressArray[4].trim();
			let tmpAddressProvince = tmpAddressArray[5].trim();
			let tmpAddressCountry = 'South Africa';

			handleOnchange(tmpAddressStreet, 'clientPhysicalAddressStreet')
			handleOnchange(tmpAddressSuburb, 'clientPhysicalAddressSuburb')
			handleOnchange(tmpAddressCity, 'clientPhysicalAddressCity')
			handleOnchange(tmpAddressPCode, 'clientPhysicalAddressPCode')
			handleOnchange(tmpAddressProvince, 'clientPhysicalAddressProvince')
			handleOnchange(tmpAddressCountry, 'clientPhysicalAddressCountry')
			validState('Physical Address Street', true);
			validState('Physical Address Suburb', true);
			validState('Physical Address City', true);
			validState('Physical Address Postal Code', true);
			validState('Physical Address Province', true);
			validState('Physical Address Country', true);
		}
	}, [selectedPremise]);

	useEffect(() => {
		if (isFirstRendered.current) {
			isFirstRendered.current = false;
			return
		}//if
		else {
			setPreferredContactStartTime(preferredContactStartDate.toLocaleTimeString())
		}//else

	}, [preferredContactStartDate]);

	useEffect(() => {
		if (isFirstRendered1.current) {
			isFirstRendered1.current = false;
			return
		}//if
		else {
			setPreferredContactEndTime(preferredContactEndDate.toLocaleTimeString())
		}//else
	}, [preferredContactEndDate]);

	useEffect(() => {
		if (billingAdrressSameAsPhysical == true) {
			const tmpAddressStreet = inputs.clientPhysicalAddressStreet;
			const tmpAddressSuburb = inputs.clientPhysicalAddressSuburb;
			const tmpAddressCity = inputs.clientPhysicalAddressCity;
			const tmpAddressPCode = inputs.clientPhysicalAddressPCode;
			const tmpAddressProvince = inputs.clientPhysicalAddressProvince;
			const tmpAddressCountry = inputs.clientPhysicalAddressCountry;
			handleOnchange(tmpAddressStreet, 'clientBillingAddressStreet')
			handleOnchange(tmpAddressSuburb, 'clientBillingAddressSuburb')
			handleOnchange(tmpAddressCity, 'clientBillingAddressCity')
			handleOnchange(tmpAddressPCode, 'clientBillingAddressPCode')
			handleOnchange(tmpAddressProvince, 'clientBillingAddressProvince')
			handleOnchange(tmpAddressCountry, 'clientBillingAddressCountry')
			validState('Billing Address Street', true);
			validState('Billing Address Suburb', true);
			validState('Billing Address City', true);
			validState('Billing Address Postal Code', true);
			validState('Billing Address Province', true);
			validState('Billing Address Country', true);
		}
		else {
			handleOnchange('', 'clientBillingAddressStreet')
			handleOnchange('', 'clientBillingAddressSuburb')
			handleOnchange('', 'clientBillingAddressCity')
			handleOnchange('', 'clientBillingAddressPCode')
			handleOnchange('', 'clientBillingAddressProvince')
			handleOnchange('', 'clientBillingAddressCountry')
			validState('Billing Address Street', false);
			validState('Billing Address Suburb', false);
			validState('Billing Address City', false);
			validState('Billing Address Postal Code', false);
			validState('Billing Address Province', false);
			validState('Billing Address Country', false);
		}//else
	}, [billingAdrressSameAsPhysical]);

	useEffect(() => {
		if (doSignatureAction) {
			setShowAction(true)
			try {
				//actionSheetRef.current.open()
				setTimeout(() => actionSheetRef.current.snapToIndex(0), 1000);

			}//try
			catch (snapError) { }//catch

		}
		else if (doUploadAction) {
			setShowAction(true)
			try {
				//actionSheetRef.current.snapToPosition('58%')
				setTimeout(() => actionSheetRef.current.snapToIndex(1), 1000);
			}//try
			catch (snapError) { }//catch

		}
		else {
			setShowAction(false)
		}

	}, [doSignatureAction, doUploadAction]);

	useEffect(() => {
		if (documentPage1Image.length > 0) {
			setDocumentPage1ImageSet(true)
			if (documentPage2ImageSet) {
				setDocumentValid(true)
			}//if
		}//if
	}, [documentPage1Image]);

	useEffect(() => {
		if (documentPage2Image.length > 0) {
			setDocumentPage2ImageSet(true)
			if (documentPage1ImageSet) {
				setDocumentValid(true)
			}//if
		}//if
	}, [documentPage2Image]);

	//Theme
	const onChangeTheme = ({ theme, darkMode }) => {
		dispatch(changeTheme({ theme, darkMode }))
	}
	const sign = createRef();
	const saveSign = () => {
		sign.current.saveImage();
	};

	const resetSign = () => {
		setSignatureValid(false)
		sign.current.resetImage();
	};

	const _onSaveEvent = (result) => {
		if (result.encoded.length <= 840) {
			setSignatureValid(false)
			setSignaturePadDrawing(false);
		}//if
		else {
			setSignatureValid(true)
			const imageData = 'data:image/png;base64,' + result.encoded;
			//console.log(imageData);
			setSignatureImage(imageData)
			try {
				actionSheetRef.current.close()
			}//try
			catch (snapError) { }//catch
			setSignaturePadDrawing(false);
			setShowAction(false)
			setDoSignatureAction(false)
		}//else

	};

	const _onDragEvent = () => {
		setSignaturePadDrawing(true);
	};

	const openCameraUpload = (pageIndex) => {

		ImagePicker.openCamera({
			width: 1024,
			height: 1448,
			cropping: false,
			includeBase64: true,
			mediaType: 'photo',
		}).then(image => {

			if (pageIndex == 1) {
				const imageData = 'data:' + image.mime + ';base64,' + image.data;
				setDocumentPage1Image(imageData)
			}//if
			else if (pageIndex == 2) {
				const imageData = 'data:' + image.mime + ';base64,' + image.data;
				setDocumentPage2Image(imageData)
			}//else if
		})
			.catch(error => {

			});
	}

	const openDocumentUpload = (pageIndex) => {

		ImagePicker.openPicker({
			width: 1024,
			height: 1448,
			cropping: false,
			multiple: true,
			includeBase64: true,
			mediaType: 'photo',
		}).then(image => {
			if (image.length > 1) {
				const tmpPage1Image = image[0];
				const tmpPage2Image = image[1];
				const imageData1 = 'data:' + tmpPage1Image.mime + ';base64,' + tmpPage1Image.data;
				setDocumentPage1Image(imageData1)
				const imageData2 = 'data:' + tmpPage2Image.mime + ';base64,' + tmpPage2Image.data;
				setDocumentPage2Image(imageData2)
			}//if
			else {
				const tmpPageImage = image[0];
				if (pageIndex == 1) {
					const imageData = 'data:' + tmpPageImage.mime + ';base64,' + tmpPageImage.data;
					setDocumentPage1Image(imageData)
				}//if
				else if (pageIndex == 2) {
					const imageData = 'data:' + tmpPageImage.mime + ';base64,' + tmpPageImage.data;
					setDocumentPage2Image(imageData)
				}//else if
			}//else if


		})
			.catch(error => {

			});
	}

	const clearDocumentImage = (pageIndex) => {
		if (pageIndex == 1) {
			setDocumentPage1Image('')
			setDocumentPage1ImageSet(false)
			setDocumentValid(false)
		}//if
		else if (pageIndex == 2) {
			setDocumentPage2Image('')
			setDocumentPage2ImageSet(false)
			setDocumentValid(false)
		}//else if
	}

	const changeROAPromotions = (value) => {
		setRoaCurrentPromotions
		if (value == true) {
			setRoaCurrentPromotions('YES')
		}//if
		else if (value == false) {
			setRoaCurrentPromotions('NO')
		}//else if
	}

	const changeROAMonthlyPremiums = (value) => {
		if (value == true) {
			setRoaMonthlyPremium('YES')
		}//if
		else if (value == false) {
			setRoaMonthlyPremium('NO')
		}//else if
	}

	const changeROANewExistingClient = (value) => {
		if (value == true) {
			setRoaNewExistingClient('EXISTING')
		}//if
		else if (value == false) {
			setRoaNewExistingClient('NEW')
		}//else if
	}

	const changeROAContractDuration = (value) => {
		if (value == true) {
			setRoaContractDuration('YES')
		}//if
		else if (value == false) {
			setRoaContractDuration('NO')
		}//else if
	}

	const changeROAFees = (value) => {
		if (value == true) {
			setRoaFees('YES')
		}//if
		else if (value == false) {
			setRoaFees('NO')
		}//else if
	}

	const renderApplicationForm = ({ item, index }) => {
		try {
			if (item.name == "PersonalDetailsHeader") {
				return (
					<View style={[Layout.alignItemsStart, { height: 30 }]}>
						<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.semi_trans_black, }]}>{t('application_form_label_personal_details')}</Text>
					</View>
				);
			}//if
			else if (item.name == "PersonalDetailsFName") {
				return (
					<View>
						<CustomTextInput name="First Name" label="First Name" value={inputs.clientFirstName} onChangeText={text => handleOnchange(text, 'clientFirstName')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PersonalDetailsLName") {
				return (
					<View>
						<CustomTextInput name="Last Name" label="Last Name" value={inputs.clientLastName} onChangeText={text => handleOnchange(text, 'clientLastName')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PersonalDetailsIDNumber") {
				return (
					<View>
						<CustomTextInput name="ID Number" label="ID Number" value={inputs.clientIDNumber} onChangeText={text => handleOnchange(text, 'clientIDNumber')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PersonalDetailsEmail") {
				return (
					<View>
						<CustomTextInput name="Email Address" label="Email Address" value={inputs.clientEmailAddress} onChangeText={text => handleOnchange(text, 'clientEmailAddress')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PersonalDetailsMobileNumber") {
				return (
					<View>
						<CustomTextInput name="Mobile Number" label="Mobile Number" value={inputs.clientMobileNumber} onChangeText={text => handleOnchange(text, 'clientMobileNumber')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PersonalDetailsHomeNumber") {
				return (
					<View>
						<CustomTextInput name="Home Number" label="Home Number" value={inputs.clientHomeNumber} onChangeText={text => handleOnchange(text, 'clientHomeNumber')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={false} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PersonalDetailsWorkNumber") {
				return (
					<View>
						<CustomTextInput name="Work Number" label="Work Number" value={inputs.clientWorkNumber} onChangeText={text => handleOnchange(text, 'clientWorkNumber')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={false} validState={validState} />
						<View style={[{ height: 22 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "BusinessDetailsHeader") {
				return (
					<View style={[Layout.alignItemsStart, { height: 30 }]}>
						<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.semi_trans_black, }]}>{t('application_form_label_business_details')}</Text>
					</View>
				);
			}//else if
			else if (item.name == "BusinessDetailsName") {
				return (
					<View>
						<CustomTextInput name="Business Name" label="Business Name" value={inputs.clientBusinessName} onChangeText={text => handleOnchange(text, 'clientBusinessName')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={false} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "BusinessDetailsVatNumber") {
				return (
					<View>
						<CustomTextInput name="VAT Number" label="VAT Number (If Applicable)" value={inputs.clientBusinessVATNumber} onChangeText={text => handleOnchange(text, 'clientBusinessVATNumber')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={false} validState={validState} />
						<View style={[{ height: 20 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "AddressDetailsHeader") {
				return (
					<View style={[Layout.alignItemsStart, { height: 30 }]}>
						<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.semi_trans_black, }]}>{t('application_form_label_address_details')}</Text>
					</View>
				);
			}//else if
			else if (item.name == "PhysicalAddressStreet") {
				return (
					<View>
						<CustomTextInput name="Physical Address Street" label="Physical Address Street" value={inputs.clientPhysicalAddressStreet} onChangeText={text => handleOnchange(text, 'clientPhysicalAddressStreet')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PhysicalAddressSuburb") {
				return (
					<View>
						<CustomTextInput name="Physical Address Suburb" label="Physical Address Suburb" value={inputs.clientPhysicalAddressSuburb} onChangeText={text => handleOnchange(text, 'clientPhysicalAddressSuburb')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PhysicalAddressCity") {
				return (
					<View>
						<CustomTextInput name="Physical Address City" label="Physical Address City" value={inputs.clientPhysicalAddressCity} onChangeText={text => handleOnchange(text, 'clientPhysicalAddressCity')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PhysicalAddressPCode") {
				return (
					<View>
						<CustomTextInput name="Physical Address Postal Code" label="Physical Address Postal Code" value={inputs.clientPhysicalAddressPCode} onChangeText={text => handleOnchange(text, 'clientPhysicalAddressPCode')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PhysicalAddressProvince") {
				return (
					<View>
						<CustomTextInput name="Physical Address Province" label="Physical Address Province" value={inputs.clientPhysicalAddressProvince} onChangeText={text => handleOnchange(text, 'clientPhysicalAddressProvince')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PhysicalAddressCountry") {
				return (
					<View>
						<CustomTextInput name="Physical Address Country" label="Physical Address Country" value={inputs.clientPhysicalAddressCountry} onChangeText={text => handleOnchange(text, 'clientPhysicalAddressCountry')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 18 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "PhysicalandBillngAddressSame") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.regularVPadding, Gutters.tinyHPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<BouncyCheckbox
							size={35}
							fillColor={Colors.primary}
							unfillColor={Colors.dark_white}
							text={t('billing_address_same_as_physical')}
							iconStyle={{ borderColor: Colors.dark_white }}
							innerIconStyle={{ borderWidth: 2 }}
							textStyle={{ fontFamily: "Montserrat-Regular" }}
							onPress={(billingAdrressSameAsPhysical) => { setBillingAddressSameAsPhysical(!!billingAdrressSameAsPhysical) }}
							disableText={true}
						/>
						<Text style={[Gutters.smallLMargin, Fonts.black_text, Fonts.montserrat_regular, Fonts.textSmall, { textAlign: 'right' }]}>{t('billing_address_same_as_physical')}</Text>
					</View>
				);
			}//else if
			else if (item.name == "BillingAddressStreet") {
				return (
					<View>
						<CustomTextInput name="Billing Address Street" label="Billing Address Street" value={inputs.clientBillingAddressStreet} onChangeText={text => handleOnchange(text, 'clientBillingAddressStreet')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "BillingAddressSuburb") {
				return (
					<View>
						<CustomTextInput name="Billing Address Suburb" label="Billing Address Suburb" value={inputs.clientBillingAddressSuburb} onChangeText={text => handleOnchange(text, 'clientBillingAddressSuburb')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "BillingAddressCity") {
				return (
					<View>
						<CustomTextInput name="Billing Address City" label="Billing Address City" value={inputs.clientBillingAddressCity} onChangeText={text => handleOnchange(text, 'clientBillingAddressCity')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "BillingAddressPCode") {
				return (
					<View>
						<CustomTextInput name="Billing Address Postal Code" label="Billing Address Postal Code" value={inputs.clientBillingAddressPCode} onChangeText={text => handleOnchange(text, 'clientBillingAddressPCode')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "BillingAddressProvince") {
				return (
					<View>
						<CustomTextInput name="Billing Address Province" label="Billing Address Province" value={inputs.clientBillingAddressProvince} onChangeText={text => handleOnchange(text, 'clientBillingAddressProvince')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "BillingAddressCountry") {
				return (
					<View>
						<CustomTextInput name="Billing Address Country" label="Billing Address Country" value={inputs.clientBillingAddressCountry} onChangeText={text => handleOnchange(text, 'clientBillingAddressCountry')} lblBgColor={Colors.dark_white} isPassword={false} requiredField={true} validState={validState} />
						<View style={[{ height: 20 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "RoAHeader") {
				return (
					<View style={[Layout.alignItemsStart, { height: 20 }]}>
						<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.black, }]}>{t('application_form_record_of_advice_label')}</Text>
					</View>
				);
			}//else if
			else if (item.name == "RoAContactTime") {
				return (
					<View style={[Layout.fullWidth, Layout.colHCenter, Gutters.tinyVPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<View style={[Layout.alignItemsStart]}>
							<Text style={[Fonts.textSmall, Fonts.montserrat_regular, Fonts.textCenter, { color: Colors.black, }]}>{t('application_form_roa_preferred_contact_time')}</Text>
						</View>
						<View style={[Layout.colCenter, Gutters.tinyTMargin]}>
							<Text style={[Fonts.textRegular, Fonts.montserrat_regular, Fonts.textCenter, { color: Colors.semi_trans_black, }]}>{t('between')}</Text>
							<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.secondary, }]} onPress={() => setShowStartTimePicker(true)}>{preferredContactStartTime}</Text>
							<Text style={[Fonts.textRegular, Fonts.montserrat_regular, Fonts.textCenter, { color: Colors.semi_trans_black, }]}>{t('and')}</Text>
							<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.secondary, }]} onPress={() => setShowEndTimePicker(true)}>{preferredContactEndTime}</Text>
						</View>
					</View>
				);
			}//else if
			else if (item.name == "RoAPromotions") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<View style={[Layout.colHCenter, { width: '65%' }]}>
							<Text style={[Fonts.montserrat_regular, Fonts.textSmall, Gutters.tinyRMargin, { color: Colors.black, }]}>{t('application_form_roa_promotions')}</Text>
						</View>
						<View style={[Layout.center, { width: '35%' }]}>
							<ToggleSwitch
								text={{ on: 'YES', off: 'NO', activeTextColor: Colors.white, inactiveTextColor: Colors.white }}
								textStyle={[Fonts.textSmall, { fontFamily: "Montserrat-Bold", color: Colors.white }]}
								color={{ indicator: 'white', active: Colors.primary, inactive: Colors.secondary, activeBorder: Colors.primary, inactiveBorder: Colors.secondary }}
								active={false}
								disabled={false}
								width={60}
								radius={18}
								onValueChange={(val) => {
									/* your handler function... */
									changeROAPromotions(val)

								}}
							/>
						</View>
					</View>
				);
			}//else if
			else if (item.name == "RoAPremium") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<View style={[Layout.colHCenter, { width: '65%' }]}>
							<Text style={[Fonts.montserrat_regular, Fonts.textSmall, Gutters.tinyRMargin, { color: Colors.black, }]}>{t('application_form_roa_monthly_premium')}</Text>
						</View>
						<View style={[Layout.center, { width: '35%' }]}>
							<ToggleSwitch
								text={{ on: 'YES', off: 'NO', activeTextColor: Colors.white, inactiveTextColor: Colors.white }}
								textStyle={[Fonts.textSmall, { fontFamily: "Montserrat-Bold", color: Colors.white }]}
								color={{ indicator: 'white', active: Colors.primary, inactive: Colors.secondary, activeBorder: Colors.primary, inactiveBorder: Colors.secondary }}
								active={false}
								disabled={false}
								width={60}
								radius={18}
								onValueChange={(val) => {
									/* your handler function... */
								}}
							/>
						</View>
					</View>
				);
			}//else if
			else if (item.name == "RoAClientType") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<View style={[Layout.colHCenter, { width: '65%' }]}>
							<Text style={[Fonts.montserrat_regular, Fonts.textSmall, Gutters.tinyRMargin, { color: Colors.black, }]}>{t('application_form_roa_new_or_existing')}</Text>
						</View>
						<View style={[Layout.center, { width: '35%' }]}>
							<ToggleSwitch
								text={{ on: 'EXISTING', off: 'NEW', activeTextColor: Colors.white, inactiveTextColor: Colors.white }}
								textStyle={[Fonts.textSmall, { fontFamily: "Montserrat-Bold", color: Colors.white }]}
								color={{ indicator: 'white', active: Colors.primary, inactive: Colors.secondary, activeBorder: Colors.primary, inactiveBorder: Colors.secondary }}
								active={false}
								disabled={false}
								width={60}
								radius={18}
								onValueChange={(val) => {
									/* your handler function... */
								}}
							/>
						</View>
					</View>
				);
			}//else if
			else if (item.name == "RoAContractDuration") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<View style={[Layout.colHCenter, { width: '65%' }]}>
							<Text style={[Fonts.montserrat_regular, Fonts.textSmall, Gutters.tinyRMargin, { color: Colors.black, }]}>{t('application_form_roa_contract_duration')}</Text>
						</View>
						<View style={[Layout.center, { width: '35%' }]}>
							<ToggleSwitch
								text={{ on: 'YES', off: 'NO', activeTextColor: Colors.white, inactiveTextColor: Colors.white }}
								textStyle={[Fonts.textSmall, { fontFamily: "Montserrat-Bold", color: Colors.white }]}
								color={{ indicator: 'white', active: Colors.primary, inactive: Colors.secondary, activeBorder: Colors.primary, inactiveBorder: Colors.secondary }}
								active={false}
								disabled={false}
								width={60}
								radius={18}
								onValueChange={(val) => {
									/* your handler function... */
								}}
							/>
						</View>
					</View>
				);
			}//else if
			else if (item.name == "RoAFees") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<View style={[Layout.colHCenter, { width: '65%' }]}>
							<Text style={[Fonts.montserrat_regular, Fonts.textSmall, Gutters.tinyRMargin, { color: Colors.black, }]}>{t('application_form_roa_fees')}</Text>
						</View>
						<View style={[Layout.center, { width: '35%' }]}>
							<ToggleSwitch
								text={{ on: 'YES', off: 'NO', activeTextColor: Colors.white, inactiveTextColor: Colors.white }}
								textStyle={[Fonts.textSmall, { fontFamily: "Montserrat-Bold", color: Colors.white }]}
								color={{ indicator: 'white', active: Colors.primary, inactive: Colors.secondary, activeBorder: Colors.primary, inactiveBorder: Colors.secondary }}
								active={false}
								disabled={false}
								width={60}
								radius={18}
								onValueChange={(val) => {
									/* your handler function... */
								}}
							/>
						</View>
					</View>
				);
			}//else if
			else if (item.name == "AgreementsHeader") {
				return (
					<View>
						<View style={[{ height: 12 }]}></View>
						<View style={[Layout.alignItemsStart, { height: 30 }]}>
							<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.semi_trans_black, }]}>{t('application_form_label_agreements_details')}</Text>
						</View>
					</View>
				);
			}//else if
			else if (item.name == "AgreementsTandC") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.smallHPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<BouncyCheckbox
							size={35}
							fillColor={Colors.primary}
							unfillColor={Colors.dark_white}
							text={t('application_form_t_and_c')}
							iconStyle={{ borderColor: Colors.dark_white }}
							innerIconStyle={{ borderWidth: 2 }}
							textStyle={{ fontFamily: "Montserrat-Regular" }}
							onPress={(clientTandCAccepted) => { setClientTandCAccepted(!!clientTandCAccepted) }}
							disableText={true}
						/>
						<Text style={[Gutters.smallLMargin, Fonts.black_text, Fonts.montserrat_regular, Fonts.textSmall, { textAlign: 'left', maxWidth: '90%' }]}>{t('application_form_t_and_c')}</Text>
					</View>
				);
			}//else if
			else if (item.name == "AgreementsContactConsent") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.smallHPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<BouncyCheckbox
							size={35}
							fillColor={Colors.primary}
							unfillColor={Colors.dark_white}
							text={t('application_form_consent')}
							iconStyle={{ borderColor: Colors.dark_white }}
							innerIconStyle={{ borderWidth: 2 }}
							textStyle={{ fontFamily: "Montserrat-Regular" }}
							onPress={(clientPOPIAgreement) => { setClientPOPIAgreement(!!clientPOPIAgreement) }}
							disableText={true}
						/>
						<Text style={[Gutters.smallLMargin, Fonts.black_text, Fonts.montserrat_regular, Fonts.textSmall, { textAlign: 'left', maxWidth: '90%' }]}>{t('application_form_consent')}</Text>
					</View>
				);
			}//else if
			else if (item.name == "AgreementsUpfrontPayment") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.smallHPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<BouncyCheckbox
							size={35}
							fillColor={Colors.primary}
							unfillColor={Colors.dark_white}
							text={t('application_form_upfront_payment')}
							iconStyle={{ borderColor: Colors.dark_white }}
							innerIconStyle={{ borderWidth: 2 }}
							textStyle={{ fontFamily: "Montserrat-Regular" }}
							onPress={(clientAgreedUpfrontPaymentRequest) => { setClientAgreedUpfrontPaymentRequest(!!clientAgreedUpfrontPaymentRequest) }}
							disableText={true}
						/>
						<Text style={[Gutters.smallLMargin, Fonts.black_text, Fonts.montserrat_regular, Fonts.textSmall, { textAlign: 'left', maxWidth: '90%' }]}>{t('application_form_upfront_payment')}</Text>
					</View>
				);
			}//else if
			else if (item.name == "AgreementsNoUpfrontPaymentMade") {
				return (
					<View style={[Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVPadding, Gutters.smallHPadding, Gutters.smallTMargin, { flex: 1 }]}>
						<BouncyCheckbox
							size={35}
							fillColor={Colors.primary}
							unfillColor={Colors.dark_white}
							text={t('application_form_not_made_upfront_payment')}
							iconStyle={{ borderColor: Colors.dark_white }}
							innerIconStyle={{ borderWidth: 2 }}
							textStyle={{ fontFamily: "Montserrat-Regular" }}
							onPress={(clientNoUpfrontPaymentMade) => { setClientNoUpfrontPaymentMade(!!clientNoUpfrontPaymentMade) }}
							disableText={true}
						/>
						<Text style={[Gutters.smallLMargin, Fonts.black_text, Fonts.montserrat_regular, Fonts.textSmall, { textAlign: 'left', maxWidth: '90%' }]}>{t('application_form_not_made_upfront_payment')}</Text>
					</View>
				);
			}//else if
			else if (item.name == "SignatureCapture") {
				return (
					<View>
						<View style={[{ height: 12 }]}></View>
						<TouchableOpacity onPress={() => {
							setDoUploadAction(false)
							setDoSignatureAction(true)
						}
						}>
							<View style={[{ height: 80 }, Layout.column]}>

								<View style={[{ height: 40, borderBottomWidth: 2, borderBottomColor: Colors.semi_trans_black }, Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVMargin]}>
									<View style={[{ position: 'absolute', top: 2, right: 2 }]}>
										{signatureValid ?
											(<FontAwesomeIcon icon="fa-circle-check" color={Colors.success} size={20} />)
											:
											(<FontAwesomeIcon icon="fa-asterisk" color={Colors.secondary} size={10} />)
										}

									</View>
									<View style={{ alignItems: "center", position: 'relative', left: 4, top: 12, alignItems: "flex-start", height: 40 }}>

										<View>
											<FontAwesomeIcon icon="fa-pen-nib" color={Colors.semi_trans_black} size={25} />
										</View>

									</View>
									<View>
										{signatureValid ?
											(
												<Image style={[Layout.colCenter, { width: '94%', aspectRatio: 6, borderRadius: 0, borderColor: Colors.solitude, borderWidth: 0, alignContent: 'center', justifyContent: 'center', resizeMode: 'contain' }]} source={{ uri: signatureImage }}></Image>
											)
											:
											(<Text style={[Fonts.textTiny, Fonts.montserrat_regular, Fonts.textCenter, { color: Colors.semi_trans_black, position: 'relative', left: 24, top: 16, alignItems: "flex-start", height: 40 }]}>{t('application_form_label_signature_instruction')}</Text>)
										}
									</View>
								</View>


								<View style={[Layout.alignItemsStart, { height: 30 }]}>
									<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.semi_trans_black, }]}>{t('application_form_label_signature')}</Text>
								</View>
							</View>
						</TouchableOpacity>
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "SignatureFormSeperator") {
				return (
					<View>
						<View style={[Layout.alignItemsCenter, { height: 30 }]}>
							<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.secondary, }]}>{t('or')}</Text>
						</View>
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "AppFormCapture") {
				return (
					<View>
						<TouchableOpacity onPress={() => {
							setDoSignatureAction(false)
							setDoUploadAction(true)
						}
						}>
							<View style={[{ height: 80 }, Layout.column]}>

								<View style={[{ height: 40, borderBottomWidth: 2, borderBottomColor: Colors.semi_trans_black }, Layout.fullWidth, Layout.rowHCenter, Gutters.tinyVMargin]}>
									<View style={[{ position: 'absolute', top: 2, right: 2 }]}>
										{documentValid ?
											(<FontAwesomeIcon icon="fa-circle-check" color={Colors.success} size={20} />)
											:
											(<FontAwesomeIcon icon="fa-asterisk" color={Colors.secondary} size={10} />)
										}

									</View>
									<View style={{ alignItems: "center", position: 'relative', left: 4, top: 12, alignItems: "flex-start", height: 40 }}>

										<View>
											<FontAwesomeIcon icon="fa-file-import" color={Colors.semi_trans_black} size={25} />
										</View>

									</View>
									<View>
										{documentValid ?
											(
												documentThumbnails
											)
											:
											(
												uploadPlaceholder
											)
										}
									</View>
								</View>

								<View style={[Layout.alignItemsStart, { height: 30 }]}>
									<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.semi_trans_black, }]}>{t('application_form_label_document')}</Text>
								</View>
							</View>
						</TouchableOpacity >
						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
			else if (item.name == "CancelButton") {
				return (
					<TouchableOpacity
						style={[Gutters.tinyBMargin, Gutters.regularTMargin, Gutters.regularHPadding, Layout.fullWidth, { height: 50, }]}
						onPress={() => {
							navigation.reset({
								index: 0,
								routes: [{ name: "Reseller Package Selector" }]
							});
							navigation.reset({
								index: 0,
								routes: [{ name: "Reseller Map View" }]
							});
							navigate('Reseller Home', { screen: 'Reseller Map View' })
						}
						}
					>
						<View style={[Layout.colCenter, { backgroundColor: Colors.transparent, borderColor: Colors.primary, borderWidth: 2, borderRadius: 30, height: '100%' }]}>
							<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.primary }]}>{t('cancel_button_label')}</Text>
						</View>
					</TouchableOpacity>
				);
			}//else if
			else if (item.name == "SubmitButton") {
				return (
					<View>
						<TouchableOpacity
							style={[Gutters.regularBMargin, Gutters.tinyTMargin, Gutters.regularHPadding, Layout.fullWidth, { height: 50, }]}
							onPress={() => { validateForm() }
							}
						>
							<LinearGradient colors={[Colors.primary_gradient_start, Colors.primary_gradient_mid]} style={[Common.button.rounded, Layout.colCenter, { height: '100%' }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
								<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.white_text]}>{t('submit_button_label')}</Text>
							</LinearGradient>
						</TouchableOpacity>

						<View style={[{ height: 12 }]}></View>
					</View>
				);
			}//else if
		}//try
		catch (applicationFormItemException) {
			return ''
		}//catch
	}

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return
		}//if
		if (formValid == 'false') {
			setInvalidPopupText(t('form_invalid_text'))
			setFormValid('')
			setModalVisible(true);
		}//if
		else if (formValid == 'true') {
			let clientAgreementsValid = false;
			let clientDocumentsValid = false;
			let clientSignatureValid = false;
			if (clientTandCAccepted == false || clientPOPIAgreement == false || clientAgreedUpfrontPaymentRequest == false || clientNoUpfrontPaymentMade == false) {
				clientAgreementsValid = false;
			}//if
			else {
				clientAgreementsValid = true;
			}//else
			if (documentPage1ImageSet == false || documentPage2ImageSet == false) {
				clientDocumentsValid = false
			}//if
			else {
				clientDocumentsValid = true
			}//else
			if (signatureValid == false || clientDocumentsValid == false || clientAgreementsValid == false) {

				if ((signatureValid == true && clientDocumentsValid == false) || (signatureValid == false && clientDocumentsValid == true)) {
					if (preferredContactStartTime == "Select Time" || preferredContactEndTime == "Select Time") {
						setInvalidPopupText(t('form_roa_invalid'))
						setFormValid('')
						setModalVisible(true);
					}//if
					else {
						setFormValid('true')
						setModalVisible(false);
						resellerSubmitApplication()
					}//else

				}//if
				else {
					if (clientAgreementsValid == false) {
						setInvalidPopupText(t('form_agreements_invalid_text'))
						setFormValid('')
						setModalVisible(true);
					}//if
					else if (signatureValid == false && clientDocumentsValid == false) {
						setInvalidPopupText(t('form_signature_invalid_text'))
						setFormValid('')
						setModalVisible(true);
					}//else if
				}//else
			}//if
			else {
				setFormValid('true')
				setModalVisible(false);
				resellerSubmitApplication()
			}
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

	const resellerSubmitApplication = () => {
		//navigate('Reseller Document', { screen: 'Reseller Document Upload', params: { 'selectedPremise': selectedPremise, 'packages': allThePackages, 'package': selectedPackage, 'allPackagesLoaded': true } })
		navigate('Reseller Document', { screen: 'Reseller Document Upload', params: { 'allPackagesLoaded': true } })
	}

	const applicationFields =

		<FlashList
			data={formFields}
			renderItem={renderApplicationForm}
			estimatedItemSize={120}
			//ListHeaderComponent={ispList}
			//ListHeaderComponentStyle={{ height: 300 }}
			onScroll={({ nativeEvent }) => {
				scrollY.setValue(nativeEvent.contentOffset.y);
			}
			}
			//onEndReached={() => { loadMorePackages() }}
			//onEndReachedThreshold={0}
			contentContainerStyle={{ paddingBottom: 20, paddingTop: 250, paddingLeft: 20, paddingRight: 20,}}
			disableAutoLayout={true}
			keyExtractor={(item, index) => index}
			extraData={(item, index) => index}
		/>

	const sheetSignatureContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
		<View style={[Layout.fullWidth, Layout.row]} >
			<TouchableOpacity
				style={[Common.button.backgroundReset, { position: 'absolute', right: 8 }]}
				onPress={() => { setSignaturePadDrawing(false); resetSign(); }}
			>
				<Text style={[Fonts.textRegular, Fonts.montserrat_regular, { color: Colors.primary }]}>{t('signature_clear')}</Text>
			</TouchableOpacity>
		</View>
		<View style={[Layout.fullWidth, Gutters.regularVPadding, Gutters.tinyTMargin, Gutters.tinyBMargin]}>
			<View style={[{ height: 200 }]}>
				<View style={[Layout.fullSize, Layout.center, { backgroundColor: Colors.white, position: 'absolute', top: 0 }]}>
					{signaturePadDrawing ?
						(null) : (<FontAwesomeIcon icon="fa-signature" color={Colors.dark_white} size={250} />)}

				</View>
				<SignatureCapture
					style={styles.signature}
					ref={sign}
					showBorder={false}
					onSaveEvent={_onSaveEvent}
					onDragEvent={_onDragEvent}
					showNativeButtons={false}
					showTitleLabel={true}
					viewMode={'portrait'}
					minStrokeWidth={4}
					maxStrokeWidth={4}
					backgroundColor='transparent'
				//backgroundColor={signaturePadDrawing ? '#ffffff' : 'transparent'}
				/>
			</View>
		</View>
		<View style={[Layout.fullWidth, Layout.rowVCenter]}>
			<TouchableWithoutFeedback onPress={() => {
				setDoSignatureAction(false)
				setShowAction(false)
				setSignaturePadDrawing(false)
				try {
					actionSheetRef.current.close()
				}//try
				catch (snapError) { }//catch
			}}>
				<View style={[Layout.colCenter, { backgroundColor: Colors.transparent, borderColor: Colors.primary, borderWidth: 2, borderRadius: 25, height: 50, paddingHorizontal: 8, marginHorizontal: 8, minWidth: 150, }]}>
					<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.primary }]}>{t('cancel_button_label')}</Text>
				</View>

			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback onPress={() => {
				saveSign();
				//setDoSignatureAction(false)
				//setShowAction(false)
				//try {
				//actionSheetRef.current.close()
				//}//try
				//catch (snapError) { }//catch
			}}>
				<View style={[Layout.colCenter, { backgroundColor: Colors.primary, borderColor: Colors.primary, borderWidth: 2, borderRadius: 25, height: 50, paddingHorizontal: 8, marginHorizontal: 8, minWidth: 150, }]}>
					<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.white }]}>{t('save_button_label')}</Text>
				</View>

			</TouchableWithoutFeedback>
		</View>
	</View>;

	const sheetUploadContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
		<View style={[Layout.fullWidth, Layout.row, Gutters.regularBPadding]} >
			<TouchableOpacity
				style={[Common.button.backgroundReset, { position: 'absolute', right: 8 }]}
				onPress={() => {
					setDoSignatureAction(false)
					setDoUploadAction(false)
					//setDocumentPage1ImageSet(false)
					//setDocumentPage2ImageSet(false)

					//setDocumentPage1Image('')
					//setDocumentPage2Image('')
					//setDocumentValid(false)
					try {
						actionSheetRef.current.close()
					}//try
					catch (snapError) { }//catch
				}}
			>
				<Text style={[Fonts.textRegular, Fonts.montserrat_regular, { color: Colors.primary }]}>{t('upload_close')}</Text>
			</TouchableOpacity>
		</View>
		<View style={[Layout.rowCenter, Layout.fullWidth, Gutters.regularVMargin, { minHeight: 260 }]}>
			<View style={[Layout.col, Layout.fullHeight, { width: '50%', backgroundColor: Colors.solitude, borderRadius: 10, borderColor: Colors.primary, borderWidth: 0, }, Gutters.tinyHMargin]}>
				{documentPage1ImageSet ?
					(
						<View style={[Layout.colCenter, { width: '98%', height: 260, position: 'absolute', top: 0, left: '1%' }]}>

							<Image style={[Layout.colCenter, { width: (screenWidth / 2) - screenWidth * 0.02, aspectRatio: 0.74, borderRadius: 10, borderColor: Colors.solitude, borderWidth: 0, alignContent: 'center', justifyContent: 'center', resizeMode: 'contain' }]} source={{ uri: documentPage1Image }}></Image>
							<TouchableWithoutFeedback onPress={() => {
								clearDocumentImage(1)
							}}>
								<View style={[Layout.colCenter, { backgroundColor: Colors.thirty_trans_black, borderColor: Colors.primary, borderWidth: 0, borderRadius: 20, height: 40, width: 40, position: 'absolute', top: 6, right: 0 }]}>
									<FontAwesomeIcon icon="fa-times" color={Colors.white} size={26} />
								</View>

							</TouchableWithoutFeedback>
						</View>
					)
					:
					(
						<View style={[Layout.colCenter, { minHeight: 200 }]}>
							<View>
								<FontAwesomeIcon icon="fa-1" color={Colors.thirty_trans_black} size={80} />
							</View>
							<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.thirty_trans_black }, Gutters.tinyTMargin]}>{t('page_label')}</Text>
						</View>
					)
				}

				<View style={[Layout.rowVCenter, Gutters.tinyTMargin, { height: 50, width: '100%', bottom: 2, position: 'absolute' }]}>

					<TouchableWithoutFeedback onPress={() => {
						openDocumentUpload(1)
					}}>
						<View style={[Layout.colCenter, { backgroundColor: Colors.thirty_trans_black, borderColor: Colors.primary, borderWidth: 0, borderRadius: 20, height: 40, width: 40, position: 'absolute', bottom: 4, left: 2 }]}>
							<FontAwesomeIcon icon="fa-file-image" color={Colors.white} size={26} />
						</View>

					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback onPress={() => {
						openCameraUpload(1)
					}}>
						<View style={[Layout.colCenter, { backgroundColor: Colors.thirty_trans_black, borderColor: Colors.primary, borderWidth: 0, borderRadius: 20, height: 40, width: 40, position: 'absolute', bottom: 4, right: 2 }]}>
							<FontAwesomeIcon icon="fa-camera" color={Colors.white} size={26} />

						</View>

					</TouchableWithoutFeedback>

				</View>
			</View>
			<View style={[Layout.col, Layout.fullHeight, { width: '50%', backgroundColor: Colors.solitude, borderRadius: 10, borderColor: Colors.primary, borderWidth: 0, }, Gutters.tinyHMargin]}>
				{documentPage2ImageSet ?
					(
						<View style={[Layout.colCenter, { width: '98%', height: 260, position: 'absolute', top: 0, left: '1%' }]}>

							<Image style={[Layout.colCenter, { width: (screenWidth / 2) - screenWidth * 0.02, aspectRatio: 0.74, borderRadius: 10, borderColor: Colors.solitude, borderWidth: 0, alignContent: 'center', justifyContent: 'center', resizeMode: 'contain' }]} source={{ uri: documentPage2Image }}></Image>
							<TouchableWithoutFeedback onPress={() => {
								clearDocumentImage(2)
							}}>
								<View style={[Layout.colCenter, { backgroundColor: Colors.thirty_trans_black, borderColor: Colors.primary, borderWidth: 0, borderRadius: 20, height: 40, width: 40, position: 'absolute', top: 6, right: 0 }]}>
									<FontAwesomeIcon icon="fa-times" color={Colors.white} size={26} />
								</View>

							</TouchableWithoutFeedback>
						</View>
					)
					:
					(
						<View style={[Layout.colCenter, { minHeight: 200 }]}>
							<View>
								<FontAwesomeIcon icon="fa-2" color={Colors.thirty_trans_black} size={80} />
							</View>
							<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.thirty_trans_black }, Gutters.tinyTMargin]}>{t('page_label')}</Text>
						</View>
					)
				}
				<View style={[Layout.rowVCenter, Gutters.tinyTMargin, { height: 50, width: '100%', bottom: 2, position: 'absolute' }]}>

					<TouchableWithoutFeedback onPress={() => {
						openDocumentUpload(2)
					}}>
						<View style={[Layout.colCenter, { backgroundColor: Colors.thirty_trans_black, borderColor: Colors.primary, borderWidth: 0, borderRadius: 20, height: 40, width: 40, position: 'absolute', bottom: 4, left: 2 }]}>
							<FontAwesomeIcon icon="fa-file-image" color={Colors.white} size={26} />

						</View>

					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback onPress={() => {
						openCameraUpload(2)
					}}>
						<View style={[Layout.colCenter, { backgroundColor: Colors.thirty_trans_black, borderColor: Colors.primary, borderWidth: 0, borderRadius: 20, height: 40, width: 40, position: 'absolute', bottom: 4, right: 2 }]}>
							<FontAwesomeIcon icon="fa-camera" color={Colors.white} size={26} />

						</View>

					</TouchableWithoutFeedback>

				</View>
			</View>
		</View >
		<View style={[Layout.fullWidth, Layout.rowVCenter]}>
			<TouchableWithoutFeedback onPress={() => {
				setDoSignatureAction(false)
				setDoUploadAction(false)
				try {
					actionSheetRef.current.close()
				}//try
				catch (snapError) { }//catch
			}}>
				<View style={[Layout.colCenter, { backgroundColor: Colors.primary, borderColor: Colors.primary, borderWidth: 2, borderRadius: 25, height: 50, paddingHorizontal: 8, marginHorizontal: 8, minWidth: '90%', }]}>
					<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.white }]}>{t('save_button_label')}</Text>
				</View>

			</TouchableWithoutFeedback>
		</View>
	</View >;

	const actionSheet = <BottomSheet
		ref={actionSheetRef}
		//initialSnapIndex={0}
		snapPoints={snapPoints}
		style={[{ backgroundColor: Colors.transparent }]}
		handleIndicatorStyle={[{ display: 'none' }]}
		enableOverDrag={false}
		enableContentPanningGesture={false}
		enableHandlePanningGesture={false}
	>
		{doSignatureAction ? (
			sheetSignatureContent
		) : (
			null
		)}
		{doUploadAction ? (
			sheetUploadContent
		)
			: (
				null
			)}
	</BottomSheet>;

	const uploadPlaceholder = <View>
		<Text style={[Fonts.textTiny, Fonts.montserrat_regular, Fonts.textCenter, { color: Colors.semi_trans_black, position: 'relative', left: 24, top: 16, alignItems: "flex-start", height: 40 }]}>{t('application_form_label_document_instruction')}</Text>
	</View>;

	const documentThumbnails =
		<View style={[Layout.rowCenter, Layout.fullWidth, Gutters.regularBPadding, { top: -4 }]}>
			<View style={[Layout.alignItemsCenter, { width: '40%', right: -8 }]}>
				<Image style={[{ width: '30%', aspectRatio: 0.74, borderRadius: 10, borderColor: Colors.solitude, borderWidth: 0, alignContent: 'center', justifyContent: 'center', resizeMode: 'contain' }]} source={{ uri: documentPage1Image }}></Image>
			</View>
			<View style={[Layout.alignItemsCenter, { width: '40%', left: -8 }]}>
				<Image style={[{ width: '30%', aspectRatio: 0.74, borderRadius: 10, borderColor: Colors.solitude, borderWidth: 0, alignContent: 'center', justifyContent: 'center', resizeMode: 'contain' }]} source={{ uri: documentPage2Image }}></Image>
			</View>
		</View>;

	return (
		<View style={[{ flex: 1 }]}>

			<Animated.View
				style={[
					styles.header,
					{
						transform: [{ translateY: headerTranslateY }],
						borderBottomLeftRadius: borderRadiusTransform,
						borderBottomRightRadius: borderRadiusTransform,
					}
				]}>
				<Animated.Image
					style={[
						styles.headerBackground,
						{
							opacity: imageOpacity,
							transform: [{ translateY: imageTranslateY }],
						},
					]}
					source={Images.bg}
				/>
			</Animated.View>
			<Animated.View style={[styles.headerImage, Layout.fullWidth, Layout.rowCenter, { flex: 1 },
			{
				transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
			}
			]}>
				<Brand width={220} height={220} />
			</Animated.View>
			<Animated.View style={[styles.headerLeftNav,
			{
				transform: [{ scale: titleScale }, { translateY: headerNavTranslateY }],
			}
			]}>
				<TouchableOpacity
					style={[Common.button.backgroundReset, Gutters.regularBMargin, { height: 50, width: 12, left: -40, top: 0 }]}
					onPress={() => {
						navigation.reset({
							index: 0,
							routes: [{ name: "Reseller Package Selector" }]
						});
						navigate('Reseller Packages', { screen: 'Reseller Package Selector', params: { 'selectedPremise': selectedPremise, 'packages': allThePackages, 'allPackagesLoaded': true } })
					}

					}
				>
					<FontAwesomeIcon icon="fa-angle-left" color={'white'} size={26} />
				</TouchableOpacity>
			</Animated.View>
			<Animated.View
				style={[
					styles.topBar,
					{
						transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
					},
				]}>

				<Text style={[Fonts.whiteTextRegular, Fonts.montserrat_bold,]}>{t('application_form_heading')}</Text>
			</Animated.View>
			{applicationFields}
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
				<Text style={[Fonts.textRegular, Fonts.black_text, Fonts.montserrat_regular, { textAlign: "center", marginVertical: 30 }]}>{invalidPopUpText}</Text>
			</CustomModal>
			<DatePicker
				modal
				open={showStartTimePicker}
				date={preferredContactStartDate}
				onConfirm={(date) => {
					setShowStartTimePicker(false)
					setPreferredContactStartDate(date)
				}}
				onCancel={() => {
					setShowStartTimePicker(false)
				}}
				mode={"time"}
			/>
			<DatePicker
				modal
				open={showEndTimePicker}
				date={preferredContactEndDate}
				onConfirm={(date) => {
					setShowEndTimePicker(false)
					setPreferredContactEndDate(date)
				}}
				onCancel={() => {
					setShowEndTimePicker(false)
				}}
				mode={"time"}
			/>
			{
				showAction ? (
					actionSheet
				) : (null)
			}
		</View >
	)
}


export default ResellerApplicationFormContainer1
