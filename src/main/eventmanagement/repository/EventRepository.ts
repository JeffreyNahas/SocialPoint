import { EntityRepository, Repository } from "typeorm";
import { Event } from "../model/Event";

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
    
}