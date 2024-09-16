import React from 'react';

function Profile({username}) {
    const useRname = localStorage.getItem("username");
    console.log(useRname);
    return (
        <p>Welcome {useRname}</p>
    );
}

export default Profile;