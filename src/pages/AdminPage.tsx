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
  ImagePlus,
} from "lucide-react";
import {
  uploadProductImage,
  deleteProductImage,
} from "@/lib/imageUpload";
import shoe1 from "@/assets/shoe-1.png";
import shoe2 from "@/assets/shoe-2.png";
import shoe3 from "@/assets/shoe-3.png";
import shoe4 from "@/assets/shoe-4.png";
import shoe5 from "@/assets/shoe-5.png";
import shoe6 from "@/assets/shoe-6.png";

const DEFAULT_SHOE_IMAGES = [shoe1, shoe2, shoe3, shoe4, shoe5, shoe6];

const getFallbackImage = (id: string) => {
  const idx = (id.charCodeAt(0) + id.charCodeAt(id.length - 1)) % DEFAULT_SHOE_IMAGES.length;
  return DEFAULT_SHOE_IMAGES[idx];
};

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
  additional_images?: string; // JSON array of image URLs
  is_active: boolean;
}

interface AdminSession {
  id: string;
  email: string;
  full_name: string;
}

const AdminPage = () => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    color: "",
    category: "",
    description: "",
    image_url: "",
    image_path: "",
    additional_images: [] as string[],
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const statuses = ["Pending", "Accepted", "Shipped", "Delivered", "Returned"];

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
      toast({ title: "Login Successful", description: `Welcome, ${result.admin.full_name}!` });
    } else {
      toast({ title: "Login Failed", description: result.error, variant: "destructive" });
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("admin_session");
    resetForm();
    toast({ title: "Logged Out", description: "You have been logged out successfully" });
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
    }
  };

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
      toast({ title: "Error", description: "Failed to fetch orders", variant: "destructive" });
    } finally {
      setOrdersLoading(false);
    }
  };

  // Upload main product image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const { image_url, image_path } = await uploadProductImage(file, formData.name || "product");
      setFormData((prev) => ({ ...prev, image_url, image_path }));
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload additional images
  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const { image_url } = await uploadProductImage(file, formData.name || "product");
        newUrls.push(image_url);
      }
      setFormData((prev) => ({
        ...prev,
        additional_images: [...prev.additional_images, ...newUrls],
      }));
      toast({ title: "Success", description: `${newUrls.length} image(s) uploaded` });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.color || !formData.category) {
      toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const payload: any = {
        name: formData.name,
        price: Number(formData.price),
        color: formData.color,
        category: formData.category,
        description: formData.description,
        image_url: formData.image_url,
        image_path: formData.image_path,
        additional_images: JSON.stringify(formData.additional_images),
      };

      if (editingProduct) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
        if (error) throw error;
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        const { error } = await supabase.from("products").insert({ ...payload, is_active: true });
        if (error) throw error;
        toast({ title: "Success", description: "Product added successfully" });
      }
      resetForm();
      await fetchProducts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProduct(product);
    let additionalImages: string[] = [];
    try {
      if (product.additional_images) {
        additionalImages = JSON.parse(product.additional_images);
      }
    } catch {}
    setFormData({
      name: product.name,
      price: product.price,
      color: product.color,
      category: product.category,
      description: product.description,
      image_url: product.image_url || "",
      image_path: product.image_path || "",
      additional_images: additionalImages,
    });
    setActiveTab("products");
  };

  const handleDeleteProduct = async (product: AdminProduct) => {
    if (!confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    setIsLoading(true);
    try {
      if (product.image_path) {
        await deleteProductImage(product.image_path);
      }
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
      toast({ title: "Success", description: "Product deleted successfully" });
      await fetchProducts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
      if (error) throw error;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      toast({ title: "Success", description: `Order status updated to ${newStatus}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

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
      additional_images: [],
    });
  };

  // Login page
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 pt-28">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
                  <Lock className="w-8 h-8 text-black" />
                </div>
              </div>
              <h1 className="text-4xl font-black text-amber-400 tracking-tight">CusAura</h1>
              <p className="text-amber-400/80 text-sm mt-1 font-bold">Admin Dashboard</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Username</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-amber-500/60" />
                  <Input type="text" placeholder="admin" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="bg-slate-800/50 border-amber-500/30 pl-10 py-6 text-white placeholder-gray-500" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Password</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-amber-500/60" />
                  <Input type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="bg-slate-800/50 border-amber-500/30 pl-10 py-6 text-white placeholder-gray-500" required />
                </div>
              </div>
              <Button type="submit" disabled={loginLoading} className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold py-6 mt-6">
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black text-amber-400">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome, <span className="text-amber-400 font-bold">{session.full_name}</span>
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-red-500/30 hover:bg-red-500/10 text-red-400 gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 backdrop-blur-xl border border-amber-500/30 rounded-2xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-14 bg-slate-800/50 p-1 rounded-none border-b border-amber-500/30">
              <TabsTrigger value="products" className="text-amber-400 data-[state=active]:bg-amber-500/20">
                <Package className="w-4 h-4 mr-2" /> Products ({products.length})
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-amber-400 data-[state=active]:bg-amber-500/20">
                <Package className="w-4 h-4 mr-2" /> Orders ({orders.length})
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
                  <Input placeholder="Product Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-slate-700/50 border-amber-500/30" />
                  <Input type="number" placeholder="Price (₹) *" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="bg-slate-700/50 border-amber-500/30" />
                  <Input placeholder="Color *" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="bg-slate-700/50 border-amber-500/30" />
                  <Input placeholder="Category *" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-slate-700/50 border-amber-500/30" />
                </div>

                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-4 bg-slate-700/50 border border-amber-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                  rows={3}
                />

                {/* Main Image Upload */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                    Main Product Image
                  </label>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-amber-500/20">
                    <label className="cursor-pointer block">
                      <div className="flex items-center justify-center">
                        {formData.image_url ? (
                          <div className="relative w-full">
                            <ProductImage src={formData.image_url} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setFormData({ ...formData, image_url: "", image_path: "" });
                              }}
                              className="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-amber-400/60 mx-auto mb-2" />
                            <p className="text-gray-300 text-sm">Click to upload main image</p>
                            <p className="text-gray-500 text-xs mt-1">Max 5MB</p>
                          </div>
                        )}
                      </div>
                      <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" disabled={uploadingImage} />
                    </label>
                  </div>
                </div>

                {/* Additional Images Upload */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                    Additional Images ({formData.additional_images.length})
                  </label>

                  {/* Existing additional images */}
                  {formData.additional_images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                      {formData.additional_images.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <ProductImage src={url} alt={`Additional ${idx + 1}`} className="w-full h-28 object-cover rounded-lg border border-amber-500/20" />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload more button */}
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-dashed border-amber-500/30">
                    <label className="cursor-pointer block text-center">
                      <ImagePlus className="w-6 h-6 text-amber-400/60 mx-auto mb-1" />
                      <p className="text-gray-300 text-sm">Click to add more images</p>
                      <p className="text-gray-500 text-xs mt-1">Select multiple files at once</p>
                      <input
                        type="file"
                        onChange={handleAdditionalImageUpload}
                        accept="image/*"
                        className="hidden"
                        multiple
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>

                {uploadingImage && (
                  <div className="mt-3 flex items-center gap-2 text-amber-400 text-sm">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSaveProduct} disabled={isLoading} className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold">
                    {isLoading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  {editingProduct && (
                    <Button onClick={resetForm} variant="outline" className="border-amber-500/30 hover:bg-amber-500/10">
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
                  {products.map((product) => {
                    const displayImage = product.image_url || getFallbackImage(product.id);
                    let additionalCount = 0;
                    try {
                      if (product.additional_images) {
                        additionalCount = JSON.parse(product.additional_images).length;
                      }
                    } catch {}

                    return (
                      <motion.div key={product.id} whileHover={{ scale: 1.02 }} className="bg-slate-800/50 border border-amber-500/30 rounded-xl overflow-hidden">
                        <div className="relative h-48 overflow-hidden bg-slate-700/30">
                          <ProductImage src={displayImage} alt={product.name} className="w-full h-full object-contain p-4" fallbackId={product.id} />
                          {additionalCount > 0 && (
                            <span className="absolute top-2 right-2 bg-amber-500/90 text-black text-xs font-bold px-2 py-1 rounded-full">
                              +{additionalCount} imgs
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-amber-400">{product.name}</h4>
                          <p className="text-gray-400 text-sm">{product.color} • {product.category}</p>
                          <p className="text-white text-sm mt-2 line-clamp-2">{product.description}</p>
                          <p className="text-amber-400 font-bold mt-2">{formatPrice(product.price)}</p>
                          <div className="flex gap-2 mt-4">
                            <button onClick={() => handleEditProduct(product)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(product)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="p-6">
              {ordersLoading ? (
                <div className="text-center py-12"><p className="text-gray-400">Loading orders...</p></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-amber-400/30 mx-auto mb-4" />
                  <p className="text-gray-400">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex gap-2 border-b border-amber-500/20 pb-4 overflow-x-auto">
                    {["all", ...statuses].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setOrderStatusFilter(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                          orderStatusFilter === tab
                            ? "bg-amber-500/20 border border-amber-500/60 text-amber-400"
                            : "bg-slate-700/40 border border-slate-600/40 text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        {tab === "all" ? "All Orders" : tab}
                        <span className="ml-2 text-xs font-normal">({orders.filter(o => tab === "all" || o.status === tab).length})</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {orders.filter(o => orderStatusFilter === "all" || o.status === orderStatusFilter).map((order) => (
                      <motion.div key={order.id} className="cursor-pointer transition-all" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-amber-500/30 rounded-xl p-5 hover:border-amber-500/60 transition-all">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="text-white font-semibold text-sm">Order {order.id.slice(0, 8)}</p>
                              <p className="text-gray-400 text-xs mt-1">{new Date(order.created_at).toLocaleDateString()} • {order.shipping_name || "No name"}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-amber-400 font-bold">₹{order.total}</p>
                                <span className={`text-xs font-semibold mt-1 inline-block px-3 py-1 rounded-full ${
                                  order.status === "Accepted" ? "bg-green-500/20 text-green-400"
                                    : order.status === "Pending" ? "bg-yellow-500/20 text-yellow-400"
                                    : order.status === "Delivered" ? "bg-emerald-500/20 text-emerald-400"
                                    : order.status === "Shipped" ? "bg-cyan-500/20 text-cyan-400"
                                    : "bg-orange-500/20 text-orange-400"
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="text-gray-400">
                                <svg className={`w-5 h-5 transition-transform ${expandedOrderId === order.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {expandedOrderId === order.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 bg-slate-800/80 border border-amber-500/20 rounded-xl p-6 space-y-6">
                            <div>
                              <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">Customer Information</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div><p className="text-gray-400 text-xs uppercase">Name</p><p className="text-white font-semibold mt-1">{order.shipping_name || "N/A"}</p></div>
                                <div><p className="text-gray-400 text-xs uppercase">Email</p><p className="text-white break-all">{order.shipping_email || "N/A"}</p></div>
                                <div><p className="text-gray-400 text-xs uppercase">Phone</p><p className="text-white font-mono">{order.shipping_phone || "N/A"}</p></div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">Shipping Address</h4>
                              <div className="bg-slate-700/30 rounded-lg p-4 text-sm text-white space-y-1">
                                <p className="font-semibold">{order.shipping_address || "N/A"}</p>
                                <p>{[order.shipping_city, order.shipping_state, order.shipping_postal_code].filter(Boolean).join(", ") || "N/A"}</p>
                                <p>{order.shipping_country || "N/A"}</p>
                              </div>
                            </div>

                            {order.order_items?.length > 0 && (
                              <div>
                                <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">Order Items</h4>
                                <div className="space-y-2">
                                  {order.order_items.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30 text-sm">
                                      <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                          <p className="text-white font-semibold">{item.product_name}</p>
                                          <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1">
                                            {item.product_color && <span>Color: {item.product_color}</span>}
                                            {item.product_category && <span>Category: {item.product_category}</span>}
                                            <span>Qty: {item.quantity}</span>
                                          </div>
                                        </div>
                                        <p className="text-amber-400 font-bold whitespace-nowrap">₹{item.price}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">Update Status</h4>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-slate-700/80 border border-amber-500/40 text-white rounded-lg px-4 py-2 text-sm font-medium hover:border-amber-500/60 transition-colors"
                              >
                                {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                              </select>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

// Helper component for images with fallback
const ProductImage = ({ src, alt, className, fallbackId }: { src: string; alt: string; className?: string; fallbackId?: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <img
      src={hasError && fallbackId ? getFallbackImage(fallbackId) : imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          if (fallbackId) {
            setImgSrc(getFallbackImage(fallbackId));
          }
        }
      }}
    />
  );
};

export default AdminPage;
