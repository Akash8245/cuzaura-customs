import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { adminAuth } from "@/lib/adminAuth";
import { formatPrice } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  Edit2,
  Plus,
  Package,
  Trash2,
  Upload,
  LogOut,
  Lock,
  Mail,
} from "lucide-react";
import {
  uploadProductImage,
  deleteProductImage,
  formatBytes,
} from "@/lib/imageUpload";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  color: string;
  category: string;
  description: string;
  image_url?: string;
  image_path?: string;
  image_size_bytes?: number;
  is_active: boolean;
}

interface AdminSession {
  id: string;
  email: string;
  full_name: string;
}

const AdminPage = () => {
  // Auth state
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Products state
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    color: "",
    category: "",
    description: "",
    image_url: "",
    image_path: "",
  });

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const statuses = ["Pending", "Accepted", "Shipped", "Delivered", "Returned"];

  // Check for stored session
  useEffect(() => {
    const stored = localStorage.getItem("admin_session");
    if (stored) {
      try {
        setSession(JSON.parse(stored));
        fetchProducts();
        fetchOrders();
      } catch (e) {
        localStorage.removeItem("admin_session");
      }
    }
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const result = await adminAuth.login(loginEmail, loginPassword);

    if (result.success) {
      setSession(result.admin);
      localStorage.setItem("admin_session", JSON.stringify(result.admin));
      setLoginEmail("");
      setLoginPassword("");
      fetchProducts();
      fetchOrders();
      toast({
        title: "Login Successful",
        description: `Welcome, ${result.admin.full_name}!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      });
    }

    setLoginLoading(false);
  };

  // Handle logout
  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("admin_session");
    resetForm();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { image_url, image_path } = await uploadProductImage(
        file,
        formData.name || "product"
      );

      setFormData((prev) => ({
        ...prev,
        image_url,
        image_path,
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Save product
  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.color || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingProduct) {
        // Update
        const { error } = await supabase
          .from("products")
          .update({
            name: formData.name,
            price: Number(formData.price),
            color: formData.color,
            category: formData.category,
            description: formData.description,
            image_url: formData.image_url,
            image_path: formData.image_path,
          })
          .eq("id", editingProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Create
        const { error } = await supabase.from("products").insert({
          name: formData.name,
          price: Number(formData.price),
          color: formData.color,
          category: formData.category,
          description: formData.description,
          image_url: formData.image_url,
          image_path: formData.image_path,
          is_active: true,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }

      resetForm();
      await fetchProducts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit product
  const handleEditProduct = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      color: product.color,
      category: product.category,
      description: product.description,
      image_url: product.image_url || "",
      image_path: product.image_path || "",
    });
    setActiveTab("products");
  };

  // Delete product
  const handleDeleteProduct = async (product: AdminProduct) => {
    if (!confirm(`Delete ${product.name}? This cannot be undone.`)) return;

    setIsLoading(true);
    try {
      if (product.image_path) {
        await deleteProductImage(product.image_path);
      }

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      await fetchProducts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      color: "",
      category: "",
      description: "",
      image_url: "",
      image_path: "",
    });
  };

  // Login page
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 pt-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
                  <Lock className="w-8 h-8 text-black" />
                </div>
              </div>
              <h1 className="text-4xl font-black text-amber-400 tracking-tight">
                CusAura
              </h1>
              <p className="text-amber-400/80 text-sm mt-1 font-bold">
                Admin Dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                  Username
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-amber-500/60" />
                  <Input
                    type="text"
                    placeholder="admin"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-slate-800/50 border-amber-500/30 pl-10 py-6 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-amber-500/60" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-slate-800/50 border-amber-500/30 pl-10 py-6 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold py-6 mt-6"
              >
                {loginLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black pt-28 px-6 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-black text-amber-400">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome, <span className="text-amber-400 font-bold">{session.full_name}</span>
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/30 hover:bg-red-500/10 text-red-400 gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-amber-500/30 rounded-2xl overflow-hidden"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-14 bg-slate-800/50 p-1 rounded-none border-b border-amber-500/30">
              <TabsTrigger
                value="products"
                className="text-amber-400 data-[state=active]:bg-amber-500/20"
              >
                <Package className="w-4 h-4 mr-2" />
                Products ({products.length})
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="text-amber-400 data-[state=active]:bg-amber-500/20"
              >
                <Package className="w-4 h-4 mr-2" />
                Orders ({orders.length})
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="p-6 space-y-6">
              {/* Form */}
              <div className="bg-slate-800/50 border border-amber-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-400 mb-4">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Product Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-700/50 border-amber-500/30"
                  />
                  <Input
                    type="number"
                    placeholder="Price (₹) *"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) })
                    }
                    className="bg-slate-700/50 border-amber-500/30"
                  />
                  <Input
                    placeholder="Color *"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="bg-slate-700/50 border-amber-500/30"
                  />
                  <Input
                    placeholder="Category *"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="bg-slate-700/50 border-amber-500/30"
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full mt-4 bg-slate-700/50 border border-amber-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                  rows={3}
                />

                {/* Image Upload */}
                <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-amber-500/20">
                  <label className="cursor-pointer block">
                    <div className="flex items-center justify-center">
                      {formData.image_url ? (
                        <div className="relative w-full">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData({
                                ...formData,
                                image_url: "",
                                image_path: "",
                              });
                            }}
                            className="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-amber-400/60 mx-auto mb-2" />
                          <p className="text-gray-300 text-sm">
                            Click to upload product image
                          </p>
                          <p className="text-gray-500 text-xs mt-1">Max 5MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleSaveProduct}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold"
                  >
                    {isLoading
                      ? "Saving..."
                      : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                  </Button>
                  {editingProduct && (
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="border-amber-500/30 hover:bg-amber-500/10"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Plus className="w-12 h-12 text-amber-400/30 mx-auto mb-4" />
                  <p className="text-gray-400">No products yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-800/50 border border-amber-500/30 rounded-xl overflow-hidden"
                    >
                      {product.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <h4 className="font-bold text-amber-400">{product.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {product.color} • {product.category}
                        </p>
                        <p className="text-white text-sm mt-2 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-amber-400 font-bold mt-2">
                          ₹{product.price}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="p-6">
              {ordersLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-amber-400/30 mx-auto mb-4" />
                  <p className="text-gray-400">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      className="bg-slate-800/50 border border-amber-500/30 rounded-xl p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Order ID</p>
                          <p className="text-white font-mono text-sm mt-1">
                            {order.id.slice(0, 12)}...
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Customer</p>
                          <p className="text-white text-sm mt-1">
                            {order.shipping_email}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Total</p>
                          <p className="text-amber-400 font-bold mt-1">₹{order.total}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Status</p>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value)
                            }
                            className="mt-1 bg-slate-700 border border-amber-500/30 text-white rounded px-3 py-1 text-sm w-full"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {order.order_items?.length > 0 && (
                        <div className="pt-4 border-t border-amber-500/20">
                          <p className="text-gray-400 text-xs uppercase mb-2">Items</p>
                          {order.order_items.map((item: any, idx: number) => (
                            <p key={idx} className="text-white text-sm">
                              • {item.product_name} (x{item.quantity}) - ₹{item.price}
                            </p>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
