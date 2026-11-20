import numpy as np
import scipy.interpolate as si
from PIL import Image, ImageDraw, ImageFilter
import cv2

# Refined strokes with pinpoint precision matching RougeScript "welcome"
strokes = [
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
    # 'l' (tall elegant loop)
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
        (1030, 360), (1060, 335), (1075, 330)
    ]
]

all_pts = []
for s in strokes:
    all_pts.extend(s)

cleaned_pts = [all_pts[0]]
for pt in all_pts[1:]:
    if pt != cleaned_pts[-1]:
        cleaned_pts.append(pt)

pts = np.array(cleaned_pts)

# Spline interpolation
tck, u = si.splprep([pts[:, 0], pts[:, 1]], s=3.0, k=3)
u_fine = np.linspace(0, 1, 2500)
x_fine, y_fine = si.splev(u_fine, tck)

# Verify mask coverage at 100%
W, H = 1376, 768
test_mask = np.zeros((H, W), dtype=np.uint8)
for i in range(len(x_fine)):
    cv2.circle(test_mask, (int(round(x_fine[i])), int(round(y_fine[i]))), 22, 255, -1)

# Check against text mask
font_path = r"c:\Vichost\assets\RougeScript.ttf"
from PIL import ImageFont
font = ImageFont.truetype(font_path, 360)
text_img = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(text_img)
bbox = font.getbbox("welcome")
bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
tx = (W - bw) // 2 - bbox[0]
ty = 310 - bh // 2 - bbox[1]
d.text((tx, ty), "welcome", font=font, fill=255)
text_arr = np.array(text_img)

uncovered = (text_arr > 50) & (test_mask == 0)
print(f"Uncovered text pixels: {np.sum(uncovered)} (out of {np.sum(text_arr > 50)})")
coverage = 100.0 * (1.0 - np.sum(uncovered) / np.sum(text_arr > 50))
print(f"Stroke coverage of text: {coverage:.2f}%")
