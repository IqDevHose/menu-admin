import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "./components/ui/button";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/home";
import Restaurant from "./pages/Restaurant/restaurant";
import EditRestaurant from "./pages/Restaurant/EditRestaurant";
import Category from "./pages/Category/category";
import Item from "./pages/Items/item";
import CustomerReview from "./pages/CustomerReview/CustomerReview";
import Rating from "./pages/Rating/rating";
import Questions from "./pages/Questions/questions";
import Theme from "./pages/Theme/theme";
import EditQuestion from "./pages/Questions/EditQuestion";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/edit-restaurant" element={<EditRestaurant />} />
        <Route path="/category" element={<Category />}></Route>
        <Route path="/items" element={<Item />}></Route>
        <Route path="/customerReview" element={<CustomerReview />}></Route>
        <Route path="/rating" element={<Rating />}></Route>
        <Route path="/questions" element={<Questions />}></Route>
        <Route path="/edit-questions/:questionId" element={<EditQuestion />}></Route>
        <Route path="/theme" element={<Theme />}></Route>
      </Routes>
    </div>
  );
}

export default App;
