import React from 'react';
import { chatbot } from '../chatbot';

const Covid19 = () => (
  <iframe style={{ height: '100vh', width: '100vw' }} title="covid" srcDoc={chatbot} />
);

export default Covid19;
