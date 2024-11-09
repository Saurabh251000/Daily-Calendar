import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  await dbConnect();

  try {
    const { username, event } = await request.json();
    const { id, title, start, end } = event; 

    // Find the user 
    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Find the event 
    const eventIndex = user.events.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return NextResponse.json(
        { message: 'Event not found', success: false },
        { status: 404 }
      );
    }

    // Update the event 
    user.events[eventIndex].title = title;
    user.events[eventIndex].start = start;
    user.events[eventIndex].end = end;

    // Save 
    await user.save();

    return NextResponse.json(
      { message: 'Event updated successfully', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}