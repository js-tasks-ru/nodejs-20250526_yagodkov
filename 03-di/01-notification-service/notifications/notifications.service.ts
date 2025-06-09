import { Injectable, BadRequestException, Inject, Optional } from "@nestjs/common";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import * as fs from 'fs';
import * as path from 'path';

export interface NotificationsConfig {
  senderEmail?: string;
  smsGateway?: string;
  logFilePath?: string;
}

@Injectable()
export class NotificationsService {
  private readonly senderEmail: string;
  private readonly smsGateway: string;
  private readonly logFilePath: string;

  constructor(@Optional() @Inject('NOTIFICATIONS_CONFIG') config?: NotificationsConfig) {
    this.senderEmail = config?.senderEmail || 'noreply@example.com';
    this.smsGateway = config?.smsGateway || 'default-gateway';
    this.logFilePath = config?.logFilePath || path.join(process.cwd(), 'notifications.log');
  }

  private logToFile(message: string) {
    fs.appendFileSync(this.logFilePath, message + '\n');
  }

  sendEmail(to: string, subject: string, message: string): void {
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      throw new BadRequestException('Некорректный email для отправки уведомления');
    }
    const logMsg = `Email sent from ${this.senderEmail} to ${to}: ${subject} ${message}`;
    console.log(logMsg);
    this.logToFile(logMsg);
  }

  sendSMS(to: string, message: string): void {
    const phoneNumber = parsePhoneNumberFromString(to);
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new BadRequestException('Некорректный номер телефона для отправки SMS');
    }
    const logMsg = `SMS sent via ${this.smsGateway} to ${to}: ${message}`;
    console.log(logMsg);
    this.logToFile(logMsg);
  }
}
