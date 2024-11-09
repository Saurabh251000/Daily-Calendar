import { Event as BaseEvent } from "react-big-calendar";
import { withDragAndDropProps as DnDProps } from 'react-big-calendar/lib/addons/dragAndDrop';

export interface CustomEvent extends BaseEvent {
  _id?: string;  
}

export type CustomAgendaEventProps = {
  event: CustomEvent;
  onEdit: (event: CustomEvent) => void;
  onDelete: (event: CustomEvent) => void;
};

export type AddEventProps = {
  onAddEvent: (event: CustomEvent) => void;
};

export type EditEventProps = {
  username?: string | null ;
  event: CustomEvent;
  onUpdateEvent: (updatedEvent: CustomEvent) => void;
  onCancel: () => void;
};

export interface CustomDnDProps extends  DnDProps<CustomEvent, object> {
  onCustomEventAction?: (event: CustomEvent) => void;
}
