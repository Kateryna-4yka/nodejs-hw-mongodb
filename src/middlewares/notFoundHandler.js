// ============тут ми оголошуємо кастомну міделвару, клієнт звертається до неіснуючого маршруту
import createHttpError from 'http-errors';

export const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, 'Route not found'));
};
