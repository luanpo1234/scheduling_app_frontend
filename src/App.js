//import { useState } from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import { START_TIME_RANGE, END_TIME_RANGE } from "./utils/globalVars"
import Home from './components/Home';
import Calendar from "./components/Calendar";
import ProtectedComponent from "./auth/src/auth/ProtectedComponent";

const App = () => {

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/:calendarType/"
          element={<ProtectedComponent 
                      component={Calendar}
                      dailyTimeRange={[START_TIME_RANGE, END_TIME_RANGE]}
                    />
                  }
        />
        <Route
          path="/:calendarType/:initialDate"
          element={<ProtectedComponent 
                      component={Calendar}
                      dailyTimeRange={[START_TIME_RANGE, END_TIME_RANGE]}
                    />
                  }
        />
      </Routes>
    </div>
  );
}

export default App;