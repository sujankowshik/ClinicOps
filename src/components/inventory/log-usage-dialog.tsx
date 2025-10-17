'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { MinusCircle } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';

const logUsageFormSchema = z.object({
  itemId: z.string().min(1, 'Item is required.'),
  quantityUsed: z.coerce.number().int().positive('Quantity must be a positive number.'),
});

type LogUsageFormValues = z.infer<typeof logUsageFormSchema>;

interface LogUsageDialogProps {
  inventory: InventoryItem[];
  onUpdateStock: (itemId: string, quantityUsed: number) => void;
}

export function LogUsageDialog({ inventory, onUpdateStock }: LogUsageDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm<LogUsageFormValues>({
    resolver: zodResolver(logUsageFormSchema),
    defaultValues: {
      itemId: '',
      quantityUsed: 0,
    },
  });

  function onSubmit(data: LogUsageFormValues) {
    const item = inventory.find(i => i.id === data.itemId);
    if (!item) {
        toast({ variant: "destructive", title: "Error", description: "Selected item not found." });
        return;
    }
    if (data.quantityUsed > item.stock) {
        form.setError('quantityUsed', { message: `Cannot use more than the available stock (${item.stock}).` });
        return;
    }

    onUpdateStock(data.itemId, data.quantityUsed);
    toast({
      title: 'Usage Logged!',
      description: `${data.quantityUsed} of ${item.itemName} has been logged.`,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MinusCircle className="mr-2 h-4 w-4" />
          Log Usage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Log Item Usage</DialogTitle>
          <DialogDescription>
            Select an item and enter the quantity used today.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory Item</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventory.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.itemName} (In Stock: {item.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantityUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Used</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Log Usage</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
