import { useSelector } from 'react-redux'


export default function () {
  // Get current reseller from the store
  const currentReseller = useSelector(state => state.reseller || null)
  
  let resellerIsLoggedIn = false;
  if(currentReseller.reseller_id == null || currentReseller.reseller_keep_logged_in == null){
	  resellerIsLoggedIn = false;
  }//if
  else{
	  if(currentReseller.reseller_keep_logged_in == false){
		resellerIsLoggedIn = false; 
	  }//if
	  else{
		resellerIsLoggedIn = true;
	  }//else
  }//else
  
  
  // Build the Reseller Account
  const resellerAccount = {
    id: currentReseller.reseller_id,
	username: currentReseller.reseller_username,
	password: currentReseller.reseller_password,
	first_name: currentReseller.reseller_first_name,
	last_name: currentReseller.reseller_last_name,
	email_address: currentReseller.reseller_email_address,
	reseller_company: currentReseller.reseller_company,
	user_group: currentReseller.reseller_user_group,
	keep_logged_in: currentReseller.reseller_keep_logged_in,
	is_logged_in: resellerIsLoggedIn,
  }

  // Return the Reseller Account
  return {
	  ...resellerAccount
	}
}

