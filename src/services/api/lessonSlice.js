import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDataById, parseFirestoreFields, retrieveData, retrieveDataMultipleCondition, update } from "../db";

const initialState = {
  beforeLesson: null,
  selectedLesson:null,
  afterLesson: null,
  test: null,
  tests: [],
  loading: false,
  error: null,
  status:false,
  submitStatus:false
};

export const fetchLessonById = createAsyncThunk(
  'lesson/getById',
  async (id, thunkAPI) => {
    try {
      const res = await getDataById(id, 'lessons');
      const lesson = parseFirestoreFields(res.fields)
      let beforeLesson = null;
      let afterLesson = null;
      const lessons = await retrieveData('lessons', lesson.class_id,"class_id");
      lessons.forEach((item) => {
        if (lesson.ordering > 0) {
          if (Number(item.ordering) === (lesson.ordering - 1)) {
            beforeLesson = item 
          }
        }
        if (lesson.ordering < (lessons.length-1)) {
          if (Number(item.ordering) === (Number(lesson.ordering) + 1)) {
            afterLesson = item 
          }
        }
      })
      return {
        lesson : lesson,
        beforeLesson: beforeLesson,
        afterLesson: afterLesson
      }
    } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchExamByNo = createAsyncThunk(
  'test/getByNo',
  async ({orderId,type,no}, thunkAPI) => {
    try {
      const where = [
        {field: "order_id", operator: "==", value: orderId},
        {field: "type", operator: "==", value: type},
        {field: "no", operator: "==", value: no}
      ]
      const test = await retrieveDataMultipleCondition('order_lessons', where);
      const whereTests = [
        {field: "order_id", operator: "==", value: orderId},
        {field: "type", operator: "==", value: type},
      ]
      
      const tests = await retrieveDataMultipleCondition('order_lessons', whereTests);
      return {
        test : test[0],
        tests: tests,
      }
    } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateAnswerThunk = createAsyncThunk(
  'order/update',
  async ({id,AnswerData}, thunkAPI) => {
    try {
      const res = await update(AnswerData,'order_lessons',id);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const submitTestThunk = createAsyncThunk(
  'test/submit',
  async ({orderId,type}, thunkAPI) => {
    try {
      const whereTests = [
        {field: "order_id", operator: "==", value: orderId},
        {field: "type", operator: "==", value: type},
      ]
      const tests = await retrieveDataMultipleCondition('order_lessons', whereTests);
      let correct = 0;
      for (let i = 0; i < tests.length; i++) {
        if (tests[i].answer == tests.user_answer) {
          correct++;
        }
        await update({submitted_at:new Date().toISOString()},'order_lessons',tests[i].id);
      }
      const score = (correct / tests.length) * 100
      
      const res = await update({pretest_score:score},'orders',orderId);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    resetAll: () => {
      return initialState;
    },
    resetError: (state) => {
      state.error = false;
    },
    resetclass: (state) => {
      state.selectedLesson = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLesson = action.payload.lesson;
        state.beforeLesson = action.payload.beforeLesson;
        state.afterLesson = action.payload.afterLesson;
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchExamByNo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamByNo.fulfilled, (state, action) => {
        state.loading = false;
        state.test = action.payload.test;
        state.tests = action.payload.tests;
      })
      .addCase(fetchExamByNo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAnswerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnswerThunk.fulfilled, (state) => {
        state.loading = false;
        state.status = true; // data user baru dari Firestore
      })
      .addCase(updateAnswerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(submitTestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTestThunk.fulfilled, (state) => {
        state.loading = false;
        state.submitStatus = true;
      })
      .addCase(submitTestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
  },
});

export const { resetAll, resetError, resetlesson } = lessonSlice.actions;

export default lessonSlice.reducer;