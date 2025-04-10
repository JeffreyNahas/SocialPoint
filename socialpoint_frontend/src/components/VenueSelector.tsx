import React, { useRef, useEffect, useState } from 'react';
import { loadGoogleMapsScript } from '../utils/loadGoogleMaps';


export interface VenueData{
    address: string;
    placeId: string;
    latitude?: number;
    longitude?: number;
}

interface VenueSelectorProps {
    onVenueSelected: (venue: VenueData | null) => void;
}

export const VenueSelector: React.FC<VenueSelectorProps> = ({
    onVenueSelected,
}) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

;    useEffect(() => {
        loadGoogleMapsScript(import.meta.env.VITE_GOOGLE_MAPS_API_KEY, () => {
            setIsScriptLoaded(true);
        });
    }, [])
    

    useEffect(() => {
        // Initializing Google API autocomplete
        if (isScriptLoaded && inputRef.current && !autocompleteRef.current) {
            autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
              types: ['establishment', 'geocode'],
              fields: ['formatted_address', 'geometry', 'place_id'],
            });

        // adding listener to changed user input
        autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();

            if (place) {
                const venueData: VenueData = {
                    address: place.formatted_address || '',
                    placeId: place.place_id || '',
                    latitude: place.geometry?.location?.lat(),
                    longitude: place.geometry?.location?.lng(),
                };
                onVenueSelected(venueData);
            }
        });
      }

      return () => {
        if (autocompleteRef.current) {
            google.maps.event.clearInstanceListeners(autocompleteRef.current);
            autocompleteRef.current = null;
        }
      };
    }, [onVenueSelected, isScriptLoaded]);

    return (
        <div className='venue-selector'>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search for a venue"
                className="w-full p-2 border border-gray-300 rounded-md"
            />
        </div>
    );
    };