import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

os.makedirs("assets", exist_ok=True)

def add_demo_badge(draw, width, height, text="Advance Dermatology & Laser Medical Center"):
    # Subtle elegant pill badge at bottom right
    padding_x = 16
    padding_y = 8
    font_size = 13
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Approximate text size
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    bx = width - tw - 32
    by = height - th - 24
    
    # Draw translucent rounded rectangle
    draw.rounded_rectangle([bx - padding_x, by - padding_y, bx + tw + padding_x, by + th + padding_y], radius=6, fill=(15, 32, 39, 210), outline=(197, 168, 128, 180), width=1)
    draw.text((bx, by), text, font=font, fill=(240, 243, 246, 240))

def create_hero_bg():
    w, h = 1920, 1080
    im = Image.new("RGBA", (w, h), (15, 28, 44, 255))
    draw = ImageDraw.Draw(im)
    
    # Rich deep medical slate gradient to oceanic teal-navy
    for y in range(h):
        interp = y / h
        r = int(14 + (24 - 14) * interp)
        g = int(28 + (48 - 28) * interp)
        b = int(48 + (72 - 48) * interp)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
    
    # Ambient glowing light orbs
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    
    # Warm gold subtle glow top right
    for rad in range(500, 0, -10):
        alpha = int(35 * (1 - rad / 500))
        glow_draw.ellipse([w - 300 - rad, -100 - rad, w - 300 + rad, -100 + rad], fill=(197, 168, 128, alpha))
        
    # Calming teal glow bottom left
    for rad in range(600, 0, -12):
        alpha = int(40 * (1 - rad / 600))
        glow_draw.ellipse([100 - rad, h - 100 - rad, 100 + rad, h - 100 + rad], fill=(13, 148, 136, alpha))
    
    # Abstract cellular / collagen network subtle curves
    for i in range(12):
        offset = i * 80
        glow_draw.arc([w // 2 - 400 + offset, 100, w // 2 + 600 + offset, 900], start=30, end=180, fill=(255, 255, 255, 12), width=2)
        glow_draw.arc([w // 2 - 350 + offset, 180, w // 2 + 550 + offset, 820], start=210, end=350, fill=(197, 168, 128, 16), width=1)
        
    im = Image.alpha_composite(im, glow)
    im = im.convert("RGB")
    im.save("assets/hero-bg.jpg", quality=92)
    print("Created hero-bg.jpg")

def create_doctor_concept():
    w, h = 900, 1100
    im = Image.new("RGBA", (w, h), (246, 248, 250, 255))
    draw = ImageDraw.Draw(im)
    
    # Soft clinical studio gradient
    for y in range(h):
        interp = y / h
        r = int(240 - 20 * interp)
        g = int(244 - 18 * interp)
        b = int(248 - 14 * interp)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    # Architectural background element: calm archway / marble column silhouette
    draw.rounded_rectangle([100, 80, 800, 1020], radius=320, outline=(220, 226, 235), width=2)
    draw.rounded_rectangle([130, 110, 770, 990], radius=300, fill=(255, 255, 255, 180), outline=(230, 235, 242), width=1)
    
    # Elegant stylized silhouette & clinical physician portrait art
    cx, cy = w // 2, 420
    
    # Head & hair
    draw.ellipse([cx - 100, cy - 170, cx + 100, cy + 90], fill=(42, 38, 48))
    # Face & neck
    draw.ellipse([cx - 75, cy - 130, cx + 75, cy + 50], fill=(235, 205, 188))
    draw.rectangle([cx - 35, cy + 20, cx + 35, cy + 120], fill=(225, 195, 178))
    
    # Physician lab coat / suit in refined medical navy & white
    # Shoulders and coat
    draw.polygon([
        (cx - 35, cy + 100),
        (cx - 280, cy + 340),
        (cx - 340, h),
        (cx + 340, h),
        (cx + 280, cy + 340),
        (cx + 35, cy + 100)
    ], fill=(255, 255, 255))
    
    # Crisp navy lapel
    draw.polygon([
        (cx - 25, cy + 100),
        (cx - 100, cy + 260),
        (cx - 20, cy + 380),
        (cx, cy + 280),
        (cx + 20, cy + 380),
        (cx + 100, cy + 260),
        (cx + 25, cy + 100)
    ], fill=(22, 40, 64))
    
    # Stethoscope / gold insignia detail
    draw.arc([cx - 110, cy + 160, cx + 110, cy + 420], start=10, end=170, fill=(197, 168, 128), width=5)
    draw.ellipse([cx + 50, cy + 410, cx + 80, cy + 440], fill=(197, 168, 128), outline=(255, 255, 255), width=2)
    
    # Subtle gold badge pin
    draw.ellipse([cx - 140, cy + 330, cx - 115, cy + 355], fill=(197, 168, 128))
    
    add_demo_badge(draw, w, h, "Advance Dermatology & Laser Medical Center")
    im = im.convert("RGB")
    im.save("assets/doctor-concept.jpg", quality=92)
    print("Created doctor-concept.jpg")

def create_clinic_reception():
    w, h = 1200, 800
    im = Image.new("RGB", (w, h), (248, 250, 252))
    draw = ImageDraw.Draw(im)
    
    # Coastal Marina del Rey warm serene medical sanctuary aesthetic
    # Ceiling & warm cove lighting
    draw.rectangle([0, 0, w, 220], fill=(240, 244, 248))
    draw.rectangle([80, 40, w - 80, 160], fill=(255, 255, 255), outline=(225, 230, 238), width=2)
    # Warm strip light
    draw.line([(100, 150), (w - 100, 150)], fill=(225, 205, 170), width=6)
    
    # Marble accent wall with fluted wood panelling
    draw.rectangle([120, 220, w - 120, 580], fill=(255, 255, 255))
    for x in range(140, w - 140, 28):
        draw.line([(x, 220), (x, 580)], fill=(242, 238, 230), width=2)
        
    # Clinic reception desk (curved luxury quartz & warm brass)
    draw.rounded_rectangle([250, 440, w - 250, 680], radius=24, fill=(255, 255, 255), outline=(200, 180, 150), width=3)
    draw.line([(250, 460), (w - 250, 460)], fill=(197, 168, 128), width=4)
    
    # Clinic branding sign on wall (Illustrative)
    draw.rounded_rectangle([420, 280, 780, 360], radius=8, fill=(245, 248, 252), outline=(197, 168, 128), width=1)
    try:
        font = ImageFont.truetype("arial.ttf", 20)
        sub_font = ImageFont.truetype("arial.ttf", 12)
    except:
        font = ImageFont.load_default()
        sub_font = ImageFont.load_default()
    
    draw.text((455, 296), "ADVANCE DERMATOLOGY", fill=(22, 40, 64), font=font)
    draw.text((495, 326), "& LASER MEDICAL CENTER", fill=(197, 168, 128), font=sub_font)
    
    # Floor (polished terrazzo / warm limestone)
    for y in range(580, h):
        interp = (y - 580) / (h - 580)
        c = int(230 - 30 * interp)
        draw.line([(0, y), (w, y)], fill=(c, c - 2, c - 5))
        
    add_demo_badge(draw, w, h, "Advance Dermatology & Laser Medical Center")
    im.save("assets/clinic-reception.jpg", quality=92)
    print("Created clinic-reception.jpg")

def create_laser_suite():
    w, h = 1200, 800
    im = Image.new("RGB", (w, h), (18, 28, 42))
    draw = ImageDraw.Draw(im)
    
    # High-tech Sciton / Hybrid laser treatment suite with ambient blue/gold calibration glow
    # Wall background
    for y in range(h):
        interp = y / h
        r = int(18 + 10 * interp)
        g = int(28 + 15 * interp)
        b = int(42 + 25 * interp)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
        
    # Laser workstation system
    draw.rounded_rectangle([680, 320, 960, 680], radius=18, fill=(235, 240, 245), outline=(197, 168, 128), width=2)
    # Touchscreen display
    draw.rounded_rectangle([720, 200, 920, 320], radius=8, fill=(10, 20, 30), outline=(13, 148, 136), width=2)
    # Display graphics
    draw.rectangle([735, 220, 905, 300], fill=(15, 35, 50))
    draw.line([(745, 260), (790, 240), (840, 270), (895, 235)], fill=(13, 148, 136), width=2)
    
    # Articulated laser arm
    draw.line([(700, 340), (620, 250)], fill=(120, 135, 150), width=10)
    draw.line([(620, 250), (520, 320)], fill=(100, 115, 130), width=8)
    draw.ellipse([505, 310, 535, 340], fill=(197, 168, 128))
    # Calibrated beam guide (subtle amber/gold beam)
    draw.line([(520, 340), (460, 480)], fill=(225, 185, 110), width=2)
    
    # Ergonomic medical procedure recliner
    draw.rounded_rectangle([200, 460, 580, 540], radius=14, fill=(245, 248, 250))
    draw.rounded_rectangle([180, 430, 320, 520], radius=16, fill=(235, 240, 245))
    draw.rounded_rectangle([320, 540, 460, 680], radius=10, fill=(90, 105, 120))
    
    # Ambient surgical/procedure lighting
    draw.ellipse([340, 80, 560, 130], fill=(255, 255, 255), outline=(197, 168, 128), width=3)
    
    add_demo_badge(draw, w, h, "Advance Dermatology & Laser Medical Center")
    im.save("assets/laser-suite.jpg", quality=92)
    print("Created laser-suite.jpg")

def create_consultation_room():
    w, h = 1200, 800
    im = Image.new("RGB", (w, h), (245, 247, 250))
    draw = ImageDraw.Draw(im)
    
    # Warm natural light window looking out to Marina del Rey ocean tones
    draw.rectangle([80, 100, 450, 500], fill=(210, 235, 250), outline=(200, 210, 220), width=4)
    # Ocean horizon
    draw.rectangle([80, 340, 450, 500], fill=(160, 205, 230))
    # Window mullions
    draw.line([(265, 100), (265, 500)], fill=(255, 255, 255), width=6)
    draw.line([(80, 300), (450, 300)], fill=(255, 255, 255), width=6)
    
    # Doctor consultation desk
    draw.rounded_rectangle([420, 400, 1050, 620], radius=16, fill=(255, 255, 255), outline=(220, 225, 232), width=2)
    # Digital skin analysis diagnostic station
    draw.rounded_rectangle([520, 290, 720, 420], radius=6, fill=(20, 30, 45))
    draw.rectangle([535, 305, 705, 405], fill=(30, 55, 80))
    # Cross polarized skin scan schematic
    draw.ellipse([580, 320, 660, 390], outline=(13, 148, 136), width=2)
    
    # Ergonomic consultation chairs
    draw.rounded_rectangle([780, 360, 950, 560], radius=12, fill=(230, 235, 242))
    
    # Warm wood floor
    draw.rectangle([0, 600, w, h], fill=(215, 200, 185))
    
    add_demo_badge(draw, w, h, "Advance Dermatology & Laser Medical Center")
    im.save("assets/consultation-room.jpg", quality=92)
    print("Created consultation-room.jpg")

def create_skin_layers():
    w, h = 1000, 650
    im = Image.new("RGB", (w, h), (252, 253, 255))
    draw = ImageDraw.Draw(im)
    
    # Title & schematic
    try:
        title_font = ImageFont.truetype("arial.ttf", 22)
        label_font = ImageFont.truetype("arial.ttf", 14)
    except:
        title_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
        
    draw.text((40, 30), "DERMATOLOGICAL CELLULAR RESTRUCTURING & LASER DYNAMICS", fill=(18, 32, 54), font=title_font)
    draw.text((40, 60), "Cross-sectional visualization of Stratum Corneum, Epidermis, Dermis & Collagen remodeling", fill=(100, 116, 139), font=label_font)
    
    # Epidermis Layer (Top)
    draw.rounded_rectangle([40, 120, 960, 220], radius=8, fill=(254, 235, 226), outline=(245, 195, 180), width=2)
    draw.text((60, 140), "EPIDERMAL LAYER (Basal Keratinocytes & Melanocytes)", fill=(180, 83, 9), font=label_font)
    
    # Dermal-Epidermal Junction
    draw.line([(40, 220), (960, 220)], fill=(225, 140, 120), width=3)
    
    # Papillary Dermis
    draw.rounded_rectangle([40, 220, 960, 370], radius=8, fill=(254, 243, 235), outline=(235, 200, 180), width=1)
    draw.text((60, 240), "PAPILLARY DERMIS (Microvascular Capillary Loops & Type III Collagen)", fill=(154, 52, 18), font=label_font)
    
    # Reticular Dermis & Deep Collagen Matrix
    draw.rounded_rectangle([40, 370, 960, 560], radius=8, fill=(248, 250, 252), outline=(203, 213, 225), width=2)
    draw.text((60, 390), "RETICULAR DERMIS (Type I Collagen Fiber Bundles, Elastin & Hyaluronic Acid)", fill=(30, 41, 59), font=label_font)
    
    # Fractional Laser Microthermal Treatment Columns (MTZs)
    for col_x in range(320, 880, 80):
        # Ablative / Coagulative channel
        draw.polygon([(col_x - 12, 120), (col_x + 12, 120), (col_x + 4, 460), (col_x - 4, 460)], fill=(239, 68, 68, 140))
        # Collagen induction halo
        draw.ellipse([col_x - 22, 440, col_x + 22, 490], outline=(13, 148, 136), width=2)
        
    draw.text((360, 510), "Fractional Photothermolysis Columns (Stimulates Neocollagenesis)", fill=(13, 148, 136), font=label_font)
    
    add_demo_badge(draw, w, h, "Sample Credential Display — Illustrative Only")
    im.save("assets/skin-layers-diagram.jpg", quality=92)
    print("Created skin-layers-diagram.jpg")

def create_before_after():
    w, h = 800, 600
    
    # Pre-treatment illustrative baseline (fine texture, sun pigmentation spots)
    im1 = Image.new("RGB", (w, h), (242, 218, 205))
    draw1 = ImageDraw.Draw(im1)
    # Subtle skin shading
    for y in range(h):
        interp = y / h
        r = int(245 - 20 * interp)
        g = int(220 - 25 * interp)
        b = int(208 - 25 * interp)
        draw1.line([(0, y), (w, y)], fill=(r, g, b))
    
    # Illustrative hyperpigmentation and fine lines
    for px, py, rad in [(320, 280, 18), (360, 240, 12), (440, 310, 24), (490, 270, 16), (280, 340, 14), (520, 350, 20)]:
        draw1.ellipse([px - rad, py - rad, px + rad, py + rad], fill=(205, 160, 140))
    for ly in [260, 290, 330, 360]:
        draw1.arc([250, ly, 550, ly + 80], start=20, end=160, fill=(210, 175, 160), width=2)
        
    add_demo_badge(draw1, w, h, "Advance Dermatology & Laser Medical Center")
    im1.save("assets/before-texture.jpg", quality=92)
    
    # Post-treatment illustrative concept (even luminous tone, refined cellular smoothness)
    im2 = Image.new("RGB", (w, h), (248, 228, 218))
    draw2 = ImageDraw.Draw(im2)
    for y in range(h):
        interp = y / h
        r = int(252 - 12 * interp)
        g = int(232 - 15 * interp)
        b = int(222 - 15 * interp)
        draw2.line([(0, y), (w, y)], fill=(r, g, b))
    
    # Radiant glow center
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for rad in range(300, 0, -10):
        alpha = int(45 * (1 - rad / 300))
        gdraw.ellipse([400 - rad, 300 - rad, 400 + rad, 300 + rad], fill=(255, 250, 240, alpha))
    im2.paste(glow, (0, 0), glow)
    
    add_demo_badge(draw2, w, h, "Advance Dermatology & Laser Medical Center")
    im2.save("assets/after-texture.jpg", quality=92)
    print("Created before-texture.jpg and after-texture.jpg")

if __name__ == "__main__":
    create_hero_bg()
    create_doctor_concept()
    create_clinic_reception()
    create_laser_suite()
    create_consultation_room()
    create_skin_layers()
    create_before_after()
