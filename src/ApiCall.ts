import { CustomEvent } from "./interface";

export async function getEventAPI(username:string) {
  try {
    // console.log(username, "-->username");
    
    const response = await fetch('/api/get-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username}),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.log(data.message);
      return null;
    }
  } catch (error) {
    console.log('Failed to restore the events from the server:', error);
    return null;
  }
}

export async function deleteEventAPI({username, id}: {username: string , id: string}) {
  try {
    const response = await fetch('/api/delete-event', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username,id }),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(data.message);
      return null;
    }
  } catch (error) {
    console.error('Failed to delete event:', error);
    return null;
  }
}


export async function AddEventAPI({ username, event }: { username: string; event: CustomEvent }) {
  try {
    const response = await fetch('/api/add-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, event }), 
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(data.message);
      return null;
    }
  } catch (error) {
    console.error('Failed to add event:', error);
    return null;
  }
}


export async function editEventAPI({ username, event }: { username: string | null | undefined; event: CustomEvent }) {
  try {
    // console.log("update event : ",event);
    
    const response = await fetch('/api/edit-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, event }), 
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(data.message);
      return null;
    }
  } catch (error) {
    console.error('Failed to Edit event:', error);
    return null;
  }
}


