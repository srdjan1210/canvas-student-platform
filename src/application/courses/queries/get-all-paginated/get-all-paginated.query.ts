import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../../../specialization/specialization.constants';

export class GetAllPaginatedQuery {
  constructor(
    public readonly page: number = DEFAULT_PAGINATION_PAGE,
    public readonly limit: number = DEFAULT_PAGINATION_LIMIT,
  ) {}
}
