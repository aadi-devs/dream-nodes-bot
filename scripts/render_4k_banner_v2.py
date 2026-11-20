import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import subprocess

WIDTH = 3840
HEIGHT = 2160
FPS = 30
DURATION_SEC = 3.0
TOTAL_FRAMES = int(FPS * DURATION_SEC) # 90 frames

ASSETS_DIR = r"c:\Vichost\assets"
OUTPUT_4K_MP4 = os.path.join(ASSETS_DIR, "dream_nodes_banner_4K.mp4")
OUTPUT_SHARP_GIF = os.path.join(ASSETS_DIR, "dream_nodes_banner_sharp_discord.gif")
FRAMES_DIR = os.path.join(ASSETS_DIR, "temp_4k_frames_v2")

os.makedirs(FRAMES_DIR, exist_ok=True)

bg_path = os.path.join(ASSETS_DIR, "banner_bg.jpg")
logo_path = os.path.join(ASSETS_DIR, "logo.jpg")

# 1. 4K background with sharpening
base_bg = Image.open(bg_path).convert("RGBA").resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
enhancer = ImageEnhance.Sharpness(base_bg.convert("RGB"))
base_bg = enhancer.enhance(1.8).convert("RGBA")

# 2. 4K logo emblem
base_logo = Image.open(logo_path).convert("RGBA")
logo_size = 540
base_logo = base_logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
enhancer_logo = ImageEnhance.Sharpness(base_logo.convert("RGB"))
base_logo = enhancer_logo.enhance(1.6).convert("RGBA")

# 3. 4K Fonts
font_path = r"C:\Windows\Fonts\bahnschrift.ttf"
font_title = ImageFont.truetype(font_path, 180)
font_subtitle = ImageFont.truetype(font_path, 72)
font_badge = ImageFont.truetype(font_path, 52)
font_pill = ImageFont.truetype(font_path, 52)

# 4. Particles
np.random.seed(42)
NUM_PARTICLES = 65
particles = []
for _ in range(NUM_PARTICLES):
    x = np.random.uniform(50, WIDTH - 50)
    y_start = np.random.uniform(100, HEIGHT + 200)
    speed = np.random.uniform(120, 360)
    size = np.random.uniform(6, 16)
    color_choice = np.random.choice(["cyan", "magenta", "white"])
    if color_choice == "cyan":
        color = (0, 245, 255)
    elif color_choice == "magenta":
        color = (255, 50, 180)
    else:
        color = (240, 250, 255)
    particles.append({"x": x, "y_start": y_start, "speed": speed, "size": size, "color": color})

print("Rendering 4K UHD frames with requested text: 'VPS ◈ VDS ◈ GAMES ◈ WEBSITES'...")

for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / TOTAL_FRAMES
    glow_factor = 0.5 + 0.5 * math.sin(t * 2 * math.pi)

    # Base frame with subtle breathing
    scale = 1.0 + 0.012 * math.sin(t * 2 * math.pi)
    w_crop = int(WIDTH / scale)
    h_crop = int(HEIGHT / scale)
    x_crop = (WIDTH - w_crop) // 2
    y_crop = (HEIGHT - h_crop) // 2
    frame = base_bg.crop((x_crop, y_crop, x_crop + w_crop, y_crop + h_crop)).resize((WIDTH, HEIGHT), Image.Resampling.BILINEAR)

    # 4K Contrast Backing Overlay
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_overlay = ImageDraw.Draw(overlay)
    
    for gx in range(2200):
        alpha = int(195 * (1.0 - gx / 2200.0))
        d_overlay.line([(gx, 0), (gx, HEIGHT)], fill=(6, 8, 20, alpha))
        
    for gy in range(300):
        alpha_t = int(160 * (1.0 - gy / 300.0))
        d_overlay.line([(0, gy), (WIDTH, gy)], fill=(3, 5, 14, alpha_t))
        alpha_b = int(180 * (1.0 - gy / 300.0))
        d_overlay.line([(0, HEIGHT - 1 - gy), (WIDTH, HEIGHT - 1 - gy)], fill=(3, 5, 14, alpha_b))

    frame = Image.alpha_composite(frame, overlay)

    # 4K Particles
    part_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_part = ImageDraw.Draw(part_layer)
    for p in particles:
        cur_y = (p["y_start"] - t * p["speed"]) % HEIGHT
        p_alpha = int(140 + 110 * math.sin((t + p["x"] / 1000.0) * 2 * math.pi))
        col = p["color"] + (p_alpha,)
        s = p["size"]
        halo_col = p["color"] + (int(p_alpha * 0.35),)
        d_part.ellipse([(p["x"] - s * 2.2, cur_y - s * 2.2), (p["x"] + s * 2.2, cur_y + s * 2.2)], fill=halo_col)
        d_part.ellipse([(p["x"] - s, cur_y - s), (p["x"] + s, cur_y + s)], fill=col)

    frame = Image.alpha_composite(frame, part_layer)

    # UI / Branding Layer
    ui_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(ui_layer)

    # 1. 4K LOGO EMBLEM
    logo_x = 220
    logo_y = 510
    
    glow_r = int(24 + 18 * glow_factor)
    d.rounded_rectangle(
        [(logo_x - glow_r, logo_y - glow_r), (logo_x + logo_size + glow_r, logo_y + logo_size + glow_r)],
        radius=90,
        fill=(0, 240, 255, int(90 + 70 * glow_factor))
    )
    d.rounded_rectangle(
        [(logo_x - glow_r + 10, logo_y - glow_r + 10), (logo_x + logo_size + glow_r - 10, logo_y + logo_size + glow_r - 10)],
        radius=85,
        fill=(255, 0, 160, int(60 + 50 * (1 - glow_factor)))
    )

    mask = Image.new("L", (logo_size, logo_size), 0)
    d_mask = ImageDraw.Draw(mask)
    d_mask.rounded_rectangle([(0, 0), (logo_size, logo_size)], radius=80, fill=255)
    ui_layer.paste(base_logo, (logo_x, logo_y), mask)
    d.rounded_rectangle([(logo_x, logo_y), (logo_x + logo_size, logo_y + logo_size)], radius=80, outline=(0, 245, 255, 240), width=6)

    # 2. TYPOGRAPHY
    text_x = 880
    
    # REQUESTED PILL: VPS ◈ VDS ◈ GAMES ◈ WEBSITES
    pill_text = "VPS  ◈  VDS  ◈  GAMES  ◈  WEBSITES"
    bbox = font_pill.getbbox(pill_text)
    pill_w = (bbox[2] - bbox[0]) + 90
    pill_y = 485
    pill_h = 100

    d.rounded_rectangle(
        [(text_x, pill_y), (text_x + pill_w, pill_y + pill_h)],
        radius=50,
        fill=(10, 22, 38, 225),
        outline=(0, 240, 255, int(160 + 75 * glow_factor)),
        width=4
    )
    # Pulsing neon glow for pill text
    for off in [(-1, -1), (1, 1), (0, 2), (-2, 0)]:
        d.text((text_x + 45 + off[0], pill_y + 18 + off[1]), pill_text, font=font_pill, fill=(0, 225, 255, int(75 + 50 * glow_factor)))
    d.text((text_x + 45, pill_y + 18), pill_text, font=font_pill, fill=(240, 252, 255, 255))

    # Title: DREAM NODES in 4K
    title_y = 620
    for off in [(0, 0), (-2, -2), (2, 2), (0, 4), (-4, 0), (4, 0)]:
        d.text((text_x + off[0], title_y + off[1]), "DREAM NODES", font=font_title, fill=(0, 220, 255, int(80 + 60 * glow_factor)))
    d.text((text_x, title_y), "DREAM NODES", font=font_title, fill=(255, 255, 255, 255))

    # Subtitle
    sub_y = 860
    d.text((text_x, sub_y), "NEXT-GEN CLOUD & GAME SERVER HOSTING", font=font_subtitle, fill=(195, 220, 255, 255))

    # Neon Divider Bar
    line_y = 990
    line_len = 2100
    d.line([(text_x, line_y), (text_x + line_len, line_y)], fill=(35, 60, 110, 200), width=6)
    sweep_pos = (t * (line_len + 400)) - 200
    if sweep_pos > 0 and sweep_pos < line_len:
        d.line([(text_x + max(0, sweep_pos - 160), line_y), (text_x + min(line_len, sweep_pos + 160), line_y)], fill=(0, 245, 255, 255), width=10)
        d.ellipse([(text_x + sweep_pos - 14, line_y - 14), (text_x + sweep_pos + 14, line_y + 14)], fill=(255, 255, 255, 255))

    # Badges
    badges = [
        {"icon": "⚡", "label": "Ultra-Low Latency"},
        {"icon": "🛡️", "label": "Anti-DDoS Game Shield"},
        {"icon": "🚀", "label": "Instant Provisioning"},
        {"icon": "💎", "label": "NVMe Gen4 Storage"}
    ]
    badge_x = text_x
    badge_y = 1070
    badge_w = 700
    badge_h = 115
    
    for i, b in enumerate(badges):
        bx = badge_x + (i % 2) * 760
        by = badge_y + (i // 2) * 155
        d.rounded_rectangle(
            [(bx, by), (bx + badge_w, by + badge_h)],
            radius=28,
            fill=(14, 22, 42, 220),
            outline=(60, 120, 200, 180),
            width=3
        )
        accent_col = (0, 245, 255) if (i % 2 == 0) else (255, 50, 180)
        d.ellipse([(bx + 35, by + 42), (bx + 65, by + 72)], fill=accent_col + (255,))
        d.text((bx + 95, by + 26), b["label"], font=font_badge, fill=(235, 245, 255, 255))

    # Diagonal cyber shimmer sheen
    flare_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_flare = ImageDraw.Draw(flare_layer)
    flare_x = int(-800 + t * (WIDTH + 1600))
    for w_off in range(-90, 91):
        alpha_flare = int((1.0 - abs(w_off) / 91.0) * (40 + 25 * glow_factor))
        d_flare.line(
            [(flare_x + w_off + 300, 0), (flare_x + w_off - 300, HEIGHT)],
            fill=(220, 245, 255, alpha_flare),
            width=4
        )
    ui_layer = Image.alpha_composite(ui_layer, flare_layer)

    final_frame = Image.alpha_composite(frame, ui_layer).convert("RGB")
    final_frame.save(os.path.join(FRAMES_DIR, f"frame_{frame_idx:03d}.png"))

print(f"Rendered {TOTAL_FRAMES} frames in 4K. Compiling MP4 (True 4K 3840x2160)...")

cmd_4k_mp4 = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(FRAMES_DIR, "frame_%03d.png"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "slow",
    "-crf", "14",
    OUTPUT_4K_MP4
]
subprocess.run(cmd_4k_mp4, check=True)
print(f"4K MP4 ready at {OUTPUT_4K_MP4}")

print("Compiling sharp Discord-ready GIF...")
cmd_sharp_gif = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(FRAMES_DIR, "frame_%03d.png"),
    "-vf", "scale=960:540:flags=lanczos,unsharp=5:5:0.8:5:5:0.0,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=1",
    OUTPUT_SHARP_GIF
]
subprocess.run(cmd_sharp_gif, check=True)
print(f"Sharp GIF ready at {OUTPUT_SHARP_GIF}")

for f in os.listdir(FRAMES_DIR):
    os.remove(os.path.join(FRAMES_DIR, f))
os.rmdir(FRAMES_DIR)
print("Updated 4K banner render complete!")
