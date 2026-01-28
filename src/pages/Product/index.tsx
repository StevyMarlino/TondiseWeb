import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Truck,
  RotateCcw,
  Shield,
  Loader2,
  ChevronRight,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/authStore";

interface ProductOption {
  id: number;
  name: string;
  type: "select" | "radio" | "color";
  is_required: boolean;
  sort_order: number;
  values: ProductOptionValue[];
}

interface ProductOptionValue {
  id: number;
  label: string;
  value: string;
  price_modifier: string;
  is_default: boolean;
  sort_order: number;
}

interface PricingTier {
  id: number;
  quantity: number;
  unit_price: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  base_price: string;
  sku: string;
  images: string[];
  main_image: string | null;
  is_active: boolean;
  is_featured: boolean;
  category: Category;
  options: ProductOption[];
  pricing_tiers: PricingTier[];
}

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<{
    unit_price: string;
    total: string;
  } | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      // Set default options
      const defaults: Record<number, number> = {};
      product.options.forEach((option) => {
        const defaultValue = option.values.find((v) => v.is_default);
        if (defaultValue) {
          defaults[option.id] = defaultValue.id;
        } else if (option.values.length > 0) {
          defaults[option.id] = option.values[0].id;
        }
      });
      setSelectedOptions(defaults);
    }
  }, [product]);

  useEffect(() => {
    if (product && Object.keys(selectedOptions).length > 0) {
      calculatePrice();
    }
  }, [quantity, selectedOptions, product]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const data = response.data.product || response.data;
      setProduct(data);

      // Check if product is in favorites
      if (isAuthenticated) {
        checkFavoriteStatus(data.id);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Erreur lors du chargement du produit");
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoriteStatus = async (productId: number) => {
    try {
      const response = await api.get("/favorites");
      const favorites = response.data.data || response.data || [];
      setIsFavorite(favorites.some((f: any) => f.product_id === productId || f.product?.id === productId));
    } catch (error) {
      // Ignore error
    }
  };

  const calculatePrice = async () => {
    if (!product) return;

    // Local calculation function (used as fallback or primary)
    const calculateLocally = () => {
      const basePrice = parseFloat(product.base_price) || 0;
      let optionsPrice = 0;

      Object.entries(selectedOptions).forEach(([optionId, valueId]) => {
        const option = product.options?.find((o) => o.id === parseInt(optionId));
        const value = option?.values?.find((v) => v.id === valueId);
        if (value?.price_modifier) {
          optionsPrice += parseFloat(value.price_modifier) || 0;
        }
      });

      // Find applicable tier
      let unitPrice = basePrice;
      if (product.pricing_tiers && product.pricing_tiers.length > 0) {
        const sortedTiers = [...product.pricing_tiers].sort((a, b) => b.quantity - a.quantity);
        for (const tier of sortedTiers) {
          if (quantity >= tier.quantity) {
            unitPrice = parseFloat(tier.unit_price) || basePrice;
            break;
          }
        }
      }

      const finalUnitPrice = unitPrice + optionsPrice;
      const total = finalUnitPrice * quantity;

      setCalculatedPrice({
        unit_price: finalUnitPrice.toFixed(2),
        total: total.toFixed(2),
      });
    };

    // Try API calculation first, fallback to local
    try {
      const response = await api.post(`/products/${product.id}/calculate-price`, {
        quantity,
        selected_options: Object.values(selectedOptions),
      });
      const pricing = response.data.pricing;
      if (pricing?.unit_price && pricing?.total) {
        setCalculatedPrice({
          unit_price: pricing.unit_price,
          total: pricing.total,
        });
      } else {
        calculateLocally();
      }
    } catch (error) {
      // Silently fallback to local calculation
      calculateLocally();
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleOptionChange = (optionId: number, valueId: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }));
  };

  const handleAddToCart = async () => {
    if (!product || !calculatedPrice) return;

    setIsAddingToCart(true);
    try {
      // Build selected options for display (name -> label)
      const optionsDisplay: Record<string, string> = {};
      Object.entries(selectedOptions).forEach(([optionId, valueId]) => {
        const option = product.options.find((o) => o.id === parseInt(optionId));
        const value = option?.values.find((v) => v.id === valueId);
        if (option && value) {
          optionsDisplay[option.name] = value.label;
        }
      });

      // Get options for API: { optionId: valueId }
      const optionsApi: Record<number, number> = { ...selectedOptions };

      addItem({
        productId: product.id,
        name: product.name,
        image: product.main_image || product.images[0] || "/placeholder.png",
        quantity,
        unitPrice: parseFloat(calculatedPrice.unit_price),
        totalPrice: parseFloat(calculatedPrice.total),
        selectedOptions: optionsDisplay,
        selectedOptionsApi: optionsApi,
      });

      toast.success("Produit ajouté au panier");
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour ajouter aux favoris");
      return;
    }

    if (!product) return;

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${product.id}`);
        setIsFavorite(false);
        toast.success("Retiré des favoris");
      } else {
        await api.post(`/favorites/${product.id}`);
        setIsFavorite(true);
        toast.success("Ajouté aux favoris");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return num.toLocaleString("fr-FR");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Produit introuvable</h1>
        <p className="text-neutral-500 mb-6">Ce produit n'existe pas ou a été supprimé.</p>
        <NavLink to="/shop">
          <Button>Retour à la boutique</Button>
        </NavLink>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.main_image || "/placeholder.png"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <NavLink to="/" className="hover:text-primary">Accueil</NavLink>
        <ChevronRight className="h-4 w-4" />
        <NavLink to="/shop" className="hover:text-primary">Boutique</NavLink>
        <ChevronRight className="h-4 w-4" />
        {product.category && (
          <>
            <NavLink to={`/category/${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </NavLink>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-neutral-900 dark:text-white truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-neutral-300"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            {product.is_featured && (
              <Badge className="mb-2 bg-primary/10 text-primary">Produit vedette</Badge>
            )}
            <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>
            {product.sku && (
              <p className="text-sm text-neutral-500 mt-1">SKU: {product.sku}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(calculatedPrice?.unit_price || product.base_price)} FCFA
              </span>
              {quantity > 1 && calculatedPrice && (
                <span className="text-lg text-neutral-500">
                  / unité
                </span>
              )}
            </div>
            {quantity > 1 && calculatedPrice && (
              <p className="text-lg font-semibold">
                Total: {formatPrice(calculatedPrice.total)} FCFA
              </p>
            )}
          </div>

          {/* Pricing Tiers */}
          {product.pricing_tiers.length > 1 && (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
              <p className="font-medium mb-2">Prix dégressifs :</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.pricing_tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={cn(
                      "text-center p-2 rounded-lg border",
                      quantity >= tier.quantity
                        ? "border-primary bg-primary/5"
                        : "border-neutral-200 dark:border-neutral-700"
                    )}
                  >
                    <p className="text-sm text-neutral-500">À partir de {tier.quantity}</p>
                    <p className="font-semibold">{formatPrice(tier.unit_price)} FCFA</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Short Description */}
          {product.short_description && (
            <p className="text-neutral-600 dark:text-neutral-400">
              {product.short_description}
            </p>
          )}

          <Separator />

          {/* Options */}
          {product.options.map((option) => (
            <div key={option.id} className="space-y-3">
              <label className="font-medium">
                {option.name}
                {option.is_required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {option.type === "select" ? (
                <Select
                  value={selectedOptions[option.id]?.toString()}
                  onValueChange={(value) => handleOptionChange(option.id, parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Choisir ${option.name.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.values.map((value) => (
                      <SelectItem key={value.id} value={value.id.toString()}>
                        {value.label}
                        {parseFloat(value.price_modifier) > 0 && (
                          <span className="text-neutral-500 ml-2">
                            (+{formatPrice(value.price_modifier)} FCFA)
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : option.type === "color" ? (
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <button
                      key={value.id}
                      onClick={() => handleOptionChange(option.id, value.id)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all",
                        selectedOptions[option.id] === value.id
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-neutral-300 hover:border-neutral-400"
                      )}
                      style={{ backgroundColor: value.value }}
                      title={value.label}
                    />
                  ))}
                </div>
              ) : (
                <RadioGroup
                  value={selectedOptions[option.id]?.toString()}
                  onValueChange={(value) => handleOptionChange(option.id, parseInt(value))}
                  className="flex flex-wrap gap-2"
                >
                  {option.values.map((value) => (
                    <label
                      key={value.id}
                      className={cn(
                        "flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer transition-colors",
                        selectedOptions[option.id] === value.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      <RadioGroupItem value={value.id.toString()} className="sr-only" />
                      <span>{value.label}</span>
                      {parseFloat(value.price_modifier) > 0 && (
                        <span className="text-xs text-neutral-500 ml-1">
                          +{formatPrice(value.price_modifier)}
                        </span>
                      )}
                    </label>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}

          {/* Quantity */}
          <div className="space-y-3">
            <label className="font-medium">Quantité</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-5 w-5 mr-2" />
              )}
              Ajouter au panier
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleToggleFavorite}
              className={cn(isFavorite && "text-red-500 border-red-500")}
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Livraison rapide</p>
                <p className="text-neutral-500">2-5 jours ouvrés</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Retours gratuits</p>
                <p className="text-neutral-500">Sous 14 jours</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Paiement sécurisé</p>
                <p className="text-neutral-500">100% sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}
    </div>
  );
}
