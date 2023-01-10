import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react'
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
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand, CustomTextInput, SearchInput, CustomModal } from '@/Components'
import { useTheme } from '@/Hooks'
import { useReseller } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { useLazyAuthenticateQuery } from "@/Services/resellerAPI";
import { useLazyPremisesearchQuery, useLazyAreavalidationQuery, useLazyPremiselookupQuery, useLazyPremiseservicesQuery, useLazyProductavailabilityQuery } from "@/Services/aexAPI";
import { changeTheme } from '@/Store/Theme'
import { setReseller } from '@/Store/Reseller'
import { clearReseller } from '@/Store/Reseller'
import Animated, { FadeOutDown, FadeInUp, FadeIn, Layout, Easing, FadeInDown, SlideInDown, SlideInLeft, SlideInUp, BounceInUp, BounceInDown } from 'react-native-reanimated'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { navigate } from '@/Navigators/utils'
import { navigateAndReset } from '@/Navigators/utils'
import { navigateOpenDrawer } from '@/Navigators/utils'
import LinearGradient from 'react-native-linear-gradient';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ProgressBar from 'react-native-animated-progress'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import MyToast from '@/Theme/components/ToastConfig'
import { Config } from '@/Config'
import _ from 'lodash'
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { FlashList } from "@shopify/flash-list";
import FastImage from 'react-native-fast-image'


const ResellerPackageContainer1 = ({ navigation, route }) => {
	const sortProducts = (arr, prop, asc) => {

		let newArr = [...arr].sort((a, b) => {
			if (typeof (a[prop]) === "string") {
				if (asc) {
					return (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : ((a[prop].toLowerCase() < b[prop].toLowerCase()) ? -1 : 0);
				} else {
					return (b[prop].toLowerCase() > a[prop].toLowerCase()) ? 1 : ((b[prop].toLowerCase() < a[prop].toLowerCase()) ? -1 : 0);
				}
			}//if
			else {
				if (asc) {
					return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
				} else {
					return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
				}
			}//else

		});
		return newArr;
	}

	const findProducts = (obj, key, val) => {
		let objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(findProducts(obj[i], key, val));
			} else if (i == key && obj[key] == val) {
				objects.push(obj);
			}
		}
		return objects;
	}

	const [aexProductAvailability, productAvaialabilityResponse] = useLazyProductavailabilityQuery()


	//let packageList = '';

	//const [selectedPremise, setSelectedPremise] = useState(route.params.selectedPremise)
	//const [allPackages, setAllPackages] = useState(route.params.packages)
	const [selectedPremise, setSelectedPremise] = useState(global.selectedPremise)
	const [allPackages, setAllPackages] = useState(global.allAEXPackages)
	const [allISPs, setAllISPs] = useState([])
	const [allSpeeds, setAllSpeeds] = useState([])
	const [ispLoaded, setISPsLoaded] = useState(false)
	const [packagesLoaded, setPackagesLoaded] = useState(false)
	const [showPackageList, setShowPackageList] = useState(true)
	const [filteredPackages, setFilteredPackages] = useState([])
	const [displayedPackages, setDisplayedPackages] = useState([])
	const [packageCurrentIndex, setPackageCurrentIndex] = useState(0)
	const [packageNumToLoad, setPackageNumToLoad] = useState(30)
	const [isFetching, setIsFetching] = useState(false)
	const [packageSelected, setPackageSelected] = useState(false)
	const [selectedPackage, setSelectedPackage] = useState({})
	const [headerZIndex, setHeaderZIndex] = useState(1)
	const [headerBackgroundZIndex, setHeaderBackgroundZIndex] = useState(2)
	const [headerLeftNavZIndex, setHeaderLeftNavZIndex] = useState(3)
	const [packageInfoContent, setPackageInfoContent] = useState()
	const [checkAvailabilityInProgress, setCheckAvailabilityInProgress] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [availabilityText, setAvailabilityText] = useState('')
	const [packageAvailable, setPackageAvailable] = useState('')
	const [packageAvailableIcon, setPackageAvailableIcon] = useState(null)


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
	const packageInfoSheetRef = useRef(null);
	const snapPoints = useMemo(() => ['100%'], []);
	const resultsSheet = <BottomSheet
		ref={packageInfoSheetRef}
		initialSnapIndex={0}
		snapPoints={snapPoints}
		handleIndicatorStyle={{ display: "none" }}
		//onChange={handleSheetChanges}
		backgroundStyle={[{ backgroundColor: Colors.white }]}
		//style={[{ backgroundColor: Colors.transparent, zIndex: 4 }]}
		handleStyle={[{ backgroundColor: Colors.dark_white }]}
	>
		{packageInfoContent}
	</BottomSheet>;


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
	});

	//Theme
	const onChangeTheme = ({ theme, darkMode }) => {
		dispatch(changeTheme({ theme, darkMode }))
	}

	useEffect(() => {
		if (productAvaialabilityResponse.isError == true) {
			setAvailabilityText('')
			setPackageAvailable('')
			setPackageAvailableIcon(null)
			setCheckAvailabilityInProgress(false)
			setModalVisible(false)
			Toast.show({
				type: 'dark',
				text1: t('network_error_header'),
				text2: t('network_error_body'),
				position: 'bottom',
				autoHide: true,
				visibilityTime: 4000
			});
		}//if
	}, [productAvaialabilityResponse]);

	useEffect(() => {

		if (Object.keys(allPackages).length > 0) {

			let sortedArr = sortProducts(allPackages.data, 'provider', true);
			let sortedSpeedArr = sortProducts(allPackages.data, 'speed_down', true);
			const uniqueISPs = [...new Map(sortedArr.map(item =>
				[item['provider'], item])).values()];
			const uniqueSpeeds = [...new Map(sortedSpeedArr.map(item =>
				[item['speed_down'], item['speed_down']])).values()];
			setAllISPs(uniqueISPs)
			setAllISPs(initialArray => [{ "provider": 'All' }, ...initialArray]);
			setAllSpeeds(uniqueSpeeds)
			let sortedDefaultArr = sortProducts(allPackages.data, 'speed_down', true);
			let tmpDefaultPackageArray = []
			for (i = 0; i < packageNumToLoad; i++) {
				tmpDefaultPackageArray.push(sortedDefaultArr[i])
			}//for
			setDisplayedPackages(tmpDefaultPackageArray)
			setFilteredPackages(sortedDefaultArr)
		}//if
		else {

		}//else


	}, [allPackages]);

	useEffect(() => {
		if (allISPs.length > 0) {
			setISPsLoaded(true)
			setTimeout(() => {
				setPackagesLoaded(true)
			}, 2500)
		}//if


	}, [allISPs]);

	useEffect(() => {
		if (displayedPackages.length > 0) {
			setPackageCurrentIndex((displayedPackages.length) - 1)
			//setTimeout(() => {
			setIsFetching(false)
			//Toast.hide()
			//}, 1500)
		}//if
	}, [displayedPackages]);

	useEffect(() => {
		if (Object.keys(selectedPackage).length > 0) {
			//global.selectedPackage = selectedPackage
			setPackageSelected(true)
		}//if
	}, [selectedPackage]);

	useEffect(() => {
		if (checkAvailabilityInProgress == true) {
			setAvailabilityText('Verifying Package\r\nPlease wait one moment.')

		}//if
	}, [checkAvailabilityInProgress]);

	useEffect(() => {
		if (packageAvailable == 'true') {
			setCheckAvailabilityInProgress(false)
			setModalVisible(false)
			setPackagesLoaded(false)
			setPackageSelected(false)
			setSelectedPackage({})
			setAvailabilityText('')
			setPackageAvailable('')
			setPackageAvailableIcon(null)
			//navigate('Reseller Application', { screen: 'Reseller Application Form', params: { 'selectedPremise': selectedPremise, package: item, 'all_packages': tmpAllPackages } })
			navigate('Reseller Application', { screen: 'Reseller Application Form' })
		}//if
		else if (packageAvailable == 'false') {
			setCheckAvailabilityInProgress(false)
			const packageValidationIconError = <FontAwesomeIcon icon="fa-circle-exclamation" color={Colors.warning} size={100} style={{ marginVertical: 10 }} />;
			setPackageAvailableIcon(packageValidationIconError)
			setAvailabilityText('The package you have selected is unfortunately not available in your area.\r\n\r\nPlease select a different package and try again.')
		}//else
	}, [packageAvailable]);

	const showPackageInfo = async (item) => {
		//console.log(item)
		let itemLogo = '';
		if (item.provider == "Fibre Stream") {
			itemLogo =
				<FastImage
					style={{ width: '55%', height: '55%', alignContent: 'center', justifyContent: 'center', resizeMode: 'contain', }}
					source={{
						uri: 'https://www.zoomfibre.co.za/wp-content/uploads/2022/03/fibre-stream.png',
						priority: FastImage.priority.normal,
					}}
					resizeMode={FastImage.resizeMode.contain}
				/>
		}//if
		else {
			itemLogo =
				<FastImage
					style={{ width: '55%', height: '55%', alignContent: 'center', justifyContent: 'center', resizeMode: 'contain', }}
					source={{
						uri: item.logo,
						priority: FastImage.priority.normal,
					}}
					resizeMode={FastImage.resizeMode.contain}
				/>
		}//else
		let product_type_category;
		let product_category = item.categories;
		let product_parent;
		if (item.parent) {
			product_parent = item.parent;
		}//if

		if (product_category.length > 0) {
			product_category.forEach(function (cat, l) {
				if (cat.name == "Business") {
					product_type_category = "Business";
				}//if
				else if (cat.name == "Residential") {
					product_type_category = "Residential";
				}//else if
				else if (cat.name == "Prepaid") {
					product_type_category = "Prepaid";
				}//else if
			});
		}//if
		if (typeof (product_type_category) === "undefined" || product_type_category.length == 0) {
			if (typeof (product_parent) != "undefined") {
				if (product_parent.indexOf("FTTB") >= 0) {
					product_type_category = "Business";
				}//if
				else if (product_parent.indexOf("FTTH") >= 0) {
					product_type_category = "Residential";
				}//else if
				else if (product_parent.indexOf("Pre-Paid") >= 0) {
					product_type_category = "Prepaid";
				}//else if
			}//if
		}//if


		if (typeof (product_type_category) === "undefined") {
			if (product.name.indexOf("FTTB") >= 0) {
				product_type_category = "Business";
			}//if
			else if (product.name.indexOf("FTTH") >= 0) {
				product_type_category = "Residential";
			}//else if
		}//if

		let packageTypeIndicator = '';
		if (product_type_category == "Residential") {
			packageTypeIndicator =
				<Image
					style={{ height: 40, alignContent: 'center', resizeMode: 'contain' }}
					source={Images.residential_icon}
				/>
		}//if
		else if (product_type_category == "Business") {
			packageTypeIndicator =
				<Image
					style={{ height: 40, alignContent: 'center', resizeMode: 'contain' }}
					source={Images.business_icon}
				/>
		}//else if
		else if (product_type_category == "Prepaid") {
			packageTypeIndicator =
				<Image
					style={{ height: 40, alignContent: 'center', resizeMode: 'contain' }}
					source={Images.prepaid_icon}
				/>
		}//else if
		const packageContent = <View style={[Layout.fullWidth, { backgroundColor: Colors.dark_white, minHeight: '100%' }]}>
			<View style={[Layout.rowHCenter, Layout.fullWidth, { backgroundColor: Colors.transparent }]} >
				<View style={[Layout.colCenter, { backgroundColor: Colors.white, width: '78%', height: 250, borderBottomRightRadius: 30, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, borderTopRightRadius: 30 }]}>
					<Animated.View style={[Layout.fullSize, Layout.colCenter, { backgroundColor: Colors.transparent }]} entering={SlideInLeft.duration(1500)}>
						{itemLogo}
					</Animated.View>
					<View>
						<TouchableOpacity onPress={() => {
							setHeaderZIndex(1)
							setHeaderBackgroundZIndex(2)
							setHeaderLeftNavZIndex(3)
							setSelectedPackage({})
							setPackageSelected(false)
						}
						}>
							<View>
								<FontAwesomeIcon icon="fa-angle-left" color={Colors.semi_trans_black} size={25} />
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[Layout.rowVCenter, { flex: 1, marginTop: 0, width: '22%', backgroundColor: Colors.transparent }]} >
					<View style={[Layout.fullWidth, Layout.colVCenter]} >
						<Animated.View style={[Layout.colCenter, { backgroundColor: Colors.transparent, borderWidth: 0, borderRadius: 12, minHeight: 80, paddingVertical: 2, paddingHorizontal: 2, marginHorizontal: 8, minWidth: '100%', }]} entering={FadeInUp.duration(250).delay(1250)}>
							<View style={[Gutters.tinyVPadding]}>
								{packageTypeIndicator}
							</View>
							<View>
								<Text style={[Fonts.textTiny, Fonts.montserrat_regular, Fonts.textCenter, { color: Colors.semi_trans_black }]}>{product_type_category.toUpperCase()}</Text>
							</View>
						</Animated.View>
						<Animated.View style={[Layout.colCenter, { backgroundColor: Colors.transparent, borderWidth: 0, borderRadius: 12, minHeight: 80, paddingVertical: 2, paddingHorizontal: 2, marginHorizontal: 8, minWidth: '100%', }]} entering={FadeInUp.duration(250).delay(1500)}>
							<View>
								<FontAwesomeIcon icon="fa-arrow-down" color={Colors.secondary} size={30} />
							</View>
							<View>
								<Text style={[Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.secondary, fontSize: 20 }]}>{item.speed_down}</Text>
							</View>
							<View>
								<Text style={[Fonts.textTiny, Fonts.montserrat_regular, Fonts.textCenter, { color: Colors.semi_trans_black }]}>{t('speed_unit')}</Text>
							</View>
						</Animated.View>
						<Animated.View style={[Layout.colCenter, { backgroundColor: Colors.transparent, borderWidth: 0, borderRadius: 12, minHeight: 80, paddingVertical: 2, paddingHorizontal: 2, marginHorizontal: 8, minWidth: '100%', }]} entering={FadeInUp.duration(250).delay(1750)}>
							<View>
								<FontAwesomeIcon icon="fa-arrow-up" color={Colors.secondary} size={30} />
							</View>
							<View>
								<Text style={[Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.secondary, fontSize: 20 }]}>{item.speed_up}</Text>
							</View>
							<View>
								<Text style={[Fonts.textTiny, Fonts.montserrat_regular, Fonts.textCenter, { color: Colors.semi_trans_black }]}>{t('speed_unit')}</Text>
							</View>
						</Animated.View>

					</View>
				</View>
			</View>

			<Animated.View style={[Layout.colVCenter, Layout.fullWidth, Gutters.smallTPadding, { backgroundColor: Colors.transparent }]} entering={BounceInDown.duration(500).delay(2000)}>
				<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.semi_trans_black }]}>{item.name}</Text>
			</Animated.View >
			<Animated.View style={[Layout.colVCenter, Layout.fullWidth, Gutters.smallTPadding, { backgroundColor: Colors.transparent }]} entering={BounceInDown.duration(500).delay(2000)}>
				<View style={[Layout.colCenter, { backgroundColor: Colors.transparent, borderWidth: 0, borderRadius: 0, paddingVertical: 4, marginHorizontal: 4, }]}>
					<View style={[Layout.rowCenter, Gutters.regularVPadding]}>
						<Text style={[Fonts.textLarge, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.secondary }, Gutters.smallHPadding]}>{t('currency_symbol')}</Text>
						<Text style={[Fonts.textLarge, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.secondary }]}>{item.monthly_price.toFixed(2)}</Text>
						<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, { color: Colors.secondary, position: 'relative', top: 10, left: 8 }]}>{t('pricing_period_indicator')}</Text>
					</View>
				</View>
			</Animated.View >
			<BottomSheetScrollView contentContainerStyle={[{ paddingBottom: 88 }]}>
				<Animated.View style={[Layout.colVCenter, Layout.fullWidth, Gutters.smallTPadding, { backgroundColor: Colors.transparent }]} entering={FadeIn.duration(750).delay(2000)}>
					<View style={[Layout.colCenter, { backgroundColor: Colors.transparent, borderWidth: 0, borderRadius: 0, minHeight: 100, paddingVertical: 8, marginHorizontal: 8, minWidth: 110, }]}>
						<Text style={[Fonts.textRegular, Fonts.montserrat_regular, Fonts.textCenter, { color: Colors.semi_trans_black }]}>{item.description}</Text>
					</View>
				</Animated.View >
			</BottomSheetScrollView>
			<Animated.View style={[Layout.colVCenter, Layout.fullWidth, Gutters.smallVPadding, Gutters.largeHPadding, { backgroundColor: Colors.dark_white, position: 'absolute', bottom: 0 }]} entering={BounceInDown.duration(1000).delay(2000)}>
				<TouchableOpacity onPress={() => selectPackage(item)}>
					<View style={[Layout.fullWidth, { height: 50, backgroundColor: Colors.dark_white, }]}>
						<LinearGradient colors={[Colors.primary_gradient_start, Colors.primary_gradient_mid]} style={[Common.button.rounded, Layout.colCenter, { height: '100%' }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
							<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.white_text]}>{t('package_select_label')}</Text>
						</LinearGradient>
					</View>
				</TouchableOpacity>

			</Animated.View >
		</View>;
		setPackageInfoContent(packageContent)

		setHeaderZIndex(0)
		setHeaderBackgroundZIndex(0)
		setHeaderLeftNavZIndex(0)
		setSelectedPackage(item)
	}


	const renderISP = ({ item, index }) => {
		if (item.provider == "Zoom Fibre" || item.provider == "Automation Exchange") {
			return '';
		}//if
		else {
			let itemLogo = '';
			if (item.provider == "All") {
				itemLogo = <FontAwesomeIcon icon="fa-infinity" color={Colors.black} size={90} />
			}//if
			else {
				if (item.provider == "Fibre Stream") {
					itemLogo =
						<FastImage
							style={{ width: '80%', height: '80%', alignContent: 'center', justifyContent: 'center', resizeMode: 'contain', }}
							source={{
								uri: 'https://www.zoomfibre.co.za/wp-content/uploads/2022/03/fibre-stream.png',
								priority: FastImage.priority.normal,
							}}
							resizeMode={FastImage.resizeMode.contain}
						/>
				}//if
				else {
					itemLogo =
						<FastImage
							style={{ width: '80%', height: '80%', alignContent: 'center', justifyContent: 'center', resizeMode: 'contain', }}
							source={{
								uri: item.logo,
								priority: FastImage.priority.normal,
							}}
							resizeMode={FastImage.resizeMode.contain}
						/>
				}//else
			}//else
			return (
				<TouchableWithoutFeedback onPress={() => filterByISP(item.provider)}>
					<View style={[Layout.colCenter, { backgroundColor: '#ffffff', borderWidth: 0, borderRadius: 12, height: 120, paddingHorizontal: 8, marginHorizontal: 8, minWidth: 175, }]}>
						{itemLogo}
						<View>
							<Text style={[Fonts.textRegular, Colors.black, Fonts.montserrat_bold]}>{item.provider}</Text>
						</View>
					</View>
				</TouchableWithoutFeedback>
			)
		}//else


	}

	const renderSpeedFilterISP = ({ item, index }) => {
		if (item != null) {
			return (
				<TouchableWithoutFeedback onPress={() => filterBySpeed(item)}>
					<View style={[Layout.colCenter, { backgroundColor: Colors.transparent, borderColor: Colors.primary, borderWidth: 2, borderRadius: 25, height: 50, paddingHorizontal: 8, marginHorizontal: 8, minWidth: 150, }]}>
						<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.primary }]}>{item} Mbps</Text>
					</View>
				</TouchableWithoutFeedback>
			)
		}//if
		else {
			return '';
		}//else
	}

	const cellRenderer =
		<SkeletonPlaceholder backgroundColor={Colors.white} highlightColor={'#E0E0E0'} speed={1110} >
			<View style={[Layout.fullWidth, Layout.alignItemsCenter, Gutters.smallVPadding, Layout.rowCenter, { borderWidth: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderColor: '#E0E0E0', marginTop: 250 }]}>
				<View style={[{ flex: 1 }, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularHPadding]}>
					<View style={{ marginTop: 6, width: '100%', height: 120, borderRadius: 5 }} />
				</View>
				<View style={[{ flex: 1 }, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularHPadding]}>
					<View style={{ marginTop: 6, width: '100%', height: 120, borderRadius: 5 }} />
				</View>
			</View>
			<View style={[Layout.fullWidth, Layout.alignItemsCenter, Gutters.smallVPadding, Layout.rowCenter, { borderWidth: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderColor: '#E0E0E0', }]}>
				<View style={[{ flex: 1 }, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularHPadding]}>
					<View style={{ marginTop: 6, width: '100%', height: 50, borderRadius: 25 }} />
				</View>
				<View style={[{ flex: 1 }, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularHPadding]}>
					<View style={{ marginTop: 6, width: '100%', height: 50, borderRadius: 25 }} />
				</View>
				<View style={[{ flex: 1 }, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularHPadding]}>
					<View style={{ marginTop: 6, width: '100%', height: 50, borderRadius: 25 }} />
				</View>
			</View>
			<View style={[Layout.colCenter, Gutters.smallVMargin, Gutters.smallVPadding, { borderWidth: 2, borderRadius: 5, borderColor: Colors.thirty_trans_black }]}>
				<View style={[Layout.fullWidth, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularVPadding]}>
					<View style={{ marginTop: 6, width: '80%', height: 20, borderRadius: 5 }} />
				</View>
				<View style={[Layout.fullWidth, Layout.alignItemsCenter, Layout.colCenter, { backgroundColor: '#ffffff', borderWidth: 0, height: 120, borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderColor: '#E0E0E0' }]}>
					<View style={{ width: 100, height: 100, borderRadius: 50 }} />
				</View>
				<View style={[Layout.fullWidth, Layout.alignItemsCenter, Gutters.smallVPadding, Layout.rowCenter, { borderWidth: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderColor: '#E0E0E0' }]}>
					<View style={[{ flex: 1 }, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularHPadding]}>
						<View style={{ marginTop: 6, width: '80%', height: 20, borderRadius: 5 }} />
					</View>
					<View style={[{ flex: 1 }, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularHPadding]}>
						<View style={{ marginTop: 6, width: '80%', height: 20, borderRadius: 5 }} />
					</View>
				</View>
				<View style={[Layout.fullWidth, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularVPadding]}>
					<View style={{ marginTop: 6, width: '80%', height: 20, borderRadius: 5 }} />
				</View>
			</View>
		</SkeletonPlaceholder>


	const loadingRenderer = <View style={[Layout.fullWidth, Gutters.smallHPadding, { position: 'absolute', bottom: 10, zIndex: 15 }]}>

		<View style={[Layout.fullWidth, Gutters.regularVPadding, Gutters.tinyTMargin]}>
			<ProgressBar
				indeterminate={true}
				height={2}
				backgroundColor={Colors.secondary}
				animated={true}
				trackColor={Colors.solitude}
			/>
		</View>
	</View>

	const loadMorePackages = () => {
		//console.log('loadMorePackages');
		//console.log("packagesLoaded: " + packagesLoaded)
		//console.log("isFetching: " + isFetching)
		if (packagesLoaded && !isFetching) {
			setIsFetching(true)
			for (j = packageCurrentIndex + 1; j < packageCurrentIndex + packageNumToLoad; j++) {
				let tmpAdditionalPackages = filteredPackages[j];
				setDisplayedPackages(initialArray => [...initialArray, tmpAdditionalPackages]);
			}//for
		}//if
	}

	const renderPackageList = ({ item, index }) => {

		//if (index < packageCurrentIndex - 1) {
		try {
			if (item.visible_to_user && item.status == "Active" && (item.monthly_price != "" && typeof (item.monthly_price) != 'undefined') && (item.speed_up != '' && item.speed_up) && (item.speed_down != '' && item.speed_down)) {

				let itemLogo = '';
				if (item.provider == "Fibre Stream") {
					itemLogo =
						<FastImage
							style={{ width: '60%', height: '60%', alignContent: 'center', justifyContent: 'center', resizeMode: 'contain', }}
							source={{
								uri: 'https://www.zoomfibre.co.za/wp-content/uploads/2022/03/fibre-stream.png',
								priority: FastImage.priority.normal,
							}}
							resizeMode={FastImage.resizeMode.contain}
						/>
				}//if
				else {
					itemLogo =
						<FastImage
							style={{ width: '60%', height: '60%', alignContent: 'center', justifyContent: 'center', resizeMode: 'contain', }}
							source={{
								uri: item.logo,
								priority: FastImage.priority.normal,
							}}
							resizeMode={FastImage.resizeMode.contain}
						/>
				}//else
				let product_type_category;
				let product_category = item.categories;
				let product_parent;
				if (item.parent) {
					product_parent = item.parent;
				}//if

				if (product_category.length > 0) {
					product_category.forEach(function (cat, l) {
						if (cat.name == "Business") {
							product_type_category = "Business";
						}//if
						else if (cat.name == "Residential") {
							product_type_category = "Residential";
						}//else if
						else if (cat.name == "Prepaid") {
							product_type_category = "Prepaid";
						}//else if
					});
				}//if
				if (typeof (product_type_category) === "undefined" || product_type_category.length == 0) {
					if (typeof (product_parent) != "undefined") {
						if (product_parent.indexOf("FTTB") >= 0) {
							product_type_category = "Business";
						}//if
						else if (product_parent.indexOf("FTTH") >= 0) {
							product_type_category = "Residential";
						}//else if
						else if (product_parent.indexOf("Pre-Paid") >= 0) {
							product_type_category = "Prepaid";
						}//else if
					}//if
				}//if


				if (typeof (product_type_category) === "undefined") {
					if (product.name.indexOf("FTTB") >= 0) {
						product_type_category = "Business";
					}//if
					else if (product.name.indexOf("FTTH") >= 0) {
						product_type_category = "Residential";
					}//else if
				}//if

				let packageTypeIndicator = '';
				if (product_type_category == "Residential") {
					packageTypeIndicator =
						<Image
							style={{ position: 'absolute', left: -42, top: -13, height: 70, resizeMode: 'contain' }}
							source={Images.residential_indicator}

						/>
				}//if
				else if (product_type_category == "Business") {
					packageTypeIndicator =
						<Image
							style={{ position: 'absolute', left: -42, top: -13, height: 70, resizeMode: 'contain' }}
							source={Images.business_indicator}

						/>
				}//else if
				else if (product_type_category == "Prepaid") {
					packageTypeIndicator =
						<Image
							style={{ position: 'absolute', left: -42, top: -13, height: 70, resizeMode: 'contain' }}
							source={Images.prepaid_indicator}

						/>
				}//else if


				return (
					<View key={item.product_id} style={[Gutters.regularVPadding, Gutters.regularHPadding, { backgroundColor: 'transparent' }]} >
						<TouchableWithoutFeedback key={item.product_id} onPress={() => selectPackage(item)}>
							<View style={[Layout.colCenter, Gutters.smallVMargin, Gutters.smallVPadding, { borderWidth: 2, borderRadius: 5, borderColor: Colors.thirty_trans_black, }]}>
								<View style={[Layout.fullWidth, Layout.alignItemsCenter, Gutters.regularVPadding, { borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 1, borderLeftWidth: 0, borderColor: '#E0E0E0', height: 55 }]}>
									<Text style={[Fonts.montserrat_bold, { color: Colors.black, fontSize: 18 }]}>{item.provider}</Text>
									{packageTypeIndicator}
									<TouchableOpacity
										style={[Common.button.backgroundReset, Gutters.regularBMargin, { position: 'absolute', width: 12, right: 32, top: 6 }]}
										onPress={() => showPackageInfo(item)}

									>
										<FontAwesomeIcon icon="fa-circle-info" color={Colors.primary} size={34} />
									</TouchableOpacity>
								</View>
								<View style={[Layout.fullWidth, Layout.alignItemsCenter, Layout.colCenter, { backgroundColor: '#ffffff', borderWidth: 0, height: 120, borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 1, borderLeftWidth: 0, borderColor: '#E0E0E0' }]}>
									{itemLogo}
								</View>
								<View style={[Layout.fullWidth, Layout.alignItemsCenter, Gutters.smallVPadding, Layout.rowCenter, { borderWidth: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 1, borderLeftWidth: 0, borderColor: '#E0E0E0' }]}>
									<View style={[{ flex: 1 }, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularHPadding]}>
										<FontAwesomeIcon icon="fa-circle-down" color={Colors.semi_trans_black} size={30} />
										<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.semi_trans_black }, Gutters.smallVMargin, Gutters.smallHPadding]}>{item.speed_down} Mbps</Text>
									</View>
									<View style={[{ flex: 1 }, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularHPadding]}>
										<FontAwesomeIcon icon="fa-circle-up" color={Colors.semi_trans_black} size={30} />
										<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.semi_trans_black }, Gutters.smallVMargin, Gutters.smallHPadding]}>{item.speed_up} Mbps</Text>
									</View>
								</View>
								<View style={[Layout.fullWidth, Layout.rowCenter, Layout.alignItemsCenter, Gutters.regularVPadding]}>
									<Text style={[Fonts.montserrat_bold, { color: Colors.black, fontSize: 20 }]}>R {item.monthly_price.toFixed(2)}</Text>
									<Text style={[Fonts.montserrat_bold, Gutters.tinyLMargin, { color: Colors.black, fontSize: 16, top: -8 }]}>pm</Text>
									<TouchableOpacity
										style={[Common.button.backgroundReset, Gutters.regularBMargin, { position: 'absolute', height: 60, width: 12, right: 32, top: 16 }]}
										onPress={() => selectPackage(item)}
									>
										<FontAwesomeIcon icon="fa-circle-chevron-right" color={Colors.secondary} size={34} />
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				);
			}//if
			else {
				return '';
			}//else
		}//try
		catch (packageItemException) {
			return ''
		}//catch

		//}//if
		//else {
		//setPackageCurrentIndex(index)
		//return ''
		//}//else
	}

	const filterByISP = async (item) => {
		setDisplayedPackages([])

		if (item == "All") {
			let sortedArr = sortProducts(allPackages.data, 'provider', true);
			let sortedSpeedArr = sortProducts(allPackages.data, 'speed_down', true);
			const uniqueISPs = [...new Map(sortedArr.map(item =>
				[item['provider'], item])).values()];
			const uniqueSpeeds = [...new Map(sortedSpeedArr.map(item =>
				[item['speed_down'], item['speed_down']])).values()];
			setAllISPs(uniqueISPs)
			setAllISPs(initialArray => [{ "provider": 'All' }, ...initialArray]);
			setAllSpeeds(uniqueSpeeds)
			let sortedDefaultArr = sortProducts(allPackages.data, 'speed_down', true);
			let tmpDefaultPackageArray = []
			for (i = 0; i < packageNumToLoad; i++) {
				tmpDefaultPackageArray.push(sortedDefaultArr[i])
			}//for
			setDisplayedPackages(tmpDefaultPackageArray)
			setFilteredPackages(sortedDefaultArr)

		}//if
		else {
			let filteredArr = findProducts(allPackages.data, 'provider', item);
			let sortedDefaultArr = sortProducts(filteredArr, 'speed_down', true);
			let tmpDefaultPackageArray = []
			for (i = 0; i < packageNumToLoad; i++) {
				tmpDefaultPackageArray.push(sortedDefaultArr[i])
			}//for
			setDisplayedPackages(tmpDefaultPackageArray)
			setFilteredPackages(sortedDefaultArr)

		}//else

	}

	const filterBySpeed = async (item) => {
		setDisplayedPackages([])
		let filteredArr = findProducts(allPackages.data, 'speed_down', item);
		let sortedDefaultArr = sortProducts(filteredArr, 'speed_down', true);
		let tmpDefaultPackageArray = []
		for (i = 0; i < packageNumToLoad; i++) {
			tmpDefaultPackageArray.push(sortedDefaultArr[i])
		}//for
		setDisplayedPackages(tmpDefaultPackageArray)
		setFilteredPackages(sortedDefaultArr)
	}


	const selectPackage = async (item) => {
		setCheckAvailabilityInProgress(true)
		setModalVisible(true)
		let tmpAllPackages = allPackages;
		global.selectedPackage = item;
		checkProductAvailability()
	}

	const checkProductAvailability = async () => {
		try {
			const availabilityResults = await aexProductAvailability({ 'lat': global.selectedPremise.latitude, 'lng': global.selectedPremise.longitude, 'provider': global.selectedPackage.provider_id })
			//console.log(availabilityResults)
			if (availabilityResults.data.result == "error") {
				setCheckAvailabilityInProgress(false)
				setPackageAvailable('false')
			}//if
			else {
				//if (typeof (availabilityResults.error) == "undefined") {
				if (availabilityResults.data.items.length == 0) {
					setPackageAvailable('false')
				}//if
				else {
					let tmpPackageAvailable = false;
					availabilityResults.data.items.forEach(function (tmpPack, k) {
						if (global.selectedPackage.id == tmpPack.id) {
							tmpPackageAvailable = true;
							return false;
						}//if
					});

					if (tmpPackageAvailable) {
						setPackageAvailable('true')
					}//if
					else {
						setPackageAvailable('false')
					}//else
				}//else
				//}//if

			}//else
		}
		catch (fetchException) { }//catch

	};

	const ispList = <Animated.View>
		<Text style={[Fonts.textSmall, Colors.light_gray, Fonts.montserrat_regular, Gutters.smallHPadding, Gutters.smallVPadding]}>Filter ISP</Text>
		<FlatList
			data={allISPs}
			horizontal
			keyExtractor={(item, index) => index}
			renderItem={renderISP}
			contentContainerStyle={{
				padding: 10,
				height: 150
			}}
			style={[{ backgroundColor: Colors.transparent, height: 150 }]}
		>
		</FlatList>
		<Text style={[Fonts.textSmall, Colors.light_gray, Fonts.montserrat_regular, Gutters.smallHPadding, Gutters.smallVPadding]}>Filter Download Speed</Text>
		<FlatList
			data={allSpeeds}
			horizontal
			keyExtractor={(item, index) => index}
			renderItem={renderSpeedFilterISP}
			contentContainerStyle={{
				padding: 10,
				height: 60
			}}
			style={[{ backgroundColor: Colors.transparent, height: 60 }]}
		>
		</FlatList>
	</Animated.View>

	const packageList =

		<FlashList
			data={displayedPackages}
			//data={filteredPackages}
			renderItem={renderPackageList}
			estimatedItemSize={400}
			ListHeaderComponent={ispList}
			ListHeaderComponentStyle={{ height: 300 }}
			onScroll={({ nativeEvent }) => {
				scrollY.setValue(nativeEvent.contentOffset.y);
			}
			}
			onEndReached={() => { loadMorePackages() }}
			onEndReachedThreshold={0}
			contentContainerStyle={{ paddingBottom: 20, paddingTop: 250, }}
			disableAutoLayout={true}
			keyExtractor={(item, index) => index}

		/>


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
					style={[Common.button.backgroundReset, Gutters.regularBMargin, { height: 60, width: 12, left: -40, top: 0 }]}
					onPress={() => {
						navigation.reset({
							index: 0,
							routes: [{ name: "Reseller Map View" }]
						});
						navigate('Reseller Home', { screen: 'Reseller Map View' })
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

				<Text style={[Fonts.whiteTextRegular, Fonts.montserrat_bold]}>{t('package_selection_header')}</Text>
			</Animated.View>

			{packagesLoaded ? (
				packageList
			) : (
				cellRenderer
			)}
			{packageSelected ? (
				resultsSheet
			) : (null)}

			<CustomModal visible={modalVisible}>
				{!checkAvailabilityInProgress ?
					(<View style={[{ alignItems: "center" }, Common.modal.header]}>
						<TouchableOpacity onPress={() => {
							setModalVisible(false)
							setAvailabilityText('')
							setPackageAvailable('')
							setPackageAvailableIcon(null)
						}

						}>
							<View>
								<FontAwesomeIcon icon="fa-times" color={Colors.semi_trans_black} size={30} />
							</View>
						</TouchableOpacity>
					</View>)
					:
					(null)
				}

				{checkAvailabilityInProgress ?
					(
						<View>
							<View style={{ alignItems: "center" }}>
								<ActivityIndicator size={100} style={{ marginVertical: 10 }} color={Colors.secondary} />
							</View>
							<Text style={[Fonts.textRegular, Fonts.black_text, Fonts.montserrat_regular, { textAlign: "center", marginVertical: 30 }]}>{availabilityText}</Text>
						</View>
					)
					:
					(
						<View>
							<View style={{ alignItems: "center" }}>
								{packageAvailableIcon}
							</View>
							<Text style={[Fonts.textRegular, Fonts.black_text, Fonts.montserrat_regular, { textAlign: "center", marginVertical: 30 }]}>{availabilityText}</Text>
						</View >
					)
				}


			</CustomModal >

			<MyToast />
		</View>
	)
}


export default ResellerPackageContainer1
