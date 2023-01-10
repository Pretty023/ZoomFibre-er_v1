import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, StyleSheet, Modal, Animated } from 'react-native';
import { useTheme } from '@/Hooks'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		width: "80%",
		backgroundColor: "rgba(255,255,255,1)",
		paddingHorizontal: 20,
		paddingVertical: 30,
		borderRadius: 20,
		elevation: 20,
		
	}
});

const CustomModal = ({visible, children}) => {
	const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme()
	const [showModal, setShowModal] = useState(visible);
	const scaleValue = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		toggleModal();
	}, [visible]);
	const toggleModal = () => {
		if(visible){
			setShowModal(true)
			Animated.spring(scaleValue,{
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}//if
		else{
			setTimeout(() => setShowModal(false), 200);
			
			Animated.timing(scaleValue, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}//else
	}
	return (
		<Modal transparent visible={showModal}>
			<View style={styles.modalBackground}>
				<Animated.View style={[styles.modalContainer, {transform:[{scale:scaleValue}]}]}>
					{children}
				</Animated.View>
			</View>
		</Modal>
	)
}

export default CustomModal