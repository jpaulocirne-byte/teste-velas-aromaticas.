
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Floral' | 'Amadeirado' | 'Cítrico' | 'Doce' | 'Fresco';
  images: string[];
  aroma: string;
  size: 'Pequena' | 'Média' | 'Grande';
  weight: string;
  burnTime: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  reviews: Review[];
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue';
  date: string;
}

export interface User {
  name: string;
  email: string;
  orders: Order[];
}
