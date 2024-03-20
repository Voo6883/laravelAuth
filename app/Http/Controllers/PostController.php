<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        // Retrieve all posts
        $posts = Post::all();
        return response()->json($posts);
    }
    // public function store(){
    //     return Post::all();
    // }
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        $post = new Post();
        $post->user_id = $request->user_id;
        $post->title = $request->title;
        $post->content = $request->content;
        $post->save();

        return response()->json($post, 201);
    }

    // public function store(Request $request){
    //     return Post::create($request->all());
    // }
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'string',
            'content' => 'string',
        ]);

        $post = Post::findOrFail($id);
        if ($request->has('title')) {
            $post->title = $request->title;
        }
        if ($request->has('content')) {
            $post->content = $request->content;
        }
        $post->save();

        return response()->json($post);
    }
    // public function update(Request $request, $id){
    //     $post = Post::findOrFail($id);
    //     $post->update($request->all());
    //     return $post;
    // }
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return response()->json(null, 204);
    }

    // public function destroy($id){
    //     $post = Post::findOrFail($id);
    //     $post->delete();
    //     return 204;
    // }
}
