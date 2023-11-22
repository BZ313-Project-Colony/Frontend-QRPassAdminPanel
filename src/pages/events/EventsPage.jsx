import React from 'react';
import { Button } from 'reactstrap';
import { useAuth } from '../../context/AuthContext';

const EventsPage = () => {
    const { authToken, login, logout } = useAuth();
    return (
        <div>
            <Button onClick={() => {logout()}}>
               logout 
            </Button>
        </div>
    );
};

export default EventsPage;