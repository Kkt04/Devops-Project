let products = [
    {
      id: 1,
      name: 'Hand-Thrown Ceramic Bowl',
      description: 'Beautifully crafted ceramic bowl with a unique matte glaze finish. Each piece is one-of-a-kind, shaped by hand on a traditional potter\'s wheel.',
      price: 48.00,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
      category: 'Ceramics',
      artisan: 'Maya Okonkwo',
      rating: 4.9,
      reviews: 127,
      stock: 8,
      featured: true
    },
    {
      id: 2,
      name: 'Macramé Wall Hanging',
      description: 'Intricate macramé wall hanging crafted from 100% natural cotton rope. A stunning bohemian statement piece for any living space.',
      price: 85.00,
      image: 'https://okhai.org/products/boho-handcrafted-small-macrame-wall-hanging-online?srsltid=AfmBOopJ3wTdn__si3DZY2xNiE8PMLtYlmu814m2nQZqc2QjELlp_6AS',
      category: 'Textiles',
      artisan: 'Luna Reyes',
      rating: 4.8,
      reviews: 89,
      stock: 5,
      featured: true
    },
    {
      id: 3,
      name: 'Beeswax Taper Candles (Set of 6)',
      description: 'Pure beeswax taper candles hand-dipped using traditional methods. Clean-burning, natural honey scent. Sustainable and eco-friendly.',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1602526216114-4c8c15dd5a3f?w=600',
      category: 'Home Goods',
      artisan: 'Erik Lindqvist',
      rating: 4.7,
      reviews: 203,
      stock: 24,
      featured: false
    },
    {
      id: 4,
      name: 'Leather Journal',
      description: 'Handstitched full-grain leather journal with 200 pages of acid-free paper. Develops a beautiful patina over time.',
      price: 65.00,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      category: 'Leather Goods',
      artisan: 'James Abara',
      rating: 4.9,
      reviews: 156,
      stock: 12,
      featured: true
    },
    {
      id: 5,
      name: 'Hand-Forged Chef\'s Knife',
      description: 'High-carbon steel chef\'s knife with a walnut handle, forged and finished by hand. A tool that lasts generations.',
      price: 195.00,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600',
      category: 'Kitchen',
      artisan: 'Hana Fujimoto',
      rating: 5.0,
      reviews: 78,
      stock: 4,
      featured: true
    },
    {
      id: 6,
      name: 'Indigo Dyed Linen Scarf',
      description: 'Naturally dyed linen scarf using traditional Japanese shibori technique. Lightweight and versatile for all seasons.',
      price: 72.00,
      image: 'https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=600',
      category: 'Textiles',
      artisan: 'Yuki Tanaka',
      rating: 4.8,
      reviews: 44,
      stock: 9,
      featured: false
    },
    {
      id: 7,
      name: 'Terracotta Planter Set',
      description: 'Set of three hand-pinched terracotta planters in varying sizes. Sealed with natural beeswax for moisture retention.',
      price: 54.00,
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600',
      category: 'Ceramics',
      artisan: 'Maya Okonkwo',
      rating: 4.6,
      reviews: 92,
      stock: 15,
      featured: false
    },
    {
      id: 8,
      name: 'Hand-Carved Wooden Spoon',
      description: 'Lovingly carved from a single piece of black walnut. Perfectly balanced and smooth, ideal for cooking and serving.',
      price: 38.00,
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600',
      category: 'Kitchen',
      artisan: 'Tom Wheeler',
      rating: 4.7,
      reviews: 61,
      stock: 20,
      featured: false
    }
  ];
  
  let nextId = 9;
  
  const getAll = () => products;
  
  const getById = (id) => products.find(p => p.id === id);
  
  const create = (data) => {
    const product = {
      id: nextId++,
      name: data.name,
      description: data.description || '',
      price: parseFloat(data.price),
      image: data.image || '',
      category: data.category,
      artisan: data.artisan,
      rating: parseFloat(data.rating) || 0,
      reviews: parseInt(data.reviews) || 0,
      stock: parseInt(data.stock) || 10,
      featured: data.featured || false
    };
    products.push(product);
    return product;
  };
  
  const update = (id, data) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id };
    return products[index];
  };
  
  const remove = (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  };
  
  const getCategories = () => [...new Set(products.map(p => p.category))];
  
  module.exports = { getAll, getById, create, update, remove, getCategories };