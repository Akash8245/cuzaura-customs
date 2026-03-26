import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useOrdersStore } from "@/store/ordersStore";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Truck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/data";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pending":
      return <Package className="w-5 h-5 text-yellow-500" />;
    case "Accepted":
      return <Package className="w-5 h-5 text-blue-500" />;
    case "Shipped":
      return <Truck className="w-5 h-5 text-purple-500" />;
    case "Delivered":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    default:
      return <ShoppingBag className="w-5 h-5" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500/20 text-yellow-700";
    case "Accepted":
      return "bg-blue-500/20 text-blue-700";
    case "Shipped":
      return "bg-purple-500/20 text-purple-700";
    case "Delivered":
      return "bg-green-500/20 text-green-700";
    default:
      return "bg-gray-500/20 text-gray-700";
  }
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orders, isLoading, fetchUserOrders } = useOrdersStore();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchUserOrders(user.id);
  }, [user, navigate, fetchUserOrders]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-12">
            <h1 className="font-display text-5xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track your bespoke shoe orders</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-secondary rounded-xl p-12 text-center glow-border"
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Button
                onClick={() => navigate("/collection")}
                className="glow-gold px-8 py-6"
              >
                Browse Collection
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary rounded-xl p-8 glow-border"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono text-sm text-gold font-semibold">
                        {order.id.substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                      {getStatusIcon(order.status)}
                      <span
                        className={`px-4 py-2 rounded-lg font-medium text-sm ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <h3 className="font-display font-semibold mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {order.items?.map((item) => (
                          <div key={item.id} className="text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-foreground">
                                {item.product_name}
                              </span>
                              <span className="text-gold font-semibold">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                            {item.customization && (
                              <p className="text-xs text-muted-foreground">
                                Customized
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display font-semibold mb-4">
                        Shipping Address
                      </h3>
                      <div className="text-sm space-y-2 text-muted-foreground">
                        <p className="font-medium text-foreground">
                          {order.shipping_name}
                        </p>
                        <p>{order.shipping_street}</p>
                        <p>
                          {order.shipping_city}, {order.shipping_zip}
                        </p>
                        <p>{order.shipping_phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Order Total
                      </p>
                      <p className="font-display text-2xl font-bold text-gradient">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground mt-4 sm:mt-0">
                      <p>
                        Ordered on{" "}
                        <span className="text-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrdersPage;
