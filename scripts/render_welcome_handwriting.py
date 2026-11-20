import os
import sys
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cv2
import subprocess
import scipy.interpolate as si

# Ensure unbuffered output
sys.stdout.reconfigure(line_buffering=True)

W, H = 1376, 768
FPS = 30
DURATION_SEC = 3.6
TOTAL_FRAMES = int(FPS * DURATION_SEC) # 108 frames

ASSETS_DIR = r"c:\Vichost\assets"
OUTPUT_MP4 = os.path.join(ASSETS_DIR, "welcome_banner_animated.mp4")
OUTPUT_GIF = os.path.join(ASSETS_DIR, "welcome_banner_animated_discord.gif")
OUTPUT_GIF_ALT = os.path.join(ASSETS_DIR, "welcome_banner_animated.gif")
FRAMES_DIR = os.path.join(ASSETS_DIR, "temp_handwriting_frames")

os.makedirs(FRAMES_DIR, exist_ok=True)

print("╔════════════════════════════════════════════════════════╗")
print("║  Dream Nodes — Apple-Style 'welcome' Write-On Banner   ║")
print("╚════════════════════════════════════════════════════════╝")

# 1. Base clean background
bg_path = os.path.join(ASSETS_DIR, "clean_bg_test.jpg")
base_bg = Image.open(bg_path).convert("RGBA")

# 2. Pre-render 3D Neon Glass Tube Artwork
scale = 2
sw, sh = W * scale, H * scale
font_path = os.path.join(ASSETS_DIR, "RougeScript.ttf")
font_large = ImageFont.truetype(font_path, 360 * scale)

raw_text_large = Image.new("L", (sw, sh), 0)
d_large = ImageDraw.Draw(raw_text_large)
bbox_l = font_large.getbbox("welcome")
bw_l, bh_l = bbox_l[2] - bbox_l[0], bbox_l[3] - bbox_l[1]
tx_l = (sw - bw_l) // 2 - bbox_l[0]
ty_l = int(310 * scale) - bh_l // 2 - bbox_l[1]
d_large.text((tx_l, ty_l), "welcome", font=font_large, fill=255)

# Tube dilation
raw_arr_l = np.array(raw_text_large)
k_tube = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(6 * scale), int(6 * scale)))
tube_mask_l = cv2.dilate(raw_arr_l, k_tube)

# Vibrant Cyan -> Lavender -> Neon Pink Gradient
grad_arr = np.zeros((sh, sw, 4), dtype=np.uint8)
x_coords = np.arange(sw)
t_x = np.clip((x_coords - (tx_l - 40)) / float(bw_l + 80), 0.0, 1.0)

r_c = np.where(t_x < 0.45, 0 + (170 - 0) * (t_x / 0.45), 170 + (255 - 170) * ((t_x - 0.45) / 0.55))
g_c = np.where(t_x < 0.45, 235 + (90 - 235) * (t_x / 0.45), 90 + (50 - 90) * ((t_x - 0.45) / 0.55))
b_c = np.where(t_x < 0.45, 255 + (255 - 255) * (t_x / 0.45), 255 + (185 - 255) * ((t_x - 0.45) / 0.55))

grad_arr[:, :, 0] = r_c.astype(np.uint8)
grad_arr[:, :, 1] = g_c.astype(np.uint8)
grad_arr[:, :, 2] = b_c.astype(np.uint8)
grad_arr[:, :, 3] = tube_mask_l

tube_full = Image.fromarray(grad_arr, mode="RGBA").resize((W, H), Image.Resampling.LANCZOS)
tube_mask_1x = Image.fromarray(tube_mask_l).resize((W, H), Image.Resampling.LANCZOS)

# Inner specular glass highlight
k_erode = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(7 * scale), int(7 * scale)))
inner_mask = cv2.erode(tube_mask_l, k_erode)
inner_shifted = np.roll(inner_mask, -int(3 * scale), axis=0)
inner_shifted[-int(3 * scale):, :] = 0
inner_img = Image.fromarray(inner_shifted).resize((W, H), Image.Resampling.LANCZOS)

core_full = Image.new("RGBA", (W, H), (0, 0, 0, 0))
c_arr = np.array(core_full)
c_arr[:, :, 0] = 255
c_arr[:, :, 1] = 255
c_arr[:, :, 2] = 255
c_arr[:, :, 3] = (np.array(inner_img) / 255.0 * 220).astype(np.uint8)
core_full = Image.fromarray(c_arr, mode="RGBA").filter(ImageFilter.GaussianBlur(1.2))

# 3. Complete Handwriting Trajectory
letter_trajectories = [
    # 'w'
    [
        (288, 310), (285, 360), (288, 400), (296, 415), (308, 405), 
        (322, 350), (336, 310), (342, 345), (350, 390), (358, 415), 
        (370, 415), (385, 355), (395, 312), (398, 332), (408, 345)
    ],
    # 'e'
    [
        (408, 345), (420, 320), (432, 308), (440, 315), (438, 338), 
        (426, 375), (418, 405), (425, 418), (440, 415), (460, 375), (475, 342)
    ],
    # 'l' (tall loop)
    [
        (475, 342), (505, 285), (535, 235), (560, 200), (575, 185), 
        (584, 188), (585, 210), (578, 255), (566, 310), (554, 370), 
        (548, 412), (558, 420), (572, 415), (595, 370), (620, 338)
    ],
    # 'c'
    [
        (620, 338), (638, 312), (652, 308), (655, 320), (642, 345), 
        (630, 375), (630, 405), (640, 418), (655, 415), (675, 370), (695, 335)
    ],
    # 'o'
    [
        (695, 335), (712, 310), (728, 308), (732, 325), (718, 365), 
        (702, 395), (708, 418), (725, 418), (745, 380), (752, 335), 
        (745, 315), (735, 320), (748, 338), (768, 335)
    ],
    # 'm'
    [
        # 1st arch
        (768, 335), (785, 312), (798, 312), (800, 345), (795, 385), (792, 418),
        # 2nd arch
        (798, 365), (815, 315), (832, 312), (838, 345), (832, 385), (830, 418),
        # 3rd arch
        (838, 365), (855, 315), (872, 312), (880, 345), (875, 385), (872, 415),
        (880, 420), (895, 410), (918, 360), (940, 335)
    ],
    # 'e' + trailing flourish
    [
        (940, 335), (955, 318), (968, 308), (978, 315), (975, 340), 
        (962, 375), (952, 405), (958, 418), (975, 415), (1000, 390), 
        (1030, 360), (1060, 335), (1080, 330), (1095, 345), (1106, 365)
    ]
]

all_path_points = []
for traj in letter_trajectories:
    pts = np.array(traj)
    tck, u = si.splprep([pts[:, 0], pts[:, 1]], s=2.0, k=3)
    u_dense = np.linspace(0, 1, 350)
    xd, yd = si.splev(u_dense, tck)
    all_path_points.extend(list(zip(xd, yd)))

total_pts = len(all_path_points)
print(f"Path initialized with {total_pts} high-precision trajectory points.")

# 4. Floating Cosmic Dust Particles
np.random.seed(77)
NUM_PARTICLES = 40
particles = []
for _ in range(NUM_PARTICLES):
    px = np.random.uniform(40, W - 40)
    py = np.random.uniform(60, H + 80)
    speed = np.random.uniform(40, 120)
    size = np.random.uniform(2.0, 5.0)
    color = (0, 240, 255) if np.random.rand() > 0.4 else (255, 60, 190)
    particles.append({"x": px, "y": py, "speed": speed, "size": size, "color": color})

# Full mask array for 100% completion
full_text_arr = np.array(tube_mask_1x)

print(f"Rendering {TOTAL_FRAMES} frames (progressive handwriting animation)...")

# Write-on timeline:
# Frames 0 to 74: Active handwriting write-on (0% -> 100%)
# Frames 75 to 82: Spark liftoff / flare
# Frames 83 to 107: Specular shimmer gleam sweep + breathing glow loop
WRITE_END_FRAME = 75

for frame_idx in range(TOTAL_FRAMES):
    t_global = frame_idx / float(TOTAL_FRAMES)
    
    # Breathing pulse
    pulse = 0.5 + 0.5 * math.sin(t_global * 2 * math.pi)
    
    # 1. Subtle camera drift
    scale_cam = 1.0 + 0.008 * math.sin(t_global * 2 * math.pi)
    wc = int(W / scale_cam)
    hc = int(H / scale_cam)
    xc = (W - wc) // 2
    yc = (H - hc) // 2
    frame = base_bg.crop((xc, yc, xc + wc, yc + hc)).resize((W, H), Image.Resampling.BILINEAR)
    
    # 2. Ambient Floating Particles
    part_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_part = ImageDraw.Draw(part_layer)
    for p in particles:
        cur_py = (p["y"] - t_global * p["speed"]) % H
        p_alpha = int(100 + 80 * math.sin((t_global + p["x"] / 400.0) * 2 * math.pi))
        col = p["color"] + (p_alpha,)
        s = p["size"]
        d_part.ellipse([(p["x"] - s, cur_py - s), (p["x"] + s, cur_py + s)], fill=col)
    frame = Image.alpha_composite(frame, part_layer)
    
    # 3. Determine Handwriting Progress
    if frame_idx <= WRITE_END_FRAME:
        # Smooth ease-in-out writing speed
        lin_p = frame_idx / float(WRITE_END_FRAME)
        # Cubic smooth step
        p_write = lin_p * lin_p * (3 - 2 * lin_p)
    else:
        p_write = 1.0
        
    current_pt_idx = int(np.clip(p_write * total_pts, 0, total_pts - 1))
    cur_x, cur_y = all_path_points[current_pt_idx]
    
    # 4. Construct Stroke Reveal Mask
    if p_write >= 0.99:
        # Fully written - reveal 100% of all letters
        mask_arr = full_text_arr.copy()
    else:
        mask_arr = np.zeros((H, W), dtype=np.uint8)
        pts_drawn = all_path_points[:current_pt_idx + 1]
        for pt in pts_drawn:
            cv2.circle(mask_arr, (int(round(pt[0])), int(round(pt[1]))), 30, 255, -1)
        # Intersect with full text so letters stay crisp
        mask_arr = np.minimum(mask_arr, full_text_arr)
        
    mask_img = Image.fromarray(mask_arr).filter(ImageFilter.GaussianBlur(1.0))
    
    # Apply mask to tube body and inner core highlight
    tube_revealed = Image.composite(tube_full, Image.new("RGBA", (W, H), (0,0,0,0)), mask_img)
    core_revealed = Image.composite(core_full, Image.new("RGBA", (W, H), (0,0,0,0)), mask_img)
    
    # 5. Dynamic Neon Blooms
    # Freshly written parts glow more intensely
    glow_mult = 1.25 if frame_idx <= WRITE_END_FRAME else (1.0 + 0.15 * pulse)
    bloom_wide = tube_revealed.filter(ImageFilter.GaussianBlur(36))
    bloom_mid = tube_revealed.filter(ImageFilter.GaussianBlur(14))
    
    # Enhance bloom intensity
    b_mid_arr = (np.array(bloom_mid) * min(1.5, glow_mult)).clip(0, 255).astype(np.uint8)
    bloom_mid = Image.fromarray(b_mid_arr, mode="RGBA")
    
    frame = Image.alpha_composite(frame, bloom_wide)
    frame = Image.alpha_composite(frame, bloom_mid)
    frame = Image.alpha_composite(frame, tube_revealed)
    frame = Image.alpha_composite(frame, core_revealed)
    
    # 6. Glowing Pen Tip / Spark
    spark_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_spark = ImageDraw.Draw(spark_layer)
    
    if frame_idx <= WRITE_END_FRAME:
        # Determine local spark color from X
        tx_spark = np.clip((cur_x - 268) / (1106 - 268), 0.0, 1.0)
        spark_halo_col = (0, 240, 255) if tx_spark < 0.5 else (255, 60, 200)
        
        # Outer soft glow
        d_spark.ellipse([(cur_x - 40, cur_y - 40), (cur_x + 40, cur_y + 40)], fill=spark_halo_col + (50,))
        # Mid intense glow
        d_spark.ellipse([(cur_x - 20, cur_y - 20), (cur_x + 20, cur_y + 20)], fill=spark_halo_col + (130,))
        # Core white-hot spark
        d_spark.ellipse([(cur_x - 9, cur_y - 9), (cur_x + 9, cur_y + 9)], fill=(255, 255, 255, 255))
        d_spark.ellipse([(cur_x - 4, cur_y - 4), (cur_x + 4, cur_y + 4)], fill=(255, 255, 255, 255))
        
        # Radiating micro-sparks
        np.random.seed((frame_idx * 37) % 1000)
        for _ in range(5):
            ang = np.random.uniform(0, 2 * math.pi)
            dist = np.random.uniform(6, 26)
            sx = cur_x + math.cos(ang) * dist
            sy = cur_y + math.sin(ang) * dist
            d_spark.ellipse([(sx - 2, sy - 2), (sx + 2, sy + 2)], fill=(240, 250, 255, 220))
            
    elif frame_idx <= WRITE_END_FRAME + 8:
        # Flare / dissipation at the tip of the flourish
        liftoff_t = (frame_idx - WRITE_END_FRAME) / 8.0
        flare_r = int(25 * (1.0 + liftoff_t * 1.5))
        alpha_flare = int(200 * (1.0 - liftoff_t))
        d_spark.ellipse([(cur_x - flare_r, cur_y - flare_r), (cur_x + flare_r, cur_y + flare_r)], fill=(255, 255, 255, alpha_flare))
        d_spark.ellipse([(cur_x - flare_r * 2, cur_y - flare_r * 2), (cur_x + flare_r * 2, cur_y + flare_r * 2)], fill=(255, 60, 200, alpha_flare // 2))
        
    frame = Image.alpha_composite(frame, spark_layer)
    
    # 7. Specular Shimmer Glint Sweep (after word is written)
    if frame_idx > WRITE_END_FRAME + 4:
        shimmer_t = (frame_idx - (WRITE_END_FRAME + 4)) / float(TOTAL_FRAMES - (WRITE_END_FRAME + 4))
        gleam_x = int(200 + shimmer_t * (W - 200))
        
        shimmer_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d_shim = ImageDraw.Draw(shimmer_layer)
        
        for w_off in range(-35, 36):
            alpha_s = int((1.0 - abs(w_off) / 36.0) * (140 + 60 * pulse))
            d_shim.line(
                [(gleam_x + w_off + 80, 160), (gleam_x + w_off - 80, 480)],
                fill=(255, 255, 255, alpha_s),
                width=3
            )
            
        # Mask shimmer by the tube text mask
        shimmer_masked = Image.composite(shimmer_layer, Image.new("RGBA", (W, H), (0,0,0,0)), tube_mask_1x)
        frame = Image.alpha_composite(frame, shimmer_masked)
        
    # Save frame
    out_frame_file = os.path.join(FRAMES_DIR, f"frame_{frame_idx:03d}.png")
    frame.convert("RGB").save(out_frame_file)
    
    if frame_idx % 15 == 0 or frame_idx == TOTAL_FRAMES - 1:
        print(f"  Progress: {frame_idx + 1}/{TOTAL_FRAMES} frames rendered ({int((frame_idx+1)/TOTAL_FRAMES*100)}%)")

print("\nAll frames rendered! Compiling MP4 (1376x768 @ 30FPS)...")

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
print(f"✓ Animated MP4 banner created: {OUTPUT_MP4} ({os.path.getsize(OUTPUT_MP4) / 1024:.1f} KB)")

print("\nCompiling Discord-optimized animated GIF (< 8MB)...")
cmd_gif = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(FRAMES_DIR, "frame_%03d.png"),
    "-vf", "fps=24,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=1",
    OUTPUT_GIF
]
subprocess.run(cmd_gif, check=True)
print(f"✓ Discord-optimized GIF created: {OUTPUT_GIF} ({os.path.getsize(OUTPUT_GIF) / 1024 / 1024:.2f} MB)")

# Copy to alt path
import shutil
shutil.copyfile(OUTPUT_GIF, OUTPUT_GIF_ALT)

# Clean up frames
for f in os.listdir(FRAMES_DIR):
    os.remove(os.path.join(FRAMES_DIR, f))
os.rmdir(FRAMES_DIR)

print("\n╔════════════════════════════════════════════════════════╗")
print("║  SUCCESS! Apple-style handwriting animation complete!  ║")
print("╚════════════════════════════════════════════════════════╝")
