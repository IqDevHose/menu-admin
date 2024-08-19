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
import EditRating from "./pages/Rating/EditRating";
import EditCustomerReview from "./pages/CustomerReview/EditCustomerReview";
import EditCategory from "./pages/Category/EditCategory";
import EditItmes from "./pages/Items/EditItmes";
import EditQuestion from "./pages/Questions/EditQuestion";
import AddRestaurant from "./pages/Restaurant/AddRestaurant";
import AddCategory from "./pages/Category/AddCategory";
import AddQuestion from "./pages/Questions/AddQuestion";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route
          path="/edit-restaurant:restaurantId"
          element={<EditRestaurant />}
        />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/edit-rating" element={<EditRating />} />
        <Route path="/edit-customer-review" element={<EditCustomerReview />} />
        <Route path="/category" element={<Category />}></Route>
        <Route
          path="/edit-category/:categoryId"
          element={<EditCategory />}
        ></Route>
        <Route path="/add-category" element={<AddCategory />}></Route>
        <Route path="/items" element={<Item />}></Route>
        <Route path="/edit-items" element={<EditItmes />}></Route>
        <Route path="/customerReview" element={<CustomerReview />}></Route>
        <Route path="/rating" element={<Rating />}></Route>
        <Route path="/questions" element={<Questions />}></Route>
        <Route
          path="/edit-questions/:questionId"
          element={<EditQuestion />}
        ></Route>
        <Route path="/add-question" element={<AddQuestion />}></Route>

        <Route path="/theme" element={<Theme />}></Route>
      </Routes>
    </div>
  );
}

export default App;
