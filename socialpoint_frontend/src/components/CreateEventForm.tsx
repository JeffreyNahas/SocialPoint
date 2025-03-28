const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await axios.post(
      'http://localhost:3000/api/events',
      {
        name,
        description,
        date,
        startTime,
        endTime,
        category,
        venueLocation
        // organizerId is omitted since the backend will use the current user
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    // Handle success...
  } catch (error) {
    // Handle error...
  }
}; 