import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessonById } from '../services/api/lessonSlice';

const useLesson = (id=null) => {
  const dispatch = useDispatch();
  const {selectedLesson,beforeLesson,afterLesson} = useSelector((state) => state.lesson);
  const loading = useSelector(state => state.class.loading);
  const error = useSelector(state => state.class.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchLessonById(id)); 
    }
  }, [dispatch,id]);

  return { selectedLesson, loading, error, beforeLesson, afterLesson };
};

export default useLesson;
