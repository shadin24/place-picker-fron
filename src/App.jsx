import { useEffect, useRef, useState } from 'react';
import Places from './components/Places.jsx';
import { AVAILABLE_PLACES ,} from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';





const storageid = JSON.parse(localStorage.getItem('selectedPlace')) || [];
const storedplace = storageid.map(id => AVAILABLE_PLACES.find((place) => place.id === id));

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedplace);

  useEffect(() => {
    const fetchPlaces = (lat, lon) => {
      fetch(`https://place-picker-backend.vercel.app/places/proximity/?lat=${lat}&lon=${lon}`)
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then((data) => {
          const adjustedData = data.map((place) => ({
            ...place,
            image: {
              ...place.image,
              src: place.image.src,
            },
          }));
  
          setAvailablePlaces(adjustedData);
        })
        .catch((error) => {
          console.error("Error fetching places:", error);
        });
    };
  
    const handleSuccess = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      fetchPlaces(latitude, longitude);
    };
  
    const handleError = (error) => {
      console.error("Error getting geolocation:", error);
      
      
      const defaultLatitude = 37.7749; 
      const defaultLongitude = -122.4194; 
      fetchPlaces(defaultLatitude, defaultLongitude);
    };
  
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);
  


  function handleStartRemovePlace(id) {
    if (modal.current) {
      modal.current.open();
    }
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    if (modal.current) {
      modal.current.close();
    }
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const storedid = JSON.parse(localStorage.getItem('selectedPlace')) || [];
    if (storedid.indexOf(id) === -1) {
      localStorage.setItem('selectedPlace', JSON.stringify([id, ...storedid]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    if (modal.current) {
      modal.current.close();
    }

    const storedid = JSON.parse(localStorage.getItem('selectedPlace')) || [];
    localStorage.setItem('selectedPlace', JSON.stringify(storedid.filter((id) => id !== selectedPlace.current)));
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src="https://res.cloudinary.com/dpuz94s75/image/upload/v1724217203/logo_iojgba.png" alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="sorting places by distance"
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
