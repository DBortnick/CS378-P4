import './Weather.css';
import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

const Weather = () => {
  const [curCity, setCurCity] = useState('');
  const [newCity, setNewCity] = useState('Replace With Any City');
  const [mostRec, setMostRec] = useState('Most Recent Lookup');
  const [timeData, setTimeData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [weatherAvailable, setWeatherAvailable] = useState(true);

  const databaseURL = "https://proj---4-default-rtdb.firebaseio.com/";

  useEffect(() => {
    fetchNewWeatherData(curCity);
  }, [curCity]);
  
  useEffect(() => {
    fetchUserCity();
  }, []);
  
  const fetchNewWeatherData = async (cityName) => {
    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`);
      const geoData = await geoResponse.json();
      if (geoData.results[0] != null) {
        const city = geoData.results[0];
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=temperature_2m&temperature_unit=fahrenheit`);
        const data = await response.json();
        console.log(data);
        setTimeData(data.hourly.time);
        setTempData(data.hourly.temperature_2m);
        setWeatherAvailable(true);
      } else {
        setWeatherAvailable(false);
        console.log(`Could not find weather for ${cityName}.`);
      }
    } catch (error) {
      setWeatherAvailable(false);
      console.log(error);
    }
  };

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(user.email);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);


  const setUserCity = async (cityName) => {
    return fetch(`${databaseURL + "/" + user?.uid}/.json`, {
      method: "PUT",
      body: JSON.stringify(cityName)
    }).then((res) => {
      if (res.status !== 200) {
        console.log("ERROR: " + res);
      } else {
        console.log("Successfully set the data. Check the database.");
        return;
      }
    });
  };

  const fetchUserCity = async () => {
    fetch(`${databaseURL + "/" + user?.uid}/.json`)
      .then((res) => {
        if (res.status !== 200) {
          console.log("ERROR: " + res);
        } else {
          return res.json();
        }
      })
      .then((res) => {
        if (res === null) {
          setUserCity("Austin");
          setCurCity("Austin");
        } else {
          setCurCity(res);
          setMostRec(res);
        }
      });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '150vh',
      width: '100vw',
      backgroundColor: 'lightgray',
      color: 'black',
      fontFamily: "copperplate",
      font: 'largest',
    }}>

        <h1>{name}</h1>
        <button style= {{
          color: 'white',
          backgroundColor: "black",
          borderColor: 'white',
          padding: '5px',
          borderRadius: '50%',
          fontFamily: "copperplate",
        }}onClick={logout}>
            Logout
        </button>

      <h1>{curCity} Weather Today</h1>
      <div>
        <button style= {{
          color: 'white',
          backgroundColor: "black",
          borderColor: 'white',
          padding: '5px',
          borderRadius: '50%',
          fontFamily: "copperplate",
          justifyItems: 'left',
        }}onClick={() => {
          setCurCity('Dallas');
          setNewCity('Replace With Any City');
          setUserCity('Dallas');
        }}>Dallas</button>
        <button style= {{
          color: 'white',
          backgroundColor: "black",
          borderColor: 'white',
          padding: '5px',
          borderRadius: '50%',
          fontFamily: "copperplate",
        }}onClick={() => {
          setCurCity('Austin');
          setNewCity('Replace With Any City');
          setUserCity('Austin');
      }}>Austin</button>
        <button style= {{
          color: 'white',
          backgroundColor: "black",
          borderColor: 'white',
          padding: '5px',
          borderRadius: '50%',
          fontFamily: "copperplate",
        }}onClick={() => {
          setCurCity('Houston');
          setNewCity('Replace With Any City');
          setUserCity('Houston');
        }}>Houston</button>
        <button style= {{
          color: 'white',
          backgroundColor: "black",
          borderColor: 'white',
          padding: '5px',
          borderRadius: '50%',
          fontFamily: "copperplate",
        }}onClick={() => {
          setCurCity(mostRec);
          setNewCity('Replace With Any City');
          setUserCity(mostRec);
        }}>{mostRec}</button>
      </div>
      <br />
      <row>
        <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <button style= {{
          color: 'white',
          backgroundColor: "black",
          borderColor: 'white',
          padding: '6px 10px',
          borderRadius: '50%',
          fontSize: '15px',
          fontFamily: "copperplate",
        }}onClick={() => setCurCity(newCity) & setMostRec(newCity)}>+</button>
      </row>
      {weatherAvailable ? (
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '35vw',
        }}>
          <div style={{ 
            flex: '0.5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', 
          }}>
            <h3>Hour</h3>
            {timeData.slice(0,10).map((time, index) => (
              <p key={index}>{index+12 + ":00"}</p>
              ))}
          </div>
          <div style={{ 
            flex: '0.5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', 
          }}>
            <h3>Temp°F</h3>
            {tempData.slice(0,10).map((temp, index) => (
              <p key={index}>{temp}</p>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>Weather not available for {curCity}.</h3>
        </div>
      )}
    </div>
  );
};

export default Weather;