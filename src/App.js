import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { ProvideAuth } from "./auth/use-auth";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ProvideAuth>
          <AppRouter />
        </ProvideAuth>
      </BrowserRouter>
    </div>
  );
}

export default App;
