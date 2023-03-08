import { FileValidator } from '@nestjs/common';

export class FileExtensionValidator extends FileValidator<{ regex: RegExp }> {
  buildErrorMessage(file: any): string {
    return 'File is not matching allowed extensions!';
  }

  isValid(file: any): boolean | Promise<boolean> {
    return file.originalname.match(this.validationOptions.regex);
  }

  protected readonly validationOptions: { regex: RegExp };
}
