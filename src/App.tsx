import { useState } from 'react';
import { createChatCompletionStream } from '@/utils/openai';

// NOTE: 로컬스토리지에 저장하고 그 값을 불러와서 사용하도록 변경해야함
const API_KEY = '';

function App() {
  const [message, setMessage] = useState('');

  return (
    <div className="container">
      <button
        onClick={() => {
          // TODO: 사용 예시
          createChatCompletionStream({
            apiKey: API_KEY,
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a helpful AI.' },
              { role: 'user', content: 'What is the meaning of life?' },
            ],
            onMessage: (message) => {
              setMessage((prev) => prev + message);
            },
            onError: (error) => {
              console.error('error', error);
              alert(error);
            },
          });
        }}
      >
        call
      </button>
      <p>message: {message}</p>
    </div>
  );
}

export default App;
