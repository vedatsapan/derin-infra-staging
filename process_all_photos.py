import os
import json
from PIL import Image, ImageOps

def process_images():
    photo_dir = "/Users/vedat/Desktop/der-in infra /photo"
    output_dir = "/Users/vedat/Desktop/der-in infra /projects"
    os.makedirs(output_dir, exist_ok=True)
    
    # Sort files alphabetically
    extensions = ('.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')
    files = sorted([f for f in os.listdir(photo_dir) if f.endswith(extensions)])
    total_files = len(files)
    print(f"Found {total_files} files in {photo_dir}")
    
    # Existing mapping for before/after and specific gallery items
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

    # Define categories and content pools
    content_pools = {
        "badkamer": {
            "titles": [
                {"nl": "Luxe badkamerrenovatie", "en": "Luxury bathroom renovation", "tr": "Lüks Banyo Yenileme"},
                {"nl": "Moderne inloopdouche", "en": "Modern walk-in shower", "tr": "Modern Duşakabin"},
                {"nl": "Strak badkamer tegelwerk", "en": "Sleek bathroom tiling", "tr": "Şık Banyo Fayans Kaplama"},
                {"nl": "Sanitair installatie", "en": "Sanitary installation", "tr": "Sıhhi Tesisat ve Vitrifiye"},
                {"nl": "Badkamermeubel montage", "en": "Bathroom vanity installation", "tr": "Lavabo ve Dolap Montajı"},
                {"nl": "Gerenoveerde douchewand", "en": "Renovated shower wall", "tr": "Yenilenmiş Duş Duvarı"},
                {"nl": "Design badkamer afwerking", "en": "Design bathroom finish", "tr": "Tasarım Banyo Detayı"}
            ],
            "descriptions": [
                {"nl": "Volledige renovatie van badkamer met grote tegels en inloopdouche.", "en": "Complete renovation of bathroom with large tiles and walk-in shower.", "tr": "Büyük ebatlı fayanslar ve duşakabin ile komple banyo tadilatı."},
                {"nl": "Hoogwaardige afwerking van sanitair en tegelwerk.", "en": "High-quality finishing of sanitary ware and tiling.", "tr": "Birinci sınıf işçilikle vitrifiye ve fayans uygulaması."},
                {"nl": "Moderne regendouche en drain goot installatie.", "en": "Modern rain shower and drain channel installation.", "tr": "Modern yağmur duşu ve duş süzgeci montajı."},
                {"nl": "Nivelleren en verlijmen van XXL tegels op de wand.", "en": "Leveling and bonding of XXL tiles on the wall.", "tr": "Duvara XXL boyutlu fayansların lazer terazili montajı."}
            ]
        },
        "toilet": {
            "titles": [
                {"nl": "Toiletrenovatie", "en": "Toilet renovation", "tr": "Klozet Yenileme"},
                {"nl": "Modern hangtoilet", "en": "Modern wall-hung toilet", "tr": "Modern Asma Klozet"},
                {"nl": "Inbouwreservoir toilet", "en": "Concealed cistern toilet", "tr": "Gömme Rezervuar Montajı"},
                {"nl": "Strak betegeld toilet", "en": "Sleek tiled toilet", "tr": "Fayans Kaplı Tuvalet"},
                {"nl": "Toilet met nisverlichting", "en": "Toilet with niche lighting", "tr": "Niş Aydınlatmalı Tuvalet"}
            ],
            "descriptions": [
                {"nl": "Geberit inbouwsysteem met moderne hangende pot en fonteintje.", "en": "Geberit built-in system with modern wall-hung toilet and small basin.", "tr": "Geberit gömme rezervuar, asma klozet ve mini lavabo kurulumu."},
                {"nl": "Toiletruimte volledig gerenoveerd inclusief nisverlichting.", "en": "Toilet room completely renovated including niche lighting.", "tr": "Niş aydınlatma dahil komple yenilenmiş tuvalet alanı."},
                {"nl": "Compact toilet strak afgewerkt met grote tegels.", "en": "Compact toilet cleanly finished with large tiles.", "tr": "Büyük ebatlı fayanslar ile temizce bitirilmiş küçük tuvalet."}
            ]
        },
        "gipsplaat": {
            "titles": [
                {"nl": "Metal-stud scheidingswand", "en": "Metal stud partition wall", "tr": "Metal İskeletli Bölme Duvar"},
                {"nl": "Gipsplaten plafond", "en": "Gypsum board ceiling", "tr": "Alçıpan Asma Tavan"},
                {"nl": "Voorzetwand plaatsen", "en": "Installing drywall lining", "tr": "Metal Konstrüksiyon Duvar Yapımı"},
                {"nl": "Gipsplaat isolatie", "en": "Drywall insulation", "tr": "Alçıpan Arası Isı/Ses Yalıtımı"},
                {"nl": "Strak stucwerk wand", "en": "Smooth plastered wall", "tr": "Pürüzsüz Alçı Sıva Uygulaması"}
            ],
            "descriptions": [
                {"nl": "Opbouw van metalen profielen met steenwol isolatie en gipsplaten.", "en": "Construction of metal profiles with rockwool insulation and drywalls.", "tr": "Taş yünü yalıtımlı metal profiller ve alçıpan levha montajı."},
                {"nl": "Glad afgewerkte wanden gereed voor sauswerk.", "en": "Smoothly finished walls ready for painting.", "tr": "Boya öncesi pürüzsüz hale getirilmiş alçı sıvalı duvarlar."},
                {"nl": "Plafondverlaging met gipsplaten inclusief spotjes voorbereiding.", "en": "Ceiling lowering with gypsum boards including spotlight prep.", "tr": "Spot ışık hazırlıklı alçıpan asma tavan yapımı."}
            ]
        },
        "riolering": {
            "titles": [
                {"nl": "Loodgieterswerk & leidingen", "en": "Plumbing & pipes", "tr": "Sıhhi Tesisat & Boru Döşeme"},
                {"nl": "Nieuwe waterleidingen", "en": "New water lines", "tr": "Yeni Temiz Su Hattı"},
                {"nl": "Riolering afvoerbuis", "en": "Sewer drainage pipe", "tr": "Kanalizasyon Gider Borusu"},
                {"nl": "Leidingen verleggen", "en": "Rerouting pipework", "tr": "Tesisat Hattı Taşıma"},
                {"nl": "Professioneel perswerk", "en": "Professional pipe pressing", "tr": "Profesyonel Boru Sıkma/Presleme"}
            ],
            "descriptions": [
                {"nl": "Aanleg en testen van nieuwe kunststof/koperen leidingen.", "en": "Installation and testing of new plastic/copper pipework.", "tr": "Yeni nesil plastik veya bakır tesisat borularının döşenmesi ve testi."},
                {"nl": "Riolering afvoer onder de betonvloer vakkundig vernieuwd.", "en": "Sewer drainage under concrete floor professionally renewed.", "tr": "Beton zemin altındaki kanalizasyon giderlerinin profesyonel yenilenmesi."},
                {"nl": "Lekvrije aansluitingen met kwalitatief hoogwaardig perssysteem.", "en": "Leak-free connections with high-quality pressing system.", "tr": "Yüksek kaliteli presleme sistemiyle sızdırmaz boru bağlantıları."}
            ]
        }
    }

    # Map target filenames to their default categories
    filename_categories = {
        "drywall_before.jpg": "gipsplaat",
        "tiling_before.jpg": "badkamer",
        "bathroom_after_1.jpg": "badkamer",
        "toilet_after.jpg": "toilet",
        "toilet_before.jpg": "toilet",
        "bathroom_before_1.jpg": "badkamer",
        "bathroom_after_2.jpg": "badkamer",
        "toilet_modern.jpg": "toilet",
        "tiling_after.jpg": "badkamer",
        "drywall_after.jpg": "gipsplaat",
        "bathroom_luxury.jpg": "badkamer",
        "bathroom_before_2.jpg": "badkamer",
        "plumbing_rough.jpg": "riolering",
        "tiling_finished.jpg": "badkamer",
        "bathroom_sink.jpg": "badkamer"
    }

    projects_list = []
    max_size = 1200
    
    general_photo_counter = 0

    for idx, src_filename in enumerate(files):
        src_path = os.path.join(photo_dir, src_filename)
        
        # Decide output name and category
        if idx in mapping:
            target_name = mapping[idx]
            category = filename_categories[target_name]
        else:
            target_name = f"gal_{general_photo_counter}.jpg"
            # Distribute general photos round-robin among the 4 categories
            categories_list = ["badkamer", "toilet", "gipsplaat", "riolering"]
            category = categories_list[general_photo_counter % len(categories_list)]
            general_photo_counter += 1
            
        dest_path = os.path.join(output_dir, target_name)
        
        # Select title and desc from pool based on index to ensure variety
        titles_pool = content_pools[category]["titles"]
        descs_pool = content_pools[category]["descriptions"]
        
        title = titles_pool[idx % len(titles_pool)]
        desc = descs_pool[idx % len(descs_pool)]
        
        # For mapped before/after, customize the title/desc slightly
        if "before" in target_name:
            title = {
                "nl": f"{title['nl']} (Voor)",
                "en": f"{title['en']} (Before)",
                "tr": f"{title['tr']} (Öncesi)"
            }
            desc = {
                "nl": f"Sloopfase en voorbereiding van: {desc['nl'].lower()}",
                "en": f"Demolition phase and preparation of: {desc['en'].lower()}",
                "tr": f"Yıkım aşaması ve hazırlık çalışması: {desc['tr'].lower()}"
            }
        
        # Process and optimize image
        try:
            with Image.open(src_path) as img:
                # Transpose EXIF orientation
                try:
                    img = ImageOps.exif_transpose(img)
                except Exception:
                    pass
                
                # Convert to RGB if needed
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
                
                # Save optimized JPEG
                img.save(dest_path, "JPEG", quality=82, optimize=True)
                print(f"Processed #{idx} ({src_filename}) -> {target_name}")
                
                # Add to JSON list
                projects_list.append({
                    "id": idx,
                    "image": f"projects/{target_name}",
                    "category": category,
                    "title": title,
                    "desc": desc
                })
                
        except Exception as e:
            print(f"Error processing #{idx} ({src_filename}): {e}")
            
    # Write JSON database
    json_path = "/Users/vedat/Desktop/der-in infra /projects.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(projects_list, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(projects_list)} projects to {json_path}")

if __name__ == "__main__":
    process_images()
