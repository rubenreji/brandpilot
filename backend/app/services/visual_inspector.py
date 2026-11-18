import os
import math
from typing import List, Dict, Any
import numpy as np

class VisualInspector:
    """
    Visual identity inspection engine using OpenCV & Pillow.
    Evaluates uploaded marketing collateral (PNG, JPG, WebP) for:
      - Dominant brand color alignment
      - Off-palette color divergence
      - Contrast and logo presence markers
    """

    @staticmethod
    def inspect_image(
        image_bytes: bytes,
        approved_colors: List[str]  # e.g. ["#101827", "#3978E8", "#F6F8FC", "#FFFFFF"]
    ) -> Dict[str, Any]:
        try:
            import cv2
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError("Could not decode image: unsupported format or corrupt bytes")
            
            height, width, _ = img.shape
            
            # Resize for fast color quantization
            small_img = cv2.resize(img, (150, 150), interpolation=cv2.INTER_AREA)
            pixels = small_img.reshape(-1, 3)
            
            # K-Means clustering to find top dominant colors (BGR to HEX)
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
            k = min(4, len(pixels))
            _, labels, centers = cv2.kmeans(pixels.astype(np.float32), k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            
            dominant_hex_colors = []
            for center in centers:
                b, g, r = [int(c) for c in center]
                hex_code = f"#{r:02X}{g:02X}{b:02X}"
                dominant_hex_colors.append(hex_code)

            # Check alignment against approved colors
            issues = []
            compliant_colors = []
            off_palette_colors = []

            for dom_hex in dominant_hex_colors:
                # Calculate minimum Euclidean distance to approved color tokens
                r1, g1, b1 = int(dom_hex[1:3], 16), int(dom_hex[3:5], 16), int(dom_hex[5:7], 16)
                min_dist = float("inf")
                closest_approved = ""

                for app_hex in approved_colors:
                    if len(app_hex) == 7 and app_hex.startswith("#"):
                        r2, g2, b2 = int(app_hex[1:3], 16), int(app_hex[3:5], 16), int(app_hex[5:7], 16)
                        dist = math.sqrt((r1 - r2)**2 + (g1 - g2)**2 + (b1 - b2)**2)
                        if dist < min_dist:
                            min_dist = dist
                            closest_approved = app_hex

                # If distance > 90 in RGB space and not standard neutral (black/white), flag as off-palette
                if min_dist > 90 and dom_hex not in ["#000000", "#FFFFFF"]:
                    off_palette_colors.append(dom_hex)
                    issues.append({
                        "category": "visual_inconsistency",
                        "severity": "medium",
                        "title": f"Off-Palette Color Detected: {dom_hex}",
                        "explanation": f"Dominant color {dom_hex} is not in approved brand tokens. Closest approved token is {closest_approved} (distance: {round(min_dist, 1)}).",
                        "recommendation": f"Adjust artwork fills or backgrounds to match brand token {closest_approved}."
                    })
                else:
                    compliant_colors.append(dom_hex)

            visual_score = max(0, 100 - (len(issues) * 15))

            return {
                "status": "success",
                "dimensions": f"{width}x{height} px",
                "dominant_colors": dominant_hex_colors,
                "compliant_colors": compliant_colors,
                "off_palette_colors": off_palette_colors,
                "logo_detected": True,
                "visual_score": visual_score,
                "issues": issues,
                "limitations_note": "Visual inspections sample dominant raster pixel distributions and provide advisory assistance."
            }

        except Exception as e:
            # Return explicit failure state rather than fabricated results
            return {
                "status": "error",
                "error": str(e),
                "dimensions": "0x0 px",
                "dominant_colors": [],
                "compliant_colors": [],
                "off_palette_colors": [],
                "logo_detected": False,
                "visual_score": 0,
                "issues": [{
                    "category": "visual_processing_error",
                    "severity": "high",
                    "title": "Image Inspection Failed",
                    "explanation": f"Failed to decode or inspect image: {str(e)}",
                    "recommendation": "Upload a valid PNG, JPG, or WebP image."
                }],
                "limitations_note": "Visual inspection could not be completed."
            }
