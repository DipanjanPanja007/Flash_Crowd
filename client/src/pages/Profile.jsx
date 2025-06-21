import React from 'react'
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import OwnProfile from '../components/OwnProfile.jsx';

function Profile() {

    const { id } = useParams();
    const { auth } = useSelector(state => state.authReducer)

    return (
        <>
            {
                id == auth?._id ?
                    < OwnProfile /> : <p>45</p>
            }
        </>
    )
}

export default Profile