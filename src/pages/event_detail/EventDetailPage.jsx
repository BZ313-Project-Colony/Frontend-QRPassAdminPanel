import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EventDetailPage.css'
import { Alert, Button, Spinner, Table } from 'reactstrap';
import { useEffect } from 'react';
import ApiRequest from '../../util/ApiRequest';
import formatTimestamp from '../../util/DateUtils';
import MessageModal from '../../components/MessageModal';
import { useAuth } from '../../context/AuthContext';

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

    useEffect(() => {
        getEventDetail()
        getTickets()
    }, [])

    const getEventDetail = () => {
        setLoading(true)
        ApiRequest("get", `/events/${event_id}`, null, (response) => {
            setEventDetails(response.data)
            setLoading(false)
        }, (code, message) => {
            setError({ code, message })
        })
    }

    const enableEvent = () => {
        setLoadingEnable(true)
        ApiRequest("post", `/events/${event_id}/enable`, null, (response) => {
            setLoadingEnable(false)
            getEventDetail()
            setEnableDisableEventMessage(response.data)
        }, (code, message) => {
            setError({ code, message })
            setLoadingEnable(false)
        })
    }

    const disableEvent = () => {
        setLoadingEnable(true)
        ApiRequest("post", `/events/${event_id}/disable`, null, (response) => {
            setLoadingEnable(false)
            getEventDetail()
            setEnableDisableEventMessage(response.data)
        }, (code, message) => {
            setError({ code, message })
            setLoadingEnable(false)
        })
    }

    const onClickCopyRegistirationLink = () => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_REGISTIRATION_BASE_URL}/${event_id}`)
    }

    const onClickDeleteEvent = () => {
        setLoadingDeleteEvent(true)
        ApiRequest("delete", `/events/${event_id}`, null, (response) => {
            setLoadingDeleteEvent(false)
            navigate(-1)
        }, (code, message) => {
            setError({ code, message })
            setLoadingDeleteEvent(false)
        })
    }

    const getTickets = () => {
        ApiRequest("get", `/events/${event_id}/tickets`, null, (response) => {
            setTickets(response.data)
            console.log(response.data);
        }, (code, message) => {
            setError({ code, message })
        })
    }

    return (
        <div className='root'>
            <div className="root_event_detail">
                <MessageModal isOpen={error != null} toggle={() => {
                    setError(null)
                    if (error.code == 401) {
                        logout()
                    }
                }} message={error && error.message} />
                <MessageModal title='Bilgi' isOpen={enableDisableEventMessage != null} toggle={() => {
                    setEnableDisableEventMessage(null)
                }} message={enableDisableEventMessage} />
                <div style={{
                    display: "flex"
                }}>
                    <div className="detail_section">
                        <h2><b>Etkinlik: </b>{eventDetails && eventDetails.title}</h2>
                        <div><b>ID: </b>{eventDetails && eventDetails.id}</div>
                        <div><b>Zaman: </b>{eventDetails && formatTimestamp(eventDetails.time)}</div>
                        <div><b>Yer: </b>{eventDetails && eventDetails.place}</div>
                        <div><b>Durum: </b>{eventDetails && eventDetails.isActive == true ? "Aktif" : "Kapalı"}</div>
                    </div>
                    <div style={{
                        marginRight: "0px",
                        marginLeft: "auto",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{
                            display: "flex"
                        }}>
                            <Button onClick={onClickCopyRegistirationLink}>Kayıt Linkini Kopyala</Button>
                            {loadingDeleteEvent ? <Spinner></Spinner> : <Button color="danger" style={{
                                marginLeft: "8px"
                            }} onClick={onClickDeleteEvent}>Etkinliği Sil</Button>}
                        </div>
                        {loadingEnable ? <Spinner></Spinner> : eventDetails && eventDetails.isActive ? <Button onClick={disableEvent} style={{ marginTop: "8px" }}>
                            Alımları Kapat
                        </Button> : <Button onClick={enableEvent} style={{ marginTop: "8px" }}>
                            Alımları Aç
                        </Button>}
                        <div style={{ marginBottom: "0px", marginTop: "auto", textAlign: "end" }}>
                            Okunan Bilet: {tickets && tickets.filter(ticket => ticket.isConfirmed).length}/{tickets && tickets.length}
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "16px" }} className="root_tickets">
                    <h3><b>Biletler</b></h3>
                    {tickets && <Table hover borderless>
                        <thead>
                            <tr>
                                <th>Ad-Soyad</th>
                                <th>Mail</th>
                                <th style={{ textAlign: 'right' }}>Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket, index) => (
                                <tr key={ticket.id} style={{ cursor: 'pointer' }}>
                                    <td>{ticket.name} {ticket.surname}</td>
                                    <td>{ticket.email}</td>
                                    <td style={{ textAlign: 'right' }}>{ticket.isConfirmed ? "✅" : "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}
                    {tickets && tickets.length == 0 ? <Alert>Etkinliğe henüz hiç kimse kayıt olmadı!</Alert> : <></>}
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;