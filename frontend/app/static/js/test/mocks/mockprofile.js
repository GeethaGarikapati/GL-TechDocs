
import { isEqualObjects,baseApiUrl } from "../helpers.js";
export {mockhandlers};
var getProfileAPIUrl = baseApiUrl + "getProfile";
var updateProfileAPIUrl = baseApiUrl + "updateProfile";
var userProfiles=
{
  '123456':{
    firstName:'Sarith',
    lastName:'Madhu'
  },
  '789123':
  {
    firstName: 'Tech',
    lastName:'Docs'
  }
};
function writeProfiles(profiles)
{
  localStorage.setItem('userProfiles',JSON.stringify(profiles));
}
if(!(localStorage.getItem('userProfiles')))
{
  writeProfiles(userProfiles);
}
function getProfiles()
{
  return JSON.parse(localStorage.getItem('userProfiles'));
}

function getProfileData(authtoken)
{
  var userData=getProfiles();
  return userData[authtoken];
}
var user1GetRequest = {
    authToken:'123456'    
}
var user2GetRequest = {
  authToken:'789123'    
}


var profileDataFailure = {
    status:false,
    message:"MOCK : Unable to fetch Data"
}

var updateProfileDataFailure = {
  status:false,
  message:"MOCK : Unable to update Data"
}
function checkValidProfileRequest(data)
{
  return isEqualObjects( data, user1GetRequest ) || isEqualObjects( data, user2GetRequest );
}
var getProfileUser={
    url: getProfileAPIUrl,
    data: function( data ) {
        return checkValidProfileRequest(data);
      },
    status:200,
    response:function(settings)
    {
      var response = {
        status:true,
        userData:getProfileData(settings.data.authToken)
      };
      this.responseText=response;
    }
  };



  var profileDataFailure={
    url: getProfileAPIUrl,
    data: function( data ) {
        return !checkValidProfileRequest(data);
      },
    status:401,
    responseText:profileDataFailure
  };

  function checkValidUpdateRequest(data)
  {
    if(data.authToken!='123456'&&data.authToken!='789123')
      return false;
    if(data.userData.firstName.length>10) return false;
    return true;
  }
  function updateProfileData(data)
  {
    var token = data.authToken;
    var userData=getProfiles();
    userData[token].firstName=data.userData.firstName;
    userData[token].lastName = data.userData.lastName;
    writeProfiles(userData);

  }
  var updateProfileUser={
    url: updateProfileAPIUrl,
    data: function( data ) {
        return checkValidUpdateRequest(data);
      },
    status:200,
    response:function(settings)
    {
      var response = {
        status:true,
        userData:updateProfileData(settings.data)
      };
      this.responseText=response;
    }
  };

  var updateProfileUserFailure={
    url: updateProfileAPIUrl,
    data: function( data ) {
        return !checkValidUpdateRequest(data);
      },
    status:[402,404,500],
    responseText:updateProfileDataFailure
  };
  
  var mockhandlers=[
    getProfileUser,
    profileDataFailure,
    updateProfileUser,
    updateProfileUserFailure
    
            ];
  