import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Dashboard = () => {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, total_price, order_status, created_at');
      
      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(o => o.order_status === 'Pending').length || 0;
      const todayOrders = orders?.filter(o => new Date(o.created_at) >= today).length || 0;
      const monthOrders = orders?.filter(o => new Date(o.created_at) >= monthStart).length || 0;
      const totalRevenue = orders?.filter(o => o.order_status !== 'Cancelled')
        .reduce((sum, o) => sum + Number(o.total_price), 0) || 0;
      const todayRevenue = orders?.filter(o => new Date(o.created_at) >= today && o.order_status !== 'Cancelled')
        .reduce((sum, o) => sum + Number(o.total_price), 0) || 0;

      return {
        totalOrders,
        pendingOrders,
        todayOrders,
        monthOrders,
        totalRevenue,
        todayRevenue
      };
    }
  });

  // Fetch recent orders
  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, product_variants(variant_name, weight_size)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch low stock alerts
  const { data: lowStock, isLoading: stockLoading } = useQuery({
    queryKey: ['low-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('is_active', true)
        .lt('stock_quantity', 10)
        .order('stock_quantity', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">৳{stats?.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    ৳{stats?.todayRevenue.toLocaleString()} today
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.todayOrders} today, {stats?.monthOrders} this month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-yellow-600">{stats?.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires attention
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stockLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-orange-600">{lowStock?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Below 10 units
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link to="/admin/orders" className="text-sm text-primary hover:underline">
                View all →
              </Link>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentOrders?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders?.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.order_number} • {format(new Date(order.created_at), 'dd MMM, hh:mm a')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">৳{Number(order.total_price).toLocaleString()}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.order_status || '')}`}>
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Low Stock Alerts</CardTitle>
              <Link to="/admin/products" className="text-sm text-primary hover:underline">
                Manage →
              </Link>
            </CardHeader>
            <CardContent>
              {stockLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : lowStock?.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">All products are well stocked!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lowStock?.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium">{product.variant_name}</p>
                        <p className="text-sm text-muted-foreground">{product.weight_size}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">{product.stock_quantity} left</p>
                        <p className="text-xs text-muted-foreground">Restock needed</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
