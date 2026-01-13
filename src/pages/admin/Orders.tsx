import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2,
  Download,
  Phone,
  MapPin,
  Calendar,
  Package
} from 'lucide-react';
import { format } from 'date-fns';

type OrderStatus = 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

const statusOptions: OrderStatus[] = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', searchQuery, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*, product_variants(variant_name, weight_size, price)')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('order_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Client-side search filter
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        return data?.filter(order => 
          order.customer_name.toLowerCase().includes(search) ||
          order.phone_number.includes(search) ||
          order.order_number.toLowerCase().includes(search)
        );
      }

      return data;
    }
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setIsDetailOpen(false);
      toast({
        title: "Order Deleted",
        description: "Order has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete order.",
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportToCSV = () => {
    if (!orders?.length) return;

    const headers = ['Order Number', 'Customer Name', 'Phone', 'Address', 'Product', 'Quantity', 'Total', 'Status', 'Date'];
    const rows = orders.map(order => [
      order.order_number,
      order.customer_name,
      order.phone_number,
      order.delivery_address.replace(/,/g, ';'),
      order.product_variants?.variant_name || '',
      order.quantity,
      order.total_price,
      order.order_status,
      format(new Date(order.created_at), 'yyyy-MM-dd HH:mm')
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or order number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportToCSV} disabled={!orders?.length}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({orders?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : orders?.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Product</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(order.created_at), 'dd MMM, hh:mm a')}
                          </p>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.phone_number}</p>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <p className="text-sm">{order.product_variants?.weight_size}</p>
                          <p className="text-xs text-muted-foreground">x{order.quantity}</p>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-medium">৳{Number(order.total_price).toLocaleString()}</p>
                        </td>
                        <td className="py-3 px-2">
                          <Select
                            value={order.order_status || 'Pending'}
                            onValueChange={(value) => updateStatusMutation.mutate({ 
                              orderId: order.id, 
                              status: value as OrderStatus 
                            })}
                          >
                            <SelectTrigger className={`w-[140px] h-8 text-xs border ${getStatusColor(order.order_status || '')}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                {selectedOrder?.order_number}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="font-medium">{selectedOrder.phone_number}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Delivery Address
                  </p>
                  <p className="font-medium">{selectedOrder.delivery_address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium">
                      {selectedOrder.product_variants?.variant_name} ({selectedOrder.product_variants?.weight_size})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{selectedOrder.quantity}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Unit Price</p>
                    <p className="font-medium">৳{Number(selectedOrder.unit_price).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold text-lg">৳{Number(selectedOrder.total_price).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Order Date
                    </p>
                    <p className="font-medium">
                      {format(new Date(selectedOrder.created_at), 'dd MMM yyyy, hh:mm a')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <p className="font-medium">{selectedOrder.payment_method}</p>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Admin Notes</p>
                    <p className="font-medium">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this order?')) {
                        deleteOrderMutation.mutate(selectedOrder.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Order
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://wa.me/88${selectedOrder.phone_number}`, '_blank')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Orders;
