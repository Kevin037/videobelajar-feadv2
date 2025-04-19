import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { classFilterData, getDataById, parseFirestoreFields, retrieveData } from "../db";

const initialState = {
  selectedClass:null,
  classData: [],
  loading: false,
  error: null,
};

// export const getClasses = createAsyncThunk('users/fetch', async (filterGroup, thunkAPI) => {
//   try {
//     const data = await retrieveData('classes', filterGroup);
//     return data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message);
//   }
// });

export const getClasses = createAsyncThunk(
  'class/fetch',
  async ({type, columnName}, thunkAPI) => {
    try {
      const data = await retrieveData('classes', type,columnName);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchClassById = createAsyncThunk(
  'class/getById',
  async (id, thunkAPI) => {
    try {
      const res = await getDataById(id, 'classes');
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getClassesFilter = createAsyncThunk(
  'class/filter',
  async ({ClassType, price, duration, keyword, ordering}, thunkAPI) => {
    try {
      const data = await classFilterData(ClassType, price, duration, keyword, ordering);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    resetAll: () => {
      return initialState;
    },
    resetError: (state) => {
      state.error = false;
    },
    resetclass: (state) => {
      state.classData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classData = action.payload;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchClassById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClass = parseFirestoreFields(action.payload.fields);
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getClassesFilter.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClassesFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.classData = action.payload;
      })
      .addCase(getClassesFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAll, resetError, resetclass } = classSlice.actions;

export default classSlice.reducer;