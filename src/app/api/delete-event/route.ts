import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {

    const { username, eventId } = await request.json();

    // Find the user 
    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Find the event 
    const eventIndex = user.events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      return NextResponse.json(
        { message: 'Event not found', success: false },
        { status: 404 }
      );
    }

    // Remove the event 
    user.events.splice(eventIndex, 1);

    // Save 
    await user.save();

    return NextResponse.json(
      { message: 'Event deleted successfully', success: true },
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
