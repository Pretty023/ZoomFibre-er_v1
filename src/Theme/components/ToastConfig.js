import React from 'react'
import { StyleSheet } from 'react-native'
import Toast, {BaseToast, ErrorToast } from 'react-native-toast-message';
import { Colors } from '../Variables';

  const toastConfig = {
	  success: (props) => (
		<BaseToast
		  {...props}
		  contentContainerStyle={{ paddingHorizontal: 4 }}
		  text1Style={{
			fontSize: 16,
			fontFamily: "Montserrat-Bold"
		  }}
		  text2Style={{
			fontSize: 14,
			fontFamily: "Montserrat-Regular"
		  }}
		/>
	  ),
	  error: (props) => (
		<ErrorToast
		  {...props}
		  text1Style={{
			fontSize: 16,
			fontFamily: "Montserrat-Bold"
		  }}
		  text2Style={{
			fontSize: 14,
			fontFamily: "Montserrat-Regular"
		  }}
		/>
	  ),
	  dark: (props) => (
		<ErrorToast 
		  {...props}
		  text1Style={{
			fontSize: 16,
			fontFamily: "Montserrat-Bold",
			color: Colors.white
		  }}
		  text2Style={{
			fontSize: 14,
			fontFamily: "Montserrat-Regular",
			color: Colors.white
		  }}
		  style={{ borderLeftColor: Colors.error }}
		  contentContainerStyle={{backgroundColor: Colors.error}}
		/>
	  )
	};

function MyToast(){
	return (
		<Toast config={toastConfig}/>
	)
	
}
 export default MyToast
