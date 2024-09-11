import { useEffect } from 'react';
import axios from 'axios';

const useRecordSiteView = () => {
  useEffect(() => {
    const recordSiteView = async () => {
      if (sessionStorage.getItem('viewRecorded')) {
        return;
      }

      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
      }

      try {
        await axios.post('http://localhost:5000/api/views', { 
          projectId: null, 
          sessionId: sessionId
        });
        sessionStorage.setItem('viewRecorded', 'true');
      } catch (error) {
        console.error('Error recording site view:', error);
      }
    };

    recordSiteView();
  }, []);
};

export default useRecordSiteView;