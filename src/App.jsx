import { useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

// executes once
const storedIDs = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIDs.map(id => AVAILABLE_PLACES.find(place => place.id === id))

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  // since it is a HOOK it must be in the root of the component function (not inside others)
  useEffect(() => { // this function will be exec AFTER the component function is done. it is EXTRA exec. 
  // Do not use it all the time, just to avoid infinite loop or exec AFTER componnet.
  // USEFUL FOR ASYNC
		navigator.geolocation.getCurrentPosition((position) => {
			const sortedPlaces = sortPlacesByDistance(
				AVAILABLE_PLACES,
				position.coords.latitude,
				position.coords.longitude
			);
			//if i call setAvailablePlaces here, it will cause an infinite loop
		});
	}, []); // if i have no dependencies, it will never re-excecute, otherwise it would change when a dependency changes

  /* //this is not directly related to the function of the app so it is A SIDE EFFECT
  navigator // provided by the browser
    .geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude)
      //if i call setAvailablePlaces here, it will cause an infinite loop
    }) */

  function handleStartRemovePlace(id) {
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIDs = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if(storedIDs.indexOf(id) === -1) //  avoid repeating items
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedIDs]))
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();

    const storedIDs = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
		if (storedIDs.indexOf(id) === -1)
			//  avoid repeating items
			localStorage.setItem(
				"selectedPlaces",
				JSON.stringify(storedIDs.filter(id => id !== selectedPlace.current))
			);
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
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={AVAILABLE_PLACES}
          onSelectPlace={handleSelectPlace}
          fallbackText="Sorting places..."
        />
      </main>
    </>
  );
}

export default App;
