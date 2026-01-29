export const RESTORATION_CONFIG = {
  "version": "1.0",
  "task": "image_edit",
  "caption": "Phục chế & nâng cấp ảnh cũ – giữ background gốc, màu điện ảnh, chuẩn Phase One XF IQ4 150MP",
  "notes": "Biến ảnh cũ (kể cả ảnh chụp lại) thành ảnh màu hiện đại, sạch tuyệt đối, giữ background gốc nhưng nâng cấp đẳng cấp như chụp mới. Ưu tiên bảo toàn danh tính và pose.",
  "input_image": "REPLACE_WITH_IMAGE_ID_OR_PATH",
  "preprocess": {
    "detect_and_isolate_original_photo": true,
    "auto_crop_photo_edges": true,
    "clean_edges": true,
    "remove_hands_or_objects": true,
    "perspective_correction": true,
    "flatten_page_curvature": true,
    "glare_reduction": "strict",
    "reflection_removal": "strict",
    "specular_highlight_fix": true
  },
  "camera_emulation": {
    "brand_model": "Phase One XF IQ4 150MP",
    "lens": "Schneider Kreuznach 80mm LS f/2.8",
    "medium_format": true,
    "look": "ultimate sharpness, maximum dynamic range, medium format 3D pop, cinematic rendering"
  },
  "composition": {
    "framing": "three-quarter body (from mid-thigh up)",
    "orientation": "portrait",
    "crop_policy": "do_not_crop_face_or_hands",
    "keep_pose": true,
    "zoom": "slight zoom-out for wider context"
  },
  "subject_constraints": {
    "keep_identity": true,
    "lock_features": ["eyes","nose","lips","eyebrows","jawline","face_shape","ears","hairline"],
    "expression_policy": "preserve_original"
  },
  "retouching": {
    "skin": {
      "tone": "realistic warm neutral",
      "finish": "radiant but detailed",
      "texture": "retain fine pores; avoid plastic look",
      "blemishes": "remove completely",
      "luminosity_balance": "uniform subtle glow",
      "color_uniformity": "fix uneven tones"
    },
    "hair": { "finish": "clean, neat, natural gloss", "flyaways": "reduce but keep natural strands" },
    "eyes": {
      "iris_color": "natural brown/gray",
      "whites_desaturation": 0.1,
      "iris_clarity": 0.2,
      "avoid_overwhitening": true,
      "avoid_exaggeration": true
    },
    "teeth": { "natural_whiten": 0.08, "avoid_pure_white": true },
    "clothing": {
      "fabric_look": "premium, fine weave, crisp edges",
      "wrinkle_reduction": "moderate",
      "texture_enhancement": 0.25
    },
    "repair_cracks": "strict",
    "remove_dust_scratches": "strict",
    "remove_stains": "strict",
    "remove_folds": true,
    "restore_faded_details": true
  },
  "colorization": {
    "apply_to": "entire_photo",
    "style": "cinematic, natural, true-to-life",
    "skin_tone_accuracy": "very_high",
    "background_colorization": "full, layered, realistic",
    "clothing_colorization": "faithful but premium",
    "avoid_exaggeration": true
  },
  "background": {
    "policy": "preserve_and_enhance",
    "keep_original": true,
    "enhancement": {
      "colorize": "natural, true-to-life, cinematic color grading",
      "restore_damage": true,
      "texture_cleanup": "remove paper grain and speckles completely",
      "add_depth": "studio gradient with layered tones and soft atmospheric haze",
      "contrast_boost": "medium-high with soft roll-off",
      "dynamic_range": "expanded like medium format",
      "lighting_match": true
    },
    "remove_external_objects": true,
    "banding_fix_on_background": true
  },
  "color_tone": {
    "overall": "natural, true-to-life",
    "saturation": "balanced vivid",
    "contrast": "medium with cinematic roll-off",
    "vibrance": 0.2,
    "color_restoration": "revive faded colors, unify uneven tones, remove discoloration completely",
    "auto_tone_balance": "strict",
    "auto_contrast_balance": true,
    "recolorize_consistently": true
  },
  "detail_sharpness": {
    "method": "edge-aware sharpening",
    "amount": 0.4,
    "radius": 0.9,
    "threshold": 0.02,
    "noise_reduction": { "luminance": 0.22, "chroma": 0.26, "preserve_details": 0.85 }
  },
  "clean_up": {
    "remove_noise": true,
    "remove_artifacts": true,
    "remove_scratches": "strict",
    "remove_dust": "strict",
    "remove_stains": "strict",
    "remove_folds": true,
    "deblotching": true,
    "desilvering_fix": true,
    "paper_texture_reduction": "strong",
    "restore_faded_colors": true,
    "reconstruct_missing_parts": "museum-grade",
    "reconstruct_missing_corners": true,
    "hallucination_control": "only realistic restoration, no fantasy",
    "heritage_preservation_strict": true,
    "archival_quality": "museum-grade restoration, pristine finish",
    "final_finish": "as new color studio photograph, indistinguishable from modern digital capture"
  },
  "controls": {
    "face_identity_lock": 0.96,
    "pose_lock": 0.95,
    "background_enhancement_strength": 0.9,
    "colorization_strength": 0.9,
    "restoration_strength": 0.95,
    "background_replace_strength": 0.0
  },
  "output": {
    "resolution": "12000x8000",
    "dpi": 600,
    "format": "TIFF",
    "color_space": "AdobeRGB 1998",
    "bit_depth": "16-bit",
    "background_alpha": "opaque"
  },
  "safety_bounds": {
    "do_not": [
      "change face geometry or identity",
      "change pose",
      "alter clothing style drastically",
      "add heavy makeup",
      "over-smooth or plastic skin",
      "over-sharpen halos",
      "exaggerated eye colors"
    ],
    "negative_prompt": [
      "paper grain",
      "speckles",
      "flat monochrome background",
      "hands holding photo",
      "photo edges visible",
      "glare spots",
      "crooked perspective",
      "color casts",
      "posterization/banding",
      "muddy blacks",
      "oversaturated skin",
      "cartoonish colors",
      "loss of fine texture",
      "visible damage marks"
    ]
  },
  "seed": 142857,
  "metadata": {
    "locale": "vi-VN",
    "creator": "fine art restoration specialist",
    "purpose": "phục chế & nâng cấp toàn ảnh lên chuẩn studio hiện đại, giữ nền gốc nhưng nâng cấp màu/độ sâu/dải sáng",
    "workflow": "studio emulation, medium format rendering, heritage restoration, cinematic color grading"
  }
};