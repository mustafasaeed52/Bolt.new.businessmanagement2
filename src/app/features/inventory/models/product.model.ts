export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}