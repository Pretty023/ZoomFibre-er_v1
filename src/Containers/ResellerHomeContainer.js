import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
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
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand, CustomTextInput, SearchInput } from '@/Components'
import { useTheme } from '@/Hooks'
import { useReseller } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { useLazyAuthenticateQuery } from "@/Services/resellerAPI";
import { useLazyPremisesearchQuery, useLazyAreavalidationQuery, useLazyPremiselookupQuery, useLazyPremiseservicesQuery, useLazyAllpackagesQuery } from "@/Services/aexAPI";
import { changeTheme } from '@/Store/Theme'
import { setReseller } from '@/Store/Reseller'
import { clearReseller } from '@/Store/Reseller'
import Animated, { FadeOutDown, FadeInUp, Layout, Easing, FadeInDown, SlideInDown } from 'react-native-reanimated'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { navigate } from '@/Navigators/utils'
import { navigateAndReset } from '@/Navigators/utils'
import { navigateOpenDrawer } from '@/Navigators/utils'
import LinearGradient from 'react-native-linear-gradient';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ProgressBar from 'react-native-animated-progress'
import Toast, {BaseToast, ErrorToast } from 'react-native-toast-message';
import MapView, {Marker} from 'react-native-maps';
import MyToast  from '@/Theme/components/ToastConfig'
import { Config } from '@/Config'
import _ from 'lodash'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';


const ResellerHomeContainer = () => {
    const { t } = useTranslation()
    const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()
    const theReseller  = useReseller()
  
    const dispatch = useDispatch()
	
	const icon_height = 30;
	const item_margin_bottom = 20;
	const item_padding = 10;
	const item_size = icon_height + item_padding *2 + item_margin_bottom;
	
	const isFirstRender = useRef(true);	
	const isFirstRendered = useRef(true);	
	const searchResultsSheetRef = useRef(null);
	const snapPoints = useMemo(() => ['12%', '48%', '100%'], []);
	
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
		marginTop:5,
		marginBottom:5,
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
	  
	});
	
	const [showLocationSearchResults, setShowLocationSearchResults] = useState(false)
	const [searchLocation, setSearchLocation] = useState("")
	const [locationsArray, setLocationsArray] = useState([])
	const [premiseArray, setPremiseArray] = useState([])
	const [selectedLocationID, setLocationID] = useState("")
	const [locationSelected, setLocationSelected] = useState(false)
	const [selectedLocationGeometry, setLocationGeometry] = useState({})
	const [locationMarker, setLocationMarker] = useState(null)
	const [mapRegion, setMapRegion] = useState({
            latitude: -26.1372399,
            longitude: 28.1975,
            latitudeDelta: 10.0,
            longitudeDelta: 10.0,
          })
	const [mapView, setMapView] = useState()
	const [bottomDrawer, setBottomDrawer] = useState()
	const [premiseLookUpComplete, setPremiseLookUpComplete] = useState(false)
	const [bottomDrawerContent, setBottomDrawerContent] = useState("")
	const [selectedPremise, setSelectedPremise] = useState({})
	const [packagesLoading, setPackagesLoading] = useState(false)
	const [packagesLoaded, setPackagesLoaded] = useState(false)
	const [allAEXPackages, setAEXPackages] = useState({})
	
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return
		}//if
		setTimeout(() => areaLookup(), 3500);
	}, [selectedLocationGeometry]);
	
	useEffect(() => {
		if (premiseArray.length==0) {
			return
		}//if
		setBottomDrawerContent(sheetInitialSelectPremiseContent);
		setPremiseLookUpComplete(true);
	}, [premiseArray]);
	
	useEffect(() => {
		if (Object.keys(selectedPremise).length === 0) {
			return
		}
		premiseLookup()
	}, [selectedPremise]);

	useEffect(() => {
		if (Object.keys(allAEXPackages).length > 0) {
			global.allAEXPackages = allAEXPackages
			setSearchLocation('')
			setShowLocationSearchResults(false)
			setLocationSelected(false)
			setPremiseLookUpComplete(false)
			setLocationMarker(null)
			setSelectedPremise({})
			setPremiseArray([])

			//setTimeout(() => navigate('Reseller Packages', {screen: 'Reseller Package Selector', params: {'selectedPremise': selectedPremise, 'packages': allAEXPackages}}), 150);
			setTimeout(() => navigate('Reseller Packages', {screen: 'Reseller Package Selector'}), 150);
		}
		
	}, [allAEXPackages]);
	
    //Theme
    const onChangeTheme = ({ theme, darkMode }) => {
      dispatch(changeTheme({ theme, darkMode }))
    }

	const onChangeLocation = async(searchLocation) => {
		//setSearchLocation({searchLocation});
		const placesAPIUrl = Config.GOOGLE_PLACES_API_URL+'?key='+Config.GOOGLE_MAPS_API_KEY+'&input='+searchLocation+'&region=za';
		try{
			const placesResults = await fetch(placesAPIUrl);
			const jsonPlacesResults = await placesResults.json();
			setShowLocationSearchResults(true)
			setLocationsArray(jsonPlacesResults.predictions)
		}//try
		catch(err){
			setTimeout(() => 
				Toast.show({
				  type: 'error',
				  text1: t('network_error_header'),
				  text2: t('network_error_body'),
				  position: 'bottom',
				  autoHide: true,
				  visibilityTime: 4000
				}),
				setPremiseLookUpComplete(true)
			, 250);
		}//catch
	}
	const onChangeLocationDebounced = _.debounce(onChangeLocation, 50);
	
	const scrollY_0 = useRef(new Animated.Value(0)).current;
	
	const renderPremiseItem = ({item, index}) => {
		const scale = scrollY_0.interpolate({
			inputRange: [
				-1, 0,
				item_size * index,
				item_size * (index + 2)
			],
			outputRange: [
				1,1,1,0
			]
		})
		const opacity = scrollY_0.interpolate({
			inputRange: [
				-1, 0,
				item_size * index,
				item_size * (index + .6)
			],
			outputRange: [
				1,1,1,0
			]
		})
		return(
			<TouchableWithoutFeedback onPress={ () => onPremiseSelected(item)}>
				<Animated.View style={[
					styles.item,
					{
						transform:[{scale}],
						opacity
					}
				
				]}>
					<FontAwesomeIcon icon="fa-map-location" color={Colors.semi_trans_black} size={icon_height} style={{marginVertical:10}}/>
					<View style={styles.suggestionsText}>
						<Text style={[Fonts.textSmall, Colors.black]}>{item.full_text}</Text>
					</View>
				</Animated.View>
			</TouchableWithoutFeedback>
		)
		
	}
	
	const sheetInitialLoadingContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
		<View style={[Layout.colCenter]}>
			<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Colors.black]}>{t('location_loading_header')}</Text>
		</View>
		<View style={[Layout.fullWidth, Gutters.regularVPadding, Gutters.tinyTMargin]}>
			<ProgressBar
				indeterminate={true}
				height={2}
				backgroundColor={Colors.secondary}
				animated={true}
				trackColor={Colors.solitude}
			  />
			</View>
	</View>;
	
	const sheetInitialSelectPremiseContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
		<View style={[Layout.colCenter]}>
			<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Colors.black]}>{t('premise_select_header')}</Text>
		</View>
		<View style={{height: '100%'}} >
			<BottomSheetFlatList 
				data={premiseArray}
				keyExtractor={(item, index) => index}
				renderItem={renderPremiseItem}
				contentContainerStyle={{
					padding: 20,					
				}}
				style={[{shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 20
					},
					shadowOpacity: .3,
					shadowRadius: 20,
					elevation: 10,
					}
				]}				
			>
			</BottomSheetFlatList>
		</View>
	</View>;
	
	const sheetNoCoverageContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
		<View style={[Layout.colCenter]}>
			<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, Colors.black, Gutters.regularHPadding]}>{t('fibre_not_available')}</Text>
			<View style={{alignItems:"center", position: 'absolute', right: 0, top: 0, alignItems: "flex-end", height: 40}}>
				<TouchableOpacity onPress={()=>
					{
						setSearchLocation('')
						setShowLocationSearchResults(false)
						setLocationSelected(false)
						setPremiseLookUpComplete(false)
						setLocationMarker(null)
						setSelectedPremise({})
						setPremiseArray([])
						
					}
				}>
					<View>
						<FontAwesomeIcon icon="fa-circle-xmark" color={Colors.semi_trans_black} size={25}/>
					</View>
				</TouchableOpacity>
			</View>
		</View>
		<View style={[Layout.fullWidth, Layout.colCenter]} >
			<Text style={[Fonts.textSmall, Fonts.montserrat_regular, Colors.black, Fonts.textCenter, Gutters.smallVMargin]}>{searchLocation}</Text>
			<View
				style={[{
				position: 'relative',
				height: 160,
				width: 160,
				justifyContent: 'center',
				alignItems: 'center',
				marginVertical:20
			}]}>
				
				<FontAwesomeIcon icon="fa-house-signal" color={Colors.light_gray} size={160} style={{position: 'absolute' , top: 10}}/>
				<FontAwesomeIcon icon="fa-slash" color={Colors.secondary} size={160} style={{position: 'absolute' , top: 10}}/>
			</View>
			
		</View>
	</View>;
	
	const sheetInConstructionContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
		<View style={[Layout.colCenter]}>
			<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, Colors.black, Gutters.largeHPadding]}>{t('fibre_under_construction')}</Text>
			<View style={{alignItems:"center", position: 'absolute', right: 0, top: 0, alignItems: "flex-end", height: 40}}>
				<TouchableOpacity onPress={()=>
					{
						setSearchLocation('')
						setShowLocationSearchResults(false)
						setLocationSelected(false)
						setPremiseLookUpComplete(false)
						setLocationMarker(null)
						setSelectedPremise({})
						setPremiseArray([])
					}
				}>
					<View>
						<FontAwesomeIcon icon="fa-circle-xmark" color={Colors.semi_trans_black} size={25}/>
					</View>
				</TouchableOpacity>
			</View>
		</View>
		<View style={[Layout.fullWidth, Layout.colCenter]} >
			<Text style={[Fonts.textSmall, Fonts.montserrat_regular, Colors.black, Fonts.textCenter, Gutters.smallVMargin]}>{searchLocation}</Text>
			<View
				style={[{
				position: 'relative',
				height: 160,
				width: 160,
				justifyContent: 'center',
				alignItems: 'center',
				marginVertical:20
			}]}>
				
				<FontAwesomeIcon icon="fa-person-digging" color={Colors.light_gray} size={160} style={{position: 'absolute' , top: 10}}/>
			</View>
			
		</View>
	</View>;
	
	const sheetPremiseServiceLoadingContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
		<View style={[Layout.colCenter]}>
			<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Colors.black]}>{t('premise_service_lookup_header')}</Text>
		</View>
		<View style={[Layout.fullWidth, Gutters.regularVPadding, Gutters.tinyTMargin]}>
			<ProgressBar
				indeterminate={true}
				height={2}
				backgroundColor={Colors.secondary}
				animated={true}
				trackColor={Colors.solitude}
			  />
			</View>
	</View>;
	
	const sheetActiveServiceContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
		<View style={[Layout.colCenter]}>
			<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, Colors.black, Gutters.largeHPadding]}>{t('fibre_premise_active_service')}</Text>
			<View style={{alignItems:"center", position: 'absolute', right: 0, top: 0, alignItems: "flex-end", height: 40}}>
				<TouchableOpacity onPress={()=>
					{
						setSearchLocation('')
						setShowLocationSearchResults(false)
						setLocationSelected(false)
						setPremiseLookUpComplete(false)
						setLocationMarker(null)
					}
				}>
					<View>
						<FontAwesomeIcon icon="fa-circle-xmark" color={Colors.semi_trans_black} size={25}/>
					</View>
				</TouchableOpacity>
			</View>
		</View>
		<View style={[Layout.fullWidth, Layout.colCenter]} >
			<Text style={[Fonts.textSmall, Fonts.montserrat_regular, Colors.black, Fonts.textCenter, Gutters.smallVMargin]}>{searchLocation}</Text>
			<View
				style={[{
				position: 'relative',
				height: 160,
				width: 160,
				justifyContent: 'center',
				alignItems: 'center',
				marginVertical:20
			}]}>
				
				<FontAwesomeIcon icon="fa-house-circle-exclamation" color={Colors.light_gray} size={160} style={{position: 'absolute' , top: 10}}/>
			</View>
			
		</View>
	</View>;
	
	const sheetLiveContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
		<View style={[Layout.colCenter]}>
			<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, Colors.black, Gutters.largeHPadding]}>{t('fibre_available')}</Text>
			<View style={{alignItems:"center", position: 'absolute', right: 0, top: 0, alignItems: "flex-end", height: 40}}>
				<TouchableOpacity onPress={()=>
					{
						setSearchLocation('')
						setShowLocationSearchResults(false)
						setLocationSelected(false)
						setPremiseLookUpComplete(false)
						setLocationMarker(null)
					}
				}>
					<View>
						<FontAwesomeIcon icon="fa-circle-xmark" color={Colors.semi_trans_black} size={25}/>
					</View>
				</TouchableOpacity>
			</View>
		</View>
		<View style={[Layout.fullWidth, Layout.colCenter]} >
			<Text style={[Fonts.textSmall, Fonts.montserrat_regular, Colors.black, Fonts.textCenter, Gutters.smallVMargin]}>{searchLocation}</Text>
			<View
				style={[{
				position: 'relative',
				height: 80,
				width: 80,
				justifyContent: 'center',
				alignItems: 'center',
				marginVertical:20
			}]}>
				
				<FontAwesomeIcon icon="fa-circle-check" color={Colors.success} size={80} style={{position: 'absolute' , top: 10}}/>
			</View>
			<View
				style={[
					Layout.fullWidth
				]}
			>
				<TouchableOpacity
					style={[Gutters.regularBMargin, Gutters.regularHPadding, Layout.fullWidth, {height:50, bottom:-20}]}
					onPress={()=>
						loadPackages()
					}
				>
				{packagesLoading ? 
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
					<LinearGradient colors={[Colors.primary_gradient_start, Colors.primary_gradient_mid]} style={[Common.button.rounded, Layout.colCenter, {height:'100%'}]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
					<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.white_text]}>{t('order_button_label')}</Text>
					</LinearGradient>
				}
				
				</TouchableOpacity>
			</View>
			
		</View>
	</View>;

	const sheetLoadingContent = <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
	<View style={[Layout.colCenter]}>
		<Text style={[Fonts.textRegular, Fonts.montserrat_bold, Fonts.textCenter, Colors.black, Gutters.largeHPadding]}>{t('general_loading_string')}</Text>
	</View>
	<View style={[Layout.fullWidth, Layout.colCenter]} >
		
		<View style={[Layout.fullWidth, Layout.largeVPadding, Gutters.smallTMargin]}>
			<ProgressBar
				indeterminate={true}
				height={2}
				backgroundColor={Colors.secondary}
				animated={true}
				trackColor={Colors.solitude}
			/>
		</View>
		
	</View>
	</View>;
	
	const resultsSheet = <BottomSheet
		ref={searchResultsSheetRef}
		initialSnapIndex={0}
		snapPoints={snapPoints}
		//onChange={handleSheetChanges}
		style={[{backgroundColor:Colors.transparent}]}
	>
		{!premiseLookUpComplete ? (
			sheetInitialLoadingContent
		) : (
			bottomDrawerContent
		)}
	</BottomSheet>;
	
	const onLocationSelected = async(item) => {
		setShowLocationSearchResults(false)
		setSearchLocation(item.description)
		setLocationID(item.place_id)
		const placesDetailsAPIUrl = Config.GOOGLE_PLACES_DETAILS_API_URL+'?key='+Config.GOOGLE_MAPS_API_KEY+'&place_id='+item.place_id;
		try{
			const placesDetailsResults = await fetch(placesDetailsAPIUrl);
			const jsonPlaceDetailsResults = await placesDetailsResults.json();
			setLocationGeometry(jsonPlaceDetailsResults.result.geometry.location)
			
			let tmpLocationMarker = {
				latitude: jsonPlaceDetailsResults.result.geometry.location.lat,
				longitude: jsonPlaceDetailsResults.result.geometry.location.lng,
				title: item.description,
			}
			let tmpMapRegion = {
				latitude: jsonPlaceDetailsResults.result.geometry.location.lat,
				longitude: jsonPlaceDetailsResults.result.geometry.location.lng,
				latitudeDelta: 0.02,
				longitudeDelta: 0.02,
			}
			setLocationMarker(tmpLocationMarker)
			setMapRegion(tmpMapRegion)
			
			mapView.animateToRegion(tmpMapRegion, 3000);
			setTimeout(() => setLocationSelected(true), 3500);
			
		}//try
		catch(err){
			setTimeout(() => 
				Toast.show({
				  type: 'error',
				  text1: t('network_error_header'),
				  text2: t('network_error_body'),
				  position: 'bottom',
				  autoHide: true,
				  visibilityTime: 4000
				}),
				setPremiseLookUpComplete(true)
			, 250);
		}
	}
	
	const onPremiseSelected = async(item) => {
		try{
			searchResultsSheetRef.current.snapToIndex(0)
		}//try
		catch(snapError){}//catch
		global.selectedPremise = item
		setSelectedPremise(item)
		setPremiseArray([])
		let tmpLocationMarker = {
			latitude: item.latitude,
			longitude: item.longitude,
			title: item.full_text,
		}
		let tmpMapRegion = {
			latitude: item.latitude,
			longitude: item.longitude,
			latitudeDelta: 0.02,
			longitudeDelta: 0.02,
		}
		setLocationMarker(tmpLocationMarker)
		setMapRegion(tmpMapRegion)
		
		mapView.animateToRegion(tmpMapRegion, 2000);
		setBottomDrawerContent(sheetPremiseServiceLoadingContent)
	}
	
	const scrollY = useRef(new Animated.Value(0)).current;
	
	const renderItem = ({item, index}) => {
		const scale = scrollY.interpolate({
			inputRange: [
				-1, 0,
				item_size * index,
				item_size * (index + 2)
			],
			outputRange: [
				1,1,1,0
			]
		})
		const opacity = scrollY.interpolate({
			inputRange: [
				-1, 0,
				item_size * index,
				item_size * (index + .6)
			],
			outputRange: [
				1,1,1,0
			]
		})
		return(
			<TouchableWithoutFeedback onPress={ () => onLocationSelected(item)}>
				<Animated.View style={[
					styles.item,
					{
						transform:[{scale}],
						opacity
					}
				
				]}>
					<FontAwesomeIcon icon="fa-location-crosshairs" color={Colors.semi_trans_black} size={icon_height} style={{marginVertical:10}}/>
					<View style={styles.suggestionsText}>
						<Text style={[Fonts.textSmall, Colors.black]}>{item.description}</Text>
					</View>
				</Animated.View>
			</TouchableWithoutFeedback>
		)
		
	}
	
	
	const [aexPremiseSearch, premise_result] = useLazyPremisesearchQuery()
	const [aexAreaValidation, area_result] = useLazyAreavalidationQuery()
	const [aexPremiseLookup, premise_details] = useLazyPremiselookupQuery()
	const [aexPremiseServices, premise_services] = useLazyPremiseservicesQuery()
	const [aexAllPackages, package_results] = useLazyAllpackagesQuery()
	
	const areaLookup = async () => {
		const areaResults = await aexAreaValidation({'lat': selectedLocationGeometry.lat, 'lng': selectedLocationGeometry.lng})
		//console.log(areaResults);
		
		if(typeof(areaResults.error)=="undefined"){
			if(areaResults.data.status=="Connected"){
				premiseSearch()
			}//if
			else if(areaResults.data.status=="Pre Order"){
				premiseSearch()
			}//else if
			else if(areaResults.data.status=="Show Your Interest"){
				//In Construction
				setBottomDrawerContent(sheetInConstructionContent)
				try{
					setTimeout(() => 
						setPremiseLookUpComplete(true),
						searchResultsSheetRef.current.snapToIndex(1)
					, 4500);	
				}//try
				catch(snapError){
					setTimeout(() => 
						setPremiseLookUpComplete(true)
					, 4500);
				}//catch
				
			}//else if
		}//if
		else{
			if(areaResults.error.status==404){
				setBottomDrawerContent(sheetNoCoverageContent)
				try{
					setTimeout(() => 
						setPremiseLookUpComplete(true),
						searchResultsSheetRef.current.snapToIndex(1)
					, 4500);
				}//try
				catch(snapError){
					setTimeout(() => 
						setPremiseLookUpComplete(true)
					, 4500);
				}//catch
				
			}//if
		}//else
	};
	
	const premiseSearch = async () => {
		const premiseResults = await aexPremiseSearch({'term': searchLocation, 'type':'query', 'q':searchLocation, 'count':100})
		
		if(premiseResults.status=='fulfilled'){
			if(premiseResults.data.result=="error"){
				
				setTimeout(() => searchResultsSheetRef.current.close(), 4000);
				setTimeout(() => 
					Toast.show({
					  type: 'error',
					  text1: t('network_error_header'),
					  text2: t('network_error_body'),
					  position: 'bottom',
					  autoHide: true,
					  visibilityTime: 4000
					}),
					setPremiseLookUpComplete(true)
				, 4500);

			}//if
			else{
				setPremiseArray(premiseResults.data.items)
				try{
					searchResultsSheetRef.current.snapToIndex(1)
				}//try
				catch(snapError){}//catch
			}//else
		}//if
	};
	
	const premiseLookup = async () => {
		//console.log(selectedPremise)
		const premiseLookupResults = await aexPremiseLookup({'premise_id': selectedPremise.id})
		
		if(premiseLookupResults.status=='fulfilled'){
			if(selectedPremise.premise_id=='null' || selectedPremise.premise_id==null){
				//Fibre Available
				setBottomDrawerContent(sheetLiveContent)
				try{
					searchResultsSheetRef.current.snapToIndex(1)
				}//try
				catch(snapError){}//catch
			}//if
			else{
				const premiseServiceLookupResults = await aexPremiseServices({'premise_id': selectedPremise.premise_id})
				//console.log(premiseServiceLookupResults)
				if(premiseServiceLookupResults.data.total>0){
					//Active Service
					setBottomDrawerContent(sheetActiveServiceContent)
					try{
						searchResultsSheetRef.current.snapToIndex(1)
					}//try
					catch(snapError){}//catch
				}//if
				else{
					//Fibre Available
					setBottomDrawerContent(sheetLiveContent)
					try{
						searchResultsSheetRef.current.snapToIndex(1)
					}//try
					catch(snapError){}//catch
				}//else
			}//else
			
		}//if
		else{
			
		}//else
	};

	const loadPackages = async() =>{
		setBottomDrawerContent(sheetLoadingContent);
		try{
			searchResultsSheetRef.current.snapToIndex(1)
		}//try
		catch(snapError){}//catch
		try{
			const allPackagesResults = await aexAllPackages();
			setAEXPackages(allPackagesResults)
			
		}//try
		catch(err){
			setTimeout(() => 
				Toast.show({
				  type: 'error',
				  text1: t('network_error_header'),
				  text2: t('network_error_body'),
				  position: 'bottom',
				  autoHide: true,
				  visibilityTime: 4000
				})
			, 250);
		}//catch
	};
	
  return (
  <View style={[{flex:1}, Layout.fullHeight]}>
  
  <KeyboardAwareScrollView scrollEnabled={true} resetScrollToCoords={{ x: 0, y: 0 }} style={[{backgroundColor: Colors.solitude}]} contentContainerStyle={[Layout.scrollSpaceBetween, Layout.largeBMargin, Layout.largeBPadding]}>
		<MapView
		  ref={(ref) => { setMapView(ref) }}
          style={styles.mapStyle}
          initialRegion={mapRegion}
          customMapStyle={mapStyle}
		>
			{locationMarker ? (
				<Marker coordinate={locationMarker}>
				</Marker>
			):
				null
			}
        </MapView>
		<SearchInput placeholder={t('coverage_check_text')} value={searchLocation}
			onChangeText={searchLocation => {
				setSearchLocation({ searchLocation })
				onChangeLocationDebounced(searchLocation)
			}}
			onFocus={() =>{
				setSearchLocation('')
				setShowLocationSearchResults(false)
				setLocationSelected(false)
				setPremiseLookUpComplete(false)
				setLocationMarker(null)
				setSelectedPremise({})
				setPremiseArray([])
			}}
			returnKeyType={'search'} 
			onPress={() =>
				navigateOpenDrawer()
			}
		/>
	</KeyboardAwareScrollView>
	{showLocationSearchResults? (
		<View style={[{ position: 'absolute', top: 60, flex: 1}, Layout.fullWidth]}>
			<View style={{height: '100%'}} >
				<Animated.FlatList 
					data={locationsArray}
					keyExtractor={(item, index) => index}
					renderItem={renderItem}
					contentContainerStyle={{
						padding: 20,
						
					}}
					style={[{backgroundColor: Colors.transparent}]}
					onScroll={Animated.event(
						[{nativeEvent: {contentOffset: {y: scrollY}}}],
						{useNativeDriver: true}
					)}
				>
				</Animated.FlatList>

			</View>
		</View>
	) : (null)}
	
	{locationSelected? (
		resultsSheet
	) : (null)}
	
	
	<MyToast/>
  </View>
  )
}


export default ResellerHomeContainer