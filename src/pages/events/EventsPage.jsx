import React, { useEffect, useState } from 'react';
import { Alert, Button, Progress, Row, Spinner, Table } from 'reactstrap';
import { useAuth } from '../../context/AuthContext';
import "./EventsPage.css"
import apiRequest, { GetApiRequest, PostApiRequest } from '../../util/ApiRequest';
import { useNavigate } from 'react-router-dom';
import ApiRequest from '../../util/ApiRequest';
import formatTimestamp from '../../util/DateUtils';
import MessageModal from '../../components/MessageModal';

const EventsPage = () => {
    const { logout } = useAuth();
    const [events, setEvents] = useState(null)
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const getEvents = () => {
        setLoading(true)
        ApiRequest("get", "/events", null, (response) => {
            setEvents(response.data)
            setLoading(false)
        }, (code, message) => {
            setError({ code, message })
        })
    }

    useEffect(() => {
        getEvents()
    }, [])

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
};

export default EventsPage;