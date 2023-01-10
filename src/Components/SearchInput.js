import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/Hooks'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


const styles = StyleSheet.create({
  container: {
    height: 50, 
    position: 'relative',
	marginTop:10,
	
  },
  labelContainer: {
    position: 'absolute',
    top: -15,
    left: 25,
    padding: 5,
    zIndex: 50,
  },
  textInput: {
    flex: 1, 
    borderWidth: 0, 
    borderColor: "steel",
    justifyContent: 'flex-end',
    height: 50,
    borderRadius: 50,
    paddingHorizontal: 42,
	
  },
  verifyButton: {
    position: 'absolute',
    alignSelf: 'center',
	justifyContent: 'center',
	alignItems: 'center',
	flex:1,
    right: 10,
	top:5,
	backgroundColor: 'rgba(0,0,0,0.0)',
	borderRadius: 65,
	height: 40,
	width: 40,
	borderWidth: 0, 
    borderColor: "rgba(0,0,0,0.0)",
  },
  markerIcon: {
    position: 'absolute',
    alignSelf: 'center',
	justifyContent: 'center',
	alignItems: 'center',
	flex:1,
    left: 12,
	top:10,
	backgroundColor: 'rgba(0,0,0,0.0)',
	borderRadius: 65,
	height: 40,
	width: 40,
	borderWidth: 0, 
    borderColor: "rgba(0,0,0,0.0)",
  },
})

const generateBoxShadowStyle = (
  xOffset,
  yOffset,
  shadowColorIos,
  shadowOpacity,
  shadowRadius,
  elevation,
  shadowColorAndroid,
) => {
  if (Platform.OS === 'ios') {
    styles.boxShadow = {
      shadowColor: shadowColorIos,
      shadowOffset: {width: xOffset, height: yOffset},
      shadowOpacity,
      shadowRadius,
    };
  } else if (Platform.OS === 'android') {
    styles.boxShadow = {
      elevation,
      shadowColor: shadowColorAndroid,
    };
  }
};
const imageUploaderStyles=StyleSheet.create({
  imageUpload:{
      elevation:2,
      height:200,
      width:200,
      backgroundColor:'#efefef',
      position:'relative',
      borderRadius:999,
      overflow:'hidden',
  },
  uploadBtnContainer:{
      opacity:0.7,
      position:'absolute',
      right:0,
      bottom:0,
      backgroundColor:'lightgrey',
      width:'100%',
      height:'25%',
  },
  uploadBtn:{
      display:'flex',
      alignItems:"center",
      justifyContent:'center'
  }
})
generateBoxShadowStyle(0, 5, '#000', 0.34, 6.27, 10, '#000');

const SearchInput = ({ label, lblBgColor, isPassword, style, ...props}) => {
  const { Common, Layout, Images, Fonts, Colors, Gutters } = useTheme()
  
  return (
    <View style={[styles.container, Gutters.tinyHPadding]}>
	<TextInput style={[styles.textInput, styles.boxShadow, Fonts.montserrat_regular, Fonts.textSmall, {backgroundColor:Colors.inputBackground}]} {...props}/>
	<FontAwesomeIcon style={[styles.markerIcon]} icon="fa-location-dot" color={Colors.light_gray} size={26}/>
    <Pressable style={[styles.verifyButton]} {...props}>
		<FontAwesomeIcon icon="fa-circle-user" color={Colors.secondary} size={40}/>
	</Pressable>
  </View>
  )
}



export default SearchInput
