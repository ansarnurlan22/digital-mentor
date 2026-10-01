import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface Lesson {
  id: string;
  mentor_id: string;
  mentor_name: string | null;
  title: string;
  subject: string;
  description: string;
  lesson_date: string;       // YYYY-MM-DD
  start_time: string;        // HH:MM:SS
  end_time: string;          // HH:MM:SS
  max_students: number;
  meeting_link: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

interface LessonRow {
  id: string;
  mentor_id: string;
  title: string;
  subject: string;
  description: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  max_students: number;
  meeting_link: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  profiles: { full_name: string | null } | null;
}

interface PostBody {
  title?: string;
  subject?: string;
  description?: string;
  lesson_date?: string;
  start_time?: string;
  end_time?: string;
  max_students?: number;
  meeting_link?: string;
}

// ----------------------------------------------------------------
// Supabase client factory (anon key; auth done via getUser(token))
// ----------------------------------------------------------------

function makeSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

// ----------------------------------------------------------------
// Helper: extract Bearer token from Authorization header
// ----------------------------------------------------------------

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice('Bearer '.length).trim() || null;
}

// ----------------------------------------------------------------
// GET /api/lessons
// Query params: date (YYYY-MM-DD), mentor_id, upcoming (boolean)
// ----------------------------------------------------------------

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = makeSupabaseClient();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const mentorId = searchParams.get('mentor_id');
    const upcoming = searchParams.get('upcoming');

    let query = supabase
      .from('lessons')
      .select(
        `id, mentor_id, title, subject, description,
         lesson_date, start_time, end_time,
         max_students, meeting_link, status, created_at,
         profiles!lessons_mentor_id_fkey ( full_name )`,
      )
      .order('lesson_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (date) {
      query = query.eq('lesson_date', date);
    }

    if (mentorId) {
      query = query.eq('mentor_id', mentorId);
    }

    if (upcoming === 'true') {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('lesson_date', today).eq('status', 'scheduled');
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/lessons] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const lessons: Lesson[] = (data as LessonRow[]).map((row) => ({
      id: row.id,
      mentor_id: row.mentor_id,
      mentor_name: row.profiles?.full_name ?? null,
      title: row.title,
      subject: row.subject,
      description: row.description,
      lesson_date: row.lesson_date,
      start_time: row.start_time,
      end_time: row.end_time,
      max_students: row.max_students,
      meeting_link: row.meeting_link,
      status: row.status,
      created_at: row.created_at,
    }));

    return NextResponse.json(lessons, { status: 200 });
  } catch (err) {
    console.error('[GET /api/lessons] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------
// POST /api/lessons
// Creates a new lesson. Requires Authorization: Bearer <token>
// Body: { title, subject, description, lesson_date,
//         start_time, end_time, max_students?, meeting_link? }
// ----------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = makeSupabaseClient();

    // 1. Authenticate
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Missing or malformed Authorization header' },
        { status: 401 },
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse & validate body
    let body: PostBody;
    try {
      body = (await request.json()) as PostBody;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { title, subject, lesson_date, start_time, end_time } = body;

    const missingFields: string[] = [];
    if (!title)       missingFields.push('title');
    if (!subject)     missingFields.push('subject');
    if (!lesson_date) missingFields.push('lesson_date');
    if (!start_time)  missingFields.push('start_time');
    if (!end_time)    missingFields.push('end_time');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 422 },
      );
    }

    // 3. Insert lesson
    const { data, error: insertError } = await supabase
      .from('lessons')
      .insert({
        mentor_id:    user.id,
        title:        title!.trim(),
        subject:      subject!.trim(),
        description:  body.description?.trim() ?? '',
        lesson_date:  lesson_date!,
        start_time:   start_time!,
        end_time:     end_time!,
        max_students: body.max_students ?? 5,
        meeting_link: body.meeting_link?.trim() ?? '',
      })
      .select(
        `id, mentor_id, title, subject, description,
         lesson_date, start_time, end_time,
         max_students, meeting_link, status, created_at,
         profiles!lessons_mentor_id_fkey ( full_name )`,
      )
      .single();

    if (insertError) {
      console.error('[POST /api/lessons] Insert error:', insertError);
      // Surface RLS / constraint violations clearly
      if (insertError.code === '42501') {
        return NextResponse.json(
          { error: 'Forbidden: only mentors or admins can create lessons' },
          { status: 403 },
        );
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const row = data as LessonRow;
    const lesson: Lesson = {
      id:           row.id,
      mentor_id:    row.mentor_id,
      mentor_name:  row.profiles?.full_name ?? null,
      title:        row.title,
      subject:      row.subject,
      description:  row.description,
      lesson_date:  row.lesson_date,
      start_time:   row.start_time,
      end_time:     row.end_time,
      max_students: row.max_students,
      meeting_link: row.meeting_link,
      status:       row.status,
      created_at:   row.created_at,
    };

    return NextResponse.json(lesson, { status: 201 });
  } catch (err) {
    console.error('[POST /api/lessons] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
