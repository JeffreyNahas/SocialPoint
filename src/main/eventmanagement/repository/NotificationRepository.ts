import { Repository } from "typeorm";
import {Notification} from "../model/Notification";
import {Event} from "../model/Event"

export class NotificationsRepository extends Repository<Notification>{
    async createNotification(message: string, timestamp: Date, event: Event, notificationType: string): Promise<Notification> {
        const notification = new Notification(message, timestamp, event, notificationType);
        return await this.save(notification);
    }

    async findNotificationById(id: number): Promise<Notification | null> {

        return await this.findOne({where: {id}, relations: ['event']});
    }
    // Find all notifications
    async findAllNotifications(): Promise<Notification[]> {
    return await this.find({
      relations: ['event'], // Load related event for each notification
    });
  }

    async findAttendeeNotifications(attendeeId: number): Promise<Notification[]> {
    return await this.createQueryBuilder('notification')
      .innerJoinAndSelect('notification.event', 'event')
      .innerJoin('event.attendees', 'attendee')
      .where('attendee.id = :attendeeId', { attendeeId })
      .getMany();
  }

    async findOrganizerNotifications(organizerId: number): Promise<Notification[]> {
    return await this.createQueryBuilder('notification')
      .innerJoinAndSelect('notification.event', 'event')
      .innerJoin('event.organizer', 'organizer')
      .where('organizer.id = :organizerId', { organizerId })
      .getMany();
  }

  // Update a notification by ID
    async updateNotification(id: number, updatedData: Partial<Notification>): Promise<Notification | null> {
    const notification = await this.findOneBy({ id });
    if (!notification) return null;

    Object.assign(notification, updatedData);
    return await this.save(notification);
  }

  // Delete a notification by ID
    async deleteNotification(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected !== 0;
  }

  // Custom method: Find notifications by event
    async findNotificationsByEvent(eventId: number): Promise<Notification[]> {
    return await this.find({
      where: { event: { id: eventId } },
      relations: ['event'], // Load event for each notification
    });
  }

  // Custom method: Find notifications by type
    async findNotificationsByType(notificationType: string): Promise<Notification[]> {
    return await this.find({
      where: { notificationType },
      relations: ['event'],
    });
  }

  // Custom method: Find notifications by event and type
    async findNotificationsByEventAndType(eventId: number, notificationType: string): Promise<Notification[]> {
    return await this.find({
      where: { event: { id: eventId }, notificationType },
      relations: ['event'],
    });
  }
}
