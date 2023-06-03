import { BaseException } from '../../../application/shared/base.exception';
import { TEST_NOT_FOUND_EXCEPTION_MESSAGE } from '../score.constants';

export class TestNotFoundException extends BaseException {
  constructor() {
    super(TEST_NOT_FOUND_EXCEPTION_MESSAGE);
  }
}
