import { ISanitizationService } from '../../../domain/shared/sanitization-service.interface';
import * as sanitizeHtml from 'sanitize-html';
export class SanitizationService implements ISanitizationService {
  sanitizeHtml(val: string): string {
    return sanitizeHtml(val);
  }
}
