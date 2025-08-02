<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon ;
use App\Models\User;



class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user:id,name')->latest()->paginate(10);


        return Inertia::render('notification', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'audience_type' => 'required|in:site,department,team',
            'audience_value' => 'required|string|max:255',
            'post_type' => 'required|string|max:255',
        ]);

        $post = Post::create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'audience_type' => $validated['audience_type'],
            'audience_value' => $validated['audience_value'],
            'post_type' => $validated['post_type'],
        ]);

        //event(new \App\Events\NewPostNotification("تم إضافة بوست جديد"));


        return response()->json([
            'message' => 'Post created successfully.',
            'post' => $post->load('user:id,name'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
