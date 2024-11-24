import { useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate, Outlet } from 'react-router-dom';
import './MyList.css';

const MyList = () => {
    const [activeButton, setActiveButton] = useState(null);
    const navigate = useNavigate(); 

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType); // Set the active button state
        if (buttonType === 'currReadButton') { // Use comparison operator
            navigate("/myList/currRead");
        }
        if (buttonType === 'readButton') {
            navigate("/myList/read");
        }
        if (buttonType === 'droppedButton') {
            navigate("/myList/dropped");
        }
        if (buttonType === 'wishlistButton') {
            navigate("/myList/wishlist")
        }
    };

    return (
        <div className = "container">
            <div className="myListContainer">
                {/* <div className="listHeader">
                    <h1>My Lists</h1>
                </div> */}
                <div className="buttonContainer">
                    <Button
                        variant="outlined"
                        id="currReadListButton"
                        color={activeButton === 'currReadButton' ? "secondary" : "primary"} // Update the condition
                        onClick={() => handleButtonClick('currReadButton')}>
                        Currently Reading
                    </Button>
                    <Button
                        variant="outlined"
                        id="readListButton"
                        color={activeButton === 'readButton' ? "secondary" : "primary"} // Update the condition
                        onClick={() => handleButtonClick('readButton')}>
                        Read
                    </Button>
                    <Button
                        variant="outlined"
                        id="droppedListButton"
                        color={activeButton === 'droppedButton' ? "secondary" : "primary"} // Update the condition
                        onClick={() => handleButtonClick('droppedButton')}>
                        Dropped
                    </Button>
                    <Button
                        variant="outlined"
                        id="wishlistListButton"
                        color={activeButton === 'wishlistButton' ? "secondary" : "primary"} // Update the condition
                        onClick={() => handleButtonClick('wishlistButton')}>
                        Wishlist
                    </Button>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default MyList;
