import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import subprocess

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION_SEC = 3.0
TOTAL_FRAMES = int(FPS * DURATION_SEC) # 90 frames

ASSETS_DIR = r"c:\Vichost\assets"
OUTPUT_MP4 = os.path.join(ASSETS_DIR, "dream_nodes_welcome_animated.mp4")
OUTPUT_GIF = os.path.join(ASSETS_DIR, "dream_nodes_welcome_animated.gif")
FRAMES_DIR = os.path.join(ASSETS_DIR, "temp_welcome_frames")

os.makedirs(FRAMES_DIR, exist_ok=True)

# Fonts
font_cursive_path = os.path.join(ASSETS_DIR, "GreatVibes.ttf")
f_welcome = ImageFont.truetype(font_cursive_path, 340)

font_clean_path = r"C:\Windows\Fonts\bahnschrift.ttf"
f_subtitle = ImageFont.truetype(font_clean_path, 42)
f_badge = ImageFont.truetype(font_clean_path, 22)

# Pre-measure text bounding boxes
text_welcome = "welcome"
bbox_w = f_welcome.getbbox(text_welcome)
w_w = bbox_w[2] - bbox_w[0]
w_h = bbox_w[3] - bbox_w[1]
wx = (WIDTH - w_w) // 2 - bbox_w[0]
wy = 240 - bbox_w[1]

text_sub = "W E L C O M E   T O   D R E A M   N O D E S"
bbox_sub = f_subtitle.getbbox(text_sub)
sw = bbox_sub[2] - bbox_sub[0]
sx = (WIDTH - sw) // 2
sy = 650

text_badge = "✦   N E X T - G E N   C L O U D   &   G A M E   H O S T I N G   ✦"
bbox_badge = f_badge.getbbox(text_badge)
bw = bbox_badge[2] - bbox_badge[0]
bx = (WIDTH - bw) // 2
by = 750

# Seeded floating particles
np.random.seed(99)
NUM_PARTICLES = 50
particles = []
for _ in range(NUM_PARTICLES):
    x = np.random.uniform(80, WIDTH - 80)
    y_start = np.random.uniform(100, HEIGHT + 200)
    speed = np.random.uniform(80, 240)
    size = np.random.uniform(3, 8)
    color_choice = np.random.choice(["cyan", "magenta", "white"])
    if color_choice == "cyan":
        color = (0, 245, 255)
    elif color_choice == "magenta":
        color = (255, 60, 190)
    else:
        color = (220, 240, 255)
    particles.append({"x": x, "y_start": y_start, "speed": speed, "size": size, "color": color})

print("Generating 90 animated welcome frames...")

for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / TOTAL_FRAMES
    glow_pulse = 0.5 + 0.5 * math.sin(t * 2 * math.pi)

    # 1. Base Dark Canvas
    frame = Image.new("RGBA", (WIDTH, HEIGHT), (6, 8, 18, 255))
    d_base = ImageDraw.Draw(frame)

    # Radial ambient spotlight behind the cursive text
    cx, cy = WIDTH // 2, 420
    # Soft cyan glow
    r_cyan = int(600 + 40 * glow_pulse)
    for r in range(r_cyan, 0, -15):
        alpha = int((40 + 20 * glow_pulse) * (1.0 - r / float(r_cyan)))
        d_base.ellipse([(cx - r, cy - int(r * 0.55)), (cx + r, cy + int(r * 0.55))], fill=(0, 110, 230, alpha))
        
    # Secondary magenta/violet accent glow on right
    r_mag = int(450 + 30 * (1 - glow_pulse))
    for r in range(r_mag, 0, -15):
        alpha = int((30 + 15 * (1 - glow_pulse)) * (1.0 - r / float(r_mag)))
        d_base.ellipse([(cx - r + 160, cy - int(r * 0.5) - 30), (cx + r + 160, cy + int(r * 0.5) - 30)], fill=(230, 0, 160, alpha))

    # Subtle perspective grid lines at bottom
    for gx in range(0, WIDTH + 100, 120):
        d_base.line([(gx, 860), (WIDTH // 2 + (gx - WIDTH // 2) * 2, HEIGHT)], fill=(20, 35, 65, 70), width=1)
    for gy in [880, 920, 970, 1030]:
        d_base.line([(0, gy), (WIDTH, gy)], fill=(20, 35, 65, 70), width=1)

    # 2. Floating Cyber Particles
    part_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_part = ImageDraw.Draw(part_layer)
    for p in particles:
        cur_y = (p["y_start"] - t * p["speed"]) % HEIGHT
        p_alpha = int(120 + 100 * math.sin((t + p["x"] / 500.0) * 2 * math.pi))
        s = p["size"]
        halo_col = p["color"] + (int(p_alpha * 0.35),)
        col = p["color"] + (p_alpha,)
        d_part.ellipse([(p["x"] - s * 2, cur_y - s * 2), (p["x"] + s * 2, cur_y + s * 2)], fill=halo_col)
        d_part.ellipse([(p["x"] - s, cur_y - s), (p["x"] + s, cur_y + s)], fill=col)

    frame = Image.alpha_composite(frame, part_layer)

    # 3. Cursive 'welcome' with Neon Glass Tube Glow
    text_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_text = ImageDraw.Draw(text_layer)

    # Multi-pass thick stroke
    for off_x in range(-5, 6):
        for off_y in range(-5, 6):
            if off_x**2 + off_y**2 <= 25:
                # Color gradient along x: cyan on left to magenta on right
                d_text.text((wx + off_x, wy + off_y), text_welcome, font=f_welcome, fill=(0, 240, 255, 230))

    # Wide diffuse outer glow
    outer_glow = text_layer.filter(ImageFilter.GaussianBlur(32))
    # Mid intense glow
    mid_glow = text_layer.filter(ImageFilter.GaussianBlur(12))

    # Blend glows
    frame = Image.alpha_composite(frame, outer_glow)
    frame = Image.alpha_composite(frame, mid_glow)

    # Core crisp text with Apple glass tube highlight
    core_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_core = ImageDraw.Draw(core_layer)
    # Inner white/ice-blue core
    d_core.text((wx, wy), text_welcome, font=f_welcome, fill=(255, 255, 255, 255))
    d_core.text((wx, wy - 1), text_welcome, font=f_welcome, fill=(220, 250, 255, 200))

    # Traveling specular gleam across cursive letters
    shimmer_x = int(-200 + t * (w_w + 500))
    shimmer_mask = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_shim = ImageDraw.Draw(shimmer_mask)
    for swidth in range(-45, 46):
        s_alpha = int((1.0 - abs(swidth) / 46.0) * 180)
        d_shim.line([(wx + shimmer_x + swidth, wy - 50), (wx + shimmer_x + swidth - 60, wy + w_h + 50)], fill=(255, 255, 255, s_alpha), width=2)

    # Composite shimmer on text
    frame = Image.alpha_composite(frame, core_layer)
    frame = Image.alpha_composite(frame, shimmer_mask)

    # 4. Typography: "W E L C O M E   T O   D R E A M   N O D E S"
    ui_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_ui = ImageDraw.Draw(ui_layer)

    # Drop glow on subtitle
    for off in [(-1, -1), (1, 1), (0, 2), (-2, 0)]:
        d_ui.text((sx + off[0], sy + off[1]), text_sub, font=f_subtitle, fill=(0, 200, 255, int(70 + 40 * glow_pulse)))
    d_ui.text((sx, sy), text_sub, font=f_subtitle, fill=(245, 252, 255, 255))

    # Sleek illuminated divider bar
    div_y = sy + 62
    div_w = 640
    div_x = (WIDTH - div_w) // 2
    d_ui.line([(div_x, div_y), (div_x + div_w, div_y)], fill=(30, 55, 95, 180), width=2)
    # Moving light spark along divider
    spark_pos = (t * (div_w + 100)) - 50
    if 0 < spark_pos < div_w:
        d_ui.line([(div_x + max(0, spark_pos - 35), div_y), (div_x + min(div_w, spark_pos + 35), div_y)], fill=(0, 245, 255, 255), width=3)
        d_ui.ellipse([(div_x + spark_pos - 3, div_y - 3), (div_x + spark_pos + 3, div_y + 3)], fill=(255, 255, 255, 255))

    # 5. Badge: "✦ NEXT-GEN CLOUD & GAME HOSTING ✦"
    pad_x = 35
    pad_y = 12
    badge_rect_w = bw + pad_x * 2
    badge_rect_h = bbox_badge[3] - bbox_badge[1] + pad_y * 2
    badge_rx = (WIDTH - badge_rect_w) // 2
    badge_ry = by - 8

    d_ui.rounded_rectangle(
        [(badge_rx, badge_ry), (badge_rx + badge_rect_w, badge_ry + badge_rect_h)],
        radius=20,
        fill=(12, 18, 36, 210),
        outline=(50, 110, 190, int(150 + 60 * glow_pulse)),
        width=1
    )
    d_ui.text((bx, by), text_badge, font=f_badge, fill=(185, 220, 255, 240))

    # Diagonal satin sheen across the whole banner
    flare_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_flare = ImageDraw.Draw(flare_layer)
    flare_x = int(-400 + t * (WIDTH + 800))
    for w_off in range(-50, 51):
        alpha_flare = int((1.0 - abs(w_off) / 51.0) * (30 + 15 * glow_pulse))
        d_flare.line(
            [(flare_x + w_off + 150, 0), (flare_x + w_off - 150, HEIGHT)],
            fill=(220, 245, 255, alpha_flare),
            width=2
        )
    ui_layer = Image.alpha_composite(ui_layer, flare_layer)

    # Final combined frame
    final_frame = Image.alpha_composite(frame, ui_layer).convert("RGB")
    final_frame.save(os.path.join(FRAMES_DIR, f"frame_{frame_idx:03d}.png"))

print(f"Rendered {TOTAL_FRAMES} frames. Compiling MP4 (1920x1080 30fps)...")

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
    "-vf", "scale=960:540:flags=lanczos,unsharp=5:5:0.8:5:5:0.0,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=1",
    OUTPUT_GIF
]
subprocess.run(cmd_gif, check=True)
print(f"GIF ready at {OUTPUT_GIF}")

# Clean up frames
for f in os.listdir(FRAMES_DIR):
    os.remove(os.path.join(FRAMES_DIR, f))
os.rmdir(FRAMES_DIR)
print("Animated welcome banner complete!")
