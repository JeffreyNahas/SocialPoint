export const loadGoogleMapsScript = (apiKey: string | undefined, onLoadCallback: () => void) => {
    if (window.google && window.google.maps){
        onLoadCallback();
        return;
    }

    if (!apiKey) {
        console.error('Google Maps API key is not set');
        return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = onLoadCallback;
    document.body.appendChild(script);
}