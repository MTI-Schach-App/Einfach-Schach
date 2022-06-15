import React, { Component } from 'react';
import {QrReader} from 'react-qr-reader';
import { useStore } from '../../utils/store';
import {QRFinder} from './qrfinder'

import { fetchWrapper } from '../../utils/fetch-wrapper';
import { User } from '../../interfaces/user';
import { useRouter } from 'next/router';

function QRReader(){
  
  const { setLoggedInState } = useStore();
  const router = useRouter();
 
  const handleScan = async (data) => {
    if (data){
      const name = data.toString()

    const usersRepo: User[] = await fetchWrapper.get('api/users/all');
    if (
      usersRepo
        .flatMap((user) => user.name)
        .includes(name)
    ) {
      setLoggedInState(
        usersRepo.filter((user) => user.name === name)[0]
      );
    } else {
      setLoggedInState({
        id: 0,
        name: name,
        displayName: name,
        level: 0,
        currentGame: '',
        currentCourse: '',
        dateUpdated: '0',
        dateCreated: '0',
        coursesFinished: [],
        wantsToClick: false
      });
      router.push('/signup');
    }
    
    }
  }
  const handleError = err => {
    console.error(err)
  }
  return(
    
      <div>
        <QrReader
        ViewFinder={QRFinder}
        scanDelay={2000}
        constraints={{facingMode:'environment'}}
          onResult={handleScan}
          
          videoContainerStyle={{ width: '40rem' }}
        />
      </div>  
   
  )
}

export default QRReader;
