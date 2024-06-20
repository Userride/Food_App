import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
  // State variables to store food categories and food items
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  // Function to load data from the API
  const loadData = async () => {
    let response = await fetch("http://localhost:5000/api/foodData", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    response = await response.json(); // Parse the JSON response
    setFoodItem(response[0]); // Set the food items in state
    setFoodCat(response[1]); // Set the food categories in state
  };

  // useEffect to call loadData once when the component mounts
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      {/* Render the Navbar component */}
      <div><Navbar /></div>
      {/* Render the Carousel component */}
      <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ objectFit: "contain !important" }}>
          <div className="carousel-inner" id="carousel">
            <div className="carousel-caption" style={{ zIndex: "10" }}>
              <div className="d-flex justify-content-center">
                <input 
                  className="form-control me-2" 
                  type="search" 
                  placeholder="Search" 
                  aria-label="Search" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="carousel-item active">
              <img src="https://images.unsplash.com/photo-1613564834361-9436948817d1?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" style={{ objectFit: "fill", height: "85vh" }} alt="Pizza" />
            </div>
            <div className="carousel-item">
              <img src="https://images.unsplash.com/photo-1615557960916-5f4791effe9d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" style={{ objectFit: "fill", height: "85vh" }} alt="chicken" />
            </div>
            <div className="carousel-item">
              <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" style={{ objectFit: "fill", height: "85vh" }} alt="Burger" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className='container'>
        {
          // Check if foodCat has any elements before rendering
          foodCat.length > 0
            ? foodCat.map((data) => {
              return (
                <div key={data._id}>
                  {/* Render the category name */}
                  <div className="fs-3 m-3">
                    {data.CategoryName}
                  </div>
                  <hr />
                  <div className="row">
                    {foodItem.length > 0
                      ? foodItem
                        .filter((item) => (item.CategoryName === data.CategoryName) && item.name.toLowerCase().includes(search.toLowerCase()))  // Filter items by category and search term
                        .map(filterItem => {
                          return (
                            <div key={filterItem._id} className="col-md-4 mb-4">
                              {/* Render the Card component for each filtered item */}
                              <Card 
                                foodName={filterItem.name}
                                options={filterItem.options[0]}
                                imgSrc={filterItem.img}
                              />
                            </div>
                          );
                        })
                      : <div>No such data found</div> // Message if no items match the category
                    }
                  </div>
                </div>
              );
            })
            : <div>Loading...</div> // Loading message if foodCat is empty
        }
      </div>
      {/* Render the Footer component */}
      <div><Footer /></div>
    </div>
  );
}
