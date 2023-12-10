import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetailPage.css'
import { Button, Spinner } from 'reactstrap';
import { useEffect } from 'react';
import ApiRequest from '../../util/ApiRequest';
import formatTimestamp from '../../util/DateUtils';
import MessageModal from '../../components/MessageModal';
import { useAuth } from '../../context/AuthContext';

const EventDetailPage = () => {
    let { event_id } = useParams()
    const { logout } = useAuth();

    const [eventDetails, setEventDetails] = useState();
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [loadingEnable, setLoadingEnable] = useState(false)
    const [enableDisableEventMessage, setEnableDisableEventMessage] = useState(null)

    useEffect(() => {
        getEventDetail()
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
        navigator.clipboard.writeText("1")
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
                    }} >
                        <Button onClick={onClickCopyRegistirationLink} >Kayıt Linkini Kopyala</Button>
                        {loadingEnable ? <Spinner></Spinner> : eventDetails && eventDetails.isActive ? <Button onClick={disableEvent} style={{ marginTop: "8px" }}>
                            Alımları Kapat
                        </Button> : <Button onClick={enableEvent} style={{ marginTop: "8px" }}>
                            Alımları Aç
                        </Button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;