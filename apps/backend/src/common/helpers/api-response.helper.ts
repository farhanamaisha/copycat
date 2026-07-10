export class ApiResponseHelper {
  static success(message: string, data: any = null) {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string) {
    return {
      success: false,
      message,
    };
  }
}