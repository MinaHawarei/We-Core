<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    public function index()
    {
        $users = User::with('manager')->get();

        return Inertia::render('Admin/users', [
            'users' => $users,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully.'], 200);
    }
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->only(['name', 'email', 'is_active', 'department', 'site', 'manager_id']);

        if (Auth::user() && Auth::user()->role === 'admin') {
            $role = $request->input('role');
            if ($role) {
                $data['role'] = $role;
            }
        }

        $user->update($data);

        return response()->json(['success' => true]);
    }


    public function toggleActive($id)
    {
        $user = User::findOrFail($id);
        $user->active = !$user->active;
        $user->save();

        return redirect()->back()->with('message', 'User status updated.');
    }
}
