import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username, event } = await request.json();

    // Find the user
    let user = await UserModel.findOne({ username });

    if (!user) {
      user = new UserModel({
        username,
        events: [event],
      });
    } else {
      user.events.push(event);
    }

    // Save the updated user
    const updatedUser = await user.save();

    const addedEvent = updatedUser.events[updatedUser.events.length - 1];

    return NextResponse.json(
      {
        message: 'Event added successfully',
        success: true,
        event: addedEvent, 
      },
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
