import { AnimalEvent } from "@prisma/client";
import styles from "./AnimalTimelineCard.module.css";
import React from "react";

interface Event {
  id: number;
  date: string;
  description: string;
}

interface AnimalTimelineCardProps {
  title: string;
  events: AnimalEvent[];
}

const AnimalTimelineCard: React.FC<AnimalTimelineCardProps> = ({
  title,
  events,
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {events?.map((event: AnimalEvent) => (
          <li key={event.id}>
            <span>{new Date(event.date).toString()}</span>
            <p>{event.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimalTimelineCard;
