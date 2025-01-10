import { AppDataSource } from "../../../data-source";
import { Repository } from 'typeorm';
import { UserEventRole } from '../model/UserEventRole';
import { User } from '../model/User';
import { Event } from '../model/Event';
import { Role } from '../model/UserRole';
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserEventRoleRepository extends Repository<UserEventRole> {

  // Find a UserEventRole by ID
  async findUserEventRoleById(id: number): Promise<UserEventRole | null> {
    return await this.findOne({
      where: { id },
      relations: ['user', 'event'], // Load related user and event
    });
  }

  // Find all UserEventRoles
  async findAllUserEventRoles(): Promise<UserEventRole[]> {
    return await this.find({
      relations: ['user', 'event'], // Load related user and event for each UserEventRole
    });
  }

  // Custom method: Find all roles for a specific user
  async findRolesByUser(userId: number): Promise<UserEventRole[]> {
    return await this.find({
      where: { user: { id: userId } },
      relations: ['event'], // Load the event related to each role
    });
  }

  // Custom method: Find all users with a specific role in an event
  async findUsersByEventAndRole(eventId: number, role: Role): Promise<UserEventRole[]> {
    return await this.find({
      where: { event: { id: eventId }, role },
      relations: ['user'], // Load the user related to each role
    });
  }

  // Custom method: Find all events where a user has a specific role
  async findEventsByUserAndRole(userId: number, role: Role): Promise<UserEventRole[]> {
    return await this.find({
      where: { user: { id: userId }, role },
      relations: ['event'], // Load the event related to each role
    });
  }
}