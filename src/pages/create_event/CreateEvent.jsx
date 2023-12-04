import React, { useState } from 'react';
import './CreateEvent.css'
import {Input,Label,FormGroup,Button,FormFeedback,Spinner} from 'reactstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import tr from 'date-fns/locale/tr';
import "react-datepicker/dist/react-datepicker.css";
import ApiRequest from '../../util/ApiRequest';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../components/ErrorModal';
import { useAuth } from '../../context/AuthContext';

const CreateEvent = () => {
    registerLocale('tr', tr)

    let navigate = useNavigate()
    const { logout } = useAuth();

    const [emptyInputs, setEmptyInputs] = useState([]);
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    const [eventDetails, setEventDetails] = useState({
        title: '',
        time: new Date(),
        place: '',
        imageUrl: '',
        maxParticipantNumber: 10,
    });

    if (eventDetails.maxParticipantNumber <= 1) {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            maxParticipantNumber: 1
        }));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

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

    return (
        <div className='root'>
            <div className="create_event_root">
                <ErrorModal isOpen={error != null} toggle={() => {
                    if (error.code == 401) logout()
                    setError(null)
                }} errorMessage={error && error.message} />
                <h1>Etkinlik Oluştur</h1>
                <FormGroup>
                    <Label for="title">Etkinlik Adı</Label>
                    <Input invalid={emptyInputs.includes('title')}
                        type="text"
                        name="title"
                        id="title"
                        value={eventDetails.eventName}
                        onChange={handleInputChange}
                    />
                    {emptyInputs.includes('title') ? <FormFeedback>Geçerli bir etkinlik ismi giriniz!</FormFeedback> : <></>}
                </FormGroup>
                <div className='container_date_picker'>
                    <DatePicker
                        className='date_picker'
                        locale="tr"
                        selected={eventDetails.time}
                        onChange={(date) => setEventDetails((prevDetails) => ({
                            ...prevDetails,
                            time: date,
                        }))}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </div>
                <FormGroup>
                    <Label for="place">Yer</Label>
                    <Input invalid={emptyInputs.includes('place')}
                        type="text"
                        name="place"
                        id="place"
                        value={eventDetails.place}
                        onChange={handleInputChange}
                    />
                    {emptyInputs.includes('place') ? <FormFeedback>Etkinliğiniz düzenleyeceğiniz yer için geçerli bir isim giriniz!</FormFeedback> : <></>}
                </FormGroup>
                <FormGroup>
                    <Label for="imageUrl">Resim URL</Label>
                    <Input invalid={emptyInputs.includes('imageUrl')}
                        type="text"
                        name="imageUrl"
                        id="imageUrl"
                        value={eventDetails.imageUrl}
                        onChange={handleInputChange}
                    />
                    {emptyInputs.includes('imageUrl') ? <FormFeedback>Katılımcılara gönderilecek biletler için bir resim url ekleyiniz!</FormFeedback> : <></>}
                </FormGroup>
                <FormGroup>
                    <Label for="maxParticipantNumber">Maximum Katılımcı Sayısı</Label>
                    <Input
                        type="number"
                        name="maxParticipantNumber"
                        id="maxParticipantNumber"
                        value={eventDetails.maxParticipantNumber}
                        onChange={handleInputChange}
                    />
                </FormGroup>
                {loading ? <Spinner /> : <Button className='create_event_submit_button' color="secondary" onClick={handleSubmit}>
                    Oluştur
                </Button>}
            </div>
        </div>
    );
};

export default CreateEvent;