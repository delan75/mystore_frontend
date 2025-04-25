import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const AuthRedirect = ({ tab }) => {
    const history = useHistory();

    useEffect(() => {
        history.push(`/auth#${tab}`);
    }, [history, tab]);

    return null;
};

export default AuthRedirect;