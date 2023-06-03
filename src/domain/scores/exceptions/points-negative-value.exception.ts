import { BaseException } from '../../../application/shared/base.exception';
import { POINTS_NEGATIVE_VALUE_EXCEPTION_MESSAGE } from '../score.constants';

export class PointsNegativeValueException extends BaseException {
  constructor() {
    super(POINTS_NEGATIVE_VALUE_EXCEPTION_MESSAGE);
  }
}
