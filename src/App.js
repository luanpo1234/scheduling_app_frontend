//import { useState } from "react";
import Header from "./components/Header";
import {Routes, Route} from "react-router-dom";
import Home from './components/Home';
import Calendar from "./components/Calendar";
import ProtectedComponent from "./auth/src/auth/ProtectedComponent";

const App = () => {
  const START_TIME_RANGE = 7;
  const END_TIME_RANGE = 22;

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/:calendarType"
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