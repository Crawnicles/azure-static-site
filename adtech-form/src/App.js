import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const initialFormState = {
    name: '',
    machine: '',
    date: '',
    workOrder: '',
    serialNumber: '',
    partNumber: '',
    quantity: '',
    notes: '',
    setupTime: '00:00:00',
    machiningTime: '00:00:00'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSetupActive, setIsSetupActive] = useState(false);
  const [setupStartTime, setSetupStartTime] = useState(null);
  const [isMachiningActive, setIsMachiningActive] = useState(false);
  const [machiningStartTime, setMachiningStartTime] = useState(null);
  const [isMachiningPaused, setIsMachiningPaused] = useState(false);
  const [machiningPauseTime, setMachiningPauseTime] = useState(null);
  const [lastSubmission, setLastSubmission] = useState(null);

  useEffect(() => {
    let interval;
    if (isSetupActive) {
      interval = setInterval(() => {
        const elapsed = setupStartTime ? Math.floor((Date.now() - setupStartTime) / 1000) : 0;
        const formattedTime = new Date(elapsed * 1000).toISOString().substr(11, 8);
        setFormData(formData => ({ ...formData, setupTime: formattedTime }));
      }, 1000);
    } else if (isMachiningActive && !isMachiningPaused) {
      interval = setInterval(() => {
        const elapsed = machiningStartTime ? Math.floor((Date.now() - machiningStartTime) / 1000) : 0;
        const formattedTime = new Date(elapsed * 1000).toISOString().substr(11, 8);
        setFormData(formData => ({ ...formData, machiningTime: formattedTime }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSetupActive, isMachiningActive, isMachiningPaused, setupStartTime, machiningStartTime, machiningPauseTime]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const startSetupTimer = () => {
    setIsSetupActive(true);
    setSetupStartTime(Date.now());
  };

  const startMachiningTimer = () => {
    setIsSetupActive(false);
    setIsMachiningActive(true);
    setMachiningStartTime(Date.now());
  };

  const pauseMachiningTimer = () => {
    if (!isMachiningPaused) {
      setMachiningPauseTime(Date.now());
    } else {
      setMachiningStartTime(prevStartTime => prevStartTime + (Date.now() - machiningPauseTime));
      setMachiningPauseTime(null);
    }
    setIsMachiningPaused(!isMachiningPaused);
  };

  const stopMachiningTimer = () => {
    setIsMachiningActive(false);
    setMachiningPauseTime(null);
  };


  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch('http://localhost:7071/api/getLog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/raw'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Failed to submit form');
    }

    const responseData = await response;
    console.log('Form submitted successfully:', responseData);
    setLastSubmission(formData);
    setFormData({
      name: '',
      machine: '',
      date: '',
      workOrder: '',
      serialNumber: '',
      partNumber: '',
      quantity: '',
      notes: '',
      setupTime: '00:00:00',
      machiningTime: '00:00:00'
    });
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

  return (
    <div className="App">
      <header className="App-header">
        <h2>Machinist Daily Log</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <select id="name" name="name" value={formData.name} onChange={handleInputChange}>
              <option value="">Name</option>
              <option value="anthony">Anthony</option>
              <option value="bao">Bao</option>
              <option value="brennon">Brennon</option>
              <option value="don">Don</option>
              <option value="edgar">Edgar</option>
              <option value="felipe">Felipe</option>
              <option value="jesus">Jesus</option>
              <option value="larry">Larry</option>
              <option value="luke">Luke</option>
              <option value="michael">Michael</option>
              <option value="randy">Randy</option>
              <option value="rick">Rick</option>
              <option value="tai">Tai</option>
              <option value="tyler">Tyler</option>
            </select>
          </div>
          <div>
            <label htmlFor="machine">Machine:</label>
            <select id="machine" name="machine" value={formData.machine} onChange={handleInputChange}>
            <option value="">Select a Machine</option>
              <option value="410h">410H</option>
              <option value="dahlil mill">Dahlil Mill</option>
              <option value="dahlil vertical access">Dahlil Vertical Access</option>
              <option value="haas small">Haas Small</option>
              <option value="hl-4">HL-4</option>
              <option value="lathe">Lathe</option>
              <option value="lehman">Lehman</option>
              <option value="m5">M5</option>
              <option value="mazak 3 axis">Mazak 3 Axis</option>
              <option value="mazak 5 axis">Mazak 5 Axis</option>
              <option value="haas st-40l">Haas ST-40L</option>
              <option value="polish">Polish</option>
              <option value="rotor">Rotor</option>
              <option value="sc-20">SC-20</option>
              <option value="sc-25">SC-25</option>
              <option value="sc-32">SC-32</option>
              <option value="slant 60">Slant 60</option>
              <option value="summit manual">Summit Manual</option>
            </select>
          </div>
          <div>
            <label htmlFor="date">Date:</label>
            <input id="date" type="date" name="date" value={formData.date} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="workOrder">Work Order:</label>
            <input id="workOrder" type="text" name="workOrder" value={formData.workOrder} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="serialNumber">Serial Number:</label>
            <input id="serialNumber" type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="partNumber">Part Number:</label>
            <input id="partNumber" type="text" name="partNumber" value={formData.partNumber} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="quantity">Quantity:</label>
            <input id="quantity" type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="notes">Notes:</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange}></textarea>
          </div>
          <div>
            <label htmlFor="setupTime">Setup Time:</label>
            <input id="setupTime" type="text" name="setupTime" value={formData.setupTime} onChange={handleInputChange}/>
          </div>
          <div>
            <label htmlFor="machiningTime">Machining Time:</label>
            <input id="machiningTime" type="text" name="machiningTime" value={formData.machiningTime} onChange={handleInputChange}/>
          </div>
          <div>
            <button type="button" onClick={startSetupTimer}>Start Setup Timer</button>
            <button type="button" onClick={startMachiningTimer} disabled={!setupStartTime || isMachiningActive}>Start Machining Timer</button>
            <button type="button" onClick={pauseMachiningTimer} disabled={!isMachiningActive}>Pause/Resume Machining Timer</button>
            <button type="button" onClick={stopMachiningTimer} disabled={!isMachiningActive}>Stop Machining Timer</button>
            <button type="submit">Submit Form</button>
          </div>
        </form>
        <div>Setup Time: {formData.setupTime}</div>
        <div>Machining Time: {formData.machiningTime}</div>
      </header>
      {lastSubmission && (
        <div className="submission-result">
          <h3>Last Submission</h3>
          <pre>{JSON.stringify(lastSubmission, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;