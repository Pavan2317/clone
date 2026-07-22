import React, { useEffect, useState } from "react";

const ProductsPage = () => {

  const [products,setProducts] = useState([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");

  useEffect(()=>{

    fetch("https://dummyjson.com/products")
      .then(res=>res.json())
      .then(data=>{
        setProducts(data.products);
        setLoading(false);
      })

  },[]);

  if(loading){
    return(
      <h2 className="text-center text-2xl mt-10">
        Loading Products...
      </h2>
    )
  }

  return(
    <div>

      <h1 className="text-4xl font-bold text-center mb-8">
        Products
      </h1>

      <p className="text-center mb-5">
        Total Products: {products.length}
      </p>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="
          border
          p-3
          rounded-lg
          w-full
          mb-6
        "
      />

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
        "
      >

        {
          products
          .filter((product)=>
            product.title.toLowerCase()
            .includes(search.toLowerCase())
          )
          .map((product)=>(
              <div
                key={product.id}
                className="
                  bg-white
                  dark:bg-gray-800
                  rounded-xl
                  shadow-lg
                  p-4
                  hover:shadow-xl
                  transition
                "
              >

              <img
                src={product.thumbnail}
                alt={product.title}
                className="
                  w-full
                  h-48
                  object-cover
                  rounded-lg
                "
              />

              <h2
                className="
                  text-xl
                  font-bold
                  mt-3
                  dark:text-white
                "
              >
                {product.title}
              </h2>

              <p className="text-sm text-blue-500 mt-2">
                Category: {product.category}
              </p>

              <p className="text-sm dark:text-gray-300">
                Brand: {product.brand}
              </p>

              <p className="text-sm dark:text-gray-300">
                Stock: {product.stock}
              </p>

              <p
                className="
                  text-gray-500
                  dark:text-gray-300
                  mt-2
                "
              >
                {product.description.slice(0,80)}...
              </p>

              <div className="flex justify-between mt-4">

                <span className="font-bold text-green-600">
                  ${product.price}
                </span>

                <span>
                  ⭐ {product.rating}
                </span>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  )

}

export default ProductsPage;
