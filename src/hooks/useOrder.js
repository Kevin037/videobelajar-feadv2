// hooks/useUser.js
import { useDispatch, useSelector } from 'react-redux';
import { createOrderThunk, getOrderById, getOrders, updateOrderThunk } from '../services/api/orderSlice';
import { useEffect } from 'react';

const useOrder = (id=null,order_id=null, columnName=null, user_id = null) => {
  const dispatch = useDispatch();
  const { orderData, currentOrder, loading, error, status } = useSelector(state => state.order);

  const createOrder = (userData) => {
    dispatch(createOrderThunk(userData));
  };

  const updateOrder = (id,orderData) => {
    dispatch(updateOrderThunk({id,orderData}));
  };

    useEffect(() => {
      if (order_id || user_id) {
        dispatch(getOrders({order_id,columnName, user_id})); 
      }
      if (id) {
        dispatch(getOrderById(id));
      }
    }, [dispatch,order_id]);

  return { currentOrder, loading, error, createOrder, orderData, updateOrder, status };
};

export default useOrder;
