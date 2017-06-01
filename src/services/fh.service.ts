import { Injectable } from '@angular/core';

import {Md5} from 'ts-md5/dist/md5';

// Services
import { StateService } from './state.service';

import * as $fh from 'fh-js-sdk';

@Injectable()
export class FHService {
  constructor(private stateService: StateService) {

  }

  getFormattedTime(date) {
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + (date.getMinutes()+1)).slice(-2);
  }

  getFormattedDate(date) {
    return  date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2);
  }

  getUrl = () => {
    return $fh.getCloudURL();
  }

  login = (username: string, password: string) => {
    
    return new Promise<any>(function(resolve, reject) {
        var params = {
          path: 'login',
          method: 'POST',
          contentType: "application/json",
          data: { username: username, password: password },
          timeout: 15000
        };

      $fh.cloud(
        params, 
        (data) => {
          resolve(data);
        }, 
        (msg, err) => {
          // An error occurred during the cloud call. Alert some debugging information
          console.log('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
          reject({msg: msg, err: err});
        });
    });
  }

  auth = (username: string, password: string) => {
    return new Promise<any>(function(resolve, reject) {
        // LDAP or Platform User Example
        $fh.auth({
          "policyId": "My LDAP Auth Policy", // name of auth policy to use - see link:{ProductFeatures}#administration[Auth Policies Administration] for details on how to configure an auth policy
          "clientToken": "myAppId", // Your App ID
          "params": { // the parameters associated with the requested auth policy - see below for full details.
            "userId": username, 
            "password": password 
          }
        }, function (res) {
          // Authentication successful - store sessionToken in variable
          var sessionToken = res.sessionToken; // The platform session identifier
          var authResponse = res.authResponse; // The authentication information returned from the authentication service.
          // This may include things such as validated email address,
          // OAuth token or other response data from the authentication service
          resolve(res);
        }, function (msg, err) {
          console.log('LOGIN ERROR: ', JSON.stringify(msg), JSON.stringify(err));
          var errorMsg = err.message;
          /* Possible errors:
            unknown_policyId - The policyId provided did not match any defined policy. Check the auth policies defined. See link:{ProductFeatures}#administration[Auth Policies Administration]
            user_not_found - The auth policy associated with the policyId provided has been set up to require that all users authenticating exist on the platform, but this user does not exists.
            user_not_approved - - The auth policy associated with the policyId provided has been set up to require that all users authenticating are in a list of approved users, but this user is not in that list.
            user_disabled - The user has been disabled from logging in.
            user_purge_data - The user has been flagged for data purge and all local data should be deleted.
            device_disabled - The device has been disabled. No user or apps can log in from the requesting device.
            device_purge_data - The device has been flagged for data purge and all local data should be deleted.
          */
          if (errorMsg === "user_purge_data" || errorMsg === "device_purge_data") {
            // User or device has been black listed from administration console and all local data should be wiped
          } else {
            //alert("Authentication failed - " + errorMsg);
          }
          reject(err);
        });
    });
  }

  sayHello = (endpoint: string, method: string, name: string) => {
    return new Promise<any>(function(resolve, reject) {
      var params = {
          path: endpoint,
          method: method,
          contentType: "application/json",
          data: { hello: name },
          timeout: 15000
        };

      $fh.cloud(
        params, 
        function(data) {
          resolve(data);
        }, 
        function(msg, err) {
          // An error occurred during the cloud call. Alert some debugging information
          console.log('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
          reject({msg: msg, err: err});
        });
    });
  }

  getEventsAtLocationForToday = (country: string, city: string) => {
    return new Promise<any>(function(resolve, reject) {
        if (!country || !city) {
          reject({err: 'Not enough or good parameters country: ' + country + ' city: ' + city});
        }
        var params = {
          path: 'events/' + country.toUpperCase() + '/' + city.toUpperCase(),
          method: 'GET',
          contentType: "application/json",
          //data: { country: country, city: city },
          timeout: 15000
        };

      $fh.cloud(
        params, 
        function(data) {
          resolve(data);
        }, 
        function(msg, err) {
          // An error occurred during the cloud call. Alert some debugging information
          console.log('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
          reject({msg: msg, err: err});
        });
    });
  }

  getQuizById = (id: string) => {
    return new Promise<any>(function(resolve, reject) {
        if (!id) {
          reject({err: 'Not enough or good parameters id: ' + id});
        }
        var params = {
          path: 'quizzes?id=' + id,
          method: 'GET',
          contentType: "application/json",
          timeout: 15000
        };

      $fh.cloud(
        params, 
        function(data) {
          resolve(data);
        }, 
        function(msg, err) {
          // An error occurred during the cloud call. Alert some debugging information
          console.log('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
          reject({msg: msg, err: err});
        });
    });
  }

  getLiveQuizById = (eventId: string, quizId: string) => {
    return new Promise<any>(function(resolve, reject) {
        if (!eventId || !quizId) {
          reject({err: 'Not enough or good parameters eventId: ' + eventId + ' quizId: ' + quizId});
        }
        var params = {
          path: 'live/quiz',
          method: 'GET',
          contentType: "application/json",
          data: {eventId: eventId, quizId: quizId},
          timeout: 15000
        };

      $fh.cloud(
        params, 
        function(data) {
          resolve(data);
        }, 
        function(msg, err) {
          // An error occurred during the cloud call. Alert some debugging information
          console.log('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
          reject({msg: msg, err: err});
        });
    });
  }

  submitAnswer (eventId: string, quizId: string, username: string, question: number, answer: number) {
    var _this = this;
    return new Promise<any>(function(resolve, reject) {
        if (!eventId || !quizId) {
          reject({err: 'Not enough or good parameters eventId: ' + eventId + ' quizId: ' + quizId});
        }
        
        var date: string = _this.getFormattedDate(new Date());
        var payload: any = {username: username, eventId: eventId, quizId: quizId, date: date, question: question}
        // id is not part of the MD5 for obvious reasons, 
        payload.id = Md5.hashAsciiStr(JSON.stringify(payload));
        // answer is not because different answers are not allowed
        payload.answer = answer;

        var params = {
          path: 'answers',
          method: 'POST',
          contentType: "application/json",
          data: payload,
          timeout: 15000
        };

      $fh.cloud(
        params, 
        function(data) {
          resolve(data);
        }, 
        function(msg, err) {
          // An error occurred during the cloud call. Alert some debugging information
          console.log('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
          reject({msg: msg, err: err});
        });
    });
  }
}