import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
 
    const { username, event } = await request.json();

    // Find the user 
    const user = await UserModel.findOne({ username });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found', success: false }),
        { status: 404 }
      );
    }

    // Add event 
    user.events.push(event);

    // Save 
    await user.save();

    return new NextResponse(
      JSON.stringify({ message: 'Event added successfully', success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error', success: false }),
      { status: 500 }
    );
  }
}
