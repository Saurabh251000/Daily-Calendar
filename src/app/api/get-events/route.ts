import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized', success: false },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
  
    const user = await (await clerkClient()).users.getUser(userId);
    const username = user.username; 
    
    if (!username) {
      return NextResponse.json(
        { message: 'Username not found', success: false },
        { status: 404 }
      );
    }

    // Find user 
    const userData = await UserModel.findOne({ username });

    if (!userData) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { events: userData.events, success: true },
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
