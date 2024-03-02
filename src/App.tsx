import Router from '@/routes';
import useKeyBinding from './hooks/tauri/useKeyBinding';

function App() {
  useKeyBinding();

  return (
    <div className="container flex items-center justify-center w-full h-full min-h-screen p-0 m-0">
      <Router />
    </div>
  );
}

export default App;
