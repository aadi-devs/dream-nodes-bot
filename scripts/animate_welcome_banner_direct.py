import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import subprocess

SRC_IMG_PATH = r"c:\Vichost\assets\welcome_banner.jpg"
ASSETS_DIR = r"c:\Vichost\assets"
OUTPUT_MP4 = os.path.join(ASSETS_DIR, "welcome_banner_animated.mp4")
OUTPUT_GIF = os.path.join(ASSETS_DIR, "welcome_banner_animated.gif")
FRAMES_DIR = os.path.join(ASSETS_DIR, "temp_banner_frames")

os.makedirs(FRAMES_DIR, exist_ok=True)

# Load base image
base_img = Image.open(SRC_IMG_PATH).convert("RGBA")
W, H = base_img.size

# Extract neon tube mask for targeted dynamic lighting & bloom
arr_base = np.array(base_img)
brightness = arr_base[:, :, :3].mean(axis=2)
neon_mask_arr = (brightness > 120).astype(np.uint8) * 255
neon_mask = Image.fromarray(neon_mask_arr, mode='L')

# Wide bloom mask and sharp core mask
bloom_wide = neon_mask.filter(ImageFilter.GaussianBlur(28))
bloom_mid = neon_mask.filter(ImageFilter.GaussianBlur(10))

FPS = 30
DURATION_SEC = 3.0
TOTAL_FRAMES = int(FPS * DURATION_SEC) # 90 frames

# Seeded floating particles
np.random.seed(42)
NUM_PARTICLES = 45
particles = []
for _ in range(NUM_PARTICLES):
    x = np.random.uniform(50, W - 50)
    y_start = np.random.uniform(80, H + 100)
    speed = np.random.uniform(60, 180)
    size = np.random.uniform(2.5, 6.0)
    color_choice = np.random.choice(["cyan", "magenta", "white"])
    if color_choice == "cyan":
        color = (0, 240, 255)
    elif color_choice == "magenta":
        color = (255, 60, 180)
    else:
        color = (220, 245, 255)
    particles.append({"x": x, "y_start": y_start, "speed": speed, "size": size, "color": color})

print(f"Generating {TOTAL_FRAMES} frames from welcome_banner.jpg...")

for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / TOTAL_FRAMES
    pulse = 0.5 + 0.5 * math.sin(t * 2 * math.pi)

    # 1. Subtle camera breathing zoom
    scale = 1.0 + 0.012 * math.sin(t * 2 * math.pi)
    w_crop = int(W / scale)
    h_crop = int(H / scale)
    x_crop = (W - w_crop) // 2
    y_crop = (H - h_crop) // 2
    frame = base_img.crop((x_crop, y_crop, x_crop + w_crop, y_crop + h_crop)).resize((W, H), Image.Resampling.BILINEAR)

    # 2. Dynamic Pulsing Neon Bloom on the artwork's tubes
    bloom_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    b_arr = np.array(bloom_layer)
    # Blend cyan and magenta into the glowing tubes
    alpha_wide = (np.array(bloom_wide) * (0.35 + 0.25 * pulse)).astype(np.uint8)
    alpha_mid = (np.array(bloom_mid) * (0.50 + 0.30 * pulse)).astype(np.uint8)
    
    b_arr[:, :, 0] = np.clip(alpha_wide * 0.4 + alpha_mid * 0.3, 0, 255).astype(np.uint8) # R
    b_arr[:, :, 1] = np.clip(alpha_wide * 0.8 + alpha_mid * 0.9, 0, 255).astype(np.uint8) # G
    b_arr[:, :, 2] = np.clip(alpha_wide * 1.0 + alpha_mid * 1.0, 0, 255).astype(np.uint8) # B
    b_arr[:, :, 3] = np.clip(alpha_wide + alpha_mid, 0, 255).astype(np.uint8)
    
    bloom_img = Image.fromarray(b_arr, mode="RGBA")
    frame = Image.alpha_composite(frame, bloom_img)

    # 3. Traveling Light Gleam across the neon cursive glass
    gleam_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_gleam = ImageDraw.Draw(gleam_layer)
    gleam_center = int(-200 + t * (W + 400))
    for gw in range(-50, 51):
        alpha_g = int((1.0 - abs(gw) / 51.0) * (90 + 50 * pulse))
        d_gleam.line(
            [(gleam_center + gw + 100, 0), (gleam_center + gw - 100, H)],
            fill=(230, 250, 255, alpha_g),
            width=2
        )
    # Mask gleam by the neon tubes so it only glints ON the neon glass
    gleam_masked = Image.composite(gleam_layer, Image.new("RGBA", (W, H), (0, 0, 0, 0)), neon_mask)
    gleam_blurred = gleam_masked.filter(ImageFilter.GaussianBlur(4))
    frame = Image.alpha_composite(frame, gleam_blurred)

    # 4. Floating Cosmic Data Particles
    part_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_part = ImageDraw.Draw(part_layer)
    for p in particles:
        cur_y = (p["y_start"] - t * p["speed"]) % H
        p_alpha = int(110 + 90 * math.sin((t + p["x"] / 400.0) * 2 * math.pi))
        s = p["size"]
        halo_col = p["color"] + (int(p_alpha * 0.35),)
        col = p["color"] + (p_alpha,)
        d_part.ellipse([(p["x"] - s * 2, cur_y - s * 2), (p["x"] + s * 2, cur_y + s * 2)], fill=halo_col)
        d_part.ellipse([(p["x"] - s, cur_y - s), (p["x"] + s, cur_y + s)], fill=col)

    frame = Image.alpha_composite(frame, part_layer)

    # 5. Save frame
    final_frame = frame.convert("RGB")
    final_frame.save(os.path.join(FRAMES_DIR, f"frame_{frame_idx:03d}.png"))

print(f"Rendered {TOTAL_FRAMES} frames. Compiling MP4 video...")

cmd_mp4 = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(FRAMES_DIR, "frame_%03d.png"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "slow",
    "-crf", "16",
    OUTPUT_MP4
]
subprocess.run(cmd_mp4, check=True)
print(f"MP4 ready at {OUTPUT_MP4}")

print("Compiling Discord-ready optimized GIF...")
cmd_gif = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(FRAMES_DIR, "frame_%03d.png"),
    "-vf", "scale=960:536:flags=lanczos,unsharp=5:5:0.8:5:5:0.0,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=1",
    OUTPUT_GIF
]
subprocess.run(cmd_gif, check=True)
print(f"GIF ready at {OUTPUT_GIF}")

# Cleanup temp frames
for f in os.listdir(FRAMES_DIR):
    os.remove(os.path.join(FRAMES_DIR, f))
os.rmdir(FRAMES_DIR)
print("Welcome banner animation complete!")
