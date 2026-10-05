import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Flowers', 'Dolls', 'Toys', 'Decor', 'Accessories'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setCategory(cat);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = products;
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [search, category, products]);

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <h1 style={{ fontSize: '2rem' }}>Our Collection</h1>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              placeholder="Search products..."
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Filter size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <select
              style={{ paddingLeft: '40px', minWidth: '150px' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>Loading products...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      {!loading && filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>No products found.</div>
      )}
    </div>
  );
};

export default Products;
