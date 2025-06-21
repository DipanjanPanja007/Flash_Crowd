import React from 'react'
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import OwnProfile from '../components/OwnProfile.jsx';
import OtherProfile from '../components/OtherProfile.jsx';

function Profile() {

    const { id } = useParams();
    const { auth } = useSelector(state => state.authReducer)

    return (
        <>
            {
                id == auth?._id ?
                    < OwnProfile /> : <OtherProfile id={id} />
            }
        </>
    )
}

export default Profile