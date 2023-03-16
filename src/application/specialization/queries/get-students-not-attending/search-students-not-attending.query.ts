import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../../specialization.constants';

export class SearchStudentsNotAttendingQuery {
  constructor(
    public readonly course: string,
    public readonly search: string,
    public readonly page: number = DEFAULT_PAGINATION_PAGE,
    public readonly limit: number = DEFAULT_PAGINATION_LIMIT,
  ) {}
}
