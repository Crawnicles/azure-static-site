import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('https://gentle-rock-098dd0e10.5.azurestaticapps.net/api/getLog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email })
    });

    if (!response.ok) {
      const errorResponse = await response.text(); // Assuming error as plain text
      console.error('Failed to fetch:', errorResponse);
      return; // Exit the function or handle error appropriately
    }

    const data = await response.json(); // Only parse JSON if response is OK
    console.log(data);
  };


  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Emailll" />
      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
