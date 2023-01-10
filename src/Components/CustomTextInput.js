import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, StyleSheet } from 'react-native';
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
    borderWidth: 1, 
    borderColor: "steel",
    justifyContent: 'flex-end',
    height: 44,
    borderRadius: 50,
    paddingHorizontal: 25,
  },
  markerIcon: {
    position: 'absolute',
    alignSelf: 'center',
	justifyContent: 'center',
	alignItems: 'center',
	flex:1,
    right: 10,
	top:15,
	backgroundColor: 'rgba(0,0,0,0.0)',
	borderRadius: 50,
	height: 40,
	width: 40,
	borderWidth: 0, 
    borderColor: "rgba(0,0,0,0.0)",
  },
})

const CustomTextInput = ({ label, name, lblBgColor, isPassword, requiredField, validState, value, style, ...props}) => {
	
  const { Layout, Images, Fonts, Colors } = useTheme() 
  const [validationPassed, setFieldIsValid] = useState('initial')
  
  let fieldIndicator;
  
  if(requiredField){
	  fieldIndicator = <FontAwesomeIcon style={[styles.markerIcon, {top:20, right:16}]} icon="fa-asterisk" color={Colors.secondary} size={10}/>;
  }//if
  else{
	  fieldIndicator = "";
  }//else
  
	
  const checkInputValue = () => {
	if(value.length > 0){
		if(requiredField){
			setFieldIsValid('true')
			validState(name, true)
		}//if
		else{
			setFieldIsValid('initial')
			validState(name, true)
		}//else
	}//if
	else{
		if(requiredField){
			setFieldIsValid('false')
			validState(name, false)
		}//if
		else{
			setFieldIsValid('initial')
			validState(name, true)
		}//else
		
	}//else
  }

  const setFieldInitialState = () => {
	if(value.length > 0){
		if(requiredField){
			validState(name, true)
		}//if
		else{
			validState(name, true)
		}//else
	}//if
	else{
		if(requiredField){
			validState(name, false)
		}//if
		else{
			validState(name, true)
		}//else
		
	}//else
  }

  return (
    <View style={styles.container}>
    <View style={[styles.labelContainer, Fonts.montserrat_regular, {backgroundColor: lblBgColor}]}>
		<Text style={[Fonts.montserrat_regular, Fonts.textSmall]}>{label}</Text>
    </View>
	{!isPassword ? (
		<TextInput value={value} style={[styles.textInput, Fonts.montserrat_regular, Fonts.textSmall]} onBlur={checkInputValue} onLayout={setFieldInitialState} {...props}/>
	) : (
		<TextInput value={value} secureTextEntry={true} style={[styles.textInput, Fonts.montserrat_regular, Fonts.textSmall]} onBlur={checkInputValue} onLayout={setFieldInitialState} {...props}/>
	)}
	{
		validationPassed=='initial' ? (
			fieldIndicator
		) : 
		null
	}
	{
		validationPassed=='true' ? (
			<FontAwesomeIcon style={[styles.markerIcon]} icon="fa-circle-check" color={Colors.success} size={20}/>
		) : 
		null
	}
	{
		validationPassed=='false' ? (
			<FontAwesomeIcon style={[styles.markerIcon]} icon="fa-circle-xmark" color={Colors.error} size={20}/>
		) : 
		null
	}
  </View>
  )
}


export default CustomTextInput
