import { Route, Routes } from "react-router-dom";
// import Layout from "./Layout"; // Import the MainLayout component
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
import AddItem from "./pages/Items/AddItem";
import AddCustomerReview from "./pages/CustomerReview/AddCustomerReview";
import AddRating from "./pages/Rating/AddRating";
import AddRestaurant from "./pages/Restaurant/AddRestaurant";
import AddCategory from "./pages/Category/AddCategory";
import AddQuestion from "./pages/Questions/AddQuestion";
import EditTheme from "./pages/Theme/editTheme";
import AddTheme from "./pages/Theme/AddTheme";
import DeletedItems from "./pages/Items/Deleteditems";
import DeletedCategories from "./pages/Category/DeletedCategory";
import DeletedQuestions from "./pages/Questions/DeletedQuestion";
import DeletedThemes from "./pages/Theme/DeletedTheme";
import DeletedRestaurant from "./pages/Restaurant/DeletedRestaurant";
import DeletedReview from "./pages/CustomerReview/DeletedReview";
import DeletedRating from "./pages/Rating/DeletedRating";
import Login from "./pages/Login/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./middlewares/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Routes without Sidebar */}
      <Route path="/login" element={<Login />} />

      {/* Routes with Sidebar */}
      {/* <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      > */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route
          path="/edit-restaurant/:restaurantId"
          element={<EditRestaurant />}
        />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/deleted-restaurant" element={<DeletedRestaurant />} />
        <Route path="/edit-rating/:ratingId" element={<EditRating />} />
        <Route path="/add-rating" element={<AddRating />} />
        <Route path="/deleted-rating" element={<DeletedRating />} />

        <Route
          path="/edit-customer-review/:customerReviewId"
          element={<EditCustomerReview />}
        />
        <Route path="/add-customer-review" element={<AddCustomerReview />} />
        <Route path="/deleted-customer-review" element={<DeletedReview />} />
        <Route path="/category" element={<Category />} />
        <Route path="/edit-category/:categoryId" element={<EditCategory />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/deleted-category" element={<DeletedCategories />} />
        <Route path="/items" element={<Item />} />
        <Route path="/edit-items/:itemId" element={<EditItmes />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/deleted-items" element={<DeletedItems />} />

        <Route path="/customerReview" element={<CustomerReview />} />
        <Route path="/rating" element={<Rating />} />

        <Route path="/questions" element={<Questions />} />
        <Route path="/edit-questions/:questionId" element={<EditQuestion />} />
        <Route path="/add-question" element={<AddQuestion />} />
        <Route path="/deleted-question" element={<DeletedQuestions />} />
        <Route path="/theme" element={<Theme />} />
        <Route path="/add-theme" element={<AddTheme />} />
        <Route path="/deleted-theme" element={<DeletedThemes />} />
        <Route path="/edit-theme/:themeId" element={<EditTheme />} />
      </Route>
    </Routes>
  );
}

export default App;
