import { Module } from "@nestjs/common";
import { NotificationsService, NotificationsConfig } from "./notifications.service";

const notificationsConfig: NotificationsConfig = {
  senderEmail: "noreply@myapp.com",
  smsGateway: "my-sms-gateway",
  logFilePath: "./notifications.log",
};

@Module({
  providers: [
    NotificationsService,
    {
      provide: 'NOTIFICATIONS_CONFIG',
      useValue: notificationsConfig,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
