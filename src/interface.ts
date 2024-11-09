import { Event } from "react-big-calendar";

export type CustomAgendaEventProps = {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
};

export type AddEventProps = {
  onAddEvent: (title: string, start: Date, end: Date) => void;
};

export type EditEventProps = {
  event: Event;
  onUpdateEvent: (updatedEvent: Event) => void;
  onCancel: () => void;
};
