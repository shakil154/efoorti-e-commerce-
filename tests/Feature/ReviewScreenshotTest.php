<?php

namespace Tests\Feature;

use App\Models\ReviewScreenshot;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReviewScreenshotTest extends TestCase
{
    use RefreshDatabase;

    private function createAdminUser(): User
    {
        return User::factory()->create([
            'role' => 'admin',
        ]);
    }

    public function test_homepage_loads_review_screenshots(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Storefront/Home')
            ->has('reviewScreenshots')
            ->has('reviewScreenshotsConfig')
        );
    }

    public function test_admin_can_view_review_screenshots_index(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->actingAs($admin)->get('/admin/review-screenshots');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/ReviewScreenshots/Index')
            ->has('screenshots')
            ->has('settings')
        );
    }

    public function test_admin_can_toggle_review_screenshot(): void
    {
        $admin = $this->createAdminUser();
        $screenshot = ReviewScreenshot::create([
            'title' => 'Test Review',
            'image' => 'uploads/review_screenshots/test.png',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->patch("/admin/review-screenshots/{$screenshot->id}/toggle");
        $response->assertRedirect();

        $this->assertFalse($screenshot->fresh()->is_active);
    }

    public function test_admin_can_update_settings(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->actingAs($admin)->post('/admin/review-screenshots/settings', [
            'enabled' => true,
            'title' => 'Happy Customers Review',
            'subtitle' => 'Our real feedback',
            'autoplay' => true,
        ]);

        $response->assertRedirect();
        $this->assertEquals('Happy Customers Review', setting('review_screenshots_title'));
    }
}
