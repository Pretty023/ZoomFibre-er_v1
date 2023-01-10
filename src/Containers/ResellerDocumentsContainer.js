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
import ImagePicker from 'react-native-image-crop-picker';


const ResellerDocumentsContainer = ({ navigation, route }) => {

	let screenWidth = Dimensions.get('window').width;

	//let packageList = '';

	//const [selectedPremise, setSelectedPremise] = useState(route.params.selectedPremise)
	//const [selectedPackage, setSelectedPackage] = useState(route.params.package)
	///const [allThePackages, setAllPackage] = useState(route.params.all_packages)

	const [selectedPremise, setSelectedPremise] = useState(global.selectedPremise)
	const [selectedPackage, setSelectedPackage] = useState(global.selectedPackage)
	const [allThePackages, setAllPackage] = useState(global.allAEXPackages)

	const [requiredDocumentList, setRequiredDocumentList] = useState([{ 'id': 0, 'name': 'Top Label', 'type': 'label', 'icon': '' }, { 'id': 1, 'name': 'ID Document', 'type': 'document', 'icon': 'fa-id-card' }, { 'id': 2, 'name': 'Proof of Residence', 'type': 'document', 'icon': 'fa-receipt' }, { 'id': 3, 'name': 'Proof of Bank Account', 'type': 'document', 'icon': 'fa-file-invoice' }, { 'id': 4, 'name': 'submitButton', 'type': 'button', 'icon': '' }, { 'id': 5, 'name': 'cancelButton', 'type': 'button', 'icon': '' }])
	//const [requiredDocumentList, setRequiredDocumentList] = useState([{ 'id': 0, 'name': 'Top Label', 'type': 'label', 'icon': '' }, { 'id': 1, 'name': 'ID Document', 'type': 'document', 'icon': 'fa-id-card' }, { 'id': 2, 'name': 'Proof of Residence', 'type': 'document', 'icon': 'fa-receipt' }])

	const [headerZIndex, setHeaderZIndex] = useState(1)
	const [headerBackgroundZIndex, setHeaderBackgroundZIndex] = useState(2)
	const [headerLeftNavZIndex, setHeaderLeftNavZIndex] = useState(3)

	const [documentsIDCopy, setDocumentsIDCopy] = useState('')
	const [documentsPoR, setDocumentsPoR] = useState('')
	const [documentsPoBA, setDocumentsPoBA] = useState('')
	const [documentsIDCopySet, setDocumentsIDCopySet] = useState(false)
	const [documentsPoRSet, setDocumentsPoRSet] = useState(false)
	const [documentsPoBASet, setDocumentsPoBASet] = useState(false)
	const [selectedId, setSelectedId] = useState(null);

	const [modalVisible, setModalVisible] = useState(false);
	const [oderSubmissionInProgress, setOderSubmissionInProgress] = useState(false);
	const [submissionText, setSubmissionText] = useState('');
	const [uploadModalVisible, setUploadModalVisible] = useState(false);
	const [uploadProgressText, setUploadProgressText] = useState('');
	const [inProgress, setInProgress] = useState(false);

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

	const HEADER_MAX_HEIGHT = 220;
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

	useEffect(() => {
		if (Object.keys(selectedPremise).length > 0) {
			setSubmissionText("Submitting Order")
			setOderSubmissionInProgress(true)
			setTimeout(() => {
				setModalVisible(true)
			}
				, 500);
			if (isFirstRender.current) {
				isFirstRender.current = false;
				return
			}//if
			
		}
	}, [selectedPremise]);

	useEffect(() => {
		if (documentsIDCopy.length > 0) {
			setDocumentsIDCopySet(true)
			setTimeout(() => setSelectedId(1), 500);

		}//if
		else {
			setTimeout(() => setSelectedId(null), 500);
		}//else
	}, [documentsIDCopy]);

	useEffect(() => {
		if (documentsPoR.length > 0) {
			setDocumentsPoRSet(true)
			setTimeout(() => setSelectedId(2), 500);
		}//if
		else {
			setTimeout(() => setSelectedId(null), 500);
		}//else
	}, [documentsPoR]);

	useEffect(() => {
		if (documentsPoBA.length > 0) {
			setDocumentsPoBASet(true)
			setTimeout(() => setSelectedId(3), 500);
		}//if
		else {
			setTimeout(() => setSelectedId(null), 500);
		}//else
	}, [documentsPoBA]);

	useEffect(() => {
		// if (isFirstRender.current == false) {
		// 	setSubmissionText("Submitting Order")
		// 	setOderSubmissionInProgress(true)
		// 	setTimeout(() => {
		// 		setModalVisible(true)
		// 	}
		// 		, 500);
		// }//if
	}, [isFirstRender.current]);

	useEffect(() => {
		if (oderSubmissionInProgress) {

			setTimeout(() => {
				setSubmissionText("The Order has been submitted")
				setOderSubmissionInProgress(false)
			}
				, 4000);
		}//if
	}, [oderSubmissionInProgress]);

	useEffect(() => {
		if (uploadModalVisible) {
			setUploadProgressText("Uploading Documents")
			setInProgress(true)
		}//if
	}, [uploadModalVisible]);

	useEffect(() => {
		if (inProgress) {
			setTimeout(() => {
				setUploadProgressText("Documents Uploaded.\r\nThank You!")
				setInProgress(false)
			}
				, 5250);
		}//if
	}, [inProgress]);

	//Theme
	const onChangeTheme = ({ theme, darkMode }) => {
		dispatch(changeTheme({ theme, darkMode }))
	}

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
				setDocumentsIDCopy(imageData)
			}//if
			else if (pageIndex == 2) {
				const imageData = 'data:' + image.mime + ';base64,' + image.data;
				setDocumentsPoR(imageData)
			}//else if
			else if (pageIndex == 3) {
				const imageData = 'data:' + image.mime + ';base64,' + image.data;
				setDocumentsPoBA(imageData)
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
			multiple: false,
			includeBase64: true,
			mediaType: 'photo',
		}).then(image => {
			const tmpPageImage = image[0];
			if (pageIndex == 1) {
				const imageData = 'data:' + tmpPageImage.mime + ';base64,' + tmpPageImage.data;
				setDocumentsIDCopy(imageData)
			}//if
			else if (pageIndex == 2) {
				const imageData = 'data:' + tmpPageImage.mime + ';base64,' + tmpPageImage.data;
				setDocumentsPoR(imageData)
			}//else if
			else if (pageIndex == 3) {
				const imageData = 'data:' + tmpPageImage.mime + ';base64,' + tmpPageImage.data;
				setDocumentsPoBA(imageData)
			}//else if
		})
			.catch(error => {

			});
	}

	const clearDocumentImage = (pageIndex) => {
		if (pageIndex == 1) {
			setDocumentsIDCopy('')
			setDocumentsIDCopySet(false)
			setTimeout(() => setSelectedId(1), 500);
		}//if
		else if (pageIndex == 2) {
			setDocumentsPoR('')
			setDocumentsPoRSet(false)
			setTimeout(() => setSelectedId(2), 500);
		}//else if
		else if (pageIndex == 3) {
			setDocumentsPoBA('')
			setDocumentsPoBASet(false)
			setTimeout(() => setSelectedId(3), 500);
		}//else if
	}

	const uploadDocuments = () => {
		setUploadModalVisible(true)
	}

	const goToMapConatiner = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: "Reseller Map View" }]
		});
		navigate('Reseller Home', { screen: 'Reseller Map View' })
	}

	const loadMoreFields = () => {
		if (isFirstRender.current == false) {
			console.log(requiredDocumentList.length)

			if (requiredDocumentList.length == 3) {
				console.log('Here');
			}//if
		}//if

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


	const renderDocumentList = ({ item, index }) => {

		if (item.type == "label") {
			try {
				return (
					<Text style={[Fonts.textRegular, Fonts.montserrat_regular, Fonts.textCenter, Gutters.regularVPadding, { color: Colors.semi_trans_black }]}>{t('document_upload_sub_header')}</Text>
				);
			}//try
			catch (documentItemException) {
				return ''
			}//catch
		}//if
		else if (item.type == "document") {
			let documentImageSet = false;
			let documentImage = '';
			if (index == 1) {
				documentImageSet = documentsIDCopySet;
				documentImage = documentsIDCopy;
			}//if
			else if (index == 2) {
				documentImageSet = documentsPoRSet;
				documentImage = documentsPoR;
			}//else if
			else if (index == 3) {
				documentImageSet = documentsPoBASet;
				documentImage = documentsPoBA;
			}//else if

			try {
				return (
					<View style={[Layout.col, Gutters.smallVPadding, Gutters.smallVMargin, Gutters.smallHPadding, { width: '100%', minHeight: 275 }]}>
						<View style={[{ height: 30 }]}>
							<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.semi_trans_black, }]}>{item.name}</Text>
						</View>
						<View style={[Layout.colCenter, { width: '100%' }, Gutters.tinyHMargin]}>
							<View style={[Layout.colCenter, { width: '50%', elevation: 20, backgroundColor: Colors.dark_white, borderRadius: 10, borderColor: Colors.solitude, borderWidth: 2, }, Gutters.tinyHMargin]}>
								{documentImageSet ? (
									<View style={[Layout.colCenter, { width: '100%', height: 240, top: 0, left: 0 }]}>

										<Image style={[Layout.colCenter, { width: (screenWidth / 2) - screenWidth * 0.02, aspectRatio: 0.74, borderRadius: 10, borderColor: Colors.solitude, borderWidth: 0, alignContent: 'center', justifyContent: 'center', resizeMode: 'contain' }]} source={{ uri: documentImage }}></Image>
										<TouchableWithoutFeedback onPress={() => {
											clearDocumentImage(index)
										}}>
											<View style={[Layout.colCenter, { backgroundColor: Colors.thirty_trans_black, borderColor: Colors.primary, borderWidth: 0, borderRadius: 20, height: 40, width: 40, position: 'absolute', top: 6, right: 0 }]}>
												<FontAwesomeIcon icon="fa-times" color={Colors.white} size={26} />
											</View>

										</TouchableWithoutFeedback>
									</View>
								) :
									(
										<View style={[Layout.colCenter, { minHeight: 240 }]}>
											<View style={{ top: -25 }}>
												<FontAwesomeIcon icon={item.icon} color={Colors.thirty_trans_black} size={80} />
											</View>
										</View>
									)
								}
							</View>
							<View style={[Layout.rowVCenter, Gutters.tinyTMargin, { height: 50, width: '50%', bottom: 2, position: 'absolute' }]}>

								<TouchableWithoutFeedback onPress={() => {
									openDocumentUpload(index)
								}}>
									<View style={[Layout.colCenter, { backgroundColor: Colors.thirty_trans_black, borderColor: Colors.primary, borderWidth: 0, borderRadius: 20, height: 40, width: 40, position: 'absolute', bottom: 4, left: 4 }]}>
										<FontAwesomeIcon icon="fa-file-image" color={Colors.white} size={26} />

									</View>

								</TouchableWithoutFeedback>
								<TouchableWithoutFeedback onPress={() => {
									openCameraUpload(index)
								}}>
									<View style={[Layout.colCenter, { backgroundColor: Colors.thirty_trans_black, borderColor: Colors.primary, borderWidth: 0, borderRadius: 20, height: 40, width: 40, position: 'absolute', bottom: 4, right: 4 }]}>
										<FontAwesomeIcon icon="fa-camera" color={Colors.white} size={26} />

									</View>

								</TouchableWithoutFeedback>

							</View>
						</View>

					</View>
				);


			}//try
			catch (documentItemException) {
				return ''
			}//catch
		}//else if

		else if (item.type == "button") {
			if (item.name == "cancelButton") {
				return (
					<View style={[Layout.colCenter, { width: '100%' }, Gutters.tinyHMargin, Gutters.regularHPadding, Gutters.tinyVPadding]}>
						<TouchableOpacity
							style={[Gutters.regularHPadding, Layout.fullWidth, { height: 50, }]}
							onPress={() => {
								navigation.reset({
									index: 0,
									routes: [{ name: "Reseller Map View" }]
								});
								navigate('Reseller Home', { screen: 'Reseller Map View' })
							}
							}
						>
							<View style={[Layout.colCenter, { backgroundColor: Colors.transparent, borderColor: Colors.primary, borderWidth: 2, borderRadius: 30, height: '100%' }]}>
								<Text style={[Fonts.textRegular, Fonts.montserrat_bold, { color: Colors.primary }]}>{t('order_complete_label')}</Text>
							</View>
						</TouchableOpacity>
					</View>

				);

			}//if
			else if (item.name == "submitButton") {
				return (
					<View style={[Layout.colCenter, { width: '100%' }, Gutters.regularTMargin, Gutters.regularHPadding, Gutters.tinyVPadding]}>
						<TouchableOpacity
							style={[Gutters.regularHPadding, Layout.fullWidth, { height: 50, }]}
							onPress={() => { uploadDocuments() }
							}
						>
							<LinearGradient colors={[Colors.primary_gradient_start, Colors.primary_gradient_mid]} style={[Common.button.rounded, Layout.colCenter, { height: '100%' }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
								<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.white_text]}>{t('upload_document_button_label')}</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>

				);
			}//else if
		}//else if

	}

	const documentList =

		<FlashList
			data={requiredDocumentList}
			renderItem={renderDocumentList}
			estimatedItemSize={260}

			onScroll={({ nativeEvent }) => {
				scrollY.setValue(nativeEvent.contentOffset.y);
			}
			}
			//onEndReached={() => { loadMoreFields() }}
			//onEndReachedThreshold={20}
			contentContainerStyle={{ paddingBottom: 60, paddingTop: 230, }}
			disableAutoLayout={true}
			keyExtractor={(item, index) => index}
			extraData={selectedId}
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
						goToMapConatiner()
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

				<Text style={[Fonts.whiteTextRegular, Fonts.montserrat_bold]}>{t('document_upload_header')}</Text>
			</Animated.View>
			{documentList}
			


			<CustomModal visible={modalVisible}>
				<View style={[{ alignItems: "center" }, Common.modal.header]}>
					<TouchableOpacity onPress={() => setModalVisible(false)}>
						<View>
							<FontAwesomeIcon icon="fa-times" color={Colors.semi_trans_black} size={30} />
						</View>
					</TouchableOpacity>
				</View>
				{oderSubmissionInProgress ?
					(
						<View>
							<View style={{ alignItems: "center" }}>
								<ActivityIndicator size={100} style={{ marginVertical: 10 }} color={Colors.secondary} />
							</View>
							<Text style={[Fonts.textRegular, Fonts.black_text, Fonts.montserrat_regular, { textAlign: "center", marginVertical: 30 }]}>{submissionText}</Text>
						</View>
					)
					:
					(
						<View>
							<View style={{ alignItems: "center" }}>
								<FontAwesomeIcon icon="fa-circle-check" color={Colors.success} size={100} style={{ marginVertical: 10 }} />
							</View>
							<Text style={[Fonts.textRegular, Fonts.black_text, Fonts.montserrat_regular, { textAlign: "center", marginVertical: 30 }]}>{submissionText}</Text>
						</View >
					)
				}


			</CustomModal >

			<CustomModal visible={uploadModalVisible}>
				<View style={[{ alignItems: "center" }, Common.modal.header]}>
					<TouchableOpacity onPress={() => goToMapConatiner()}>
						<View>
							<FontAwesomeIcon icon="fa-times" color={Colors.semi_trans_black} size={30} />
						</View>
					</TouchableOpacity>
				</View>
				{inProgress ?
					(
						<View>
							<View style={{ alignItems: "center" }}>
								<ActivityIndicator size={100} style={{ marginVertical: 10 }} color={Colors.secondary} />
							</View>
							<Text style={[Fonts.textRegular, Fonts.black_text, Fonts.montserrat_regular, { textAlign: "center", marginVertical: 30 }]}>{uploadProgressText}</Text>
						</View>
					)
					:
					(
						<View>
							<View style={{ alignItems: "center" }}>
								<FontAwesomeIcon icon="fa-circle-check" color={Colors.success} size={100} style={{ marginVertical: 10 }} />
							</View>
							<Text style={[Fonts.textRegular, Fonts.black_text, Fonts.montserrat_regular, { textAlign: "center", marginVertical: 30 }]}>{uploadProgressText}</Text>
						</View>
					)
				}


			</CustomModal>
			<MyToast />
		</View >
	)
}


export default ResellerDocumentsContainer
