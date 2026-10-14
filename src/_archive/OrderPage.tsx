import React from 'react';
import { OrderForm } from '../components/order/OrderForm';

interface OrderPageProps {
  navigate: (path: string) => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({ navigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <OrderForm navigate={navigate} />
    </div>
  );
};
