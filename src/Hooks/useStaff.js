import { useSelector } from 'react-redux'


export default function () {
  // Get current User from the store
  const currentUser = useSelector(state => state.staff || null)
    
  let IsSignedIn = false;
  if(currentUser.id == null || currentUser.user_keep_logged_in == null){
	  IsSignedIn = false;
  }//if
  else{
	  if(currentUser.user_keep_logged_in == false){
		IsSignedIn = false; 
	  }//if
	  else{
		IsSignedIn = true;
	  }//else
  }//else
  
  
  // Build the User Account
  const UserAccount = {
	id: currentUser.id,
	email: currentUser.email,
	givenName: currentUser.givenName,
	familyName: currentUser.familyName,
	photo: currentUser.photo,
	name: currentUser.name,
	user_keep_logged_in: currentUser.user_keep_logged_in,
	is_logged_in: IsSignedIn,
  }
 
  // Return the User Account
  return {
	  ...UserAccount
	}
}
