import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AppSettingsProvider } from "./context/AppSettingsContext";

function App() {
  return (
    <LanguageProvider>
      <AppSettingsProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </AppSettingsProvider>
    </LanguageProvider>
  );
}

export default App;

