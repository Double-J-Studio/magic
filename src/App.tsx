import useKeyBinding from "@/hooks/tauri/useKeyBinding";

import Router from "@/routes";

function App() {
  useKeyBinding();

  return (
    <div className="container flex items-center justify-center w-full h-full min-h-screen p-0 m-0">
      <Router />
    </div>
  );
}

export default App;
