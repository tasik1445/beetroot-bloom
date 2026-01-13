import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

interface ProductVariant {
  id: string;
  variant_name: string;
  description: string | null;
  weight_size: string;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  is_active: boolean | null;
  badge: string | null;
  display_order: number | null;
}

const emptyProduct: Omit<ProductVariant, 'id'> = {
  variant_name: '',
  description: '',
  weight_size: '',
  price: 0,
  original_price: null,
  stock_quantity: 0,
  is_active: true,
  badge: null,
  display_order: 0
};

const Products = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductVariant | null>(null);
  const [formData, setFormData] = useState<Omit<ProductVariant, 'id'>>(emptyProduct);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as ProductVariant[];
    }
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (product: Omit<ProductVariant, 'id'>) => {
      const { error } = await supabase
        .from('product_variants')
        .insert([product]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Product Created", description: "Product variant has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create product.", variant: "destructive" });
    }
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...product }: ProductVariant) => {
      const { error } = await supabase
        .from('product_variants')
        .update(product)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Product Updated", description: "Product variant has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update product.", variant: "destructive" });
    }
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product Deleted", description: "Product variant has been deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete product. It might be associated with orders.", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData(emptyProduct);
    setEditingProduct(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: ProductVariant) => {
    setEditingProduct(product);
    setFormData({
      variant_name: product.variant_name,
      description: product.description,
      weight_size: product.weight_size,
      price: product.price,
      original_price: product.original_price,
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
      badge: product.badge,
      display_order: product.display_order
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Product Variants</h2>
            <p className="text-muted-foreground">Manage your product variants and inventory</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products yet</p>
              <Button className="mt-4" onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products?.map((product) => (
              <Card key={product.id} className={`relative ${!product.is_active ? 'opacity-60' : ''}`}>
                {product.badge && (
                  <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                    {product.badge}
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{product.variant_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.weight_size}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">৳{product.price.toLocaleString()}</p>
                        {product.original_price && (
                          <p className="text-sm text-muted-foreground line-through">
                            ৳{product.original_price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-medium ${product.stock_quantity < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                          {product.stock_quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">in stock</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Switch checked={product.is_active || false} disabled />
                        <span className="text-sm text-muted-foreground">
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this product?')) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product Variant'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update the product details below.' : 'Fill in the details for the new product variant.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="variant_name">Variant Name *</Label>
                <Input
                  id="variant_name"
                  value={formData.variant_name}
                  onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })}
                  placeholder="e.g., Beetroot Powder - Regular"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight_size">Weight/Size *</Label>
                <Input
                  id="weight_size"
                  value={formData.weight_size}
                  onChange={(e) => setFormData({ ...formData, weight_size: e.target.value })}
                  placeholder="e.g., 250g"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (৳) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (৳)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price || ''}
                    onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || null })}
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order || 0}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Badge (Optional)</Label>
                <Input
                  id="badge"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value || null })}
                  placeholder="e.g., Most Popular, Best Value"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active (visible on landing page)</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingProduct ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Products;
