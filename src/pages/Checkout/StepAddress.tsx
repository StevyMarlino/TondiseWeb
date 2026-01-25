import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, MapPin, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CheckoutData } from "./index";
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
  country: z.string().default("CM"),
  is_default: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface StepAddressProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (data: Partial<CheckoutData>) => void;
  onNext: () => void;
}

export function StepAddress({ checkoutData, updateCheckoutData, onNext }: StepAddressProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    checkoutData.shippingAddressId?.toString() || ""
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "CM",
      is_default: false,
    },
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/addresses");
      const data = response.data.data || response.data;
      setAddresses(Array.isArray(data) ? data : []);

      // Auto-select default address
      const defaultAddress = data.find((a: Address) => a.is_default);
      if (defaultAddress && !selectedAddressId) {
        setSelectedAddressId(defaultAddress.id.toString());
        updateCheckoutData({ shippingAddressId: defaultAddress.id });
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitAddress = async (data: AddressFormData) => {
    setIsSaving(true);
    try {
      const response = await api.post("/addresses", data);
      const newAddress = response.data.address || response.data;
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id.toString());
      updateCheckoutData({ shippingAddressId: newAddress.id });
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating address:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    updateCheckoutData({ shippingAddressId: parseInt(addressId) });
  };

  const handleNext = () => {
    if (selectedAddressId) {
      onNext();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {addresses.length > 0 ? (
        <RadioGroup
          value={selectedAddressId}
          onValueChange={handleAddressSelect}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <label
              key={address.id}
              className={cn(
                "flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors",
                selectedAddressId === address.id.toString()
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            >
              <RadioGroupItem value={address.id.toString()} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{address.full_name}</span>
                  {address.label && (
                    <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded">
                      {address.label}
                    </span>
                  )}
                  {address.is_default && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Par défaut
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  {address.full_address}
                </p>
                <p className="text-sm text-neutral-500 mt-1">{address.phone}</p>
              </div>
              {selectedAddressId === address.id.toString() && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </label>
          ))}
        </RadioGroup>
      ) : (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 mb-4">
            Vous n'avez pas encore d'adresse enregistrée.
          </p>
        </div>
      )}

      {/* Add new address button/dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une nouvelle adresse
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle adresse</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-4">
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

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} disabled={!selectedAddressId}>
          Continuer
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
