const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up the API endpoint for getting the top N products
app.get('/categories/:categoryname/products', async (req, res) => {
  const { categoryname } = req.params;
  const { n, minPrice, maxPrice, sort, order, page } = req.query;

  try {
    // Make a request to each e-commerce company's API
    const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
    const products = [];

    for (const company of companies) {
      const url = `https://api.example.com/companies/${company}/categories/${categoryname}/products?top=${n || 10}&minPrice=${minPrice || 0}&maxPrice=${maxPrice || 99999}&sort=${sort || 'price'}&order=${order || 'asc'}`;
      const response = await axios.get(url);
      products.push(...response.data);
    }

    // Paginate the results if necessary
    const startIndex = page ? (page - 1) * n : 0;
    const endIndex = startIndex + n;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Generate a custom unique identifier for each product
    paginatedProducts.forEach((product, index) => {
      product.id = `product-${index}`;
    });

    // Send the response
    res.json(paginatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the products' });
  }
});

// Set up the API endpoint for getting details of a specific product
app.get('/categories/:categoryname/products/:productid', async (req, res) => {
  const { categoryname, productid } = req.params;

  try {
    // Make a request to each e-commerce company's API
    const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
    let product = null;

    for (const company of companies) {
      const url = `https://api.example.com/companies/${company}/categories/${categoryname}/products/${productid}`;
      const response = await axios.get(url);
      if (response.data) {
        product = response.data;
        break;
      }
    }

    // Send the response
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});