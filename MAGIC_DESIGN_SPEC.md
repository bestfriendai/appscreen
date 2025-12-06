# Magic Design Specification
## How to Generate Professional App Store Screenshots Like theapplaunchpad.com

---

## Executive Summary

After analyzing 50+ screenshot sets from theapplaunchpad.com (market leader), this document outlines the key patterns, techniques, and implementation requirements to achieve similar professional quality through our Magic Design AI pipeline.

---

## MASTER DESIGN RULES

> **These rules are NON-NEGOTIABLE. Every generated screenshot MUST follow these rules.**

### RULE 1: DEVICE POSITIONING (THE GOLDEN RULE)
```
┌────────────────────────────────────────────────────────────────┐
│  DEVICE MUST BE IN THE LOWER 65-80% OF THE CANVAS              │
│                                                                │
│  ✓ CORRECT: device.y = 70-80 (percentage from top)             │
│  ✗ WRONG:   device.y = 40-60 (too high, overlaps with text)    │
│                                                                │
│  Device Y position formula:                                     │
│  y = 70 + (number_of_headline_words * 2)                       │
│  Max y = 82                                                    │
└────────────────────────────────────────────────────────────────┘
```

| Scenario | Device Y Position | Device Scale |
|----------|-------------------|--------------|
| 2-word headline | 70% | 62-65% |
| 3-word headline | 72% | 60-62% |
| 4-word headline | 75% | 58-60% |
| 5+ word headline | 78% | 55-58% |

### RULE 2: HEADLINE TEXT SPECIFICATIONS
```
┌────────────────────────────────────────────────────────────────┐
│  HEADLINE REQUIREMENTS                                          │
│                                                                │
│  Word count:     2-4 words (NEVER more than 6)                 │
│  Font weight:    600-800 (bold/extra-bold)                     │
│  Font size:      64-80px (scales with canvas)                  │
│  Line height:    0.90-0.98 (TIGHT, almost touching)            │
│  Letter spacing: -1 to -2px (slightly condensed)               │
│  Position X:     6-10% from left edge                          │
│  Position Y:     6-12% from top edge                           │
│  Arrangement:    STACKED (each word on its own line)           │
└────────────────────────────────────────────────────────────────┘
```

**Stacked Text Example:**
```
INVEST          ← Word 1, line 1
WITH            ← Word 2, line 2
CONFIDENCE      ← Word 3, line 3
```

### RULE 3: SUBHEADLINE SPECIFICATIONS
```
┌────────────────────────────────────────────────────────────────┐
│  SUBHEADLINE REQUIREMENTS                                       │
│                                                                │
│  Word count:     4-10 words                                    │
│  Font weight:    400-500 (regular/medium)                      │
│  Font size:      16-24px                                       │
│  Line height:    1.3-1.5                                       │
│  Color:          70-80% opacity of headline color              │
│  Margin top:     12-20px below headline                        │
│  Arrangement:    INLINE (single line or max 2 lines)           │
└────────────────────────────────────────────────────────────────┘
```

### RULE 4: TEXT-DEVICE SEPARATION (CRITICAL)
```
┌────────────────────────────────────────────────────────────────┐
│  MINIMUM GAP BETWEEN TEXT BOTTOM AND DEVICE TOP: 50px          │
│                                                                │
│  ┌─────────────────────────────────────┐                       │
│  │  HEADLINE                           │                       │
│  │  TEXT                               │                       │
│  │  HERE                               │                       │
│  │  subheadline here                   │                       │
│  └─────────────────────────────────────┘                       │
│                    ↕ MIN 50px GAP                              │
│         ┌─────────────────────┐                                │
│         │                     │                                │
│         │      DEVICE         │                                │
│         │                     │                                │
│         └─────────────────────┘                                │
│                                                                │
│  If gap < 50px → PUSH DEVICE DOWN or REDUCE HEADLINE SIZE      │
└────────────────────────────────────────────────────────────────┘
```

### RULE 5: COLOR CONTRAST REQUIREMENTS
```
┌────────────────────────────────────────────────────────────────┐
│  TEXT CONTRAST RATIO: Minimum 4.5:1 (WCAG AA)                  │
│                                                                │
│  DARK BACKGROUNDS (#000 - #444):                               │
│    Headline:    #FFFFFF (pure white)                           │
│    Subheadline: rgba(255,255,255,0.7)                          │
│                                                                │
│  LIGHT BACKGROUNDS (#DDD - #FFF):                              │
│    Headline:    #1A1A1A or #2D3436 (near black)                │
│    Subheadline: #636E72 or rgba(0,0,0,0.6)                     │
│                                                                │
│  VIBRANT BACKGROUNDS (saturated colors):                       │
│    Headline:    #FFFFFF (always white)                         │
│    Subheadline: rgba(255,255,255,0.8)                          │
└────────────────────────────────────────────────────────────────┘
```

### RULE 6: BACKGROUND COLOR RULES
```
┌────────────────────────────────────────────────────────────────┐
│  BACKGROUND REQUIREMENTS                                        │
│                                                                │
│  Type:           Solid color preferred (80% of pro screenshots)│
│  Saturation:     60-100% (bold, not muted)                     │
│  Gradients:      If used, max 2 colors, angle 135° or 180°     │
│  Never:          Pure white (#FFF) as solid background         │
│  Never:          Noisy/busy patterns                           │
│  Never:          Low-contrast pastels for dark app screenshots │
└────────────────────────────────────────────────────────────────┘
```

**Approved Background Colors by Category:**
| Category | Primary Colors | Avoid |
|----------|---------------|-------|
| Finance | `#1a1a2e` `#0f3460` `#00b894` | Bright red, orange |
| Wellness | `#667eea` `#764ba2` `#a29bfe` | Harsh neons |
| Shopping | `#ff7675` `#e17055` `#00cec9` | Dark grays |
| Kids | `#00b894` `#ffeaa7` `#74b9ff` | Black, dark colors |
| Social | `#a29bfe` `#fd79a8` `#ffeaa7` | Corporate blues |
| Entertainment | `#000000` `#e17055` `#2d3436` | Pastels |

### RULE 7: DEVICE SHADOW SPECIFICATIONS
```
┌────────────────────────────────────────────────────────────────┐
│  SHADOW REQUIREMENTS                                            │
│                                                                │
│  Blur:           40-80px                                       │
│  Opacity:        25-40%                                        │
│  Offset Y:       15-30px (shadow below device)                 │
│  Offset X:       0px (centered shadow)                         │
│  Color:          #000000 or background color darkened 50%      │
│                                                                │
│  ON LIGHT BACKGROUNDS:                                          │
│    Use higher opacity (35-40%)                                 │
│    Use larger blur (60-80px)                                   │
│                                                                │
│  ON DARK BACKGROUNDS:                                           │
│    Use lower opacity (25-30%)                                  │
│    Use smaller blur (40-60px)                                  │
└────────────────────────────────────────────────────────────────┘
```

### RULE 8: DEVICE SCALE AND ROTATION
```
┌────────────────────────────────────────────────────────────────┐
│  DEVICE SCALE                                                   │
│                                                                │
│  Minimum:        50% of canvas width                           │
│  Maximum:        70% of canvas width                           │
│  Optimal:        58-65%                                        │
│                                                                │
│  DEVICE ROTATION                                                │
│                                                                │
│  Range:          -15° to +15°                                  │
│  Hero screens:   0° (straight) or -5° (slight tilt)            │
│  Feature screens: -5° to -10° for dynamism                     │
│  Never:          More than ±15° (looks unstable)               │
└────────────────────────────────────────────────────────────────┘
```

### RULE 9: BADGE/WIDGET PLACEMENT
```
┌────────────────────────────────────────────────────────────────┐
│  BADGE PLACEMENT ZONES                                          │
│                                                                │
│  Zone A (Primary):   Bottom-left (x: 6-10%, y: 80-90%)         │
│  Zone B (Secondary): Top-right corner (for "App of Day" etc)   │
│  Zone C (Inline):    Below subheadline                         │
│                                                                │
│  BADGE LIMITS                                                   │
│                                                                │
│  Hero screenshot:    Max 2 badges                              │
│  Feature screenshot: Max 1 badge (or none)                     │
│  CTA screenshot:     Max 2 badges                              │
│                                                                │
│  BADGE STYLING                                                  │
│                                                                │
│  Background:   rgba(255,255,255,0.15) on dark                  │
│                rgba(0,0,0,0.08) on light                       │
│  Border radius: 16-24px (pill shape)                           │
│  Padding:       8-12px horizontal, 6-8px vertical              │
└────────────────────────────────────────────────────────────────┘
```

### RULE 10: CONSISTENCY ACROSS SCREENSHOT SET
```
┌────────────────────────────────────────────────────────────────┐
│  ALL 5-6 SCREENSHOTS MUST SHARE:                               │
│                                                                │
│  ✓ Same headline font family                                   │
│  ✓ Same font weight                                            │
│  ✓ Same text position (all top-left, or all top-center)        │
│  ✓ Same background color family (can vary shade)               │
│  ✓ Same device scale (±5% variance allowed)                    │
│  ✓ Same shadow treatment                                       │
│  ✓ Same badge style (pill vs square, etc)                      │
│                                                                │
│  ALLOWED VARIATIONS:                                            │
│                                                                │
│  ○ Background shade (same hue, different brightness)           │
│  ○ Device rotation (slight variations for dynamism)            │
│  ○ Badge presence (hero has badges, features may not)          │
│  ○ Headline word count (2-4 words, varies by content)          │
└────────────────────────────────────────────────────────────────┘
```

### RULE 11: MARGIN AND SAFE ZONES
```
┌────────────────────────────────────────────────────────────────┐
│  EDGE MARGINS (minimum distance from canvas edge)              │
│                                                                │
│  Text from left edge:    6% minimum                            │
│  Text from top edge:     5% minimum                            │
│  Device from edges:      5% minimum (device can bleed bottom)  │
│  Badges from edges:      5% minimum                            │
│                                                                │
│  SAFE ZONE VISUALIZATION:                                       │
│  ┌────────────────────────────────────────┐                    │
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│← 5% top margin       │
│  │░┌────────────────────────────────┐░░░│                      │
│  │░│                                │░░░│← Content area        │
│  │░│    SAFE ZONE FOR CONTENT       │░░░│                      │
│  │░│                                │░░░│                      │
│  │░│                                │░░░│                      │
│  │░└────────────────────────────────┘░░░│                      │
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│← Device can extend   │
│  └────────────────────────────────────────┘   past bottom       │
│   ↑                                    ↑                        │
│   6% left                              5% right                 │
└────────────────────────────────────────────────────────────────┘
```

### RULE 12: FONT LOADING AND FALLBACKS
```
┌────────────────────────────────────────────────────────────────┐
│  REQUIRED FONTS (must be loaded via Google Fonts)              │
│                                                                │
│  Headlines:                                                     │
│    - Space Grotesk (finance, productivity)                     │
│    - Montserrat (entertainment, sports)                        │
│    - Poppins (shopping, general)                               │
│    - Quicksand (wellness, soft)                                │
│    - Playfair Display (luxury, elegant)                        │
│    - Fredoka One (kids, playful)                               │
│    - DM Sans (social, friendly)                                │
│                                                                │
│  Subheadlines:                                                  │
│    - Inter (universal)                                         │
│    - DM Sans (friendly)                                        │
│    - Poppins (modern)                                          │
│                                                                │
│  FALLBACK CHAIN:                                                │
│    Primary → system-ui → -apple-system → sans-serif            │
└────────────────────────────────────────────────────────────────┘
```

### RULE 13: HEADLINE CONTENT RULES
```
┌────────────────────────────────────────────────────────────────┐
│  HEADLINE DO's:                                                 │
│                                                                │
│  ✓ Start with action verb: "Track", "Discover", "Build"        │
│  ✓ Focus on benefit, not feature                               │
│  ✓ Use power words: "Smart", "Easy", "Fast", "Free"            │
│  ✓ Create emotional connection                                 │
│  ✓ Be specific when possible: "1M+ users" not "Many users"     │
│                                                                │
│  HEADLINE DON'Ts:                                               │
│                                                                │
│  ✗ Don't use more than 6 words                                 │
│  ✗ Don't use full sentences with periods                       │
│  ✗ Don't use generic phrases like "Best App Ever"              │
│  ✗ Don't repeat the app name in every headline                 │
│  ✗ Don't use all caps for entire headline (1 word max)         │
└────────────────────────────────────────────────────────────────┘
```

### RULE 14: SCREENSHOT SEQUENCE STRUCTURE
```
┌────────────────────────────────────────────────────────────────┐
│  5-SCREENSHOT SEQUENCE FORMULA                                  │
│                                                                │
│  Screenshot 1: HERO                                             │
│    - App name or main value prop                               │
│    - 2-3 word headline                                         │
│    - Rating + download badges                                  │
│    - Device showing home/main screen                           │
│                                                                │
│  Screenshot 2: CORE FEATURE                                     │
│    - Primary feature headline                                  │
│    - 3-4 word headline                                         │
│    - No badges (clean focus)                                   │
│    - Device showing feature in use                             │
│                                                                │
│  Screenshot 3: SECONDARY FEATURE                                │
│    - Second key feature                                        │
│    - 3-4 word headline                                         │
│    - Optional subtle badge                                     │
│    - Device showing different screen                           │
│                                                                │
│  Screenshot 4: DIFFERENTIATOR                                   │
│    - What makes you unique                                     │
│    - 3-4 word headline                                         │
│    - Security/trust badge if applicable                        │
│    - Device can be tilted for dynamism                         │
│                                                                │
│  Screenshot 5: SOCIAL PROOF / CTA                               │
│    - Call to action or testimonial                             │
│    - 2-4 word headline                                         │
│    - Downloads + rating badges                                 │
│    - Device or press logos                                     │
└────────────────────────────────────────────────────────────────┘
```

### RULE 15: VALIDATION CHECKLIST (RUN BEFORE EXPORT)
```
┌────────────────────────────────────────────────────────────────┐
│  AUTOMATIC VALIDATION CHECKS                                    │
│                                                                │
│  □ Text-device overlap check (gap ≥ 50px)                      │
│  □ Contrast ratio check (≥ 4.5:1)                              │
│  □ Headline word count (2-6 words)                             │
│  □ Device in lower zone (y ≥ 65%)                              │
│  □ Margins respected (≥ 5% from edges)                         │
│  □ Font loaded successfully                                    │
│  □ Shadow applied to device                                    │
│  □ Set consistency (same fonts across all)                     │
│                                                                │
│  IF ANY CHECK FAILS:                                            │
│    → Auto-fix if possible                                      │
│    → Alert user if manual fix required                         │
│    → Block export until resolved                               │
└────────────────────────────────────────────────────────────────┘
```

---

## 1. TYPOGRAPHY PATTERNS

### 1.1 Headline Structure
The most successful screenshots use a **2-tier headline system**:

```
[MAIN HEADLINE]     → 2-4 words, BOLD, large (60-80px)
[Sub-headline]      → 4-8 words, regular weight, smaller (16-24px)
```

**Examples from analysis:**
- "fast market access" + "Empowering everyday people to invest"
- "WATCH INSTANTLY STREAM" + (no sub)
- "Discover Stylish Pieces" + "Downloaded by 3M+ Users"
- "Breath it, Live it" + "let stress go with ease"

### 1.2 Text Positioning Strategies

| Position | Usage | Device Position |
|----------|-------|-----------------|
| **Top-Left Stack** | Most common, 60% of examples | Device bottom-right |
| **Top-Center** | Clean/minimal apps | Device centered-bottom |
| **Split (text left, device right)** | Hero screenshots | Side-by-side layout |
| **Overlay on device** | Bold statements | Device centered |

### 1.3 Font Pairing Recommendations

| App Category | Primary Font | Style |
|--------------|--------------|-------|
| Finance/Crypto | Space Grotesk, Inter | Clean, trustworthy |
| Wellness/Health | Quicksand, Poppins | Soft, approachable |
| Productivity | Montserrat, SF Pro | Professional, modern |
| Entertainment | Playfair Display, Bold Sans | Dramatic, engaging |
| Kids/Education | Fredoka, Comic Neue | Playful, friendly |
| Fashion/Beauty | Cormorant, Didot | Elegant, sophisticated |
| Social | DM Sans, Circular | Friendly, contemporary |

### 1.4 Text Treatments

**Must-implement effects:**
1. **Line-height compression** - Headlines with tight line spacing (0.9-1.0)
2. **Mixed weights in same headline** - "Know your **money**"
3. **Stacked word arrangements** - Words on separate lines, left-aligned
4. **Accent colors on keywords** - One word in different color
5. **Underlines/strikethroughs** - Decorative text effects

---

## 2. LAYOUT ARCHITECTURE

### 2.1 The Golden Layout Formula

```
┌─────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← 25-35% for headline area
│  ░░ HEADLINE ZONE ░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░ │
├─────────────────────────────┤
│                             │
│      ┌─────────────┐        │  ← 65-75% for device
│      │             │        │
│      │   DEVICE    │        │
│      │             │        │
│      │             │        │
│      └─────────────┘        │
│                             │
└─────────────────────────────┘
```

### 2.2 Device Positioning Presets

| Layout Name | Scale | X | Y | Rotation | Use Case |
|-------------|-------|---|---|----------|----------|
| **Hero Center** | 62% | 50 | 72 | 0° | First screenshot |
| **Classic Top-Text** | 58% | 50 | 75 | 0° | Feature screens |
| **Dynamic Tilt** | 60% | 55 | 70 | -8° | Engagement shots |
| **Perspective Float** | 65% | 52 | 68 | -12° | Premium feel |
| **Side Showcase** | 55% | 65 | 70 | 5° | Text-heavy layouts |
| **Full Bleed** | 85% | 50 | 60 | 0° | Immersive content |

### 2.3 Multi-Screenshot Consistency

**Critical rule:** All 5-6 screenshots should feel like they belong together:
- Same background color family (variations in shade allowed)
- Same headline font throughout
- Same device positioning style
- Consistent shadow treatment
- Progressive story flow

---

## 3. COLOR STRATEGY

### 3.1 Background Color Selection by Category

| Category | Primary Palette | Mood |
|----------|-----------------|------|
| **Finance** | `#1a1a2e`, `#16213e`, `#0f3460` | Trust, stability |
| **Finance Alt** | `#00b894`, `#00cec9`, `#0984e3` | Growth, success |
| **Wellness** | `#667eea`, `#764ba2`, `#f093fb` | Calm, spiritual |
| **Wellness Alt** | `#a29bfe`, `#dfe6e9`, `#ffeaa7` | Soft, peaceful |
| **Productivity** | `#2d3436`, `#636e72`, `#b2bec3` | Focus, minimal |
| **Entertainment** | `#e17055`, `#fdcb6e`, `#00b894` | Fun, vibrant |
| **Social** | `#fd79a8`, `#a29bfe`, `#74b9ff` | Friendly, warm |
| **E-commerce** | `#ff7675`, `#fab1a0`, `#ffeaa7` | Action, urgency |
| **Kids** | `#55efc4`, `#81ecec`, `#ffeaa7` | Playful, bright |

### 3.2 Color Flow Across Screenshots

**Pattern 1: Monochromatic Progression**
```
Screen 1: #667eea (base)
Screen 2: #764ba2 (shift)
Screen 3: #8e7cc3 (blend)
Screen 4: #a29bfe (lighter)
Screen 5: #667eea (return to base)
```

**Pattern 2: Complementary Pairs**
```
Screen 1: Purple background
Screen 2: Purple background
Screen 3: Gold/Yellow accent
Screen 4: Purple background
Screen 5: Purple + Gold combined
```

**Pattern 3: Same Color, Different Device Screenshots**
```
All screens: Same background
Variation: Different app screens shown
```

### 3.3 Text Color Rules

| Background Type | Headline Color | Sub-text Color |
|-----------------|----------------|----------------|
| Dark (`#000`-`#333`) | `#ffffff` | `#b0b0b0` |
| Medium (`#444`-`#888`) | `#ffffff` | `#e0e0e0` |
| Light (`#eee`-`#fff`) | `#1a1a1a` | `#666666` |
| Vibrant colors | `#ffffff` | `rgba(255,255,255,0.8)` |
| Pastel colors | `#2d2d2d` | `#555555` |

---

## 4. DECORATIVE ELEMENTS (WIDGETS)

### 4.1 Social Proof Badges

**Must-have badges:**
```
┌──────────────────┐
│ ⭐ 4.8 Rating    │  ← App Store rating
└──────────────────┘

┌──────────────────┐
│ 📱 1M+ Downloads │  ← Download count
└──────────────────┘

┌──────────────────┐
│ 🏆 App of the    │  ← Apple feature
│    Day           │
└──────────────────┘

┌──────────────────┐
│ ✨ Editor's      │  ← Editorial pick
│    Choice        │
└──────────────────┘
```

### 4.2 Trust Indicators

**Press mentions (logo badges):**
- Forbes
- TechCrunch
- Business Insider
- VentureBeat
- Vogue/Elle (for fashion apps)

**Format:** Small logos in a row, usually at bottom of first screenshot

### 4.3 Decorative Shapes

| Shape | Usage | Position |
|-------|-------|----------|
| **Circles/Blobs** | Soften corners, add depth | Behind device, corners |
| **Stars/Sparkles** | Highlight features | Near headlines |
| **Arrows/Lines** | Direct attention | Pointing to features |
| **Geometric patterns** | Modern feel | Background texture |
| **Hand-drawn squiggles** | Playful apps | Around text |

### 4.4 Lifestyle Elements

**Human presence options:**
1. **Hands holding device** - Most impactful, adds realism
2. **Person using app** - Shows context of use
3. **Illustrated characters** - For playful/kids apps
4. **Silhouettes** - Subtle human presence

---

## 5. SCREENSHOT STORY FLOW

### 5.1 The 5-Screenshot Formula

```
Screenshot 1: HERO
├── App name/logo
├── Main value proposition (2-4 words)
├── Social proof badge
└── Device showing home screen

Screenshot 2: CORE FEATURE
├── Feature headline
├── Brief benefit description
└── Device showing feature in action

Screenshot 3: SECONDARY FEATURE
├── Another feature headline
├── Benefit statement
└── Device showing different screen

Screenshot 4: DIFFERENTIATOR
├── What makes you unique
├── Competitive advantage
└── Device showing proof

Screenshot 5: CALL TO ACTION / SOCIAL PROOF
├── Download CTA or testimonial
├── Press mentions / ratings
└── Device or lifestyle image
```

### 5.2 Headline Progression Examples

**Finance App:**
1. "Invest with confidence"
2. "Track market highs"
3. "Analyze patterns"
4. "Discover all-time highs"
5. "Join 1M+ investors"

**Wellness App:**
1. "Find Your Balance"
2. "Monitor Your Meals"
3. "Achieve Your Goals"
4. "Balance Your Life"
5. "Start Your Journey"

**E-commerce App:**
1. "Discover New Arrivals"
2. "Find Products You'll Love"
3. "Best Quality Brands"
4. "Shop Your Favorites"
5. "Trending Now"

---

## 6. BACKEND AI PIPELINE ARCHITECTURE

### 6.1 Complete Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    MAGIC DESIGN PIPELINE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INPUT: User's app screenshots + optional app name/description   │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ STAGE 1: SCREENSHOT ANALYSIS                             │    │
│  │ ├── Extract dominant colors from each screenshot         │    │
│  │ ├── Detect UI patterns (lists, grids, cards, etc.)       │    │
│  │ ├── Identify app category via AI vision                  │    │
│  │ ├── Extract text/labels from screenshots                 │    │
│  │ └── Output: AppAnalysis object                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ STAGE 2: CATEGORY CLASSIFICATION                         │    │
│  │ ├── Map detected features to category                    │    │
│  │ ├── Determine app vibe (professional, playful, etc.)     │    │
│  │ ├── Select style profile from presets                    │    │
│  │ └── Output: CategoryProfile object                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ STAGE 3: TEMPLATE SELECTION                              │    │
│  │ ├── Match category to template family                    │    │
│  │ ├── Select 5 templates for screenshot sequence           │    │
│  │ ├── Apply color extraction to customize templates        │    │
│  │ └── Output: TemplateSet (5 coordinated templates)        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ STAGE 4: HEADLINE GENERATION                             │    │
│  │ ├── Generate story flow based on category                │    │
│  │ ├── Create 5 headlines using AI (GPT/Claude/Gemini)      │    │
│  │ ├── Ensure progression and narrative coherence           │    │
│  │ └── Output: HeadlineSet (5 headlines + subheadlines)     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ STAGE 5: LAYOUT APPLICATION                              │    │
│  │ ├── Apply device positioning from templates              │    │
│  │ ├── Position text elements (headline, sub, badges)       │    │
│  │ ├── Add decorative elements (shapes, icons)              │    │
│  │ └── Output: LayoutConfig for each screenshot             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ STAGE 6: WIDGET PLACEMENT                                │    │
│  │ ├── Add social proof badges (rating, downloads)          │    │
│  │ ├── Position trust indicators                            │    │
│  │ ├── Add decorative shapes/blobs                          │    │
│  │ └── Output: WidgetConfig for each screenshot             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ STAGE 7: RENDER & POLISH                                 │    │
│  │ ├── Render all 5 screenshots to canvas                   │    │
│  │ ├── Apply shadows, effects, refinements                  │    │
│  │ ├── Ensure visual consistency across set                 │    │
│  │ └── Output: 5 final screenshot images                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  OUTPUT: Complete set of professional App Store screenshots      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Core Algorithm Implementation

```javascript
/**
 * MAGIC DESIGN - Main Entry Point
 * This is the core algorithm that produces professional screenshots
 */
async function magicDesignPipeline(screenshots, options = {}) {

    // ═══════════════════════════════════════════════════════════
    // STAGE 1: Analyze Screenshots
    // ═══════════════════════════════════════════════════════════
    const analysis = await analyzeScreenshots(screenshots);
    /*
     * analysis = {
     *   dominantColors: ['#1a1a2e', '#4a90d9', '#ffffff'],
     *   detectedCategory: 'finance',
     *   appVibe: 'professional',
     *   uiPatterns: ['dashboard', 'charts', 'lists'],
     *   extractedText: ['Portfolio', 'Transactions', '$1,234'],
     *   brightness: 'dark', // or 'light'
     *   complexity: 'medium'
     * }
     */

    // ═══════════════════════════════════════════════════════════
    // STAGE 2: Get Category Profile
    // ═══════════════════════════════════════════════════════════
    const categoryProfile = getCategoryProfile(analysis.detectedCategory);
    /*
     * categoryProfile = {
     *   category: 'finance',
     *   palettes: [
     *     { name: 'trust', colors: ['#1a1a2e', '#16213e', '#0f3460'] },
     *     { name: 'growth', colors: ['#00b894', '#00cec9', '#0984e3'] }
     *   ],
     *   fonts: { primary: 'Space Grotesk', secondary: 'Inter' },
     *   headlineStyle: 'professional',
     *   layoutPreference: 'classic',
     *   badges: ['rating', 'users', 'security'],
     *   storyFlow: 'journey'
     * }
     */

    // ═══════════════════════════════════════════════════════════
    // STAGE 3: Select & Customize Templates
    // ═══════════════════════════════════════════════════════════
    const templateSet = selectTemplates(categoryProfile, analysis);
    /*
     * templateSet = [
     *   { id: 'finance-hero', slot: 1, ... },
     *   { id: 'finance-feature-1', slot: 2, ... },
     *   { id: 'finance-feature-2', slot: 3, ... },
     *   { id: 'finance-differentiator', slot: 4, ... },
     *   { id: 'finance-cta', slot: 5, ... }
     * ]
     */

    // Customize colors based on app's actual colors
    const customizedTemplates = customizeTemplateColors(
        templateSet,
        analysis.dominantColors
    );

    // ═══════════════════════════════════════════════════════════
    // STAGE 4: Generate Headlines
    // ═══════════════════════════════════════════════════════════
    const headlines = await generateHeadlines({
        category: analysis.detectedCategory,
        appName: options.appName,
        features: analysis.extractedText,
        storyFlow: categoryProfile.storyFlow,
        count: screenshots.length
    });
    /*
     * headlines = [
     *   { main: 'Invest with confidence', sub: 'Your money, simplified' },
     *   { main: 'Track every move', sub: 'Real-time market data' },
     *   { main: 'Analyze trends', sub: 'Smart insights daily' },
     *   { main: 'Grow your wealth', sub: 'Join 1M+ investors' },
     *   { main: 'Start today', sub: 'Free to download' }
     * ]
     */

    // ═══════════════════════════════════════════════════════════
    // STAGE 5: Apply Complete Configurations
    // ═══════════════════════════════════════════════════════════
    const finalConfigs = [];

    for (let i = 0; i < screenshots.length; i++) {
        const template = customizedTemplates[i];
        const headline = headlines[i];

        finalConfigs.push({
            // Background
            background: {
                type: 'solid',
                color: template.backgroundColor,
                // OR gradient
                // type: 'gradient',
                // stops: template.gradientStops,
                // angle: template.gradientAngle
            },

            // Device Position
            device: {
                scale: template.device.scale,      // 55-70%
                x: template.device.x,              // 45-60 (% from left)
                y: template.device.y,              // 65-80 (% from top)
                rotation: template.device.rotation, // -15 to 15 degrees
                shadow: {
                    blur: 60,
                    opacity: 0.3,
                    offsetY: 20
                }
            },

            // Text Configuration
            text: {
                headline: {
                    content: headline.main,
                    font: categoryProfile.fonts.primary,
                    weight: 700,
                    size: template.text.headlineSize,  // 64-80px
                    color: template.text.headlineColor,
                    position: template.text.position,   // 'top-left', 'top-center'
                    x: template.text.x,                 // 5-15%
                    y: template.text.y,                 // 5-12%
                    lineHeight: 0.95,
                    letterSpacing: -1
                },
                subheadline: {
                    content: headline.sub,
                    font: categoryProfile.fonts.secondary,
                    weight: 400,
                    size: template.text.subSize,        // 18-24px
                    color: template.text.subColor,
                    marginTop: 12
                }
            },

            // Widgets/Badges
            widgets: template.widgets.map(w => ({
                type: w.type,        // 'rating', 'downloads', 'appOfDay'
                position: w.position, // { x: 5, y: 85 }
                style: w.style       // 'pill', 'badge', 'minimal'
            })),

            // Decorative Elements
            decorations: template.decorations || []
        });
    }

    // ═══════════════════════════════════════════════════════════
    // STAGE 6: Render All Screenshots
    // ═══════════════════════════════════════════════════════════
    for (let i = 0; i < screenshots.length; i++) {
        applyConfigToScreenshot(screenshots[i], finalConfigs[i]);
    }

    return { success: true, configs: finalConfigs };
}
```

### 6.3 Screenshot Analysis Algorithm

```javascript
/**
 * Analyze uploaded screenshots to determine app characteristics
 */
async function analyzeScreenshots(screenshots) {
    const results = {
        dominantColors: [],
        detectedCategory: null,
        appVibe: null,
        uiPatterns: [],
        extractedText: [],
        brightness: 'unknown'
    };

    // 1. Extract colors from all screenshots
    const allColors = [];
    for (const screenshot of screenshots) {
        const colors = await extractColorsFromImage(screenshot.image);
        allColors.push(...colors);
    }
    results.dominantColors = findMostCommonColors(allColors, 5);

    // 2. Determine brightness (affects text color choice)
    results.brightness = calculateAverageBrightness(results.dominantColors);

    // 3. Use AI to classify category and extract features
    const aiAnalysis = await callAIForAnalysis(screenshots[0].image);
    /*
     * AI Prompt: "Analyze this mobile app screenshot. Determine:
     * 1. App category (finance, wellness, social, ecommerce, etc.)
     * 2. App vibe (professional, playful, minimal, premium, etc.)
     * 3. Key UI elements visible (lists, cards, charts, etc.)
     * 4. Any visible text labels
     * Return as JSON."
     */

    results.detectedCategory = aiAnalysis.category;
    results.appVibe = aiAnalysis.vibe;
    results.uiPatterns = aiAnalysis.uiElements;
    results.extractedText = aiAnalysis.textLabels;

    return results;
}

/**
 * Extract dominant colors using canvas sampling
 */
function extractColorsFromImage(imageData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;

    const img = new Image();
    img.src = imageData;
    ctx.drawImage(img, 0, 0, 100, 100);

    const pixels = ctx.getImageData(0, 0, 100, 100).data;
    const colorBuckets = {};

    // Sample every 4th pixel for performance
    for (let i = 0; i < pixels.length; i += 16) {
        const r = Math.round(pixels[i] / 32) * 32;
        const g = Math.round(pixels[i+1] / 32) * 32;
        const b = Math.round(pixels[i+2] / 32) * 32;
        const key = `${r},${g},${b}`;
        colorBuckets[key] = (colorBuckets[key] || 0) + 1;
    }

    // Sort by frequency and return top colors
    return Object.entries(colorBuckets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return rgbToHex(r, g, b);
        });
}
```

### 6.4 Category Detection & Profile Selection

```javascript
/**
 * Category profiles with all styling defaults
 */
const CATEGORY_PROFILES = {
    finance: {
        id: 'finance',
        keywords: ['portfolio', 'invest', 'stocks', 'crypto', 'wallet', 'bank', 'money'],
        palettes: {
            dark: {
                backgrounds: ['#1a1a2e', '#16213e', '#0f3460', '#1e3a5f'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.7)',
                accent: '#00d9ff'
            },
            light: {
                backgrounds: ['#f8f9fa', '#e9ecef', '#dee2e6'],
                text: '#1a1a2e',
                subtext: '#495057',
                accent: '#0066ff'
            },
            vibrant: {
                backgrounds: ['#00b894', '#00cec9', '#0984e3'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.8)',
                accent: '#ffd32a'
            }
        },
        fonts: {
            primary: 'Space Grotesk',
            secondary: 'Inter',
            headlineWeight: 700,
            headlineSize: 72
        },
        layouts: ['hero-left', 'classic-center', 'feature-right'],
        storyFlow: 'journey',
        badges: ['rating', 'users', 'security'],
        decorations: ['subtle-gradient', 'geometric-lines']
    },

    wellness: {
        id: 'wellness',
        keywords: ['health', 'meditation', 'sleep', 'calm', 'fitness', 'yoga', 'mindful'],
        palettes: {
            calm: {
                backgrounds: ['#667eea', '#764ba2', '#a29bfe'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.8)',
                accent: '#ffeaa7'
            },
            soft: {
                backgrounds: ['#dfe6e9', '#b2bec3', '#a29bfe'],
                text: '#2d3436',
                subtext: '#636e72',
                accent: '#fd79a8'
            },
            nature: {
                backgrounds: ['#00b894', '#55efc4', '#81ecec'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.85)',
                accent: '#ffeaa7'
            }
        },
        fonts: {
            primary: 'Quicksand',
            secondary: 'Poppins',
            headlineWeight: 600,
            headlineSize: 68
        },
        layouts: ['hero-center', 'breathing-space', 'minimal'],
        storyFlow: 'transformation',
        badges: ['rating', 'featured', 'downloads'],
        decorations: ['organic-blobs', 'soft-gradients']
    },

    ecommerce: {
        id: 'ecommerce',
        keywords: ['shop', 'buy', 'cart', 'store', 'deals', 'sale', 'products'],
        palettes: {
            warm: {
                backgrounds: ['#ff7675', '#fd79a8', '#fab1a0'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.85)',
                accent: '#ffeaa7'
            },
            modern: {
                backgrounds: ['#2d3436', '#636e72', '#dfe6e9'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.7)',
                accent: '#ff7675'
            },
            fresh: {
                backgrounds: ['#00cec9', '#81ecec', '#74b9ff'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.85)',
                accent: '#ffeaa7'
            }
        },
        fonts: {
            primary: 'Poppins',
            secondary: 'DM Sans',
            headlineWeight: 700,
            headlineSize: 70
        },
        layouts: ['hero-lifestyle', 'product-focus', 'grid-showcase'],
        storyFlow: 'feature-showcase',
        badges: ['sale', 'rating', 'shipping'],
        decorations: ['price-tags', 'sparkles', 'circles']
    },

    social: {
        id: 'social',
        keywords: ['connect', 'chat', 'friends', 'share', 'post', 'message', 'dating'],
        palettes: {
            friendly: {
                backgrounds: ['#a29bfe', '#fd79a8', '#74b9ff'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.8)',
                accent: '#ffeaa7'
            },
            modern: {
                backgrounds: ['#2d3436', '#636e72', '#000000'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.7)',
                accent: '#0984e3'
            }
        },
        fonts: {
            primary: 'DM Sans',
            secondary: 'Inter',
            headlineWeight: 700,
            headlineSize: 68
        },
        layouts: ['hero-person', 'chat-showcase', 'community'],
        storyFlow: 'emotional',
        badges: ['users', 'rating', 'featured'],
        decorations: ['hearts', 'chat-bubbles', 'emojis']
    },

    kids: {
        id: 'kids',
        keywords: ['learn', 'play', 'kids', 'children', 'education', 'fun', 'games'],
        palettes: {
            playful: {
                backgrounds: ['#00b894', '#55efc4', '#ffeaa7', '#fd79a8'],
                text: '#2d3436',
                subtext: '#636e72',
                accent: '#e17055'
            },
            bright: {
                backgrounds: ['#0984e3', '#74b9ff', '#a29bfe'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.85)',
                accent: '#ffeaa7'
            }
        },
        fonts: {
            primary: 'Fredoka One',
            secondary: 'Quicksand',
            headlineWeight: 700,
            headlineSize: 64
        },
        layouts: ['hero-fun', 'character-showcase', 'achievement'],
        storyFlow: 'journey',
        badges: ['editors-choice', 'age-rating', 'downloads'],
        decorations: ['stars', 'confetti', 'characters']
    },

    entertainment: {
        id: 'entertainment',
        keywords: ['watch', 'stream', 'movies', 'music', 'video', 'podcast', 'tv'],
        palettes: {
            dark: {
                backgrounds: ['#000000', '#1a1a1a', '#2d3436'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.7)',
                accent: '#e17055'
            },
            vibrant: {
                backgrounds: ['#e17055', '#fdcb6e', '#00b894'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.85)',
                accent: '#ffffff'
            }
        },
        fonts: {
            primary: 'Montserrat',
            secondary: 'Inter',
            headlineWeight: 800,
            headlineSize: 74
        },
        layouts: ['hero-cinematic', 'content-grid', 'immersive'],
        storyFlow: 'feature-showcase',
        badges: ['rating', 'trending', 'new'],
        decorations: ['play-buttons', 'film-strips']
    },

    sports: {
        id: 'sports',
        keywords: ['sports', 'game', 'live', 'score', 'team', 'race', 'fitness'],
        palettes: {
            energetic: {
                backgrounds: ['#e17055', '#fdcb6e', '#ff7675'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.85)',
                accent: '#2d3436'
            },
            dark: {
                backgrounds: ['#2d3436', '#000000', '#1e272e'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.7)',
                accent: '#ff7675'
            }
        },
        fonts: {
            primary: 'Montserrat',
            secondary: 'Inter',
            headlineWeight: 800,
            headlineSize: 70
        },
        layouts: ['hero-action', 'stats-focus', 'live-feed'],
        storyFlow: 'journey',
        badges: ['live', 'users', 'rating'],
        decorations: ['action-lines', 'badges']
    },

    food: {
        id: 'food',
        keywords: ['food', 'delivery', 'restaurant', 'order', 'eat', 'recipe', 'cook'],
        palettes: {
            appetizing: {
                backgrounds: ['#e17055', '#fdcb6e', '#00b894'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.85)',
                accent: '#ffeaa7'
            },
            fresh: {
                backgrounds: ['#00b894', '#55efc4', '#81ecec'],
                text: '#ffffff',
                subtext: 'rgba(255,255,255,0.85)',
                accent: '#e17055'
            },
            lifestyle: {
                backgrounds: ['#dfe6e9', '#b2bec3', '#ffeaa7'],
                text: '#2d3436',
                subtext: '#636e72',
                accent: '#e17055'
            }
        },
        fonts: {
            primary: 'Poppins',
            secondary: 'DM Sans',
            headlineWeight: 700,
            headlineSize: 68
        },
        layouts: ['hero-lifestyle', 'food-showcase', 'order-flow'],
        storyFlow: 'journey',
        badges: ['rating', 'delivery-time', 'offers'],
        decorations: ['food-icons', 'organic-shapes']
    }
};

/**
 * Get category profile based on detected category
 */
function getCategoryProfile(categoryId) {
    return CATEGORY_PROFILES[categoryId] || CATEGORY_PROFILES.productivity;
}
```

---

## 7. PREMADE TEMPLATE SYSTEM

### 7.1 Template Structure Definition

```javascript
/**
 * Complete Template Definition
 * Each template is a fully-configured screenshot design
 */
const TEMPLATE_STRUCTURE = {
    // Unique identifier
    id: 'finance-dark-hero-01',

    // Display info
    name: 'Finance Dark Hero',
    category: 'finance',
    slot: 'hero',  // hero, feature, differentiator, cta

    // Preview for gallery
    preview: {
        thumbnail: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        tags: ['dark', 'professional', 'trust']
    },

    // ═══════════════════════════════════════════════════════════
    // BACKGROUND CONFIGURATION
    // ═══════════════════════════════════════════════════════════
    background: {
        type: 'solid',  // 'solid', 'gradient', 'image'
        color: '#1a1a2e',
        // For gradients:
        // gradient: {
        //     type: 'linear',
        //     angle: 135,
        //     stops: [
        //         { color: '#1a1a2e', position: 0 },
        //         { color: '#16213e', position: 100 }
        //     ]
        // }
    },

    // ═══════════════════════════════════════════════════════════
    // DEVICE CONFIGURATION
    // ═══════════════════════════════════════════════════════════
    device: {
        scale: 62,           // Percentage of canvas width
        position: {
            x: 50,           // Percentage from left (center = 50)
            y: 72            // Percentage from top (lower = bigger number)
        },
        rotation: 0,         // Degrees (-15 to 15)
        shadow: {
            enabled: true,
            blur: 60,
            opacity: 0.35,
            offsetX: 0,
            offsetY: 25,
            color: '#000000'
        },
        frame: {
            enabled: false,  // Device frame around screenshot
            type: 'iphone-15'
        }
    },

    // ═══════════════════════════════════════════════════════════
    // TEXT CONFIGURATION
    // ═══════════════════════════════════════════════════════════
    text: {
        headline: {
            // Position
            position: 'top-left',  // 'top-left', 'top-center', 'top-right', 'bottom'
            x: 8,                  // Percentage from edge
            y: 8,                  // Percentage from top
            maxWidth: 85,          // Percentage of canvas width

            // Styling
            font: 'Space Grotesk',
            weight: 700,
            size: 72,              // Base size in pixels (scales with canvas)
            lineHeight: 0.95,      // Tight for stacked words
            letterSpacing: -1,     // Slightly tighter
            color: '#ffffff',

            // Text arrangement
            arrangement: 'stacked', // 'stacked', 'inline', 'mixed'
            // For stacked: each word on new line
            // For inline: normal sentence
            // For mixed: main word large, rest smaller

            // Optional effects
            effects: {
                shadow: null,      // { blur: 10, color: 'rgba(0,0,0,0.3)', x: 2, y: 2 }
                highlight: null,   // { word: 1, color: '#ffd32a' } - highlight specific word
                underline: null    // { word: 2, color: '#ffffff', thickness: 3 }
            }
        },

        subheadline: {
            enabled: true,
            font: 'Inter',
            weight: 400,
            size: 20,
            lineHeight: 1.4,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 16,        // Space below headline
            maxWidth: 70          // Percentage of canvas width
        }
    },

    // ═══════════════════════════════════════════════════════════
    // WIDGETS/BADGES
    // ═══════════════════════════════════════════════════════════
    widgets: [
        {
            type: 'rating',
            style: 'pill',           // 'pill', 'badge', 'minimal', 'detailed'
            position: { x: 8, y: 88 }, // Percentage
            data: {
                rating: 4.8,
                showStars: true,
                showCount: false     // "4.8 (2.3K)"
            },
            colors: {
                background: 'rgba(255,255,255,0.15)',
                text: '#ffffff',
                stars: '#ffd32a'
            }
        },
        {
            type: 'downloads',
            style: 'badge',
            position: { x: 8, y: 78 },
            data: {
                count: '1M+',
                label: 'Downloads'
            },
            colors: {
                background: 'rgba(255,255,255,0.15)',
                text: '#ffffff'
            }
        }
    ],

    // ═══════════════════════════════════════════════════════════
    // DECORATIVE ELEMENTS
    // ═══════════════════════════════════════════════════════════
    decorations: [
        {
            type: 'blob',
            position: { x: 85, y: 15 },
            size: 120,
            color: 'rgba(102, 126, 234, 0.3)',
            blur: 40
        },
        {
            type: 'circle',
            position: { x: 10, y: 70 },
            size: 80,
            color: 'rgba(255, 255, 255, 0.05)',
            blur: 0
        }
    ],

    // ═══════════════════════════════════════════════════════════
    // HEADLINE SUGGESTIONS (for AI to pick from)
    // ═══════════════════════════════════════════════════════════
    headlineSuggestions: {
        patterns: [
            '{Action} with confidence',
            'Smart {noun} moves',
            '{Verb} your {noun}',
            'The {adjective} way to {verb}'
        ],
        examples: [
            'Invest with confidence',
            'Smart money moves',
            'Grow your wealth',
            'The smarter way to invest'
        ]
    }
};
```

### 7.2 Complete Premade Templates Library

```javascript
/**
 * PREMADE TEMPLATES - Ready to use professional designs
 * Organized by category, each with 5 templates for a complete set
 */

const PREMADE_TEMPLATES = {

    // ═══════════════════════════════════════════════════════════
    // FINANCE TEMPLATES
    // ═══════════════════════════════════════════════════════════
    finance: {
        dark: [
            {
                id: 'finance-dark-01',
                name: 'Trust Dark Hero',
                slot: 'hero',
                background: { type: 'solid', color: '#1a1a2e' },
                device: { scale: 62, position: { x: 50, y: 72 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Space Grotesk', weight: 700, size: 72,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: {
                        enabled: true, font: 'Inter', size: 18,
                        color: 'rgba(255,255,255,0.7)'
                    }
                },
                widgets: [
                    { type: 'rating', position: { x: 8, y: 85 }, style: 'pill' },
                    { type: 'appOfDay', position: { x: 8, y: 75 }, style: 'badge' }
                ],
                headlinePatterns: ['Invest with confidence', 'Fast market access', 'Smart money moves']
            },
            {
                id: 'finance-dark-02',
                name: 'Trust Dark Feature',
                slot: 'feature',
                background: { type: 'solid', color: '#16213e' },
                device: { scale: 58, position: { x: 52, y: 75 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Space Grotesk', weight: 700, size: 68,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Inter', size: 16, color: 'rgba(255,255,255,0.6)' }
                },
                widgets: [],
                headlinePatterns: ['Track every move', 'Real-time data', 'Market insights']
            },
            {
                id: 'finance-dark-03',
                name: 'Trust Dark Feature 2',
                slot: 'feature',
                background: { type: 'solid', color: '#0f3460' },
                device: { scale: 58, position: { x: 48, y: 75 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Space Grotesk', weight: 700, size: 68,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Inter', size: 16, color: 'rgba(255,255,255,0.6)' }
                },
                widgets: [],
                headlinePatterns: ['Analyze trends', 'Discover patterns', 'Smart analytics']
            },
            {
                id: 'finance-dark-04',
                name: 'Trust Dark Differentiator',
                slot: 'differentiator',
                background: { type: 'solid', color: '#1a1a2e' },
                device: { scale: 60, position: { x: 55, y: 72 }, rotation: -5 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Space Grotesk', weight: 700, size: 66,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Inter', size: 16, color: 'rgba(255,255,255,0.6)' }
                },
                widgets: [
                    { type: 'security', position: { x: 8, y: 80 }, style: 'badge' }
                ],
                headlinePatterns: ['Bank-level security', 'Your data protected', 'Secure & private']
            },
            {
                id: 'finance-dark-05',
                name: 'Trust Dark CTA',
                slot: 'cta',
                background: { type: 'solid', color: '#16213e' },
                device: { scale: 58, position: { x: 50, y: 75 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Space Grotesk', weight: 700, size: 70,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Inter', size: 18, color: 'rgba(255,255,255,0.7)' }
                },
                widgets: [
                    { type: 'downloads', position: { x: 8, y: 82 }, style: 'badge' },
                    { type: 'rating', position: { x: 8, y: 72 }, style: 'pill' }
                ],
                headlinePatterns: ['Join 1M+ investors', 'Start today', 'Get started free']
            }
        ],

        green: [
            {
                id: 'finance-green-01',
                name: 'Growth Green Hero',
                slot: 'hero',
                background: { type: 'gradient', angle: 135, stops: [
                    { color: '#00b894', position: 0 },
                    { color: '#00cec9', position: 100 }
                ]},
                device: { scale: 62, position: { x: 50, y: 70 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Montserrat', weight: 700, size: 70,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Inter', size: 18, color: 'rgba(255,255,255,0.85)' }
                },
                widgets: [
                    { type: 'rating', position: { x: 8, y: 85 }, style: 'pill' }
                ],
                headlinePatterns: ['Grow your wealth', 'Money made simple', 'Financial freedom']
            }
            // ... more green variations
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // WELLNESS TEMPLATES
    // ═══════════════════════════════════════════════════════════
    wellness: {
        purple: [
            {
                id: 'wellness-purple-01',
                name: 'Calm Purple Hero',
                slot: 'hero',
                background: { type: 'gradient', angle: 135, stops: [
                    { color: '#667eea', position: 0 },
                    { color: '#764ba2', position: 100 }
                ]},
                device: { scale: 60, position: { x: 50, y: 72 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 10,
                        font: 'Quicksand', weight: 600, size: 68,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Poppins', size: 18, color: 'rgba(255,255,255,0.8)' }
                },
                widgets: [
                    { type: 'rating', position: { x: 8, y: 85 }, style: 'pill' },
                    { type: 'featured', position: { x: 8, y: 75 }, style: 'badge', data: { text: 'App of the Day' } }
                ],
                decorations: [
                    { type: 'blob', position: { x: 80, y: 20 }, size: 150, color: 'rgba(255,255,255,0.1)' }
                ],
                headlinePatterns: ['Find your balance', 'Breathe deeply', 'Inner peace awaits']
            },
            {
                id: 'wellness-purple-02',
                name: 'Calm Purple Feature',
                slot: 'feature',
                background: { type: 'gradient', angle: 135, stops: [
                    { color: '#764ba2', position: 0 },
                    { color: '#a29bfe', position: 100 }
                ]},
                device: { scale: 58, position: { x: 50, y: 74 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 10,
                        font: 'Quicksand', weight: 600, size: 64,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Poppins', size: 16, color: 'rgba(255,255,255,0.75)' }
                },
                widgets: [],
                headlinePatterns: ['Sleep better', 'Daily meditation', 'Calm your mind']
            },
            // ... wellness-purple-03 through 05
        ],

        soft: [
            {
                id: 'wellness-soft-01',
                name: 'Soft Light Hero',
                slot: 'hero',
                background: { type: 'gradient', angle: 180, stops: [
                    { color: '#ffecd2', position: 0 },
                    { color: '#fcb69f', position: 100 }
                ]},
                device: { scale: 60, position: { x: 50, y: 72 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 10,
                        font: 'Playfair Display', weight: 700, size: 66,
                        color: '#2d3436', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Quicksand', size: 18, color: '#636e72' }
                },
                widgets: [
                    { type: 'rating', position: { x: 8, y: 85 }, style: 'minimal' }
                ],
                headlinePatterns: ['Nurture yourself', 'Gentle wellness', 'Self care daily']
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // E-COMMERCE TEMPLATES
    // ═══════════════════════════════════════════════════════════
    ecommerce: {
        coral: [
            {
                id: 'ecommerce-coral-01',
                name: 'Shop Coral Hero',
                slot: 'hero',
                background: { type: 'solid', color: '#ff7675' },
                device: { scale: 60, position: { x: 55, y: 70 }, rotation: -5 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Poppins', weight: 700, size: 68,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'DM Sans', size: 18, color: 'rgba(255,255,255,0.85)' }
                },
                widgets: [
                    { type: 'sale', position: { x: 75, y: 15 }, style: 'burst', data: { text: '50% OFF' } },
                    { type: 'rating', position: { x: 8, y: 85 }, style: 'pill' }
                ],
                decorations: [
                    { type: 'sparkle', position: { x: 85, y: 10 }, size: 30, color: '#ffeaa7' }
                ],
                headlinePatterns: ['Discover new arrivals', 'Shop the look', 'Style made easy']
            }
        ],

        lifestyle: [
            {
                id: 'ecommerce-lifestyle-01',
                name: 'Shop Lifestyle Hero',
                slot: 'hero',
                background: { type: 'image', overlay: 'rgba(0,0,0,0.3)' },
                device: { scale: 55, position: { x: 60, y: 68 }, rotation: 5 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Montserrat', weight: 700, size: 66,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'DM Sans', size: 16, color: 'rgba(255,255,255,0.8)' }
                },
                widgets: [
                    { type: 'press', position: { x: 8, y: 80 }, logos: ['vogue', 'elle', 'glamour'] }
                ],
                headlinePatterns: ['Fashion forward', 'Your style awaits', 'Curated for you']
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // ENTERTAINMENT TEMPLATES
    // ═══════════════════════════════════════════════════════════
    entertainment: {
        dark: [
            {
                id: 'entertainment-dark-01',
                name: 'Stream Dark Hero',
                slot: 'hero',
                background: { type: 'solid', color: '#000000' },
                device: { scale: 65, position: { x: 50, y: 68 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Montserrat', weight: 800, size: 74,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: false }
                },
                widgets: [
                    { type: 'trending', position: { x: 8, y: 80 }, style: 'badge' }
                ],
                headlinePatterns: ['Watch now', 'Stream everything', 'Binge worthy']
            }
        ],

        vibrant: [
            {
                id: 'entertainment-vibrant-01',
                name: 'Stream Vibrant Hero',
                slot: 'hero',
                background: { type: 'solid', color: '#e17055' },
                device: { scale: 62, position: { x: 50, y: 70 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Montserrat', weight: 800, size: 72,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Inter', size: 18, color: 'rgba(255,255,255,0.85)' }
                },
                widgets: [
                    { type: 'downloads', position: { x: 8, y: 82 }, style: 'badge' }
                ],
                headlinePatterns: ['Entertainment unlimited', 'Watch anywhere', 'Stream all day']
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // KIDS/EDUCATION TEMPLATES
    // ═══════════════════════════════════════════════════════════
    kids: {
        playful: [
            {
                id: 'kids-playful-01',
                name: 'Learn Playful Hero',
                slot: 'hero',
                background: { type: 'solid', color: '#00b894' },
                device: { scale: 58, position: { x: 55, y: 72 }, rotation: 5 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Fredoka One', weight: 400, size: 64,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Quicksand', size: 18, color: 'rgba(255,255,255,0.9)' }
                },
                widgets: [
                    { type: 'editorsChoice', position: { x: 8, y: 80 }, style: 'badge' },
                    { type: 'ageRating', position: { x: 75, y: 10 }, style: 'circle', data: { age: '4+' } }
                ],
                decorations: [
                    { type: 'star', position: { x: 85, y: 15 }, size: 40, color: '#ffeaa7' },
                    { type: 'confetti', positions: [[10, 60], [90, 40], [80, 80]] }
                ],
                headlinePatterns: ['Learn through play', 'Fun learning', 'Spark curiosity']
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // SPORTS TEMPLATES
    // ═══════════════════════════════════════════════════════════
    sports: {
        energetic: [
            {
                id: 'sports-energetic-01',
                name: 'Sports Energy Hero',
                slot: 'hero',
                background: { type: 'solid', color: '#e17055' },
                device: { scale: 62, position: { x: 50, y: 70 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Montserrat', weight: 800, size: 70,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Inter', size: 16, color: 'rgba(255,255,255,0.85)' }
                },
                widgets: [
                    { type: 'live', position: { x: 75, y: 10 }, style: 'pulse' },
                    { type: 'users', position: { x: 8, y: 82 }, style: 'badge', data: { count: '63M', label: 'active users' } }
                ],
                headlinePatterns: ['Watch live sports', 'Never miss a game', 'Live action now']
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // FOOD/DELIVERY TEMPLATES
    // ═══════════════════════════════════════════════════════════
    food: {
        fresh: [
            {
                id: 'food-fresh-01',
                name: 'Food Fresh Hero',
                slot: 'hero',
                background: { type: 'gradient', angle: 135, stops: [
                    { color: '#00b894', position: 0 },
                    { color: '#55efc4', position: 100 }
                ]},
                device: { scale: 58, position: { x: 55, y: 70 }, rotation: 5 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Poppins', weight: 700, size: 68,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'DM Sans', size: 18, color: 'rgba(255,255,255,0.85)' }
                },
                widgets: [
                    { type: 'deliveryTime', position: { x: 8, y: 80 }, style: 'pill', data: { time: '30 min' } },
                    { type: 'rating', position: { x: 8, y: 70 }, style: 'minimal' }
                ],
                headlinePatterns: ['Fresh delivered', 'Order in minutes', 'Cravings satisfied']
            }
        ],

        lifestyle: [
            {
                id: 'food-lifestyle-01',
                name: 'Food Lifestyle Hero',
                slot: 'hero',
                background: { type: 'lifestyle-photo', tint: 'warm' },
                device: { scale: 50, position: { x: 65, y: 65 }, rotation: -5 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 8,
                        font: 'Playfair Display', weight: 700, size: 64,
                        color: '#ffffff', arrangement: 'stacked',
                        shadow: { blur: 20, color: 'rgba(0,0,0,0.5)' }
                    },
                    subheadline: { enabled: true, font: 'DM Sans', size: 16, color: 'rgba(255,255,255,0.9)' }
                },
                widgets: [],
                headlinePatterns: ['Delicious delivered', 'Taste the difference', 'Good food fast']
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // SOCIAL/DATING TEMPLATES
    // ═══════════════════════════════════════════════════════════
    social: {
        friendly: [
            {
                id: 'social-friendly-01',
                name: 'Social Friendly Hero',
                slot: 'hero',
                background: { type: 'gradient', angle: 135, stops: [
                    { color: '#a29bfe', position: 0 },
                    { color: '#fd79a8', position: 100 }
                ]},
                device: { scale: 62, position: { x: 50, y: 70 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 10,
                        font: 'DM Sans', weight: 700, size: 68,
                        color: '#ffffff', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'Inter', size: 18, color: 'rgba(255,255,255,0.85)' }
                },
                widgets: [
                    { type: 'users', position: { x: 8, y: 82 }, style: 'badge', data: { count: '50M+', label: 'connections' } }
                ],
                decorations: [
                    { type: 'heart', position: { x: 85, y: 20 }, size: 30, color: '#ffffff' }
                ],
                headlinePatterns: ['Connect with friends', 'Share your world', 'Meet someone new']
            }
        ],

        dating: [
            {
                id: 'social-dating-01',
                name: 'Dating Modern Hero',
                slot: 'hero',
                background: { type: 'solid', color: '#ffeaa7' },
                device: { scale: 60, position: { x: 50, y: 70 }, rotation: 0 },
                text: {
                    headline: {
                        position: 'top-left', x: 8, y: 10,
                        font: 'Playfair Display', weight: 700, size: 66,
                        color: '#2d3436', arrangement: 'stacked'
                    },
                    subheadline: { enabled: true, font: 'DM Sans', size: 18, color: '#636e72' }
                },
                widgets: [
                    { type: 'downloads', position: { x: 8, y: 82 }, style: 'minimal' }
                ],
                headlinePatterns: ['Swipe right', 'Find your match', 'Love awaits']
            }
        ]
    }
};
```

### 7.3 Template Application Algorithm

```javascript
/**
 * Apply a template to a screenshot with smart customization
 */
function applyTemplate(screenshot, template, customOptions = {}) {

    // 1. Apply background
    if (template.background.type === 'solid') {
        screenshot.background = {
            type: 'solid',
            color: customOptions.backgroundColor || template.background.color
        };
    } else if (template.background.type === 'gradient') {
        screenshot.background = {
            type: 'gradient',
            angle: template.background.angle,
            stops: customOptions.gradientStops || template.background.stops
        };
    }

    // 2. Apply device positioning
    screenshot.device = {
        scale: template.device.scale,
        x: template.device.position.x,
        y: template.device.position.y,
        rotation: template.device.rotation,
        shadow: template.device.shadow
    };

    // 3. Apply text configuration
    screenshot.text = {
        headline: {
            ...template.text.headline,
            content: customOptions.headline || ''
        },
        subheadline: template.text.subheadline.enabled ? {
            ...template.text.subheadline,
            content: customOptions.subheadline || ''
        } : null
    };

    // 4. Apply widgets
    screenshot.widgets = template.widgets.map(widget => ({
        ...widget,
        data: customOptions.widgetData?.[widget.type] || widget.data
    }));

    // 5. Apply decorations
    screenshot.decorations = template.decorations || [];

    return screenshot;
}

/**
 * Apply a complete template set to all screenshots
 */
function applyTemplateSet(screenshots, templateSet, headlines) {
    for (let i = 0; i < screenshots.length; i++) {
        const template = templateSet[i % templateSet.length];
        const headline = headlines[i];

        applyTemplate(screenshots[i], template, {
            headline: headline.main,
            subheadline: headline.sub
        });
    }
}
```

---

## 8. WIDGET RENDERING SYSTEM

### 8.1 Widget Components

```javascript
/**
 * Widget rendering functions
 */
const WIDGET_RENDERERS = {

    rating: (ctx, widget, canvasWidth, canvasHeight) => {
        const x = canvasWidth * (widget.position.x / 100);
        const y = canvasHeight * (widget.position.y / 100);

        const rating = widget.data?.rating || 4.8;
        const style = widget.style || 'pill';

        if (style === 'pill') {
            // Draw pill background
            const pillWidth = 100;
            const pillHeight = 32;
            ctx.fillStyle = widget.colors?.background || 'rgba(255,255,255,0.15)';
            roundRect(ctx, x, y, pillWidth, pillHeight, 16);
            ctx.fill();

            // Draw star
            ctx.fillStyle = widget.colors?.stars || '#ffd32a';
            drawStar(ctx, x + 16, y + 16, 8);

            // Draw rating text
            ctx.fillStyle = widget.colors?.text || '#ffffff';
            ctx.font = '600 14px Inter';
            ctx.fillText(rating.toString(), x + 32, y + 21);
            ctx.font = '400 12px Inter';
            ctx.fillText('Rating', x + 55, y + 21);
        }
    },

    downloads: (ctx, widget, canvasWidth, canvasHeight) => {
        const x = canvasWidth * (widget.position.x / 100);
        const y = canvasHeight * (widget.position.y / 100);

        const count = widget.data?.count || '1M+';
        const label = widget.data?.label || 'Downloads';

        ctx.fillStyle = widget.colors?.background || 'rgba(255,255,255,0.15)';
        roundRect(ctx, x, y, 120, 32, 16);
        ctx.fill();

        ctx.fillStyle = widget.colors?.text || '#ffffff';
        ctx.font = '700 14px Inter';
        ctx.fillText(count, x + 12, y + 21);
        ctx.font = '400 12px Inter';
        ctx.fillText(label, x + 50, y + 21);
    },

    appOfDay: (ctx, widget, canvasWidth, canvasHeight) => {
        const x = canvasWidth * (widget.position.x / 100);
        const y = canvasHeight * (widget.position.y / 100);

        // Draw badge background
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        roundRect(ctx, x, y, 110, 45, 8);
        ctx.fill();

        // Draw Apple logo placeholder
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText('', x + 10, y + 28);

        // Draw text
        ctx.font = '500 10px Inter';
        ctx.fillText('App of the', x + 30, y + 18);
        ctx.font = '700 14px Inter';
        ctx.fillText('Day', x + 30, y + 35);
    },

    sale: (ctx, widget, canvasWidth, canvasHeight) => {
        const x = canvasWidth * (widget.position.x / 100);
        const y = canvasHeight * (widget.position.y / 100);
        const text = widget.data?.text || '50% OFF';

        if (widget.style === 'burst') {
            // Draw starburst shape
            ctx.fillStyle = '#ffd32a';
            drawStarburst(ctx, x, y, 50);

            ctx.fillStyle = '#2d3436';
            ctx.font = '800 14px Montserrat';
            ctx.textAlign = 'center';
            ctx.fillText(text, x, y + 5);
            ctx.textAlign = 'left';
        }
    },

    live: (ctx, widget, canvasWidth, canvasHeight) => {
        const x = canvasWidth * (widget.position.x / 100);
        const y = canvasHeight * (widget.position.y / 100);

        // Draw pulsing red dot
        ctx.fillStyle = '#ff4757';
        ctx.beginPath();
        ctx.arc(x + 8, y + 12, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw LIVE text
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 12px Inter';
        ctx.fillText('LIVE', x + 20, y + 16);
    },

    press: (ctx, widget, canvasWidth, canvasHeight) => {
        const x = canvasWidth * (widget.position.x / 100);
        const y = canvasHeight * (widget.position.y / 100);
        const logos = widget.logos || ['forbes', 'techcrunch'];

        // Draw "Featured in" text
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '400 10px Inter';
        ctx.fillText('Featured in', x, y);

        // Draw logos (simplified as text for now)
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '600 14px Georgia';
        let logoX = x;
        logos.forEach((logo, i) => {
            ctx.fillText(logo.charAt(0).toUpperCase() + logo.slice(1), logoX, y + 20);
            logoX += 80;
        });
    }
};

/**
 * Render all widgets for a screenshot
 */
function renderWidgets(ctx, widgets, canvasWidth, canvasHeight) {
    widgets.forEach(widget => {
        const renderer = WIDGET_RENDERERS[widget.type];
        if (renderer) {
            renderer(ctx, widget, canvasWidth, canvasHeight);
        }
    });
}
```

---

## 9. TEXT RENDERING ENGINE

### 9.1 Advanced Text Rendering

```javascript
/**
 * Render headline with professional typography
 */
function renderHeadline(ctx, config, canvasWidth, canvasHeight) {
    const {
        content,
        font,
        weight,
        size,
        color,
        position,
        x,
        y,
        arrangement,
        lineHeight,
        letterSpacing,
        effects,
        maxWidth
    } = config;

    // Calculate actual positions
    const actualX = canvasWidth * (x / 100);
    const actualY = canvasHeight * (y / 100);
    const actualMaxWidth = canvasWidth * (maxWidth / 100);
    const scaledSize = size * (canvasWidth / 1290); // Scale based on standard width

    // Set font
    ctx.font = `${weight} ${scaledSize}px "${font}"`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    if (arrangement === 'stacked') {
        // Split into words and render each on new line
        const words = content.split(' ');
        let currentY = actualY;

        words.forEach((word, index) => {
            // Apply highlight effect if specified
            if (effects?.highlight && effects.highlight.word === index) {
                ctx.fillStyle = effects.highlight.color;
            } else {
                ctx.fillStyle = color;
            }

            // Apply text shadow if specified
            if (effects?.shadow) {
                ctx.shadowColor = effects.shadow.color;
                ctx.shadowBlur = effects.shadow.blur;
                ctx.shadowOffsetX = effects.shadow.x || 0;
                ctx.shadowOffsetY = effects.shadow.y || 0;
            }

            ctx.fillText(word, actualX, currentY);

            // Draw underline if specified
            if (effects?.underline && effects.underline.word === index) {
                const wordWidth = ctx.measureText(word).width;
                ctx.strokeStyle = effects.underline.color;
                ctx.lineWidth = effects.underline.thickness || 3;
                ctx.beginPath();
                ctx.moveTo(actualX, currentY + scaledSize + 5);
                ctx.lineTo(actualX + wordWidth, currentY + scaledSize + 5);
                ctx.stroke();
            }

            currentY += scaledSize * lineHeight;
        });

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

    } else if (arrangement === 'inline') {
        ctx.fillText(content, actualX, actualY);

    } else if (arrangement === 'mixed') {
        // First word large, rest smaller
        const words = content.split(' ');
        const mainWord = words[0];
        const restWords = words.slice(1).join(' ');

        ctx.font = `${weight} ${scaledSize}px "${font}"`;
        ctx.fillText(mainWord, actualX, actualY);

        const mainWordWidth = ctx.measureText(mainWord).width;
        ctx.font = `${weight} ${scaledSize * 0.6}px "${font}"`;
        ctx.fillText(restWords, actualX + mainWordWidth + 10, actualY + scaledSize * 0.2);
    }
}

/**
 * Render subheadline
 */
function renderSubheadline(ctx, config, headlineBottom, canvasWidth) {
    if (!config.enabled) return;

    const {
        content,
        font,
        weight,
        size,
        color,
        marginTop
    } = config;

    const scaledSize = size * (canvasWidth / 1290);
    const actualX = canvasWidth * 0.08; // 8% from left
    const actualY = headlineBottom + marginTop;

    ctx.font = `${weight} ${scaledSize}px "${font}"`;
    ctx.fillStyle = color;
    ctx.fillText(content, actualX, actualY);
}
```

---

## 10. QUALITY ASSURANCE RULES

### 10.1 Automatic Quality Checks

```javascript
/**
 * Validate screenshot configuration before rendering
 */
function validateScreenshotConfig(config, canvasWidth, canvasHeight) {
    const issues = [];

    // 1. Check text-device overlap
    const textBottomY = calculateTextBottom(config.text, canvasHeight);
    const deviceTopY = canvasHeight * (config.device.y / 100) -
                       (canvasHeight * config.device.scale / 100) / 2;

    if (textBottomY > deviceTopY - 50) {
        issues.push({
            type: 'overlap',
            severity: 'high',
            message: 'Text overlaps with device',
            fix: () => {
                config.device.y = Math.min(config.device.y + 5, 85);
            }
        });
    }

    // 2. Check contrast ratio
    const bgColor = config.background.color;
    const textColor = config.text.headline.color;
    const contrast = calculateContrastRatio(bgColor, textColor);

    if (contrast < 4.5) {
        issues.push({
            type: 'contrast',
            severity: 'high',
            message: `Low contrast ratio: ${contrast.toFixed(2)}`,
            fix: () => {
                config.text.headline.color = suggestBetterTextColor(bgColor);
            }
        });
    }

    // 3. Check headline length
    const headlineWords = config.text.headline.content.split(' ').length;
    if (headlineWords > 6) {
        issues.push({
            type: 'length',
            severity: 'medium',
            message: 'Headline too long (>6 words)',
            fix: null // Requires AI regeneration
        });
    }

    // 4. Check device scale
    if (config.device.scale > 75) {
        issues.push({
            type: 'scale',
            severity: 'low',
            message: 'Device might be too large',
            fix: () => {
                config.device.scale = 70;
            }
        });
    }

    return issues;
}

/**
 * Auto-fix common issues
 */
function autoFixIssues(config, issues) {
    issues.forEach(issue => {
        if (issue.fix && issue.severity === 'high') {
            issue.fix();
        }
    });
    return config;
}
```

### 10.2 Consistency Checker

```javascript
/**
 * Ensure visual consistency across screenshot set
 */
function checkSetConsistency(screenshots) {
    const issues = [];

    // 1. Check font consistency
    const fonts = screenshots.map(s => s.text.headline.font);
    const uniqueFonts = [...new Set(fonts)];
    if (uniqueFonts.length > 1) {
        issues.push({
            type: 'font-inconsistency',
            message: 'Multiple fonts used across screenshots',
            fonts: uniqueFonts
        });
    }

    // 2. Check color family consistency
    const bgColors = screenshots.map(s => s.background.color);
    if (!areColorsInSameFamily(bgColors)) {
        issues.push({
            type: 'color-inconsistency',
            message: 'Background colors not in same family',
            colors: bgColors
        });
    }

    // 3. Check device positioning consistency
    const positions = screenshots.map(s => ({ x: s.device.x, y: s.device.y }));
    const avgX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
    const avgY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;

    positions.forEach((pos, i) => {
        if (Math.abs(pos.x - avgX) > 15 || Math.abs(pos.y - avgY) > 10) {
            issues.push({
                type: 'position-outlier',
                message: `Screenshot ${i + 1} device position is an outlier`,
                screenshot: i
            });
        }
    });

    return issues;
}
```

---

## 11. SUMMARY: HOW TO ACHIEVE APPLAUNCHPAD QUALITY

### Every Time Checklist:

1. **Detect category** → Select appropriate template family
2. **Extract colors** → Customize template with app's colors
3. **Generate headlines** → 2-4 words, story flow, category-appropriate
4. **Position device LOW** → Y position 70-80%, never overlapping text
5. **Use stacked text** → Each word on new line, tight line-height
6. **Add social proof** → Rating badge, download count on hero
7. **Maintain consistency** → Same fonts, colors, positioning across set
8. **Validate quality** → Run auto-checks, fix issues

### The Secret Formula:

```
Professional Screenshot =
    Bold Solid Background (category-appropriate color)
    + Stacked Headline (2-4 words, premium font, top-left)
    + Device Pushed Down (65-75% from top)
    + Social Proof Badge (rating or downloads)
    + Consistent Set (same treatment × 5)
```

---

*Document Version: 2.0*
*Last Updated: December 2024*
*Based on analysis of 50+ theapplaunchpad.com screenshot sets*
