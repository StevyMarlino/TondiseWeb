import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, MapPin, Edit2, Trash2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AccountLayout } from "./AccountLayout";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Address {
  id: number;
  label: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  full_address: string;
  is_default: boolean;
}

const addressSchema = z.object({
  label: z.string().optional(),
  first_name: z.string().min(2, "Prénom requis"),
  last_name: z.string().min(2, "Nom requis"),
  phone: z.string().min(9, "Téléphone requis"),
  address_line_1: z.string().min(5, "Adresse requise"),
  address_line_2: z.string().optional(),
  city: z.string().min(2, "Ville requise"),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string(),
  is_default: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "CM",
      is_default: false,
    },
  });

  const isDefault = watch("is_default");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/addresses");
      const data = response.data.data || response.data;
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    reset({
      country: "CM",
      is_default: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    reset({
      label: address.label || "",
      first_name: address.first_name,
      last_name: address.last_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || "",
      city: address.city,
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country,
      is_default: address.is_default,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: AddressFormData) => {
    setIsSaving(true);
    try {
      if (editingAddress) {
        const response = await api.put(`/addresses/${editingAddress.id}`, data);
        const updatedAddress = response.data.address || response.data;
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingAddress.id ? updatedAddress : a))
        );
        toast.success("Adresse modifiée avec succès");
      } else {
        const response = await api.post("/addresses", data);
        const newAddress = response.data.address || response.data;
        setAddresses((prev) => [...prev, newAddress]);
        toast.success("Adresse ajoutée avec succès");
      }
      setIsDialogOpen(false);
      reset();
      fetchAddresses();
    } catch (error: any) {
      const message = error.response?.data?.message || "Une erreur est survenue";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAddress) return;

    try {
      await api.delete(`/addresses/${deletingAddress.id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== deletingAddress.id));
      toast.success("Adresse supprimée");
      setDeletingAddress(null);
    } catch (error: any) {
      const message = error.response?.data?.message || "Impossible de supprimer cette adresse";
      toast.error(message);
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      await api.put(`/addresses/${address.id}`, { ...address, is_default: true });
      fetchAddresses();
      toast.success("Adresse par défaut mise à jour");
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <AccountLayout
      title="Mes adresses"
      description="Gérez vos adresses de livraison"
    >
      {/* Add button */}
      <div className="mb-6">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une adresse
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white dark:bg-neutral-900 rounded-xl border p-6 relative"
            >
              {address.is_default && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-current" />
                    Par défaut
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{address.full_name}</p>
                    {address.label && (
                      <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                        {address.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    {address.full_address}
                  </p>
                  <p className="text-sm text-neutral-500">{address.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(address)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                {!address.is_default && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Par défaut
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeletingAddress(address)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border">
          <MapPin className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune adresse</h3>
          <p className="text-neutral-500 mb-6">
            Vous n'avez pas encore ajouté d'adresse
          </p>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une adresse
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Modifier l'adresse" : "Nouvelle adresse"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input id="first_name" {...register("first_name")} />
                {errors.first_name && (
                  <p className="text-xs text-red-500">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input id="last_name" {...register("last_name")} />
                {errors.last_name && (
                  <p className="text-xs text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" placeholder="+237 6XX XXX XXX" {...register("phone")} />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line_1">Adresse</Label>
              <Input id="address_line_1" {...register("address_line_1")} />
              {errors.address_line_1 && (
                <p className="text-xs text-red-500">{errors.address_line_1.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line_2">Complément (optionnel)</Label>
              <Input id="address_line_2" {...register("address_line_2")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" {...register("city")} />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Région (optionnel)</Label>
                <Input id="state" {...register("state")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Libellé (optionnel)</Label>
              <Input id="label" placeholder="Ex: Domicile, Bureau..." {...register("label")} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={isDefault}
                onCheckedChange={(checked) => setValue("is_default", !!checked)}
              />
              <label
                htmlFor="is_default"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Définir comme adresse par défaut
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingAddress} onOpenChange={() => setDeletingAddress(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette adresse ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'adresse sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccountLayout>
  );
}
