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
import Import from "./pages/Items/Import";

function App() {
  return (
    <Routes>
      <>
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
        <Route element={<Layout />}/>
          {/* home */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* end home */}

          {/* restaurant */}
          <Route path="/restaurants" element={<Restaurant />}>
            <Route path="/edit/:restaurantId" element={<EditRestaurant />} />
            <Route path="/add" element={<AddRestaurant />} />
            <Route path="/trash" element={<DeletedRestaurant />} />
          </Route>
          {/*end  restaurant */}

          {/* rating */}
          <Route path="/ratings" element={<Rating />}>
            <Route path="/edit/:ratingId" element={<EditRating />} />
            <Route path="/add" element={<AddRating />} />
            <Route path="/trash" element={<DeletedRating />} />
          </Route>
          {/* end rating */}

          {/* customerReview */}
          <Route path="/customerReviews" element={<CustomerReview />}>
            <Route
              path="/edit/:customerReviewId"
              element={<EditCustomerReview />}
            />
            <Route
              path="/add"
              element={<AddCustomerReview />}
            />
            <Route
              path="/trash"
              element={<DeletedReview />}
            />
          </Route>
          {/*end  customerReview */}

          {/* category */}
          <Route path="/categories" element={<Category />}>
            <Route
              path="/edit/:categoryId"
              element={<EditCategory />}
            />
            <Route path="/add" element={<AddCategory />} />
            <Route path="/trash" element={<DeletedCategories />} />
          </Route>
          {/*end  category */}

          {/* items */}
          <Route path="/items" element={<Item />}>
            <Route path="/import" element={<Import />} />
            <Route path="/edit/:itemId" element={<EditItmes />} />
            <Route path="/add" element={<AddItem />} />
            <Route path="/trash" element={<DeletedItems />} />
          </Route>
          {/*end items */}

          {/* questions */}
          <Route path="/questions" element={<Questions />}>
            <Route
              path="/edit/:questionId"
              element={<EditQuestion />}
            />
            <Route path="/add" element={<AddQuestion />} />
            <Route path="/trash" element={<DeletedQuestions />} />
          </Route>
          {/* end questions */}

          {/* theme */}
          <Route path="/themes" element={<Theme />}>
            <Route path="/add" element={<AddTheme />} />
            <Route path="/trash" element={<DeletedThemes />} />
            <Route path="/edit/:themeId" element={<EditTheme />} />
          </Route>
          {/*end theme */}
          {/* end sidebar */}
       
      </>
    </Routes>
  );
}

export default App;
