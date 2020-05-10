import * as firebase from "firebase/app";
import "firebase/firestore";
import React from "react"
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyAuJpDa2F6jUWFs7lVQBakFEcydtyddYQM",
  authDomain: "lastats.firebaseapp.com",
  databaseURL: "https://lastats.firebaseio.com",
  projectId: "lastats",
  storageBucket: "lastats.appspot.com",
  messagingSenderId: "450437294925",
  appId: "1:450437294925:web:6e94f612ab36e4f83da504"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const RATE = 2.5;
export const useEmissions = () => {
  const [emissions, loading, err] = useCollectionData(db.collection('emissions'))
  if ((emissions && !emissions.length)) {
    debugger;
  }
  const emissionsObj = React.useMemo(
    () => !emissions || !emissions.length
      ? null
      : emissions.reduce(
        (acc, em) => ({ ...acc, [em.id]: em }), {}
      ),
    [emissions]
  );
  return [emissionsObj, loading, err]
}

export const useData = () => {
  const [statuses, sLoading, sErr] = useCollectionData(db.collection('statuses'), {idField: 'id'})
  const [emissionsObj, eLoading, eErr] = useEmissions()
  const errors = [sErr, eErr].filter(e => !!e)
  const loading = sLoading || eLoading;

  return React.useMemo(() => {
    if (!statuses || !emissionsObj) {
      return [null, loading, errors]
    }

    // console.log(statuses);
    const dates = statuses.map(s => s.id);
    let _data = statuses; // [{emissionId: [{ emissionId: status }], id: date}]
    _data = groupStatusesByEmission(statuses); // { emissionId: [{date: emissionStatus}] }

    _data = Object.entries(_data) // [[emissionId, emission]]
      .map(([id, data]) => ({id, data})) // [{id: emissionId, data: [emissionStatus]}]
      .filter(({data}) => data.some(st => st.type !== 'EXTINGUISHED'))
      .filter(({data}) => data.some(st => st.rest !== 0))

      .map(emission => {
        emission.data = emission.data.map((st) => {
          const em = emissionsObj[st.id]
          const bought = em.count - st.rest;
          return ({
            ...st,
            x: new Date(Number(st.time)),
            y: getPrice(bought, em, st)
          })
        })
        return emission
      })
      .map((emission) => {
        dates.forEach((date) => {

        })
        return emission;
      })

    return [_data, loading, errors];
  }, [statuses, emissionsObj, errors, loading]);
}

function getPrice(bondsCount, emission, st) {
  if (!emission) {
    console.log('Unknown emission', st.id)
    return 0;
  }
  return bondsCount * emission.computed_price
}

function groupStatusesByEmission(statuses) {
  return statuses
    .reduce((acc, dayStatus) => {
      const time = dayStatus.id;
      delete dayStatus.id;

      Object.values(dayStatus)
        .forEach((emisStatus) => {
          acc[emisStatus.id] = acc[emisStatus.id] || [];
          acc[emisStatus.id].push({...emisStatus, time})
        })
      return acc
    }, {})
}