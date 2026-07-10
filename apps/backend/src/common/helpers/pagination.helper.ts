export class PaginationHelper {
  static paginate(page = 1, limit = 10) {
    const currentPage = Math.max(Number(page), 1);

    const perPage = Math.max(Number(limit), 1);

    return {
      skip: (currentPage - 1) * perPage,
      take: perPage,
    };
  }
}