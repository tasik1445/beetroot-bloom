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
import { Plus, Edit, Trash2, MessageSquare, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_location: string | null;
  testimonial_text: string;
  rating: number | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  display_order: number | null;
}

const emptyTestimonial: Omit<Testimonial, 'id'> = {
  customer_name: '',
  customer_location: '',
  testimonial_text: '',
  rating: 5,
  is_verified: false,
  is_active: true,
  display_order: 0
};

const Testimonials = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>(emptyTestimonial);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch testimonials
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    }
  });

  // Create testimonial mutation
  const createMutation = useMutation({
    mutationFn: async (testimonial: Omit<Testimonial, 'id'>) => {
      const { error } = await supabase
        .from('customer_testimonials')
        .insert([testimonial]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Testimonial Created", description: "Testimonial has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create testimonial.", variant: "destructive" });
    }
  });

  // Update testimonial mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...testimonial }: Testimonial) => {
      const { error } = await supabase
        .from('customer_testimonials')
        .update(testimonial)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Testimonial Updated", description: "Testimonial has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update testimonial.", variant: "destructive" });
    }
  });

  // Delete testimonial mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customer_testimonials')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials-admin'] });
      toast({ title: "Testimonial Deleted", description: "Testimonial has been deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete testimonial.", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData(emptyTestimonial);
    setEditingTestimonial(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customer_name: testimonial.customer_name,
      customer_location: testimonial.customer_location,
      testimonial_text: testimonial.testimonial_text,
      rating: testimonial.rating,
      is_verified: testimonial.is_verified,
      is_active: testimonial.is_active,
      display_order: testimonial.display_order
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Testimonials</h2>
            <p className="text-muted-foreground">Manage customer reviews and testimonials</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : testimonials?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No testimonials yet</p>
              <Button className="mt-4" onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Testimonial
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials?.map((testimonial) => (
              <Card key={testimonial.id} className={`relative ${!testimonial.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex gap-0.5 mb-2">
                        {renderStars(testimonial.rating || 5)}
                      </div>
                      <h3 className="font-semibold">{testimonial.customer_name}</h3>
                      {testimonial.customer_location && (
                        <p className="text-sm text-muted-foreground">{testimonial.customer_location}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {testimonial.is_verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    "{testimonial.testimonial_text}"
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Switch checked={testimonial.is_active || false} disabled />
                      <span className="text-sm text-muted-foreground">
                        {testimonial.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(testimonial)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this testimonial?')) {
                            deleteMutation.mutate(testimonial.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
              <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
              <DialogDescription>
                {editingTestimonial ? 'Update the testimonial details below.' : 'Fill in the details for the new testimonial.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="e.g., রহিম আহমেদ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_location">Location</Label>
                <Input
                  id="customer_location"
                  value={formData.customer_location || ''}
                  onChange={(e) => setFormData({ ...formData, customer_location: e.target.value || null })}
                  placeholder="e.g., ঢাকা"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testimonial_text">Testimonial Text *</Label>
                <Textarea
                  id="testimonial_text"
                  value={formData.testimonial_text}
                  onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
                  placeholder="Customer's review..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5) *</Label>
                  <Input
                    id="rating"
                    type="number"
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    min="1"
                    max="5"
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

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_verified"
                    checked={formData.is_verified || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
                  />
                  <Label htmlFor="is_verified">Verified Purchase</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active (visible on landing page)</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingTestimonial ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Testimonials;
