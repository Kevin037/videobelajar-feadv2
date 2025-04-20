import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDataById, parseFirestoreFields, retrieveData } from "../db";

const initialState = {
  beforeLesson: null,
  selectedLesson:null,
  afterLesson: null,
  loading: false,
  error: null,
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
  },
});

export const { resetAll, resetError, resetlesson } = lessonSlice.actions;

export default lessonSlice.reducer;