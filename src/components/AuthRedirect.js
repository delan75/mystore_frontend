import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = ({ tab }) => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(`/auth#${tab}`);
    }, [navigate, tab]);

    return null;
};

export default AuthRedirect;