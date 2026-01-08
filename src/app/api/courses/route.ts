import { NextRequest, NextResponse } from 'next/server';
import { connectToExploreDatabase, getUserProfile } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Get all courses or courses by mentor
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mentorId = searchParams.get('mentorId');
    const domainId = searchParams.get('domainId');

    const { db } = await connectToExploreDatabase();
    const collection = db.collection('courses');

    let query: any = {};
    if (mentorId) {
      query.mentorId = mentorId;
    }
    if (domainId) {
      query.domainId = domainId;
    }

    const courses = await collection.find(query).toArray();

    // Populate mentor information for each course
    const coursesWithMentorInfo = await Promise.all(
      courses.map(async (course) => {
        const mentorProfile = await getUserProfile(course.mentorId);
        if (mentorProfile?.mentorDetails) {
          return {
            ...course,
            mentorName: mentorProfile.mentorDetails.fullName,
            mentorTitle: mentorProfile.mentorDetails.title,
            mentorExperience: mentorProfile.mentorDetails.experience,
            mentorCompany: mentorProfile.mentorDetails.company,
          };
        }
        return course;
      })
    );

    return NextResponse.json({ courses: coursesWithMentorInfo }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      mentorId,
      domainId,
      mentorshipTopic,
      learningOutcomes,
      classType,
      totalSeats,
      cost,
    } = body;

    if (!mentorId || !domainId || !mentorshipTopic || !classType || !totalSeats || !cost) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToExploreDatabase();
    const collection = db.collection('courses');

    const courseData = {
      mentorId,
      domainId,
      mentorshipTopic,
      learningOutcomes: learningOutcomes || [],
      classType,
      totalSeats: parseInt(totalSeats),
      availableSeats: parseInt(totalSeats),
      cost: parseFloat(cost),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(courseData);

    return NextResponse.json(
      { 
        message: 'Course created successfully', 
        courseId: result.insertedId.toString(),
        course: { ...courseData, _id: result.insertedId }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a course
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, mentorId, ...updateData } = body;

    if (!courseId || !mentorId) {
      return NextResponse.json(
        { error: 'Course ID and Mentor ID are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToExploreDatabase();
    const collection = db.collection('courses');

    let courseObjectId;
    try {
      courseObjectId = new ObjectId(courseId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Verify the course belongs to the mentor
    const existingCourse = await collection.findOne({ _id: courseObjectId, mentorId });
    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found or unauthorized' },
        { status: 404 }
      );
    }

    // Calculate available seats if totalSeats is being updated
    if (updateData.totalSeats) {
      const bookedSeats = existingCourse.totalSeats - existingCourse.availableSeats;
      updateData.availableSeats = Math.max(0, parseInt(updateData.totalSeats) - bookedSeats);
      updateData.totalSeats = parseInt(updateData.totalSeats);
    }

    if (updateData.cost) {
      updateData.cost = parseFloat(updateData.cost);
    }

    updateData.updatedAt = new Date();

    const result = await collection.findOneAndUpdate(
      { _id: courseObjectId, mentorId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    return NextResponse.json(
      { message: 'Course updated successfully', course: result },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a course
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const mentorId = searchParams.get('mentorId');

    if (!courseId || !mentorId) {
      return NextResponse.json(
        { error: 'Course ID and Mentor ID are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToExploreDatabase();
    const collection = db.collection('courses');

    let courseObjectId;
    try {
      courseObjectId = new ObjectId(courseId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Verify the course belongs to the mentor
    const existingCourse = await collection.findOne({ _id: courseObjectId, mentorId });
    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found or unauthorized' },
        { status: 404 }
      );
    }

    await collection.deleteOne({ _id: courseObjectId, mentorId });

    return NextResponse.json(
      { message: 'Course deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course', details: error.message },
      { status: 500 }
    );
  }
}

