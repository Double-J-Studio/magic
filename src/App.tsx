import useKeyBinding from "@/hooks/tauri/useKeyBinding";
import { useGetGroupedModelsByPlatform } from "@/hooks/db/useGetGroupedModelsByPlatform";

import Router from "@/routes";

function App() {
  useKeyBinding();
  useGetGroupedModelsByPlatform();

  return (
    <div className="container relative flex w-screen h-full min-h-screen p-0 m-0">
      <Router />
    </div>
  );
}

export default App;
