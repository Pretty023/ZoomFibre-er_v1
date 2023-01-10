import React from 'react'
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';

const imageUploaderStyles=StyleSheet.create({
    container:{
        elevation:2,
        height:200,
        width:200,
        backgroundColor:'#efefef',
        position:'relative',
        borderRadius:999,
        overflow:'show',
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
function ImageUpload(){
	return (
		<Image config={imageUploaderStyles}/>
	)
	
}
 export default ImageUpload
