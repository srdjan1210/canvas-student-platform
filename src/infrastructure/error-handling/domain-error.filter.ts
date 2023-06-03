import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { BaseException } from '../../application/shared/base.exception';
import { Response } from 'express';
import { EmailAlreadyTakenException } from '../../domain/auth/exceptions/email-already-taken.exception';
import { InvalidCredentialsException } from '../../domain/auth/exceptions/invalid-credentials.exception';
import { UserDoesntExistException } from '../../domain/auth/exceptions/user-doesnt-exist.exception';
import { CourseNotFoundException } from '../../domain/courses/exceptions/course-not-found.exception';
import { NotCourseProfessorException } from '../../domain/courses/exceptions/not-course-professor.exception';
import { ProfessorNotInCourseException } from '../../domain/courses/exceptions/professor-not-in-course.exception';
import { StudentNotEnrolledInCourseException } from '../../domain/courses/exceptions/student-not-enrolled-in-course.exception';
import { PointsNegativeValueException } from '../../domain/scores/exceptions/points-negative-value.exception';
@Catch(BaseException)
export class DomainErrorFilter implements ExceptionFilter<BaseException> {
  catch(exception: BaseException, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const resp = context.getResponse<Response>();
    const message = exception.message;
    //Auth
    if (exception instanceof EmailAlreadyTakenException)
      return this.sendErrorResponse(resp, HttpStatus.CONFLICT, message);
    if (exception instanceof InvalidCredentialsException)
      return this.sendErrorResponse(resp, HttpStatus.UNAUTHORIZED, message);
    if (exception instanceof UserDoesntExistException)
      return this.sendErrorResponse(resp, HttpStatus.NOT_FOUND, message);
    //Courses
    if (exception instanceof CourseNotFoundException)
      return this.sendErrorResponse(resp, HttpStatus.NOT_FOUND, message);
    if (exception instanceof NotCourseProfessorException)
      return this.sendErrorResponse(resp, HttpStatus.FORBIDDEN, message);
    if (exception instanceof ProfessorNotInCourseException)
      return this.sendErrorResponse(resp, HttpStatus.FORBIDDEN, message);
    if (exception instanceof StudentNotEnrolledInCourseException)
      return this.sendErrorResponse(resp, HttpStatus.FORBIDDEN, message);
    //Scores
    if (exception instanceof PointsNegativeValueException)
      return this.sendErrorResponse(resp, HttpStatus.BAD_REQUEST, message);
    this.sendErrorResponse(resp, HttpStatus.INTERNAL_SERVER_ERROR, message);
  }

  private sendErrorResponse(resp: Response, status: number, message: string) {
    return resp.status(status).send({ status, message });
  }
}
