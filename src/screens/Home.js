import React, { useEffect, useState } from 'react';
import Card from '../components/Card';

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  // Load data from API
  const loadData = async () => {
    let response = await fetch("https://eatfit-ecwm.onrender.com/api/foodData", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' }
    });
    response = await response.json();
    setFoodItem(response[0]); // food items
    setFoodCat(response[1]); // categories
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      {/* Carousel */}
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
              <img src="https://images.unsplash.com/photo-1615557960916-5f4791effe9d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" style={{ objectFit: "fill", height: "85vh" }} alt="Chicken" />
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

      {/* Food Categories & Cards */}
      <div className='container'>
        {foodCat.length > 0 ? (
          foodCat.map((category) => (
            <div key={category._id}>
              <div className="fs-3 m-3">{category.CategoryName}</div>
              <hr />
              <div className="row">
                {foodItem.length > 0 ? (
                  foodItem
                    .filter(item => item.CategoryName === category.CategoryName && item.name.toLowerCase().includes(search.toLowerCase())) // yaha includes normilize kar diya hai bich se bhi koi words search kiye to search ho jaiye ga
                    .map(item => (
                      <div key={item._id} className="col-md-4 mb-4">
                        <Card foodItem={item} options={item.options[0]} />
                      </div>
                    ))
                ) : (
                  <div>No such data found</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
