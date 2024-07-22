<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;

class CompletionController extends Controller
{
    public function completion(Request $request)
    {
        $request->validate([
            'prompt' => 'required',
        ]);

        $prompt = $request->input('prompt');

        $savedMessages = [];
        $firstMessage = [
            'role' => 'system',
            'content' => 'Kamu adalah seorang asisten yang suka membantu. jika ada pertanyaan matematika ubah response delimiter matematika mu menjadi $$ equation $$ untuk [ equation ] dan $ equation $ untuk inline math equation'
        ];

        array_push($savedMessages, $firstMessage);

        $newMessage = [
            'role' => 'user',
            'content' => $prompt
        ];

        array_push($savedMessages, $newMessage);

        $response = OpenAI::chat()->createStreamed([
            'model' => 'gpt-4o-mini',
            'messages' => $savedMessages,
            'stream' => true,
        ]);

        return response()->stream(function () use ($response) {
            foreach ($response as $chunk) {
                echo $chunk->choices[0]->delta->content;
                ob_flush();
                flush();
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);
    }

    public function test()
    {
        $stream = OpenAI::chat()->createStreamed([
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'user', 'content' => 'hello world'],
            ],
        ]);


        foreach ($stream as $response) {
            echo $response->choices[0]->delta->content;
        }
    }
}
