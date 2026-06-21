import os
from PIL import Image, ImageOps

def process_images():
    photo_dir = "/Users/vedat/Desktop/der-in infra /photo"
    output_dir = "/Users/vedat/Desktop/der-in infra /projects"
    os.makedirs(output_dir, exist_ok=True)
    
    # Sort files exactly as done in the grid generator
    extensions = ('.jpg', '.jpeg', '.png', '.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')
    files = sorted([f for f in os.listdir(photo_dir) if f.endswith(extensions)])
    
    # Mapping of index in sorted list to target name
    mapping = {
        2: "drywall_before.jpg",
        5: "tiling_before.jpg",
        9: "bathroom_after_1.jpg",
        12: "toilet_after.jpg",
        14: "toilet_before.jpg",
        18: "bathroom_before_1.jpg",
        20: "bathroom_after_2.jpg",
        32: "toilet_modern.jpg",
        40: "tiling_after.jpg",
        47: "drywall_after.jpg",
        50: "bathroom_luxury.jpg",
        51: "bathroom_before_2.jpg",
        58: "plumbing_rough.jpg",
        63: "tiling_finished.jpg",
        66: "bathroom_sink.jpg"
    }
    
    max_size = 1200
    
    for idx, target_name in mapping.items():
        if idx >= len(files):
            print(f"Index {idx} out of range! Total files: {len(files)}")
            continue
            
        src_filename = files[idx]
        src_path = os.path.join(photo_dir, src_filename)
        dest_path = os.path.join(output_dir, target_name)
        
        try:
            with Image.open(src_path) as img:
                # Fix EXIF orientation
                try:
                    img = ImageOps.exif_transpose(img)
                except Exception:
                    pass
                
                # Convert to RGB if needed (JPEG doesn't support RGBA)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize keeping aspect ratio
                w, h = img.size
                if w > max_size or h > max_size:
                    if w > h:
                        new_w = max_size
                        new_h = int(h * (max_size / w))
                    else:
                        new_h = max_size
                        new_w = int(w * (max_size / h))
                    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                    print(f"Resized #{idx} ({src_filename}) from {w}x{h} to {new_w}x{new_h}")
                
                # Save optimized JPEG
                img.save(dest_path, "JPEG", quality=82, optimize=True)
                size_kb = os.path.getsize(dest_path) / 1024
                print(f"Saved optimized: {target_name} ({size_kb:.1f} KB)")
                
        except Exception as e:
            print(f"Error processing #{idx} ({src_filename}): {e}")

if __name__ == "__main__":
    process_images()
