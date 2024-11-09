import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse,NextRequest } from 'next/server';


export async function POST(request: NextRequest) {
  const { username} = await request.json();
  // console.log(username);
  
  await dbConnect();
  try {
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
