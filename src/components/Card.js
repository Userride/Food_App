import React from 'react';

export default function Card(props) {
  let options=props.options;
  let priceOptions=Object.keys(options)

  const handleAddToCart=()=>{

  }
  return (
    <div>
      <div className="card mt-3" style={{ width: '19rem', maxHeight: '400px' }}>
        <img
          src={props.imgSrc}
          className="card-img-top"
          style={{ height: '175px', objectFit: 'fill' }}
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title">{props.foodName}</h5>
          <p className="card-text">Important text</p>
          <div className="container w-100">
            <select className="m-2 h-100 bg-success rounded">
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select className="m-2 h-100 bg-success rounded">
              {priceOptions.map((data)=>{
                return<option key ={data} value={data}>{data}</option>
              })}
              
            </select>
            <div className="d-inline h-100 fs-5">Total price</div>
          </div>
          <hr>
          </hr>
          <button className={'btn btn-success justify-centre ms-2'} onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
