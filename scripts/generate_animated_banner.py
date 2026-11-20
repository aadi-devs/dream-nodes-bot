import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import subprocess

WIDTH = 960
HEIGHT = 540
FPS = 25
DURATION_SEC = 3.0
TOTAL_FRAMES = int(FPS * DURATION_SEC) # 75 frames

ASSETS_DIR = r"c:\Vichost\assets"
OUTPUT_GIF = os.path.join(ASSETS_DIR, "dream_nodes_banner.gif")
OUTPUT_MP4 = os.path.join(ASSETS_DIR, "dream_nodes_banner.mp4")
FRAMES_DIR = os.path.join(ASSETS_DIR, "temp_frames")

os.makedirs(FRAMES_DIR, exist_ok=True)

# Load base banner and logo
bg_path = os.path.join(ASSETS_DIR, "banner_bg.jpg")
logo_path = os.path.join(ASSETS_DIR, "logo.jpg")

base_bg = Image.open(bg_path).convert("RGBA").resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
base_logo = Image.open(logo_path).convert("RGBA")

# Crop logo into rounded square emblem
logo_size = 140
base_logo = base_logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

# Fonts
font_title_path = r"C:\Windows\Fonts\bahnschrift.ttf"
font_title = ImageFont.truetype(font_title_path, 46)
font_subtitle = ImageFont.truetype(font_title_path, 19)
font_badge = ImageFont.truetype(font_title_path, 14)
font_status = ImageFont.truetype(font_title_path, 13)

# Seeded random particles with loop periodicity
np.random.seed(42)
NUM_PARTICLES = 45
particles = []
for _ in range(NUM_PARTICLES):
    x = np.random.uniform(20, WIDTH - 20)
    y_start = np.random.uniform(50, HEIGHT + 50)
    speed = np.random.uniform(30, 90) # pixels per duration
    size = np.random.uniform(2, 5)
    color_choice = np.random.choice(["cyan", "magenta", "white"])
    if color_choice == "cyan":
        color = (0, 240, 255)
    elif color_choice == "magenta":
        color = (255, 60, 180)
    else:
        color = (220, 240, 255)
    particles.append({"x": x, "y_start": y_start, "speed": speed, "size": size, "color": color})

print("Generating frames...")

for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / TOTAL_FRAMES  # 0.0 to 1.0
    sin_pulse = math.sin(t * 2 * math.pi)  # -1 to 1
    glow_factor = 0.5 + 0.5 * math.sin(t * 2 * math.pi) # 0 to 1

    # Base frame with subtle zoom/breathing
    scale = 1.0 + 0.015 * math.sin(t * 2 * math.pi)
    w_crop = int(WIDTH / scale)
    h_crop = int(HEIGHT / scale)
    x_crop = (WIDTH - w_crop) // 2
    y_crop = (HEIGHT - h_crop) // 2
    frame = base_bg.crop((x_crop, y_crop, x_crop + w_crop, y_crop + h_crop)).resize((WIDTH, HEIGHT), Image.Resampling.BILINEAR)

    # Dark overlay on left/center for maximum text contrast
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_overlay = ImageDraw.Draw(overlay)
    
    # Left gradient backing for branding
    for gx in range(560):
        alpha = int(185 * (1.0 - gx / 560.0))
        d_overlay.line([(gx, 0), (gx, HEIGHT)], fill=(8, 10, 24, alpha))
        
    # Top and bottom subtle cinematic letterbox gradients
    for gy in range(80):
        alpha_t = int(140 * (1.0 - gy / 80.0))
        d_overlay.line([(0, gy), (WIDTH, gy)], fill=(4, 6, 16, alpha_t))
        alpha_b = int(160 * (1.0 - gy / 80.0))
        d_overlay.line([(0, HEIGHT - 1 - gy), (WIDTH, HEIGHT - 1 - gy)], fill=(4, 6, 16, alpha_b))

    frame = Image.alpha_composite(frame, overlay)

    # Particle layer
    part_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_part = ImageDraw.Draw(part_layer)
    for p in particles:
        cur_y = (p["y_start"] - t * p["speed"]) % HEIGHT
        p_alpha = int(120 + 100 * math.sin((t + p["x"]) * 2 * math.pi))
        col = p["color"] + (p_alpha,)
        s = p["size"]
        d_part.ellipse([(p["x"] - s, cur_y - s), (p["x"] + s, cur_y + s)], fill=col)
        # soft outer halo
        halo_col = p["color"] + (int(p_alpha * 0.35),)
        d_part.ellipse([(p["x"] - s * 2, cur_y - s * 2), (p["x"] + s * 2, cur_y + s * 2)], fill=halo_col)

    frame = Image.alpha_composite(frame, part_layer)

    # Draw UI / Branding layer
    ui_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(ui_layer)

    # 1. LOGO EMBLEM on Left
    logo_x = 55
    logo_y = 125
    
    # Pulsing outer glow for logo
    glow_radius = int(8 + 6 * glow_factor)
    glow_col = (0, 240, 255, int(100 + 80 * glow_factor))
    d.rounded_rectangle(
        [(logo_x - glow_radius, logo_y - glow_radius), 
         (logo_x + logo_size + glow_radius, logo_y + logo_size + glow_radius)],
        radius=28,
        fill=glow_col
    )
    # Magenta secondary glow
    mag_col = (255, 0, 150, int(60 + 50 * (1.0 - glow_factor)))
    d.rounded_rectangle(
        [(logo_x - glow_radius + 4, logo_y - glow_radius + 4), 
         (logo_x + logo_size + glow_radius - 4, logo_y + logo_size + glow_radius - 4)],
        radius=26,
        fill=mag_col
    )
    
    # Paste logo with rounded mask
    mask = Image.new("L", (logo_size, logo_size), 0)
    d_mask = ImageDraw.Draw(mask)
    d_mask.rounded_rectangle([(0, 0), (logo_size, logo_size)], radius=24, fill=255)
    ui_layer.paste(base_logo, (logo_x, logo_y), mask)
    
    # Sleek cyan border around logo
    border_col = (0, 245, 255, 230)
    d.rounded_rectangle([(logo_x, logo_y), (logo_x + logo_size, logo_y + logo_size)], radius=24, outline=border_col, width=2)

    # 2. BRANDING TYPOGRAPHY
    text_x = 230
    
    # Status Pill above title: [ ● ALL SYSTEMS OPERATIONAL ]
    status_y = 120
    status_w = 205
    status_h = 26
    d.rounded_rectangle(
        [(text_x, status_y), (text_x + status_w, status_y + status_h)],
        radius=13,
        fill=(10, 26, 32, 210),
        outline=(0, 230, 160, 160),
        width=1
    )
    # Pulsing green dot
    radar_r = int(5 + 3 * glow_factor)
    d.ellipse([(text_x + 13 - radar_r, status_y + 13 - radar_r), (text_x + 13 + radar_r, status_y + 13 + radar_r)], fill=(0, 255, 170, int(90 * (1 - glow_factor))))
    d.ellipse([(text_x + 10, status_y + 10), (text_x + 16, status_y + 16)], fill=(0, 255, 170, 255))
    d.text((text_x + 24, status_y + 5), "SYSTEMS OPERATIONAL", font=font_status, fill=(200, 255, 235, 240))

    # Title: D R E A M   N O D E S
    title_y = 155
    # Neon drop-glow on text
    for off in [(0, 0), (-1, -1), (1, 1), (0, 2)]:
        d.text((text_x + off[0], title_y + off[1]), "DREAM NODES", font=font_title, fill=(0, 210, 255, int(90 + 60 * glow_factor)))
    d.text((text_x, title_y), "DREAM NODES", font=font_title, fill=(255, 255, 255, 255))

    # Subtitle with neon gradient feel
    sub_y = 215
    d.text((text_x, sub_y), "NEXT-GEN CLOUD & GAME SERVER HOSTING", font=font_subtitle, fill=(185, 210, 255, 240))

    # Horizontal neon separator bar with pulsing sweep
    line_y = 252
    line_len = 540
    d.line([(text_x, line_y), (text_x + line_len, line_y)], fill=(30, 50, 90, 180), width=2)
    # Moving light shimmer along line
    sweep_pos = (t * (line_len + 150)) - 75
    if sweep_pos > 0 and sweep_pos < line_len:
        d.line([(text_x + max(0, sweep_pos - 45), line_y), (text_x + min(line_len, sweep_pos + 45), line_y)], fill=(0, 240, 255, 255), width=3)
        d.ellipse([(text_x + sweep_pos - 4, line_y - 4), (text_x + sweep_pos + 4, line_y + 4)], fill=(255, 255, 255, 255))

    # 3. FEATURE PILLS / HIGHLIGHT BADGES
    badges = [
        {"icon": "⚡", "label": "Ultra-Low Latency"},
        {"icon": "🛡️", "label": "Anti-DDoS Game Shield"},
        {"icon": "🚀", "label": "Instant Provisioning"},
        {"icon": "💎", "label": "NVMe Gen4 Storage"}
    ]
    badge_x = text_x
    badge_y = 275
    badge_w = 175
    badge_h = 32
    
    for i, b in enumerate(badges):
        bx = badge_x + (i % 2) * 195
        by = badge_y + (i // 2) * 44
        # Pill background
        d.rounded_rectangle(
            [(bx, by), (bx + badge_w, by + badge_h)],
            radius=8,
            fill=(14, 20, 38, 200),
            outline=(50, 110, 180, 150),
            width=1
        )
        # Highlight accent dot
        accent_col = (0, 240, 255) if (i % 2 == 0) else (255, 60, 180)
        d.ellipse([(bx + 10, by + 12), (bx + 18, by + 20)], fill=accent_col + (230,))
        d.text((bx + 26, by + 7), b["label"], font=font_badge, fill=(225, 235, 255, 240))

    # Diagonal cyber shimmer flare across the whole banner every loop
    flare_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_flare = ImageDraw.Draw(flare_layer)
    flare_x = int(-250 + t * (WIDTH + 500))
    # Draw soft angled sheen line
    for w_off in range(-35, 36):
        alpha_flare = int((1.0 - abs(w_off) / 36.0) * (35 + 20 * glow_factor))
        d_flare.line(
            [(flare_x + w_off + 90, 0), (flare_x + w_off - 90, HEIGHT)],
            fill=(200, 240, 255, alpha_flare),
            width=2
        )
    ui_layer = Image.alpha_composite(ui_layer, flare_layer)

    # Combine all
    final_frame = Image.alpha_composite(frame, ui_layer).convert("RGB")
    final_frame.save(os.path.join(FRAMES_DIR, f"frame_{frame_idx:03d}.png"))

print(f"Rendered {TOTAL_FRAMES} frames. Compiling with ffmpeg...")

# Compile to smooth MP4
cmd_mp4 = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(FRAMES_DIR, "frame_%03d.png"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "18",
    OUTPUT_MP4
]
subprocess.run(cmd_mp4, check=True)
print(f"MP4 created at {OUTPUT_MP4}")

# Compile to high-quality optimized looping GIF using palettegen/paletteuse
cmd_gif = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(FRAMES_DIR, "frame_%03d.png"),
    "-vf", "split[s0][s1];[s0]palettegen=max_colors=128:reserve_transparent=0[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3",
    OUTPUT_GIF
]
subprocess.run(cmd_gif, check=True)
print(f"GIF created at {OUTPUT_GIF}")

# Clean up temp frames to save space
for f in os.listdir(FRAMES_DIR):
    os.remove(os.path.join(FRAMES_DIR, f))
os.rmdir(FRAMES_DIR)
print("Done!")
