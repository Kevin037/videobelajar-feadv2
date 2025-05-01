import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamByNo, fetchLessonById, submitTestThunk, updateAnswerThunk } from '../services/api/lessonSlice';

const useLesson = (id=null, orderId = null, type = null, no = null) => {
  const dispatch = useDispatch();
  const {selectedLesson,beforeLesson,afterLesson,test,tests,status,submitStatus} = useSelector((state) => state.lesson);
  const loading = useSelector(state => state.class.loading);
  const error = useSelector(state => state.class.error);

  const updateAnswer = (id,AnswerData) => {
    dispatch(updateAnswerThunk({id,AnswerData}));
  };

  const submitTest = (orderId,type) => {
    dispatch(submitTestThunk({orderId,type}));
  };

  useEffect(() => {
    if (orderId || type || no) {
      dispatch(fetchExamByNo({orderId,type,no}));
    }
    if (id) {
      dispatch(fetchLessonById(id)); 
    }
  }, [dispatch,id,orderId,type,no]);

  return { selectedLesson, loading, error, beforeLesson, afterLesson, test, tests, updateAnswer,status, submitTest, submitStatus };
};

export default useLesson;
