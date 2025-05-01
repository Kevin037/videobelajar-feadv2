import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteDataById, getDataById, parseFirestoreFields, retrieveData, store, update } from "../db";

const initialState = {
  orderData: [],
  orderLessons: [],
  currentOrder: null,
  loading: false,
  error: null,
  status: null
};

export const createOrderThunk = createAsyncThunk(
  'order/create',
  async (orderData, thunkAPI) => {
    try {
      const res = await store(orderData,'orders');
      if (res?.fields) {
        const order = parseFirestoreFields(res.fields);
        const lessons = await retrieveData('lessons', order.class_id, "class_id");
          for (let i = 0; i < lessons.length; i++) {
            await store({ 
              order_id: order.order_id,
              class_id: lessons[i].class_id,
              lesson_id: lessons[i].id,
              duration: lessons[i].duration,
              group_name: lessons[i].group_name,
              ordering: lessons[i].ordering,
              name: lessons[i].name,
              type: lessons[i].type
            },'order_lessons');
          }
        return order;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createReviewThunk = createAsyncThunk(
  'order/review',
  async (reviewData, thunkAPI) => {
    try {
      const reviews = await retrieveData('reviews', reviewData.order_id,"order_id");
      if (reviews.length > 0) {
        for (let i = 0; i < reviews.length; i++) {
          await deleteDataById(reviews[i].id,'reviews');
        }
      }
      const res = await store(reviewData,'reviews');
      if (res) {
        const order = await update({user_rating:reviewData.rating,user_review:reviewData.review},'orders',reviewData.order_id); 
        return order;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateOrderThunk = createAsyncThunk(
  'order/update',
  async ({id,orderData}, thunkAPI) => {
    try {
      const res = await update(orderData,'orders',id);
      return res; // res berisi data document baru dari Firestore
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getOrders = createAsyncThunk(
  'order/fetch',
  async ({order_id,columnName,user_id}, thunkAPI) => {
    try {
      const data = await retrieveData('orders', order_id, columnName,user_id);
      if (data[0]?.order_id) {
        let orderLessons = [];
        if (order_id != null && columnName != null) {
          const lessons = await retrieveData('order_lessons', data[0].order_id, "order_id");
          lessons.sort((a, b) => a.ordering - b.ordering);
          const groupedLessons = lessons.reduce((acc, lesson) => {
            if (lesson.type === "video") {
              const groupName = lesson.group_name || "Ungrouped";
    
              if (!acc[groupName]) {
                acc[groupName] = [];
              }
      
              acc[groupName].push(lesson); // simpan seluruh objek lesson
            }
            return acc;
          }, {});
    
          // Convert grouped object to array
          orderLessons = Object.entries(groupedLessons).map(([groupName, lessons]) => ({
            title: groupName,
            lessons: lessons,
          }));
        }
        return {
          orderData: data,
          orderLessons: orderLessons
        } 
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getOrderById = createAsyncThunk(
  'order/getById',
  async (id, thunkAPI) => {
    try {
      const res = await getDataById(id,'orders');
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetAll: () => {
      return initialState;
    },
    resetError: (state) => {
      state.error = false;
    },
    resetorder: (state) => {
      state.orderData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload; // data user baru dari Firestore
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload.orderData;
        state.orderLessons = action.payload.orderLessons;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload; // data user baru dari Firestore
      })
      .addCase(updateOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = parseFirestoreFields(action.payload.fields);
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(createReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
  },
});

export const { resetorder } = orderSlice.actions;

export default orderSlice.reducer;