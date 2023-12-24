# QR Pass Admin Panel React App Setup

Welcome to the QR Pass Admin Panel React app! This README provides instructions on setting up and running the app locally. Ensure you have Node.js and npm installed on your machine before proceeding.

## Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
REACT_APP_QR_PASS_API_URL=xxx
REACT_APP_REGISTRATION_BASE_URL=xxx
```

These variables define the API URL for QR Pass and the base URL for registration.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BZ313-Project-Colony/Frontend-QRPassAdminPanel.git
   ```

2. Change into the project directory:

   ```bash
   cd qr-pass-admin-panel
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Running the App

Now that you have installed the dependencies and set up the environment variables, you can run the app locally.

```bash
npm start
```

This command starts the development server. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the app.

## Building for Production

To build the app for production, use the following command:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

# Documentation

## Login Page
```jsx
import React, { useEffect, useState } from 'react';
import { Button, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Spinner } from 'reactstrap';
import "./LoginPage.css";
import adminIcon from "../../assets/images/QRsiyah.svg"
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../components/MessageModal';
import ApiRequest, { PostApiRequest } from '../../util/ApiRequest';
```

The above lines are importing necessary dependencies and components. `reactstrap` is a library for Bootstrap 4 components in React. `useAuth` is a custom hook for authentication. `useNavigate` is a hook from `react-router-dom` for programmatically navigating. `ErrorModal` is a custom component for displaying error messages. `ApiRequest` is a utility for making API requests.

```jsx
const LoginPage = () => {
 const { login, logout } = useAuth();
 const [username, setUsername] = useState()
 const [password, setPassword] = useState()
 const [error, setError] = useState()
 const [loading, setLoading] = useState(false)
 const navigate = useNavigate();
```

This is the start of the `LoginPage` component. It's using the `useAuth` hook to get the `login` and `logout` functions. It's also setting up state variables for `username`, `password`, `error`, and `loading`. `navigate` is a function from `useNavigate` that will be used to navigate to different routes.

```jsx
 useEffect(() => {
   logout()
 })
```

This `useEffect` hook is called when the component mounts. It's calling the `logout` function from `useAuth` to ensure that the user is logged out when they visit the login page.

```jsx
 const onClickLogin = () => {
   if (!username || !password) {
     setError("Boş alan bırakmayınız!")
     return;
   }
   setLoading(true)
   ApiRequest("post", "/auth/login", {
     username: username,
     password: parseInt(password),
   }, (response) => {
     login(response.data.token)
     navigate("/")
   }, (error, code) => {
     setError(`HTTP ${code} - ${error}`)
     setLoading(false)
   })
 }
```

This is the `onClickLogin` function that is called when the user clicks the login button. It first checks if the `username` and `password` fields are not empty. If they are, it sets an error message and returns. If they are not, it sets `loading` to `true` and makes a POST request to `/auth/login` with the `username` and `password`. If the request is successful, it logs the user in and navigates to the home page. If the request fails, it sets an error message and sets `loading` to `false`.

```jsx
 return (
   <div className='root'>
     <div className='root_login'>
       <img src={adminIcon} width="200px" />
       <h3 className='title'>Giriş Yap</h3>
       <InputGroup className='inputUsername'>
         <InputGroupText>@</InputGroupText>
         <Input value={username} onChange={(event) => { setUsername(event.target.value) }} placeholder="Kullanıcı Adı" />
       </InputGroup>
       <InputGroup className='inputPassword'>
         <Input type="password" value={password} onChange={(event) => { setPassword(event.target.value) }} placeholder="Şifre" />
       </InputGroup>
       <ErrorModal isOpen={error != null} toggle={() => {
         setError(null)
       }} message={error} />
       {loading ? <Spinner className='buttonLogin' /> : <Button onClick={onClickLogin} className='buttonLogin' color="secondary">Giriş</Button>}
     </div>
   </div>
 );
};
```

This is the JSX returned by the component. It's a form with input fields for `username` and `password`, a login button, and an error modal. If `loading` is `true`, a spinner is displayed instead of the login button.

```jsx
export default LoginPage;
```

This is exporting the `LoginPage` component so it can be used in other parts of the application.

## Events Page
```jsx
import React, { useEffect, useState } from 'react';
import { Alert, Button, Progress, Row, Spinner, Table } from 'reactstrap';
import { useAuth } from '../../context/AuthContext';
import "./EventsPage.css"
import apiRequest, { GetApiRequest, PostApiRequest } from '../../util/ApiRequest';
import { useNavigate } from 'react-router-dom';
import ApiRequest from '../../util/ApiRequest';
import formatTimestamp from '../../util/DateUtils';
import MessageModal from '../../components/MessageModal';
```

The above lines are importing necessary dependencies and components. `reactstrap` is a library for Bootstrap 4 components in React. `useAuth` is a custom hook for authentication. `useNavigate` is a hook from `react-router-dom` for programmatically navigating. `MessageModal` is a custom component for displaying error messages. `ApiRequest` is a utility for making API requests. `formatTimestamp` is a utility for formatting timestamps.

```jsx
const EventsPage = () => {
   const { logout } = useAuth();
   const [events, setEvents] = useState(null)
   const [error, setError] = useState()
   const [loading, setLoading] = useState(false)
   const navigate = useNavigate();
```

This is the start of the `EventsPage` component. It's using the `useAuth` hook to get the `logout` function. It's also setting up state variables for `events`, `error`, and `loading`. `navigate` is a function from `useNavigate` that will be used to navigate to different routes.

```jsx
const getEvents = () => {
   setLoading(true)
   ApiRequest("get", "/events", null, (response) => {
       setEvents(response.data)
       setLoading(false)
   }, (code, message) => {
       setError({ code, message })
   })
}
```

This is the `getEvents` function that is called to fetch the events from the server. It sets `loading` to `true` and makes a GET request to `/events`. If the request is successful, it sets the `events` state variable to the response data and sets `loading` to `false`. If the request fails, it sets an error message.

```jsx
useEffect(() => {
   getEvents()
}, [])
```

This `useEffect` hook is called when the component mounts. It's calling the `getEvents` function to fetch the events.

```jsx
return (
   <div className='root'>
       <div className="event_root">
           <div className='container_title'>
               <MessageModal isOpen={error != null} toggle={() => {
                  setError(null)
                  if (error.code == 401) {
                      logout()
                  }
               }} message={error && error.message} />
               <h1>Etkinlikler</h1>
               <Button style={{
                  width: "100px",
                  height: "42px",
                  marginRight: "0px",
                  marginLeft: "auto"
               }} color='secondary' onClick={() => { logout() }}>Çıkış Yap</Button>
           </div>
           <Button style={{
               backgroundColor: '#000000',
               color: 'white',
               width: "100%"
           }} onClick={() => {
               navigate("/create_event")
           }}>Etkinlik Oluştur</Button>
           <div className="container_event_list">
               { loading ? <Spinner></Spinner> : <></>}
               {events && <Table hover borderless>
                  <thead>
                      <tr>
                          <th>Etkinlik</th>
                          <th style={{ textAlign: 'right' }}>Zaman</th>
                      </tr>
                  </thead>
                  <tbody>
                      {events.map((event, index) => (
                          <tr key={event.id} onClick={() => {
                              navigate(`/event_detail/${event.id}`)
                          }}style={{ cursor: 'pointer' }}>
                              <td>{event.title}</td>
                              <td style={{ textAlign: 'right' }}>{formatTimestamp(event.time)}</td>
                          </tr>
                      ))}
                  </tbody>
               </Table> }
               { events && events.length == 0 ? <Alert color="secondary">Henüz kayıtlı etkinlik yok.</Alert> : <></> }
           </div>
       </div>
   </div >
);
```

This is the JSX returned by the component. It's a page with a list of events, a button to create a new event, and an error modal. If `loading` is `true`, a spinner is displayed. If there are no events, an alert is displayed.

```jsx
export default EventsPage;
```

This is exporting the `EventsPage` component so it can be used in other parts of the application.

## Create Event Page
```jsx
import React, { useState } from 'react';
import './CreateEvent.css'
import {Input,Label,FormGroup,Button,FormFeedback,Spinner} from 'reactstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import tr from 'date-fns/locale/tr';
import "react-datepicker/dist/react-datepicker.css";
import ApiRequest from '../../util/ApiRequest';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../../components/MessageModal';
import { useAuth } from '../../context/AuthContext';
```

The above lines are importing necessary dependencies and components. `reactstrap` is a library for Bootstrap 4 components in React. `useAuth` is a custom hook for authentication. `useNavigate` is a hook from `react-router-dom` for programmatically navigating. `MessageModal` is a custom component for displaying error messages. `ApiRequest` is a utility for making API requests. `DatePicker` is a component for selecting dates.

```jsx
const CreateEvent = () => {
   registerLocale('tr', tr)
   let navigate = useNavigate()
   const { logout } = useAuth();
```

This is the start of the `CreateEvent` component. It's registering the Turkish locale for the date picker. `navigate` is a function from `useNavigate` that will be used to navigate to different routes. `logout` is a function from `useAuth` that will be used to log out the user.

```jsx
const [emptyInputs, setEmptyInputs] = useState([]);
const [error, setError] = useState()
const [loading, setLoading] = useState(false)
```

This is setting up state variables for `emptyInputs`, `error`, and `loading`. `emptyInputs` is an array that will hold the names of any empty input fields. `error` will hold any error messages. `loading` will be `true` when the form is being submitted and `false` otherwise.

```jsx
const [eventDetails, setEventDetails] = useState({
   title: '',
   time: new Date(),
   place: '',
   imageUrl: '',
   maxParticipantNumber: 10,
});
```

This is setting up the initial state for the event details. It's an object with properties for the title, time, place, image URL, and maximum participant number.

```jsx
if (eventDetails.maxParticipantNumber <= 1) {
   setEventDetails((prevDetails) => ({
       ...prevDetails,
       maxParticipantNumber: 1
   }));
}
```

This is checking if the maximum participant number is less than or equal to 1. If it is, it's setting it to 1.

```jsx
const handleInputChange = (e) => {
   const { name, value } = e.target;
   setEventDetails((prevDetails) => ({
       ...prevDetails,
       [name]: value,
   }));
};
```

This is a function that handles changes to the input fields. It's updating the `eventDetails` state with the new value of the input field that was changed.

```jsx
const handleSubmit = () => {
   const emptyFields = Object.keys(eventDetails).filter(key => eventDetails[key] === '');
   setEmptyInputs(emptyFields);
   if (emptyFields.length === 0) {
       console.log(eventDetails);
       ApiRequest("POST", "/events", eventDetails, (data) => {
           navigate(-1)
       }, (code, message) => {
           setError({ code, message })
           setLoading(false)
       })
   }
};
```

This is the function that handles form submission. It's checking if there are any empty input fields. If there are, it's setting `emptyInputs` to an array of the names of the empty fields. If there are no empty fields, it's making a POST request to `/events` with the event details. If the request is successful, it's navigating back to the previous page. If the request fails, it's setting an error message.

## Event Detail Page
```jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EventDetailPage.css'
import { Alert, Button, Spinner, Table } from 'reactstrap';
import { useEffect } from 'react';
import ApiRequest from '../../util/ApiRequest';
import formatTimestamp from '../../util/DateUtils';
import MessageModal from '../../components/MessageModal';
import { useAuth } from '../../context/AuthContext';
```

The above lines are importing necessary dependencies and components. `reactstrap` is a library for Bootstrap 4 components in React. `useNavigate` and `useParams` are hooks from `react-router-dom` for programmatically navigating and accessing route parameters. `useAuth` is a custom hook for authentication. `ApiRequest` is a utility for making API requests. `formatTimestamp` is a utility for formatting timestamps. `MessageModal` is a custom component for displaying messages.

```jsx
const EventDetailPage = () => {
   let { event_id } = useParams()
   const { logout } = useAuth();
   let navigate = useNavigate()

   const [eventDetails, setEventDetails] = useState();
   const [error, setError] = useState()
   const [loading, setLoading] = useState(false)
   const [loadingEnable, setLoadingEnable] = useState(false)
   const [loadingDeleteEvent, setLoadingDeleteEvent] = useState(false)
   const [enableDisableEventMessage, setEnableDisableEventMessage] = useState(null)
   const [tickets, setTickets] = useState(null)
```

This is the start of the `EventDetailPage` component. It's using the `useParams` hook to get the `event_id` from the route parameters. It's also using the `useAuth` hook to get the `logout` function. It's setting up state variables for `eventDetails`, `error`, `loading`, `loadingEnable`, `loadingDeleteEvent`, `enableDisableEventMessage`, and `tickets`.

```jsx
useEffect(() => {
   getEventDetail()
   getTickets()
}, [])
```

This `useEffect` hook is called when the component mounts. It's calling the `getEventDetail` and `getTickets` functions to fetch the event details and tickets.

```jsx
const getEventDetail = () => {
   setLoading(true)
   ApiRequest("get", `/events/${event_id}`, null, (response) => {
       setEventDetails(response.data)
       setLoading(false)
   }, (code, message) => {
       setError({ code, message })
   })
}
```

This is the `getEventDetail` function that is called to fetch the event details. It sets `loading` to `true` and makes a GET request to `/events/${event_id}`. If the request is successful, it sets the event details and sets `loading` to `false`. If the request fails, it sets an error message.
