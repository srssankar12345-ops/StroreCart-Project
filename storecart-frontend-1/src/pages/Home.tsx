import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Heart, 
  ShoppingCart,
  User,
  Menu,
  Grid3X3
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock product data
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image: "/placeholder.svg",
      rating: 4.5,
      category: "electronics",
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      image: "/placeholder.svg",
      rating: 4.8,
      category: "electronics",
      badge: "New"
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 79.99,
      image: "/placeholder.svg",
      rating: 4.3,
      category: "fashion",
      badge: "Sale"
    },
    {
      id: 4,
      name: "Coffee Maker",
      price: 149.99,
      image: "/placeholder.svg",
      rating: 4.6,
      category: "home",
      badge: ""
    },
    {
      id: 5,
      name: "Laptop Backpack",
      price: 59.99,
      image: "/placeholder.svg",
      rating: 4.4,
      category: "fashion",
      badge: ""
    },
    {
      id: 6,
      name: "Bluetooth Speaker",
      price: 69.99,
      image: "/placeholder.svg",
      rating: 4.7,
      category: "electronics",
      badge: "Featured"
    }
  ];

  const categories = [
    { id: "all", name: "All Products" },
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home", name: "Home & Living" }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">storeCart</span>
              </Link>
              
              {/* Search Bar */}
              <div className="hidden md:flex relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-border"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Categories</h3>
                </div>
                <div className="space-y-2">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 mb-8 text-primary-foreground">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to storeCart</h1>
              <p className="text-lg opacity-90 mb-4">Discover amazing products at unbeatable prices</p>
              <Button variant="secondary" size="lg">
                Shop Now
              </Button>
            </div>

            {/* Products Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {selectedCategory === "all" ? "All Products" : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="border-border hover:shadow-lg transition-shadow group">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {product.badge && (
                        <Badge 
                          className="absolute top-2 left-2"
                          variant={product.badge === "Sale" ? "destructive" : "default"}
                        >
                          {product.badge}
                        </Badge>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                      
                      <div className="flex items-center space-x-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{product.rating}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;