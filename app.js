// State management
const state = {
    screenshots: [],
    selectedIndex: 0,
    transferTarget: null, // Index of screenshot waiting to receive style transfer
    outputDevice: 'iphone-6.9',
    currentLanguage: 'en', // Global current language for all text
    projectLanguages: ['en'], // Languages available in this project
    customWidth: 1290,
    customHeight: 2796,
    // Default settings applied to new screenshots
    defaults: {
        background: {
            type: 'gradient',
            gradient: {
                angle: 135,
                stops: [
                    { color: '#667eea', position: 0 },
                    { color: '#764ba2', position: 100 }
                ]
            },
            solid: '#1a1a2e',
            image: null,
            imageFit: 'cover',
            imageBlur: 0,
            overlayColor: '#000000',
            overlayOpacity: 0,
            noise: false,
            noiseIntensity: 10
        },
        screenshot: {
            scale: 62,           // RULE 8: Optimal 58-65%
            y: 72,               // RULE 1: Device Y 70-80%
            x: 50,
            rotation: 0,
            perspective: 0,
            cornerRadius: 24,
            use3D: false,
            device3D: 'iphone',
            rotation3D: { x: 0, y: 0, z: 0 },
            shadow: {
                enabled: true,
                color: '#000000',
                blur: 60,        // RULE 7: 40-80px blur
                opacity: 35,     // RULE 7: 25-40% opacity
                x: 0,
                y: 25            // RULE 7: 15-30px offset Y
            },
            frame: {
                enabled: false,
                color: '#1d1d1f',
                width: 12,
                opacity: 100
            }
        },
        text: {
            headlineEnabled: true,
            headlines: { en: '' },
            headlineLanguages: ['en'],
            currentHeadlineLang: 'en',
            headlineFont: "Poppins",              // RULE 12: Premium fonts
            headlineSize: 72,                      // RULE 2: 64-80px
            headlineWeight: '700',                 // RULE 2: 600-800 weight
            headlineItalic: false,
            headlineUnderline: false,
            headlineStrikethrough: false,
            headlineColor: '#ffffff',
            position: 'top',
            offsetY: 8,                            // RULE 2: 6-12% from top
            lineHeight: 95,                        // RULE 2: 0.90-0.98 tight
            stackedText: true,                     // RULE 2: Stacked arrangement
            subheadlineEnabled: true,
            subheadlines: { en: '' },
            subheadlineLanguages: ['en'],
            currentSubheadlineLang: 'en',
            subheadlineFont: "Inter",              // RULE 12: Inter for subheadlines
            subheadlineSize: 20,                   // RULE 3: 16-24px
            subheadlineWeight: '400',              // RULE 3: 400-500 weight
            subheadlineItalic: false,
            subheadlineUnderline: false,
            subheadlineStrikethrough: false,
            subheadlineColor: '#ffffff',
            subheadlineOpacity: 75                 // RULE 3: 70-80% opacity
        }
    }
};

// Helper functions to get/set current screenshot settings
function getCurrentScreenshot() {
    if (!state.screenshots || state.screenshots.length === 0) return null;
    // Ensure selectedIndex is within bounds
    if (state.selectedIndex < 0 || state.selectedIndex >= state.screenshots.length) {
        state.selectedIndex = Math.max(0, Math.min(state.selectedIndex, state.screenshots.length - 1));
        if (state.screenshots.length === 0) return null;
    }
    return state.screenshots[state.selectedIndex] || null;
}

function getBackground() {
    const screenshot = getCurrentScreenshot();
    return screenshot ? screenshot.background : state.defaults.background;
}

function getScreenshotSettings() {
    const screenshot = getCurrentScreenshot();
    return screenshot ? screenshot.screenshot : state.defaults.screenshot;
}

function getText() {
    const screenshot = getCurrentScreenshot();
    return screenshot ? screenshot.text : state.defaults.text;
}

// Format number to at most 1 decimal place
function formatValue(num) {
    const rounded = Math.round(num * 10) / 10;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}

function setBackground(key, value) {
    const screenshot = getCurrentScreenshot();
    if (screenshot) {
        if (key.includes('.')) {
            const parts = key.split('.');
            let obj = screenshot.background;
            for (let i = 0; i < parts.length - 1; i++) {
                obj = obj[parts[i]];
            }
            obj[parts[parts.length - 1]] = value;
        } else {
            screenshot.background[key] = value;
        }
    }
}

function setScreenshotSetting(key, value) {
    const screenshot = getCurrentScreenshot();
    if (screenshot) {
        if (key.includes('.')) {
            const parts = key.split('.');
            let obj = screenshot.screenshot;
            for (let i = 0; i < parts.length - 1; i++) {
                obj = obj[parts[i]];
            }
            obj[parts[parts.length - 1]] = value;
        } else {
            screenshot.screenshot[key] = value;
        }
    }
}

function setTextSetting(key, value) {
    const screenshot = getCurrentScreenshot();
    if (screenshot) {
        screenshot.text[key] = value;
    }
}

function setCurrentScreenshotAsDefault() {
    const screenshot = getCurrentScreenshot();
    if (screenshot) {
        state.defaults.background = JSON.parse(JSON.stringify(screenshot.background));
        state.defaults.screenshot = JSON.parse(JSON.stringify(screenshot.screenshot));
        state.defaults.text = JSON.parse(JSON.stringify(screenshot.text));
    }
}

// Language flags mapping
const languageFlags = {
    'en': '🇺🇸', 'en-gb': '🇬🇧', 'de': '🇩🇪', 'fr': '🇫🇷', 'es': '🇪🇸',
    'it': '🇮🇹', 'pt': '🇵🇹', 'pt-br': '🇧🇷', 'nl': '🇳🇱', 'ru': '🇷🇺',
    'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳', 'zh-tw': '🇹🇼', 'ar': '🇸🇦',
    'hi': '🇮🇳', 'tr': '🇹🇷', 'pl': '🇵🇱', 'sv': '🇸🇪', 'da': '🇩🇰',
    'no': '🇳🇴', 'fi': '🇫🇮', 'th': '🇹🇭', 'vi': '🇻🇳', 'id': '🇮🇩'
};

// Google Fonts configuration
const googleFonts = {
    loaded: new Set(),
    loading: new Set(),
    // Popular fonts that are commonly used for marketing/app store
    popular: [
        'Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Raleway',
        'Nunito', 'Playfair Display', 'Oswald', 'Merriweather', 'Source Sans Pro',
        'PT Sans', 'Ubuntu', 'Rubik', 'Work Sans', 'Quicksand', 'Mulish', 'Barlow',
        'DM Sans', 'Manrope', 'Space Grotesk', 'Plus Jakarta Sans', 'Outfit', 'Sora',
        'Lexend', 'Figtree', 'Albert Sans', 'Urbanist', 'Satoshi', 'General Sans',
        'Bebas Neue', 'Anton', 'Archivo', 'Bitter', 'Cabin', 'Crimson Text',
        'Dancing Script', 'Fira Sans', 'Heebo', 'IBM Plex Sans', 'Josefin Sans',
        'Karla', 'Libre Franklin', 'Lora', 'Noto Sans', 'Nunito Sans', 'Pacifico',
        'Permanent Marker', 'Roboto Condensed', 'Roboto Mono', 'Roboto Slab',
        'Shadows Into Light', 'Signika', 'Slabo 27px', 'Source Code Pro', 'Titillium Web',
        'Varela Round', 'Zilla Slab', 'Arimo', 'Barlow Condensed', 'Catamaran',
        'Comfortaa', 'Cormorant Garamond', 'Dosis', 'EB Garamond', 'Exo 2',
        'Fira Code', 'Hind', 'Inconsolata', 'Indie Flower', 'Jost', 'Kanit',
        'Libre Baskerville', 'Maven Pro', 'Mukta', 'Nanum Gothic', 'Noticia Text',
        'Oxygen', 'Philosopher', 'Play', 'Prompt', 'Rajdhani', 'Red Hat Display',
        'Righteous', 'Saira', 'Sen', 'Spectral', 'Teko', 'Vollkorn', 'Yanone Kaffeesatz',
        'Zeyada', 'Amatic SC', 'Archivo Black', 'Asap', 'Assistant', 'Bangers',
        'BioRhyme', 'Cairo', 'Cardo', 'Chivo', 'Concert One', 'Cormorant',
        'Cousine', 'DM Serif Display', 'DM Serif Text', 'Dela Gothic One',
        'El Messiri', 'Encode Sans', 'Eczar', 'Fahkwang', 'Gelasio'
    ],
    // System fonts that don't need loading
    system: [
        { name: 'SF Pro Display', value: "-apple-system, BlinkMacSystemFont, 'SF Pro Display'" },
        { name: 'SF Pro Rounded', value: "'SF Pro Rounded', -apple-system" },
        { name: 'Helvetica Neue', value: "'Helvetica Neue', Helvetica" },
        { name: 'Avenir Next', value: "'Avenir Next', Avenir" },
        { name: 'Georgia', value: "Georgia, serif" },
        { name: 'Arial', value: "Arial, sans-serif" },
        { name: 'Times New Roman', value: "'Times New Roman', serif" },
        { name: 'Courier New', value: "'Courier New', monospace" },
        { name: 'Verdana', value: "Verdana, sans-serif" },
        { name: 'Trebuchet MS', value: "'Trebuchet MS', sans-serif" }
    ],
    // Cache for all Google Fonts (loaded on demand)
    allFonts: null
};

// Load a Google Font dynamically
async function loadGoogleFont(fontName) {
    // Check if it's a system font
    const isSystem = googleFonts.system.some(f => f.name === fontName);
    if (isSystem) return;

    // If already loaded, just ensure the current weight is available
    if (googleFonts.loaded.has(fontName)) {
        const text = getTextSettings();
        const weight = text.headlineWeight || '600';
        try {
            await document.fonts.load(`${weight} 16px "${fontName}"`);
        } catch (e) {
            // Font already loaded, weight might not exist but that's ok
        }
        return;
    }

    // If currently loading, wait for it
    if (googleFonts.loading.has(fontName)) {
        // Wait a bit and check again
        await new Promise(resolve => setTimeout(resolve, 100));
        if (googleFonts.loading.has(fontName)) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return;
    }

    googleFonts.loading.add(fontName);

    try {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;800;900&display=swap`;
        link.rel = 'stylesheet';

        // Wait for stylesheet to load first
        await new Promise((resolve, reject) => {
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });

        // Wait for the font to actually load with the required weights
        const text = getTextSettings();
        const headlineWeight = text.headlineWeight || '600';
        const subheadlineWeight = text.subheadlineWeight || '400';

        // Load all weights we might need
        await Promise.all([
            document.fonts.load(`400 16px "${fontName}"`),
            document.fonts.load(`${headlineWeight} 16px "${fontName}"`),
            document.fonts.load(`${subheadlineWeight} 16px "${fontName}"`)
        ]);

        googleFonts.loaded.add(fontName);
        googleFonts.loading.delete(fontName);
    } catch (error) {
        console.warn(`Failed to load font: ${fontName}`, error);
        googleFonts.loading.delete(fontName);
    }
}

// Fetch all Google Fonts from the API (cached)
async function fetchAllGoogleFonts() {
    if (googleFonts.allFonts) {
        return googleFonts.allFonts;
    }

    try {
        // Using a curated list of 500+ popular fonts instead of API to avoid rate limits
        // This list covers the most commonly used fonts on Google Fonts
        googleFonts.allFonts = [
            ...googleFonts.popular,
            'ABeeZee', 'Abel', 'Abhaya Libre', 'Abril Fatface', 'Aclonica', 'Acme',
            'Actor', 'Adamina', 'Advent Pro', 'Aguafina Script', 'Akronim', 'Aladin',
            'Aldrich', 'Alef', 'Alegreya', 'Alegreya Sans', 'Alegreya Sans SC', 'Alex Brush',
            'Alfa Slab One', 'Alice', 'Alike', 'Alike Angular', 'Allan', 'Allerta',
            'Allison', 'Allura', 'Almendra', 'Amaranth', 'Amatic SC', 'Amethysta',
            'Amiko', 'Amiri', 'Amita', 'Anaheim', 'Andada', 'Andika', 'Angkor',
            'Annie Use Your Telescope', 'Anonymous Pro', 'Antic', 'Antic Didone',
            'Antonio', 'Arapey', 'Arbutus', 'Arbutus Slab', 'Architects Daughter',
            'Archivo Narrow', 'Aref Ruqaa', 'Arima Madurai', 'Arvo', 'Asap Condensed',
            'Asar', 'Asset', 'Astloch', 'Asul', 'Athiti', 'Atkinson Hyperlegible',
            'Atomic Age', 'Aubrey', 'Audiowide', 'Autour One', 'Average', 'Average Sans',
            'Averia Gruesa Libre', 'Averia Libre', 'Averia Sans Libre', 'Averia Serif Libre',
            'B612', 'B612 Mono', 'Bad Script', 'Bahiana', 'Bahianita', 'Bai Jamjuree',
            'Baloo', 'Baloo 2', 'Balsamiq Sans', 'Balthazar', 'Baskervville',
            'Battambang', 'Baumans', 'Bellefair', 'Belleza', 'Bellota', 'Bellota Text',
            'BenchNine', 'Bentham', 'Berkshire Swash', 'Beth Ellen', 'Bevan',
            'Big Shoulders Display', 'Big Shoulders Text', 'Bigelow Rules', 'Bigshot One',
            'Bilbo', 'Bilbo Swash Caps', 'Blinker', 'Bodoni Moda', 'Bokor', 'Bonbon',
            'Boogaloo', 'Bowlby One', 'Bowlby One SC', 'Brawler', 'Bree Serif',
            'Brygada 1918', 'Bubblegum Sans', 'Bubbler One', 'Buda', 'Buenard',
            'Bungee', 'Bungee Hairline', 'Bungee Inline', 'Bungee Outline', 'Bungee Shade',
            'Butcherman', 'Butterfly Kids', 'Cabin Condensed', 'Cabin Sketch', 'Caesar Dressing',
            'Cagliostro', 'Caladea', 'Calistoga', 'Calligraffitti', 'Cambay', 'Cambo',
            'Candal', 'Cantarell', 'Cantata One', 'Cantora One', 'Capriola', 'Cardo',
            'Carme', 'Carrois Gothic', 'Carrois Gothic SC', 'Carter One', 'Castoro',
            'Caveat', 'Caveat Brush', 'Cedarville Cursive', 'Ceviche One', 'Chakra Petch',
            'Changa', 'Changa One', 'Chango', 'Charm', 'Charmonman', 'Chathura',
            'Chau Philomene One', 'Chela One', 'Chelsea Market', 'Chenla', 'Cherry Cream Soda',
            'Cherry Swash', 'Chewy', 'Chicle', 'Chilanka', 'Chonburi', 'Cinzel',
            'Cinzel Decorative', 'Clicker Script', 'Coda', 'Coda Caption', 'Codystar',
            'Coiny', 'Combo', 'Comforter', 'Comforter Brush', 'Comic Neue', 'Coming Soon',
            'Commissioner', 'Condiment', 'Content', 'Contrail One', 'Convergence',
            'Cookie', 'Copse', 'Corben', 'Corinthia', 'Cormorant Infant', 'Cormorant SC',
            'Cormorant Unicase', 'Cormorant Upright', 'Courgette', 'Courier Prime',
            'Covered By Your Grace', 'Crafty Girls', 'Creepster', 'Crete Round',
            'Crimson Pro', 'Croissant One', 'Crushed', 'Cuprum', 'Cute Font',
            'Cutive', 'Cutive Mono', 'Damion', 'Dangrek', 'Darker Grotesque',
            'David Libre', 'Dawning of a New Day', 'Days One', 'Dekko', 'Delius',
            'Delius Swash Caps', 'Delius Unicase', 'Della Respira', 'Denk One',
            'Devonshire', 'Dhurjati', 'Didact Gothic', 'Diplomata', 'Diplomata SC',
            'Do Hyeon', 'Dokdo', 'Domine', 'Donegal One', 'Dongle', 'Doppio One',
            'Dorsa', 'Droid Sans', 'Droid Sans Mono', 'Droid Serif', 'Duru Sans',
            'Dynalight', 'Eagle Lake', 'East Sea Dokdo', 'Eater', 'Economica',
            'Eczar', 'Edu NSW ACT Foundation', 'Edu QLD Beginner', 'Edu SA Beginner',
            'Edu TAS Beginner', 'Edu VIC WA NT Beginner', 'Electrolize', 'Elsie',
            'Elsie Swash Caps', 'Emblema One', 'Emilys Candy', 'Encode Sans Condensed',
            'Encode Sans Expanded', 'Encode Sans Semi Condensed', 'Encode Sans Semi Expanded',
            'Engagement', 'Englebert', 'Enriqueta', 'Ephesis', 'Epilogue', 'Erica One',
            'Esteban', 'Estonia', 'Euphoria Script', 'Ewert', 'Exo', 'Expletus Sans',
            'Explora', 'Fahkwang', 'Fanwood Text', 'Farro', 'Farsan', 'Fascinate',
            'Fascinate Inline', 'Faster One', 'Fasthand', 'Fauna One', 'Faustina',
            'Federant', 'Federo', 'Felipa', 'Fenix', 'Festive', 'Finger Paint',
            'Fira Sans Condensed', 'Fira Sans Extra Condensed', 'Fjalla One', 'Fjord One',
            'Flamenco', 'Flavors', 'Fleur De Leah', 'Flow Block', 'Flow Circular',
            'Flow Rounded', 'Fondamento', 'Fontdiner Swanky', 'Forum', 'Francois One',
            'Frank Ruhl Libre', 'Fraunces', 'Freckle Face', 'Fredericka the Great',
            'Fredoka', 'Fredoka One', 'Freehand', 'Fresca', 'Frijole', 'Fruktur',
            'Fugaz One', 'Fuggles', 'Fuzzy Bubbles', 'GFS Didot', 'GFS Neohellenic',
            'Gabriela', 'Gaegu', 'Gafata', 'Galada', 'Galdeano', 'Galindo', 'Gamja Flower',
            'Gayathri', 'Gelasio', 'Gemunu Libre', 'Genos', 'Gentium Basic', 'Gentium Book Basic',
            'Gentium Book Plus', 'Gentium Plus', 'Geo', 'Georama', 'Geostar', 'Geostar Fill',
            'Germania One', 'Gideon Roman', 'Gidugu', 'Gilda Display', 'Girassol',
            'Give You Glory', 'Glass Antiqua', 'Glegoo', 'Gloria Hallelujah', 'Glory',
            'Gluten', 'Goblin One', 'Gochi Hand', 'Goldman', 'Gorditas', 'Gothic A1',
            'Gotu', 'Goudy Bookletter 1911', 'Gowun Batang', 'Gowun Dodum', 'Graduate',
            'Grand Hotel', 'Grandstander', 'Grape Nuts', 'Gravitas One', 'Great Vibes',
            'Grechen Fuemen', 'Grenze', 'Grenze Gotisch', 'Grey Qo', 'Griffy', 'Gruppo',
            'Gudea', 'Gugi', 'Gupter', 'Gurajada', 'Gwendolyn', 'Habibi', 'Hachi Maru Pop',
            'Hahmlet', 'Halant', 'Hammersmith One', 'Hanalei', 'Hanalei Fill', 'Handlee',
            'Hanuman', 'Happy Monkey', 'Harmattan', 'Headland One', 'Hepta Slab',
            'Herr Von Muellerhoff', 'Hi Melody', 'Hina Mincho', 'Hind Guntur', 'Hind Madurai',
            'Hind Siliguri', 'Hind Vadodara', 'Holtwood One SC', 'Homemade Apple', 'Homenaje',
            'Hubballi', 'Hurricane', 'IBM Plex Mono', 'IBM Plex Sans Condensed', 'IBM Plex Serif',
            'IM Fell DW Pica', 'IM Fell DW Pica SC', 'IM Fell Double Pica', 'IM Fell Double Pica SC',
            'IM Fell English', 'IM Fell English SC', 'IM Fell French Canon', 'IM Fell French Canon SC',
            'IM Fell Great Primer', 'IM Fell Great Primer SC', 'Ibarra Real Nova', 'Iceberg',
            'Iceland', 'Imbue', 'Imperial Script', 'Imprima', 'Inconsolata', 'Inder', 'Ingrid Darling',
            'Inika', 'Inknut Antiqua', 'Inria Sans', 'Inria Serif', 'Inspiration', 'Inter Tight',
            'Irish Grover', 'Island Moments', 'Istok Web', 'Italiana', 'Italianno', 'Itim',
            'Jacques Francois', 'Jacques Francois Shadow', 'Jaldi', 'JetBrains Mono', 'Jim Nightshade',
            'Joan', 'Jockey One', 'Jolly Lodger', 'Jomhuria', 'Jomolhari', 'Josefin Slab',
            'Joti One', 'Jua', 'Judson', 'Julee', 'Julius Sans One', 'Junge', 'Jura',
            'Just Another Hand', 'Just Me Again Down Here', 'K2D', 'Kadwa', 'Kaisei Decol',
            'Kaisei HarunoUmi', 'Kaisei Opti', 'Kaisei Tokumin', 'Kalam', 'Kameron', 'Kanit',
            'Kantumruy', 'Kantumruy Pro', 'Karantina', 'Karla', 'Karma', 'Katibeh', 'Kaushan Script',
            'Kavivanar', 'Kavoon', 'Kdam Thmor Pro', 'Keania One', 'Kelly Slab', 'Kenia',
            'Khand', 'Khmer', 'Khula', 'Kings', 'Kirang Haerang', 'Kite One', 'Kiwi Maru',
            'Klee One', 'Knewave', 'KoHo', 'Kodchasan', 'Koh Santepheap', 'Kolker Brush',
            'Kosugi', 'Kosugi Maru', 'Kotta One', 'Koulen', 'Kranky', 'Kreon', 'Kristi',
            'Krona One', 'Krub', 'Kufam', 'Kulim Park', 'Kumar One', 'Kumar One Outline',
            'Kumbh Sans', 'Kurale', 'La Belle Aurore', 'Lacquer', 'Laila', 'Lakki Reddy',
            'Lalezar', 'Lancelot', 'Langar', 'Lateef', 'League Gothic', 'League Script',
            'League Spartan', 'Leckerli One', 'Ledger', 'Lekton', 'Lemon', 'Lemonada',
            'Lexend Deca', 'Lexend Exa', 'Lexend Giga', 'Lexend Mega', 'Lexend Peta',
            'Lexend Tera', 'Lexend Zetta', 'Libre Barcode 128', 'Libre Barcode 128 Text',
            'Libre Barcode 39', 'Libre Barcode 39 Extended', 'Libre Barcode 39 Extended Text',
            'Libre Barcode 39 Text', 'Libre Barcode EAN13 Text', 'Libre Bodoni', 'Libre Caslon Display',
            'Libre Caslon Text', 'Life Savers', 'Lilita One', 'Lily Script One', 'Limelight',
            'Linden Hill', 'Literata', 'Liu Jian Mao Cao', 'Livvic', 'Lobster', 'Lobster Two',
            'Londrina Outline', 'Londrina Shadow', 'Londrina Sketch', 'Londrina Solid',
            'Long Cang', 'Lora', 'Love Light', 'Love Ya Like A Sister', 'Loved by the King',
            'Lovers Quarrel', 'Luckiest Guy', 'Lusitana', 'Lustria', 'Luxurious Roman',
            'Luxurious Script', 'M PLUS 1', 'M PLUS 1 Code', 'M PLUS 1p', 'M PLUS 2',
            'M PLUS Code Latin', 'M PLUS Rounded 1c', 'Ma Shan Zheng', 'Macondo', 'Macondo Swash Caps',
            'Mada', 'Magra', 'Maiden Orange', 'Maitree', 'Major Mono Display', 'Mako', 'Mali',
            'Mallanna', 'Mandali', 'Manjari', 'Mansalva', 'Manuale', 'Marcellus', 'Marcellus SC',
            'Marck Script', 'Margarine', 'Markazi Text', 'Marko One', 'Marmelad', 'Martel',
            'Martel Sans', 'Marvel', 'Mate', 'Mate SC', 'Material Icons', 'Material Icons Outlined',
            'Material Icons Round', 'Material Icons Sharp', 'Material Icons Two Tone', 'Material Symbols Outlined',
            'Material Symbols Rounded', 'Material Symbols Sharp', 'Maven Pro', 'McLaren', 'Mea Culpa',
            'Meddon', 'MedievalSharp', 'Medula One', 'Meera Inimai', 'Megrim', 'Meie Script',
            'Meow Script', 'Merienda', 'Merienda One', 'Merriweather Sans', 'Metal', 'Metal Mania',
            'Metamorphous', 'Metrophobic', 'Michroma', 'Milonga', 'Miltonian', 'Miltonian Tattoo',
            'Mina', 'Miniver', 'Miriam Libre', 'Mirza', 'Miss Fajardose', 'Mitr', 'Mochiy Pop One',
            'Mochiy Pop P One', 'Modak', 'Modern Antiqua', 'Mogra', 'Mohave', 'Molengo', 'Molle',
            'Monda', 'Monofett', 'Monoton', 'Monsieur La Doulaise', 'Montaga', 'Montagu Slab',
            'MonteCarlo', 'Montez', 'Montserrat Alternates', 'Montserrat Subrayada', 'Moo Lah Lah',
            'Moon Dance', 'Moul', 'Moulpali', 'Mountains of Christmas', 'Mouse Memoirs', 'Mr Bedfort',
            'Mr Dafoe', 'Mr De Haviland', 'Mrs Saint Delafield', 'Mrs Sheppards', 'Ms Madi', 'Mukta Mahee',
            'Mukta Malar', 'Mukta Vaani', 'Muli', 'Murecho', 'MuseoModerno', 'My Soul', 'Mystery Quest',
            'NTR', 'Nanum Brush Script', 'Nanum Gothic Coding', 'Nanum Myeongjo', 'Nanum Pen Script',
            'Neonderthaw', 'Nerko One', 'Neucha', 'Neuton', 'New Rocker', 'New Tegomin', 'News Cycle',
            'Newsreader', 'Niconne', 'Niramit', 'Nixie One', 'Nobile', 'Nokora', 'Norican', 'Nosifer',
            'Notable', 'Nothing You Could Do', 'Noticia Text', 'Noto Color Emoji', 'Noto Emoji',
            'Noto Kufi Arabic', 'Noto Music', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', 'Noto Rashi Hebrew',
            'Noto Sans Arabic', 'Noto Sans Bengali', 'Noto Sans Devanagari', 'Noto Sans Display',
            'Noto Sans Georgian', 'Noto Sans Hebrew', 'Noto Sans HK', 'Noto Sans JP', 'Noto Sans KR',
            'Noto Sans Mono', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans Thai', 'Noto Serif',
            'Noto Serif Bengali', 'Noto Serif Devanagari', 'Noto Serif Display', 'Noto Serif Georgian',
            'Noto Serif Hebrew', 'Noto Serif JP', 'Noto Serif KR', 'Noto Serif SC', 'Noto Serif TC',
            'Noto Serif Thai', 'Nova Cut', 'Nova Flat', 'Nova Mono', 'Nova Oval', 'Nova Round',
            'Nova Script', 'Nova Slim', 'Nova Square', 'Numans', 'Nunito', 'Nunito Sans', 'Nuosu SIL',
            'Odibee Sans', 'Odor Mean Chey', 'Offside', 'Oi', 'Old Standard TT', 'Oldenburg', 'Ole',
            'Oleo Script', 'Oleo Script Swash Caps', 'Oooh Baby', 'Open Sans Condensed', 'Oranienbaum',
            'Orbit', 'Orbitron', 'Oregano', 'Orelega One', 'Orienta', 'Original Surfer', 'Oswald',
            'Otomanopee One', 'Outfit', 'Over the Rainbow', 'Overlock', 'Overlock SC', 'Overpass',
            'Overpass Mono', 'Ovo', 'Oxanium', 'Oxygen Mono', 'PT Mono', 'PT Sans Caption',
            'PT Sans Narrow', 'PT Serif', 'PT Serif Caption', 'Pacifico', 'Padauk', 'Padyakke Expanded One',
            'Palanquin', 'Palanquin Dark', 'Palette Mosaic', 'Pangolin', 'Paprika', 'Parisienne',
            'Passero One', 'Passion One', 'Passions Conflict', 'Pathway Gothic One', 'Patrick Hand',
            'Patrick Hand SC', 'Pattaya', 'Patua One', 'Pavanam', 'Paytone One', 'Peddana',
            'Peralta', 'Permanent Marker', 'Petemoss', 'Petit Formal Script', 'Petrona', 'Phetsarath',
            'Philosopher', 'Piazzolla', 'Piedra', 'Pinyon Script', 'Pirata One', 'Plaster', 'Play',
            'Playball', 'Playfair Display SC', 'Podkova', 'Poiret One', 'Poller One', 'Poly', 'Pompiere',
            'Pontano Sans', 'Poor Story', 'Poppins', 'Port Lligat Sans', 'Port Lligat Slab', 'Potta One',
            'Pragati Narrow', 'Praise', 'Prata', 'Preahvihear', 'Press Start 2P', 'Pridi', 'Princess Sofia',
            'Prociono', 'Prompt', 'Prosto One', 'Proza Libre', 'Public Sans', 'Puppies Play', 'Puritan',
            'Purple Purse', 'Qahiri', 'Quando', 'Quantico', 'Quattrocento', 'Quattrocento Sans', 'Questrial',
            'Quicksand', 'Quintessential', 'Qwigley', 'Qwitcher Grypen', 'Racing Sans One', 'Radio Canada',
            'Radley', 'Rajdhani', 'Rakkas', 'Raleway Dots', 'Ramabhadra', 'Ramaraja', 'Rambla', 'Rammetto One',
            'Rampart One', 'Ranchers', 'Rancho', 'Ranga', 'Rasa', 'Rationale', 'Ravi Prakash', 'Readex Pro',
            'Recursive', 'Red Hat Mono', 'Red Hat Text', 'Red Rose', 'Redacted', 'Redacted Script', 'Redressed',
            'Reem Kufi', 'Reenie Beanie', 'Reggae One', 'Revalia', 'Rhodium Libre', 'Ribeye', 'Ribeye Marrow',
            'Righteous', 'Risque', 'Road Rage', 'Roboto Flex', 'Rochester', 'Rock Salt', 'RocknRoll One',
            'Rokkitt', 'Romanesco', 'Ropa Sans', 'Rosario', 'Rosarivo', 'Rouge Script', 'Rowdies', 'Rozha One',
            'Rubik Beastly', 'Rubik Bubbles', 'Rubik Burned', 'Rubik Dirt', 'Rubik Distressed', 'Rubik Glitch',
            'Rubik Marker Hatch', 'Rubik Maze', 'Rubik Microbe', 'Rubik Mono One', 'Rubik Moonrocks',
            'Rubik Puddles', 'Rubik Wet Paint', 'Ruda', 'Rufina', 'Ruge Boogie', 'Ruluko', 'Rum Raisin',
            'Ruslan Display', 'Russo One', 'Ruthie', 'Rye', 'STIX Two Math', 'STIX Two Text', 'Sacramento',
            'Sahitya', 'Sail', 'Saira Condensed', 'Saira Extra Condensed', 'Saira Semi Condensed', 'Saira Stencil One',
            'Salsa', 'Sanchez', 'Sancreek', 'Sansita', 'Sansita Swashed', 'Sarabun', 'Sarala', 'Sarina', 'Sarpanch',
            'Sassy Frass', 'Satisfy', 'Sawarabi Gothic', 'Sawarabi Mincho', 'Scada', 'Scheherazade New', 'Schoolbell',
            'Scope One', 'Seaweed Script', 'Secular One', 'Sedgwick Ave', 'Sedgwick Ave Display', 'Sen',
            'Send Flowers', 'Sevillana', 'Seymour One', 'Shadows Into Light Two', 'Shalimar', 'Shanti',
            'Share', 'Share Tech', 'Share Tech Mono', 'Shippori Antique', 'Shippori Antique B1', 'Shippori Mincho',
            'Shippori Mincho B1', 'Shizuru', 'Shojumaru', 'Short Stack', 'Shrikhand', 'Siemreap', 'Sigmar One',
            'Signika Negative', 'Silkscreen', 'Simonetta', 'Single Day', 'Sintony', 'Sirin Stencil', 'Six Caps',
            'Skranji', 'Slabo 13px', 'Slackey', 'Smokum', 'Smooch', 'Smooch Sans', 'Smythe', 'Sniglet',
            'Snippet', 'Snowburst One', 'Sofadi One', 'Sofia', 'Sofia Sans', 'Sofia Sans Condensed',
            'Sofia Sans Extra Condensed', 'Sofia Sans Semi Condensed', 'Solitreo', 'Solway', 'Song Myung',
            'Sophia', 'Sora', 'Sorts Mill Goudy', 'Source Code Pro', 'Source Sans 3', 'Source Serif 4',
            'Source Serif Pro', 'Space Mono', 'Spartan', 'Special Elite', 'Spectral SC', 'Spicy Rice',
            'Spinnaker', 'Spirax', 'Splash', 'Spline Sans', 'Spline Sans Mono', 'Squada One', 'Square Peg',
            'Sree Krushnadevaraya', 'Sriracha', 'Srisakdi', 'Staatliches', 'Stalemate', 'Stalinist One',
            'Stardos Stencil', 'Stick', 'Stick No Bills', 'Stint Ultra Condensed', 'Stint Ultra Expanded',
            'Stoke', 'Strait', 'Style Script', 'Stylish', 'Sue Ellen Francisco', 'Suez One', 'Sulphur Point',
            'Sumana', 'Sunflower', 'Sunshiney', 'Supermercado One', 'Sura', 'Suranna', 'Suravaram', 'Suwannaphum',
            'Swanky and Moo Moo', 'Syncopate', 'Syne', 'Syne Mono', 'Syne Tactile', 'Tajawal', 'Tangerine',
            'Tapestry', 'Taprom', 'Tauri', 'Taviraj', 'Teko', 'Telex', 'Tenali Ramakrishna', 'Tenor Sans',
            'Text Me One', 'Texturina', 'Thasadith', 'The Girl Next Door', 'The Nautigal', 'Tienne', 'Tillana',
            'Tilt Neon', 'Tilt Prism', 'Tilt Warp', 'Timmana', 'Tinos', 'Tiro Bangla', 'Tiro Devanagari Hindi',
            'Tiro Devanagari Marathi', 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil',
            'Tiro Telugu', 'Titan One', 'Trade Winds', 'Train One', 'Trirong', 'Trispace', 'Trocchi',
            'Trochut', 'Truculenta', 'Trykker', 'Tulpen One', 'Turret Road', 'Twinkle Star', 'Ubuntu Condensed',
            'Ubuntu Mono', 'Uchen', 'Ultra', 'Uncial Antiqua', 'Underdog', 'Unica One', 'UnifrakturCook',
            'UnifrakturMaguntia', 'Unkempt', 'Unlock', 'Unna', 'Updock', 'Urbanist', 'Varta', 'Vast Shadow',
            'Vazirmatn', 'Vesper Libre', 'Viaoda Libre', 'Vibes', 'Vibur', 'Vidaloka', 'Viga', 'Voces',
            'Volkhov', 'Vollkorn SC', 'Voltaire', 'Vujahday Script', 'Waiting for the Sunrise', 'Wallpoet',
            'Walter Turncoat', 'Warnes', 'Water Brush', 'Waterfall', 'Wellfleet', 'Wendy One', 'Whisper',
            'WindSong', 'Wire One', 'Wix Madefor Display', 'Wix Madefor Text', 'Work Sans', 'Xanh Mono',
            'Yaldevi', 'Yanone Kaffeesatz', 'Yantramanav', 'Yatra One', 'Yellowtail', 'Yeon Sung', 'Yeseva One',
            'Yesteryear', 'Yomogi', 'Yrsa', 'Ysabeau', 'Ysabeau Infant', 'Ysabeau Office', 'Ysabeau SC',
            'Yuji Boku', 'Yuji Hentaigana Akari', 'Yuji Hentaigana Akebono', 'Yuji Mai', 'Yuji Syuku',
            'Yusei Magic', 'ZCOOL KuaiLe', 'ZCOOL QingKe HuangYou', 'ZCOOL XiaoWei', 'Zen Antique',
            'Zen Antique Soft', 'Zen Dots', 'Zen Kaku Gothic Antique', 'Zen Kaku Gothic New', 'Zen Kurenaido',
            'Zen Loop', 'Zen Maru Gothic', 'Zen Old Mincho', 'Zen Tokyo Zoo', 'Zeyada', 'Zhi Mang Xing',
            'Zilla Slab Highlight'
        ];
        // Remove duplicates
        googleFonts.allFonts = [...new Set(googleFonts.allFonts)].sort();
        return googleFonts.allFonts;
    } catch (error) {
        console.error('Failed to load font list:', error);
        return googleFonts.popular;
    }
}

// Font picker state - separate state for each picker
const fontPickerState = {
    headline: { category: 'popular', search: '' },
    subheadline: { category: 'popular', search: '' }
};

// Initialize all font pickers
function initFontPicker() {
    initSingleFontPicker('headline', {
        picker: 'font-picker',
        trigger: 'font-picker-trigger',
        dropdown: 'font-picker-dropdown',
        search: 'font-search',
        list: 'font-picker-list',
        preview: 'font-picker-preview',
        hidden: 'headline-font',
        stateKey: 'headlineFont'
    });

    initSingleFontPicker('subheadline', {
        picker: 'subheadline-font-picker',
        trigger: 'subheadline-font-picker-trigger',
        dropdown: 'subheadline-font-picker-dropdown',
        search: 'subheadline-font-search',
        list: 'subheadline-font-picker-list',
        preview: 'subheadline-font-picker-preview',
        hidden: 'subheadline-font',
        stateKey: 'subheadlineFont'
    });
}

// Initialize a single font picker instance
function initSingleFontPicker(pickerId, ids) {
    const trigger = document.getElementById(ids.trigger);
    const dropdown = document.getElementById(ids.dropdown);
    const searchInput = document.getElementById(ids.search);
    const picker = document.getElementById(ids.picker);

    if (!trigger || !dropdown) return;

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other font picker dropdowns
        document.querySelectorAll('.font-picker-dropdown.open').forEach(d => {
            if (d.id !== ids.dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open')) {
            searchInput.focus();
            renderFontList(pickerId, ids);
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest(`#${ids.picker}`)) {
            dropdown.classList.remove('open');
        }
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        fontPickerState[pickerId].search = e.target.value.toLowerCase();
        renderFontList(pickerId, ids);
    });

    // Prevent dropdown close when clicking inside
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Category buttons
    const categoryButtons = picker.querySelectorAll('.font-category');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fontPickerState[pickerId].category = btn.dataset.category;
            renderFontList(pickerId, ids);
        });
    });

    // Initial render
    renderFontList(pickerId, ids);
}

// Render the font list for a specific picker
async function renderFontList(pickerId, ids) {
    const fontList = document.getElementById(ids.list);
    if (!fontList) return;

    const pickerState = fontPickerState[pickerId];
    let fonts = [];
    const currentFont = getTextSettings()[ids.stateKey];

    if (pickerState.category === 'system') {
        fonts = googleFonts.system.map(f => ({
            name: f.name,
            value: f.value,
            category: 'system'
        }));
    } else if (pickerState.category === 'popular') {
        fonts = googleFonts.popular.map(name => ({
            name,
            value: `'${name}', sans-serif`,
            category: 'google'
        }));
    } else {
        // All fonts
        const allFonts = await fetchAllGoogleFonts();
        fonts = [
            ...googleFonts.system.map(f => ({
                name: f.name,
                value: f.value,
                category: 'system'
            })),
            ...allFonts.map(name => ({
                name,
                value: `'${name}', sans-serif`,
                category: 'google'
            }))
        ];
    }

    // Filter by search
    if (pickerState.search) {
        fonts = fonts.filter(f => f.name.toLowerCase().includes(pickerState.search));
    }

    // Limit to prevent performance issues
    const displayFonts = fonts.slice(0, 100);

    if (displayFonts.length === 0) {
        fontList.innerHTML = '<div class="font-picker-empty">No fonts found</div>';
        return;
    }

    fontList.innerHTML = displayFonts.map(font => {
        const isSelected = currentFont && (currentFont.includes(font.name) || currentFont === font.value);
        const isLoaded = font.category === 'system' || googleFonts.loaded.has(font.name);
        const isLoading = googleFonts.loading.has(font.name);

        return `
            <div class="font-option ${isSelected ? 'selected' : ''}"
                 data-font-name="${font.name}"
                 data-font-value="${font.value}"
                 data-font-category="${font.category}">
                <span class="font-option-name" style="font-family: ${isLoaded ? font.value : 'inherit'}">${font.name}</span>
                ${isLoading ? '<span class="font-option-loading">Loading...</span>' :
                  `<span class="font-option-category">${font.category}</span>`}
            </div>
        `;
    }).join('');

    // Add click handlers
    fontList.querySelectorAll('.font-option').forEach(option => {
        option.addEventListener('click', async () => {
            const fontName = option.dataset.fontName;
            const fontValue = option.dataset.fontValue;
            const fontCategory = option.dataset.fontCategory;

            // Load Google Font if needed
            if (fontCategory === 'google') {
                option.querySelector('.font-option-category').textContent = 'Loading...';
                option.querySelector('.font-option-category').classList.add('font-option-loading');
                await loadGoogleFont(fontName);
                option.querySelector('.font-option-name').style.fontFamily = fontValue;
                option.querySelector('.font-option-category').textContent = 'google';
                option.querySelector('.font-option-category').classList.remove('font-option-loading');
            }

            // Update state
            document.getElementById(ids.hidden).value = fontValue;
            setTextValue(ids.stateKey, fontValue);

            // Update preview
            const preview = document.getElementById(ids.preview);
            preview.textContent = fontName;
            preview.style.fontFamily = fontValue;

            // Update selection in list
            fontList.querySelectorAll('.font-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            // Close dropdown
            document.getElementById(ids.dropdown).classList.remove('open');

            updateCanvas();
        });

        // Preload font on hover for better UX
        option.addEventListener('mouseenter', () => {
            const fontName = option.dataset.fontName;
            const fontCategory = option.dataset.fontCategory;
            if (fontCategory === 'google' && !googleFonts.loaded.has(fontName)) {
                loadGoogleFont(fontName).then(() => {
                    option.querySelector('.font-option-name').style.fontFamily = option.dataset.fontValue;
                });
            }
        });
    });
}

// Update font picker preview from state
function updateFontPickerPreview() {
    updateSingleFontPickerPreview('headline-font', 'font-picker-preview', 'headlineFont');
    updateSingleFontPickerPreview('subheadline-font', 'subheadline-font-picker-preview', 'subheadlineFont');
}

function updateSingleFontPickerPreview(hiddenId, previewId, stateKey) {
    const preview = document.getElementById(previewId);
    const hiddenInput = document.getElementById(hiddenId);
    if (!preview || !hiddenInput) return;

    const text = getTextSettings();
    const fontValue = text[stateKey];
    if (!fontValue) return;

    hiddenInput.value = fontValue;

    // Extract font name from value
    let fontName = 'SF Pro Display';
    const systemFont = googleFonts.system.find(f => f.value === fontValue);
    if (systemFont) {
        fontName = systemFont.name;
    } else {
        // Try to extract from Google Font value like "'Roboto', sans-serif"
        const match = fontValue.match(/'([^']+)'/);
        if (match) {
            fontName = match[1];
            // Load the font if it's a Google Font
            loadGoogleFont(fontName);
        }
    }

    preview.textContent = fontName;
    preview.style.fontFamily = fontValue;
}

// Device dimensions
const deviceDimensions = {
    'iphone-6.9': { width: 1320, height: 2868 },
    'iphone-6.7': { width: 1290, height: 2796 },
    'iphone-6.5': { width: 1284, height: 2778 },
    'iphone-5.5': { width: 1242, height: 2208 },
    'ipad-12.9': { width: 2048, height: 2732 },
    'ipad-11': { width: 1668, height: 2388 },
    'android-phone': { width: 1080, height: 1920 },
    'android-phone-hd': { width: 1440, height: 2560 },
    'android-tablet-7': { width: 1200, height: 1920 },
    'android-tablet-10': { width: 1600, height: 2560 },
    'web-og': { width: 1200, height: 630 },
    'web-twitter': { width: 1200, height: 675 },
    'web-hero': { width: 1920, height: 1080 },
    'web-feature': { width: 1024, height: 500 }
};

// DOM elements
const canvas = document.getElementById('preview-canvas');
const ctx = canvas.getContext('2d');
const canvasLeft = document.getElementById('preview-canvas-left');
const ctxLeft = canvasLeft.getContext('2d');
const canvasRight = document.getElementById('preview-canvas-right');
const ctxRight = canvasRight.getContext('2d');
const canvasFarLeft = document.getElementById('preview-canvas-far-left');
const ctxFarLeft = canvasFarLeft.getContext('2d');
const canvasFarRight = document.getElementById('preview-canvas-far-right');
const ctxFarRight = canvasFarRight.getContext('2d');
const sidePreviewLeft = document.getElementById('side-preview-left');
const sidePreviewRight = document.getElementById('side-preview-right');
const sidePreviewFarLeft = document.getElementById('side-preview-far-left');
const sidePreviewFarRight = document.getElementById('side-preview-far-right');
const previewStrip = document.querySelector('.preview-strip');
const canvasWrapper = document.getElementById('canvas-wrapper');

let isSliding = false;
let skipSidePreviewRender = false;  // Flag to skip re-rendering side previews after pre-render

// Two-finger horizontal swipe to navigate between screenshots
let swipeAccumulator = 0;
const SWIPE_THRESHOLD = 50; // Minimum accumulated delta to trigger navigation

// Prevent browser back/forward gesture on the entire canvas area
canvasWrapper.addEventListener('wheel', (e) => {
    // Prevent horizontal scroll from triggering browser back/forward
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
    }
}, { passive: false });

previewStrip.addEventListener('wheel', (e) => {
    // Only handle horizontal scrolling (two-finger swipe on trackpad)
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

    e.preventDefault();
    e.stopPropagation();

    if (isSliding) return;
    if (state.screenshots.length <= 1) return;

    swipeAccumulator += e.deltaX;

    if (swipeAccumulator > SWIPE_THRESHOLD) {
        // Swipe left = go to next screenshot
        const nextIndex = state.selectedIndex + 1;
        if (nextIndex < state.screenshots.length) {
            slideToScreenshot(nextIndex, 'right');
        }
        swipeAccumulator = 0;
    } else if (swipeAccumulator < -SWIPE_THRESHOLD) {
        // Swipe right = go to previous screenshot
        const prevIndex = state.selectedIndex - 1;
        if (prevIndex >= 0) {
            slideToScreenshot(prevIndex, 'left');
        }
        swipeAccumulator = 0;
    }
}, { passive: false });
let suppressSwitchModelUpdate = false;  // Flag to suppress updateCanvas from switchPhoneModel
const fileInput = document.getElementById('file-input');
const screenshotList = document.getElementById('screenshot-list');
const noScreenshot = document.getElementById('no-screenshot');

// IndexedDB for larger storage (can store hundreds of MB vs localStorage's 5-10MB)
let db = null;
const DB_NAME = 'AppStoreScreenshotGenerator';
const DB_VERSION = 2;
const PROJECTS_STORE = 'projects';
const META_STORE = 'meta';

let currentProjectId = 'default';
let projects = [{ id: 'default', name: 'Default Project', screenshotCount: 0 }];

function openDatabase() {
    return new Promise((resolve, reject) => {
        try {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                // Continue without database
                resolve(null);
            };
            
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };
            
            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                
                // Delete old store if exists (from version 1)
                if (database.objectStoreNames.contains('state')) {
                    database.deleteObjectStore('state');
                }
                
                // Create projects store
                if (!database.objectStoreNames.contains(PROJECTS_STORE)) {
                    database.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });
                }
                
                // Create meta store for project list and current project
                if (!database.objectStoreNames.contains(META_STORE)) {
                    database.createObjectStore(META_STORE, { keyPath: 'key' });
                }
            };
            
            request.onblocked = () => {
                console.warn('Database upgrade blocked. Please close other tabs.');
                resolve(null);
            };
        } catch (e) {
            console.error('Failed to open IndexedDB:', e);
            resolve(null);
        }
    });
}

// Load project list and current project
async function loadProjectsMeta() {
    if (!db) return;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction([META_STORE], 'readonly');
            const store = transaction.objectStore(META_STORE);
            
            const projectsReq = store.get('projects');
            const currentReq = store.get('currentProject');
            
            transaction.oncomplete = () => {
                if (projectsReq.result) {
                    projects = projectsReq.result.value;
                }
                if (currentReq.result) {
                    currentProjectId = currentReq.result.value;
                }
                updateProjectSelector();
                resolve();
            };
            
            transaction.onerror = () => resolve();
        } catch (e) {
            resolve();
        }
    });
}

// Save project list and current project
function saveProjectsMeta() {
    if (!db) return;
    
    try {
        const transaction = db.transaction([META_STORE], 'readwrite');
        const store = transaction.objectStore(META_STORE);
        store.put({ key: 'projects', value: projects });
        store.put({ key: 'currentProject', value: currentProjectId });
    } catch (e) {
        console.error('Error saving projects meta:', e);
    }
}

// Update project selector dropdown
function updateProjectSelector() {
    const menu = document.getElementById('project-menu');
    menu.innerHTML = '';

    // Find current project
    const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

    // Update trigger display - always use actual state for current project
    document.getElementById('project-trigger-name').textContent = currentProject.name;
    const count = state.screenshots.length;
    document.getElementById('project-trigger-meta').textContent = `${count} screenshot${count !== 1 ? 's' : ''}`;

    // Build menu options
    projects.forEach(project => {
        const option = document.createElement('div');
        option.className = 'project-option' + (project.id === currentProjectId ? ' selected' : '');
        option.dataset.projectId = project.id;

        const screenshotCount = project.id === currentProjectId ? state.screenshots.length : (project.screenshotCount || 0);

        option.innerHTML = `
            <span class="project-option-name">${project.name}</span>
            <span class="project-option-meta">${screenshotCount} screenshot${screenshotCount !== 1 ? 's' : ''}</span>
        `;

        option.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (project.id !== currentProjectId) {
                await switchProject(project.id);
            }
            document.getElementById('project-dropdown').classList.remove('open');
        });

        menu.appendChild(option);
    });
}

// Initialize
async function init() {
    try {
        await openDatabase();
        await loadProjectsMeta();
        await loadState();
        syncUIWithState();
        updateCanvas();
    } catch (e) {
        console.error('Initialization error:', e);
        // Continue with defaults
        syncUIWithState();
        updateCanvas();
    }
}

// Set up event listeners immediately (don't wait for async init)
function initSync() {
    setupEventListeners();
    initFontPicker();
    updateGradientStopsUI();
    updateCanvas();
    // Then load saved data asynchronously
    init();
}

// Debounce utility for saveState
let saveStateTimeout = null;
const SAVE_DEBOUNCE_MS = 1000; // Wait 1 second after last change before saving

// Debounced save - call this during frequent updates (sliders, dragging, etc.)
function debouncedSaveState() {
    if (saveStateTimeout) {
        clearTimeout(saveStateTimeout);
    }
    saveStateTimeout = setTimeout(() => {
        saveState();
        saveStateTimeout = null;
    }, SAVE_DEBOUNCE_MS);
}

// Save state to IndexedDB for current project
function saveState() {
    if (!db) return;

    // Convert screenshots to base64 for storage, including per-screenshot settings and localized images
    const screenshotsToSave = state.screenshots.map(s => {
        // Save localized images (without Image objects, just src/name)
        const localizedImages = {};
        if (s.localizedImages) {
            Object.keys(s.localizedImages).forEach(lang => {
                const langData = s.localizedImages[lang];
                if (langData?.src) {
                    localizedImages[lang] = {
                        src: langData.src,
                        name: langData.name
                    };
                }
            });
        }

        return {
            src: s.image?.src || '', // Legacy compatibility
            name: s.name,
            deviceType: s.deviceType,
            localizedImages: localizedImages,
            background: s.background,
            screenshot: s.screenshot,
            text: s.text,
            overrides: s.overrides
        };
    });

    const stateToSave = {
        id: currentProjectId,
        screenshots: screenshotsToSave,
        selectedIndex: state.selectedIndex,
        outputDevice: state.outputDevice,
        customWidth: state.customWidth,
        customHeight: state.customHeight,
        currentLanguage: state.currentLanguage,
        projectLanguages: state.projectLanguages,
        defaults: state.defaults
    };

    // Update screenshot count in project metadata
    const project = projects.find(p => p.id === currentProjectId);
    if (project) {
        project.screenshotCount = state.screenshots.length;
        saveProjectsMeta();
    }

    try {
        const transaction = db.transaction([PROJECTS_STORE], 'readwrite');
        const store = transaction.objectStore(PROJECTS_STORE);
        store.put(stateToSave);
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

// Load state from IndexedDB for current project
function loadState() {
    if (!db) return Promise.resolve();
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction([PROJECTS_STORE], 'readonly');
            const store = transaction.objectStore(PROJECTS_STORE);
            const request = store.get(currentProjectId);
            
            request.onsuccess = () => {
                const parsed = request.result;
                if (parsed) {
                    // Check if this is an old-style project (no per-screenshot settings)
                    const isOldFormat = !parsed.defaults && (parsed.background || parsed.screenshot || parsed.text);
                    const hasScreenshotsWithoutSettings = parsed.screenshots?.some(s => !s.background && !s.screenshot && !s.text);
                    const needsMigration = isOldFormat || hasScreenshotsWithoutSettings;

                    // Load screenshots with their per-screenshot settings
                    state.screenshots = [];

                    // Build migrated settings from old format if needed
                    let migratedBackground = state.defaults.background;
                    let migratedScreenshot = state.defaults.screenshot;
                    let migratedText = state.defaults.text;

                    if (isOldFormat) {
                        if (parsed.background) {
                            migratedBackground = {
                                type: parsed.background.type || 'gradient',
                                gradient: parsed.background.gradient || state.defaults.background.gradient,
                                solid: parsed.background.solid || state.defaults.background.solid,
                                image: null,
                                imageFit: parsed.background.imageFit || 'cover',
                                imageBlur: parsed.background.imageBlur || 0,
                                overlayColor: parsed.background.overlayColor || '#000000',
                                overlayOpacity: parsed.background.overlayOpacity || 0,
                                noise: parsed.background.noise || false,
                                noiseIntensity: parsed.background.noiseIntensity || 10
                            };
                        }
                        if (parsed.screenshot) {
                            migratedScreenshot = { ...state.defaults.screenshot, ...parsed.screenshot };
                        }
                        if (parsed.text) {
                            migratedText = { ...state.defaults.text, ...parsed.text };
                        }
                    }

                    if (parsed.screenshots && parsed.screenshots.length > 0) {
                        let loadedCount = 0;
                        const totalToLoad = parsed.screenshots.length;

                        parsed.screenshots.forEach((s, index) => {
                            // Check if we have new localized format or old single-image format
                            const hasLocalizedImages = s.localizedImages && Object.keys(s.localizedImages).length > 0;

                            if (hasLocalizedImages) {
                                // New format: load all localized images
                                const langKeys = Object.keys(s.localizedImages);
                                let langLoadedCount = 0;
                                const localizedImages = {};

                                langKeys.forEach(lang => {
                                    const langData = s.localizedImages[lang];
                                    if (langData?.src) {
                                        const langImg = new Image();
                                        langImg.onload = () => {
                                            localizedImages[lang] = {
                                                image: langImg,
                                                src: langData.src,
                                                name: langData.name || s.name
                                            };
                                            langLoadedCount++;

                                            if (langLoadedCount === langKeys.length) {
                                                // All language versions loaded
                                                const firstLang = langKeys[0];
                                                state.screenshots[index] = {
                                                    image: localizedImages[firstLang]?.image, // Legacy compat
                                                    name: s.name,
                                                    deviceType: s.deviceType,
                                                    localizedImages: localizedImages,
                                                    background: s.background || JSON.parse(JSON.stringify(migratedBackground)),
                                                    screenshot: s.screenshot || JSON.parse(JSON.stringify(migratedScreenshot)),
                                                    text: s.text || JSON.parse(JSON.stringify(migratedText)),
                                                    overrides: s.overrides || {}
                                                };
                                                loadedCount++;
                                                checkAllLoaded();
                                            }
                                        };
                                        langImg.src = langData.src;
                                    } else {
                                        langLoadedCount++;
                                        if (langLoadedCount === langKeys.length) {
                                            loadedCount++;
                                            checkAllLoaded();
                                        }
                                    }
                                });
                            } else {
                                // Old format: migrate to localized images
                                const img = new Image();
                                img.onload = () => {
                                    // Detect language from filename, default to 'en'
                                    const detectedLang = typeof detectLanguageFromFilename === 'function'
                                        ? detectLanguageFromFilename(s.name || '')
                                        : 'en';

                                    const localizedImages = {};
                                    localizedImages[detectedLang] = {
                                        image: img,
                                        src: s.src,
                                        name: s.name
                                    };

                                    state.screenshots[index] = {
                                        image: img,
                                        name: s.name,
                                        deviceType: s.deviceType,
                                        localizedImages: localizedImages,
                                        background: s.background || JSON.parse(JSON.stringify(migratedBackground)),
                                        screenshot: s.screenshot || JSON.parse(JSON.stringify(migratedScreenshot)),
                                        text: s.text || JSON.parse(JSON.stringify(migratedText)),
                                        overrides: s.overrides || {}
                                    };
                                    loadedCount++;
                                    checkAllLoaded();
                                };
                                img.src = s.src;
                            }
                        });

                        function checkAllLoaded() {
                            if (loadedCount === totalToLoad) {
                                updateScreenshotList();
                                syncUIWithState();
                                updateGradientStopsUI();
                                updateCanvas();

                                if (needsMigration && parsed.screenshots.length > 0) {
                                    showMigrationPrompt();
                                }
                            }
                        }
                    } else {
                        // No screenshots - still need to update UI
                        updateScreenshotList();
                        syncUIWithState();
                        updateGradientStopsUI();
                        updateCanvas();
                    }

                    state.selectedIndex = parsed.selectedIndex || 0;
                    state.outputDevice = parsed.outputDevice || 'iphone-6.9';
                    state.customWidth = parsed.customWidth || 1320;
                    state.customHeight = parsed.customHeight || 2868;

                    // Load global language settings
                    state.currentLanguage = parsed.currentLanguage || 'en';
                    state.projectLanguages = parsed.projectLanguages || ['en'];

                    // Load defaults (new format) or use migrated settings
                    if (parsed.defaults) {
                        state.defaults = parsed.defaults;
                    } else {
                        state.defaults.background = migratedBackground;
                        state.defaults.screenshot = migratedScreenshot;
                        state.defaults.text = migratedText;
                    }
                } else {
                    // New project, reset to defaults
                    resetStateToDefaults();
                }
                resolve();
            };
            
            request.onerror = () => {
                console.error('Error loading state:', request.error);
                resolve();
            };
        } catch (e) {
            console.error('Error loading state:', e);
            resolve();
        }
    });
}

// Show migration prompt for old-style projects
function showMigrationPrompt() {
    const modal = document.getElementById('migration-modal');
    if (modal) {
        modal.classList.add('visible');
    }
}

function hideMigrationPrompt() {
    const modal = document.getElementById('migration-modal');
    if (modal) {
        modal.classList.remove('visible');
    }
}

function convertProject() {
    // Project is already converted in memory, just save it
    saveState();
    hideMigrationPrompt();
}

// Reset state to defaults (without clearing storage)
function resetStateToDefaults() {
    state.screenshots = [];
    state.selectedIndex = 0;
    state.outputDevice = 'iphone-6.9';
    state.customWidth = 1320;
    state.customHeight = 2868;
    state.currentLanguage = 'en';
    state.projectLanguages = ['en'];
    state.defaults = {
        background: {
            type: 'gradient',
            gradient: {
                angle: 135,
                stops: [
                    { color: '#667eea', position: 0 },
                    { color: '#764ba2', position: 100 }
                ]
            },
            solid: '#1a1a2e',
            image: null,
            imageFit: 'cover',
            imageBlur: 0,
            overlayColor: '#000000',
            overlayOpacity: 0,
            noise: false,
            noiseIntensity: 10
        },
        screenshot: {
            scale: 70,
            y: 55,
            x: 50,
            rotation: 0,
            perspective: 0,
            cornerRadius: 24,
            shadow: {
                enabled: true,
                color: '#000000',
                blur: 40,
                opacity: 30,
                x: 0,
                y: 20
            },
            frame: {
                enabled: false,
                color: '#1d1d1f',
                width: 12,
                opacity: 100
            }
        },
        text: {
            headlines: { en: '' },
            headlineLanguages: ['en'],
            currentHeadlineLang: 'en',
            headlineFont: "-apple-system, BlinkMacSystemFont, 'SF Pro Display'",
            headlineSize: 100,
            headlineWeight: '600',
            headlineItalic: false,
            headlineUnderline: false,
            headlineStrikethrough: false,
            headlineColor: '#ffffff',
            position: 'top',
            offsetY: 12,
            lineHeight: 110,
            subheadlines: { en: '' },
            subheadlineLanguages: ['en'],
            currentSubheadlineLang: 'en',
            subheadlineFont: "-apple-system, BlinkMacSystemFont, 'SF Pro Display'",
            subheadlineSize: 50,
            subheadlineWeight: '400',
            subheadlineItalic: false,
            subheadlineUnderline: false,
            subheadlineStrikethrough: false,
            subheadlineColor: '#ffffff',
            subheadlineOpacity: 70
        }
    };
}

// Switch to a different project
async function switchProject(projectId) {
    // Save current project first
    saveState();
    
    currentProjectId = projectId;
    saveProjectsMeta();
    
    // Reset and load new project
    resetStateToDefaults();
    await loadState();

    syncUIWithState();
    updateScreenshotList();
    updateGradientStopsUI();
    updateProjectSelector();
    updateCanvas();
}

// Create a new project
async function createProject(name) {
    const id = 'project_' + Date.now();
    projects.push({ id, name, screenshotCount: 0 });
    saveProjectsMeta();
    await switchProject(id);
    updateProjectSelector();
}

// Rename current project
function renameProject(newName) {
    const project = projects.find(p => p.id === currentProjectId);
    if (project) {
        project.name = newName;
        saveProjectsMeta();
        updateProjectSelector();
    }
}

// Delete current project
async function deleteProject() {
    if (projects.length <= 1) {
        alert('Cannot delete the only project');
        return;
    }

    // Remove from projects list
    const index = projects.findIndex(p => p.id === currentProjectId);
    if (index > -1) {
        projects.splice(index, 1);
    }

    // Delete from IndexedDB
    if (db) {
        const transaction = db.transaction([PROJECTS_STORE], 'readwrite');
        const store = transaction.objectStore(PROJECTS_STORE);
        store.delete(currentProjectId);
    }

    // Switch to first available project
    saveProjectsMeta();
    await switchProject(projects[0].id);
    updateProjectSelector();
}

// Sync UI controls with current state
function syncUIWithState() {
    // Update language button
    updateLanguageButton();

    // Device selector dropdown
    document.querySelectorAll('.output-size-menu .device-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.device === state.outputDevice);
    });

    // Update dropdown trigger text
    const selectedOption = document.querySelector(`.output-size-menu .device-option[data-device="${state.outputDevice}"]`);
    if (selectedOption) {
        document.getElementById('output-size-name').textContent = selectedOption.querySelector('.device-option-name').textContent;
        if (state.outputDevice === 'custom') {
            document.getElementById('output-size-dims').textContent = `${state.customWidth} × ${state.customHeight}`;
        } else {
            document.getElementById('output-size-dims').textContent = selectedOption.querySelector('.device-option-size').textContent;
        }
    }

    // Show/hide custom inputs
    const customInputs = document.getElementById('custom-size-inputs');
    customInputs.classList.toggle('visible', state.outputDevice === 'custom');
    document.getElementById('custom-width').value = state.customWidth;
    document.getElementById('custom-height').value = state.customHeight;

    // Get current screenshot's settings
    const bg = getBackground();
    const ss = getScreenshotSettings();
    const txt = getText();

    // Background type
    document.querySelectorAll('#bg-type-selector button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === bg.type);
    });
    document.getElementById('gradient-options').style.display = bg.type === 'gradient' ? 'block' : 'none';
    document.getElementById('solid-options').style.display = bg.type === 'solid' ? 'block' : 'none';
    document.getElementById('image-options').style.display = bg.type === 'image' ? 'block' : 'none';

    // Gradient
    const gradientAngle = bg.gradient?.angle ?? 135;
    document.getElementById('gradient-angle').value = gradientAngle;
    document.getElementById('gradient-angle-value').textContent = formatValue(gradientAngle) + '°';
    updateGradientStopsUI();

    // Solid color
    const solidColor = bg.solid || '#1a1a2e';
    document.getElementById('solid-color').value = solidColor;
    document.getElementById('solid-color-hex').value = solidColor;

    // Image background
    document.getElementById('bg-image-fit').value = bg.imageFit;
    document.getElementById('bg-blur').value = bg.imageBlur;
    document.getElementById('bg-blur-value').textContent = formatValue(bg.imageBlur) + 'px';
    document.getElementById('bg-overlay-color').value = bg.overlayColor;
    document.getElementById('bg-overlay-hex').value = bg.overlayColor;
    document.getElementById('bg-overlay-opacity').value = bg.overlayOpacity;
    document.getElementById('bg-overlay-opacity-value').textContent = formatValue(bg.overlayOpacity) + '%';

    // Noise
    document.getElementById('noise-toggle').classList.toggle('active', bg.noise);
    document.getElementById('noise-intensity').value = bg.noiseIntensity;
    document.getElementById('noise-intensity-value').textContent = formatValue(bg.noiseIntensity) + '%';

    // Screenshot settings
    document.getElementById('screenshot-scale').value = ss.scale;
    document.getElementById('screenshot-scale-value').textContent = formatValue(ss.scale) + '%';
    document.getElementById('screenshot-y').value = ss.y;
    document.getElementById('screenshot-y-value').textContent = formatValue(ss.y) + '%';
    document.getElementById('screenshot-x').value = ss.x;
    document.getElementById('screenshot-x-value').textContent = formatValue(ss.x) + '%';
    document.getElementById('corner-radius').value = ss.cornerRadius;
    document.getElementById('corner-radius-value').textContent = formatValue(ss.cornerRadius) + 'px';
    document.getElementById('screenshot-rotation').value = ss.rotation;
    document.getElementById('screenshot-rotation-value').textContent = formatValue(ss.rotation) + '°';

    // Shadow
    document.getElementById('shadow-toggle').classList.toggle('active', ss.shadow.enabled);
    document.getElementById('shadow-color').value = ss.shadow.color;
    document.getElementById('shadow-color-hex').value = ss.shadow.color;
    document.getElementById('shadow-blur').value = ss.shadow.blur;
    document.getElementById('shadow-blur-value').textContent = formatValue(ss.shadow.blur) + 'px';
    document.getElementById('shadow-opacity').value = ss.shadow.opacity;
    document.getElementById('shadow-opacity-value').textContent = formatValue(ss.shadow.opacity) + '%';
    document.getElementById('shadow-x').value = ss.shadow.x;
    document.getElementById('shadow-x-value').textContent = formatValue(ss.shadow.x) + 'px';
    document.getElementById('shadow-y').value = ss.shadow.y;
    document.getElementById('shadow-y-value').textContent = formatValue(ss.shadow.y) + 'px';

    // Frame/Border
    document.getElementById('frame-toggle').classList.toggle('active', ss.frame.enabled);
    document.getElementById('frame-color').value = ss.frame.color;
    document.getElementById('frame-color-hex').value = ss.frame.color;
    document.getElementById('frame-width').value = ss.frame.width;
    document.getElementById('frame-width-value').textContent = formatValue(ss.frame.width) + 'px';
    document.getElementById('frame-opacity').value = ss.frame.opacity;
    document.getElementById('frame-opacity-value').textContent = formatValue(ss.frame.opacity) + '%';

    // Text
    const currentHeadline = txt.headlines ? (txt.headlines[txt.currentHeadlineLang || 'en'] || '') : (txt.headline || '');
    document.getElementById('headline-text').value = currentHeadline;
    document.getElementById('headline-font').value = txt.headlineFont;
    updateFontPickerPreview();
    document.getElementById('headline-size').value = txt.headlineSize;
    document.getElementById('headline-color').value = txt.headlineColor;
    document.getElementById('headline-weight').value = txt.headlineWeight;
    // Sync text style buttons
    document.querySelectorAll('#headline-style button').forEach(btn => {
        const style = btn.dataset.style;
        const key = 'headline' + style.charAt(0).toUpperCase() + style.slice(1);
        btn.classList.toggle('active', txt[key] || false);
    });
    document.querySelectorAll('#text-position button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.position === txt.position);
    });
    document.getElementById('text-offset-y').value = txt.offsetY;
    document.getElementById('text-offset-y-value').textContent = formatValue(txt.offsetY) + '%';
    document.getElementById('line-height').value = txt.lineHeight;
    document.getElementById('line-height-value').textContent = formatValue(txt.lineHeight) + '%';
    const currentSubheadline = txt.subheadlines ? (txt.subheadlines[txt.currentSubheadlineLang || 'en'] || '') : (txt.subheadline || '');
    document.getElementById('subheadline-text').value = currentSubheadline;
    document.getElementById('subheadline-font').value = txt.subheadlineFont || txt.headlineFont;
    document.getElementById('subheadline-size').value = txt.subheadlineSize;
    document.getElementById('subheadline-color').value = txt.subheadlineColor;
    document.getElementById('subheadline-opacity').value = txt.subheadlineOpacity;
    document.getElementById('subheadline-opacity-value').textContent = formatValue(txt.subheadlineOpacity) + '%';
    document.getElementById('subheadline-weight').value = txt.subheadlineWeight || '400';
    // Sync subheadline style buttons
    document.querySelectorAll('#subheadline-style button').forEach(btn => {
        const style = btn.dataset.style;
        const key = 'subheadline' + style.charAt(0).toUpperCase() + style.slice(1);
        btn.classList.toggle('active', txt[key] || false);
    });

    // Headline/Subheadline toggles
    const headlineEnabled = txt.headlineEnabled !== false; // default true for backwards compatibility
    const subheadlineEnabled = txt.subheadlineEnabled || false;
    document.getElementById('headline-toggle').classList.toggle('active', headlineEnabled);
    document.getElementById('subheadline-toggle').classList.toggle('active', subheadlineEnabled);

    // Language UIs
    updateHeadlineLanguageUI();
    updateSubheadlineLanguageUI();

    // 3D mode
    const use3D = ss.use3D || false;
    const device3D = ss.device3D || 'iphone';
    const rotation3D = ss.rotation3D || { x: 0, y: 0, z: 0 };
    document.querySelectorAll('#device-type-selector button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === (use3D ? '3d' : '2d'));
    });
    document.querySelectorAll('#device-3d-selector button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.model === device3D);
    });
    document.getElementById('rotation-3d-options').style.display = use3D ? 'block' : 'none';
    document.getElementById('rotation-3d-x').value = rotation3D.x;
    document.getElementById('rotation-3d-x-value').textContent = formatValue(rotation3D.x) + '°';
    document.getElementById('rotation-3d-y').value = rotation3D.y;
    document.getElementById('rotation-3d-y-value').textContent = formatValue(rotation3D.y) + '°';
    document.getElementById('rotation-3d-z').value = rotation3D.z;
    document.getElementById('rotation-3d-z-value').textContent = formatValue(rotation3D.z) + '°';

    // Hide 2D-only settings in 3D mode, show 3D tip
    document.getElementById('2d-only-settings').style.display = use3D ? 'none' : 'block';
    document.getElementById('position-presets-section').style.display = use3D ? 'none' : 'block';
    document.getElementById('3d-tip').style.display = use3D ? 'flex' : 'none';

    // Show/hide 3D renderer and switch model if needed
    if (typeof showThreeJS === 'function') {
        showThreeJS(use3D);
    }
    if (use3D && typeof switchPhoneModel === 'function') {
        switchPhoneModel(device3D);
    }
}

function setupEventListeners() {
    // Collapsible toggle rows
    document.querySelectorAll('.toggle-row.collapsible').forEach(row => {
        row.addEventListener('click', (e) => {
            // Don't collapse when clicking the toggle switch itself
            if (e.target.closest('.toggle')) return;

            const targetId = row.dataset.target;
            const target = document.getElementById(targetId);
            if (target) {
                row.classList.toggle('collapsed');
                target.style.display = row.classList.contains('collapsed') ? 'none' : 'block';
            }
        });
    });

    // File upload (upload zone is now in screenshot list, created dynamically in updateScreenshotList)
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // Main upload button in empty state
    const mainUploadBtn = document.getElementById('main-upload-btn');
    if (mainUploadBtn) {
        mainUploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }

    // Make the empty state area clickable and droppable
    noScreenshot.addEventListener('click', () => fileInput.click());

    noScreenshot.addEventListener('dragover', (e) => {
        e.preventDefault();
        noScreenshot.classList.add('dragover');
    });

    noScreenshot.addEventListener('dragleave', () => {
        noScreenshot.classList.remove('dragover');
    });

    noScreenshot.addEventListener('drop', (e) => {
        e.preventDefault();
        noScreenshot.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // Make entire canvas area a drop zone
    const canvasWrapper = document.getElementById('canvas-wrapper');
    canvasWrapper.addEventListener('dragover', (e) => {
        if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            canvasWrapper.classList.add('drop-active');
        }
    });

    canvasWrapper.addEventListener('dragleave', (e) => {
        if (!canvasWrapper.contains(e.relatedTarget)) {
            canvasWrapper.classList.remove('drop-active');
        }
    });

    canvasWrapper.addEventListener('drop', (e) => {
        if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            canvasWrapper.classList.remove('drop-active');
            handleFiles(e.dataTransfer.files);
        }
    });

    // Make entire screenshot list a drop zone
    screenshotList.addEventListener('dragover', (e) => {
        // Only handle file drops, not internal screenshot reordering
        if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            screenshotList.classList.add('drop-active');
        }
    });
    screenshotList.addEventListener('dragleave', (e) => {
        // Only remove class if leaving the list entirely
        if (!screenshotList.contains(e.relatedTarget)) {
            screenshotList.classList.remove('drop-active');
        }
    });
    screenshotList.addEventListener('drop', (e) => {
        if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            screenshotList.classList.remove('drop-active');
            handleFiles(e.dataTransfer.files);
        }
    });

    // Set as Default button (commented out)
    // document.getElementById('set-as-default-btn').addEventListener('click', () => {
    //     if (state.screenshots.length === 0) return;
    //     setCurrentScreenshotAsDefault();
    //     // Show brief confirmation
    //     const btn = document.getElementById('set-as-default-btn');
    //     const originalText = btn.textContent;
    //     btn.textContent = 'Saved!';
    //     btn.style.borderColor = 'var(--accent)';
    //     btn.style.color = 'var(--accent)';
    //     setTimeout(() => {
    //         btn.textContent = originalText;
    //         btn.style.borderColor = '';
    //         btn.style.color = '';
    //     }, 1500);
    // });

    // Project dropdown
    const projectDropdown = document.getElementById('project-dropdown');
    const projectTrigger = document.getElementById('project-trigger');

    projectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        projectDropdown.classList.toggle('open');
        // Close output size dropdown if open
        document.getElementById('output-size-dropdown').classList.remove('open');
    });

    // Close project dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!projectDropdown.contains(e.target)) {
            projectDropdown.classList.remove('open');
        }
    });

    document.getElementById('new-project-btn').addEventListener('click', () => {
        document.getElementById('project-modal-title').textContent = 'New Project';
        document.getElementById('project-name-input').value = '';
        document.getElementById('project-modal-confirm').textContent = 'Create';
        document.getElementById('project-modal').dataset.mode = 'new';
        document.getElementById('project-modal').classList.add('visible');
        document.getElementById('project-name-input').focus();
    });

    // Save button removed - state is auto-saved

    document.getElementById('rename-project-btn').addEventListener('click', () => {
        const project = projects.find(p => p.id === currentProjectId);
        document.getElementById('project-modal-title').textContent = 'Rename Project';
        document.getElementById('project-name-input').value = project ? project.name : '';
        document.getElementById('project-modal-confirm').textContent = 'Rename';
        document.getElementById('project-modal').dataset.mode = 'rename';
        document.getElementById('project-modal').classList.add('visible');
        document.getElementById('project-name-input').focus();
    });

    document.getElementById('delete-project-btn').addEventListener('click', () => {
        if (projects.length <= 1) {
            alert('Cannot delete the only project');
            return;
        }
        const project = projects.find(p => p.id === currentProjectId);
        document.getElementById('delete-project-message').textContent = 
            `Are you sure you want to delete "${project ? project.name : 'this project'}"? This cannot be undone.`;
        document.getElementById('delete-project-modal').classList.add('visible');
    });

    // Project modal buttons
    document.getElementById('project-modal-cancel').addEventListener('click', () => {
        document.getElementById('project-modal').classList.remove('visible');
    });

    document.getElementById('project-modal-confirm').addEventListener('click', async () => {
        const name = document.getElementById('project-name-input').value.trim();
        if (!name) {
            alert('Please enter a project name');
            return;
        }
        if (name.length > 50) {
            alert('Project name must be 50 characters or less');
            return;
        }

        const mode = document.getElementById('project-modal').dataset.mode;
        try {
            if (mode === 'new') {
                await createProject(name);
            } else if (mode === 'rename') {
                await renameProject(name);
            }
            document.getElementById('project-modal').classList.remove('visible');
        } catch (e) {
            console.error('Project operation failed:', e);
            alert('Failed to complete operation: ' + e.message);
        }
    });

    document.getElementById('project-name-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('project-modal-confirm').click();
        }
    });

    // Delete project modal buttons
    document.getElementById('delete-project-cancel').addEventListener('click', () => {
        document.getElementById('delete-project-modal').classList.remove('visible');
    });

    document.getElementById('delete-project-confirm').addEventListener('click', async () => {
        try {
            await deleteProject();
            document.getElementById('delete-project-modal').classList.remove('visible');
        } catch (e) {
            console.error('Failed to delete project:', e);
            alert('Failed to delete project: ' + e.message);
        }
    });

    // Apply style to all modal buttons
    document.getElementById('apply-style-cancel').addEventListener('click', () => {
        document.getElementById('apply-style-modal').classList.remove('visible');
    });

    document.getElementById('apply-style-confirm').addEventListener('click', () => {
        applyStyleToAll();
        document.getElementById('apply-style-modal').classList.remove('visible');
    });

    // Close modals on overlay click
    document.getElementById('project-modal').addEventListener('click', (e) => {
        if (e.target.id === 'project-modal') {
            document.getElementById('project-modal').classList.remove('visible');
        }
    });

    document.getElementById('delete-project-modal').addEventListener('click', (e) => {
        if (e.target.id === 'delete-project-modal') {
            document.getElementById('delete-project-modal').classList.remove('visible');
        }
    });

    document.getElementById('apply-style-modal').addEventListener('click', (e) => {
        if (e.target.id === 'apply-style-modal') {
            document.getElementById('apply-style-modal').classList.remove('visible');
        }
    });

    // Language picker events
    document.getElementById('language-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const btn = e.currentTarget;
        const menu = document.getElementById('language-menu');
        menu.classList.toggle('visible');
        if (menu.classList.contains('visible')) {
            // Position menu below button using fixed positioning
            const rect = btn.getBoundingClientRect();
            menu.style.top = (rect.bottom + 4) + 'px';
            menu.style.left = rect.left + 'px';
            updateLanguageMenu();
        }
    });

    // Close language menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-picker')) {
            document.getElementById('language-menu').classList.remove('visible');
        }
    });

    // Edit Languages button
    document.getElementById('edit-languages-btn').addEventListener('click', () => {
        openLanguagesModal();
    });

    // Translate All button
    document.getElementById('translate-all-btn').addEventListener('click', () => {
        document.getElementById('language-menu').classList.remove('visible');
        translateAllText();
    });

    // Magical Titles button (in header)
    document.getElementById('magical-titles-btn').addEventListener('click', () => {
        dismissMagicalTitlesTooltip();
        showMagicalTitlesDialog();
    });

    // Magical Titles modal events
    document.getElementById('magical-titles-cancel').addEventListener('click', hideMagicalTitlesDialog);
    document.getElementById('magical-titles-confirm').addEventListener('click', generateMagicalTitles);
    document.getElementById('magical-titles-modal').addEventListener('click', (e) => {
        if (e.target.id === 'magical-titles-modal') hideMagicalTitlesDialog();
    });

    // Languages modal events
    document.getElementById('languages-modal-close').addEventListener('click', closeLanguagesModal);
    document.getElementById('languages-modal-done').addEventListener('click', closeLanguagesModal);
    document.getElementById('languages-modal').addEventListener('click', (e) => {
        if (e.target.id === 'languages-modal') closeLanguagesModal();
    });

    document.getElementById('add-language-select').addEventListener('change', (e) => {
        if (e.target.value) {
            addProjectLanguage(e.target.value);
            e.target.value = '';
        }
    });

    // Screenshot translations modal events
    document.getElementById('screenshot-translations-modal-close').addEventListener('click', closeScreenshotTranslationsModal);
    document.getElementById('screenshot-translations-modal-done').addEventListener('click', closeScreenshotTranslationsModal);
    document.getElementById('screenshot-translations-modal').addEventListener('click', (e) => {
        if (e.target.id === 'screenshot-translations-modal') closeScreenshotTranslationsModal();
    });
    document.getElementById('translation-file-input').addEventListener('change', handleTranslationFileSelect);

    // Export language modal events
    document.getElementById('export-current-only').addEventListener('click', () => {
        closeExportLanguageDialog('current');
    });
    document.getElementById('export-all-languages').addEventListener('click', () => {
        closeExportLanguageDialog('all');
    });
    document.getElementById('export-language-modal-cancel').addEventListener('click', () => {
        closeExportLanguageDialog(null);
    });
    document.getElementById('export-language-modal').addEventListener('click', (e) => {
        if (e.target.id === 'export-language-modal') closeExportLanguageDialog(null);
    });

    // Duplicate screenshot dialog
    initDuplicateDialogListeners();
    document.getElementById('duplicate-screenshot-modal').addEventListener('click', (e) => {
        if (e.target.id === 'duplicate-screenshot-modal') closeDuplicateDialog('ignore');
    });

    // Translate button events
    document.getElementById('translate-headline-btn').addEventListener('click', () => {
        openTranslateModal('headline');
    });

    document.getElementById('translate-subheadline-btn').addEventListener('click', () => {
        openTranslateModal('subheadline');
    });

    document.getElementById('translate-source-lang').addEventListener('change', (e) => {
        updateTranslateSourcePreview();
    });

    document.getElementById('translate-modal-cancel').addEventListener('click', () => {
        document.getElementById('translate-modal').classList.remove('visible');
    });

    document.getElementById('translate-modal-apply').addEventListener('click', () => {
        applyTranslations();
        document.getElementById('translate-modal').classList.remove('visible');
    });

    document.getElementById('ai-translate-btn').addEventListener('click', () => {
        aiTranslateAll();
    });

    document.getElementById('translate-modal').addEventListener('click', (e) => {
        if (e.target.id === 'translate-modal') {
            document.getElementById('translate-modal').classList.remove('visible');
        }
    });

    // About modal
    document.getElementById('about-btn').addEventListener('click', () => {
        document.getElementById('about-modal').classList.add('visible');
    });

    document.getElementById('about-modal-close').addEventListener('click', () => {
        document.getElementById('about-modal').classList.remove('visible');
    });

    document.getElementById('about-modal').addEventListener('click', (e) => {
        if (e.target.id === 'about-modal') {
            document.getElementById('about-modal').classList.remove('visible');
        }
    });

    // Settings modal
    document.getElementById('settings-btn').addEventListener('click', () => {
        openSettingsModal();
    });

    document.getElementById('settings-modal-close').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.remove('visible');
    });

    document.getElementById('settings-modal-cancel').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.remove('visible');
    });

    document.getElementById('settings-modal-save').addEventListener('click', () => {
        saveSettings();
    });

    // Provider radio buttons
    document.querySelectorAll('input[name="ai-provider"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            updateProviderSection(e.target.value);
        });
    });

    // Show/hide key buttons for all providers
    document.querySelectorAll('.settings-show-key').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
            }
        });
    });

    document.getElementById('settings-modal').addEventListener('click', (e) => {
        if (e.target.id === 'settings-modal') {
            document.getElementById('settings-modal').classList.remove('visible');
        }
    });

    // Output size dropdown
    const outputDropdown = document.getElementById('output-size-dropdown');
    const outputTrigger = document.getElementById('output-size-trigger');

    outputTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        outputDropdown.classList.toggle('open');
        // Close project dropdown if open
        document.getElementById('project-dropdown').classList.remove('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!outputDropdown.contains(e.target)) {
            outputDropdown.classList.remove('open');
        }
    });

    // Device option selection
    document.querySelectorAll('.output-size-menu .device-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.output-size-menu .device-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            state.outputDevice = opt.dataset.device;

            // Update trigger text
            document.getElementById('output-size-name').textContent = opt.querySelector('.device-option-name').textContent;
            document.getElementById('output-size-dims').textContent = opt.querySelector('.device-option-size').textContent;

            // Show/hide custom inputs
            const customInputs = document.getElementById('custom-size-inputs');
            if (state.outputDevice === 'custom') {
                customInputs.classList.add('visible');
            } else {
                customInputs.classList.remove('visible');
                outputDropdown.classList.remove('open');
            }
            updateCanvas();
        });
    });

    // Custom size inputs
    document.getElementById('custom-width').addEventListener('input', (e) => {
        state.customWidth = parseInt(e.target.value) || 1290;
        document.getElementById('output-size-dims').textContent = `${state.customWidth} × ${state.customHeight}`;
        updateCanvas();
    });
    document.getElementById('custom-height').addEventListener('input', (e) => {
        state.customHeight = parseInt(e.target.value) || 2796;
        document.getElementById('output-size-dims').textContent = `${state.customWidth} × ${state.customHeight}`;
        updateCanvas();
    });

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
            // Save active tab to localStorage
            localStorage.setItem('activeTab', tab.dataset.tab);
        });
    });

    // Restore active tab from localStorage
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        const tabBtn = document.querySelector(`.tab[data-tab="${savedTab}"]`);
        if (tabBtn) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tabBtn.classList.add('active');
            document.getElementById('tab-' + savedTab).classList.add('active');
        }
    }

    // Background type selector
    document.querySelectorAll('#bg-type-selector button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#bg-type-selector button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setBackground('type', btn.dataset.type);
            
            document.getElementById('gradient-options').style.display = btn.dataset.type === 'gradient' ? 'block' : 'none';
            document.getElementById('solid-options').style.display = btn.dataset.type === 'solid' ? 'block' : 'none';
            document.getElementById('image-options').style.display = btn.dataset.type === 'image' ? 'block' : 'none';
            
            updateCanvas();
        });
    });

    // Gradient preset dropdown toggle
    const presetDropdown = document.getElementById('gradient-preset-dropdown');
    const presetTrigger = document.getElementById('gradient-preset-trigger');
    presetTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        presetDropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!presetDropdown.contains(e.target)) {
            presetDropdown.classList.remove('open');
        }
    });

    // Position preset dropdown toggle
    const positionPresetDropdown = document.getElementById('position-preset-dropdown');
    const positionPresetTrigger = document.getElementById('position-preset-trigger');
    positionPresetTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        positionPresetDropdown.classList.toggle('open');
    });

    // Close position preset dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!positionPresetDropdown.contains(e.target)) {
            positionPresetDropdown.classList.remove('open');
        }
    });

    // Close screenshot menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.screenshot-menu-wrapper')) {
            document.querySelectorAll('.screenshot-menu.open').forEach(m => m.classList.remove('open'));
        }
    });

    // Gradient presets
    document.querySelectorAll('.preset-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            document.querySelectorAll('.preset-swatch').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
            
            // Parse gradient from preset
            const gradientStr = swatch.dataset.gradient;
            const angleMatch = gradientStr.match(/(\d+)deg/);
            const colorMatches = gradientStr.matchAll(/(#[a-fA-F0-9]{6})\s+(\d+)%/g);
            
            if (angleMatch) {
                const angle = parseInt(angleMatch[1]);
                setBackground('gradient.angle', angle);
                document.getElementById('gradient-angle').value = angle;
                document.getElementById('gradient-angle-value').textContent = formatValue(angle) + '°';
            }

            const stops = [];
            for (const match of colorMatches) {
                stops.push({ color: match[1], position: parseInt(match[2]) });
            }
            if (stops.length >= 2) {
                setBackground('gradient.stops', stops);
                updateGradientStopsUI();
            }
            
            updateCanvas();
        });
    });

    // Gradient angle
    document.getElementById('gradient-angle').addEventListener('input', (e) => {
        setBackground('gradient.angle', parseInt(e.target.value));
        document.getElementById('gradient-angle-value').textContent = formatValue(e.target.value) + '°';
        // Deselect preset when manually changing angle
        document.querySelectorAll('.preset-swatch').forEach(s => s.classList.remove('selected'));
        updateCanvas();
    });

    // Add gradient stop
    document.getElementById('add-gradient-stop').addEventListener('click', () => {
        const bg = getBackground();
        if (!bg.gradient || !bg.gradient.stops || bg.gradient.stops.length === 0) {
            // Initialize gradient if not present
            bg.gradient = {
                angle: 135,
                stops: [
                    { color: '#667eea', position: 0 },
                    { color: '#764ba2', position: 100 }
                ]
            };
        }
        const lastStop = bg.gradient.stops[bg.gradient.stops.length - 1];
        bg.gradient.stops.push({
            color: lastStop.color,
            position: Math.min(lastStop.position + 20, 100)
        });
        // Deselect preset when adding a stop
        document.querySelectorAll('.preset-swatch').forEach(s => s.classList.remove('selected'));
        updateGradientStopsUI();
        updateCanvas();
    });

    // Solid color
    document.getElementById('solid-color').addEventListener('input', (e) => {
        setBackground('solid', e.target.value);
        document.getElementById('solid-color-hex').value = e.target.value;
        updateCanvas();
    });
    document.getElementById('solid-color-hex').addEventListener('input', (e) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
            setBackground('solid', e.target.value);
            document.getElementById('solid-color').value = e.target.value;
            updateCanvas();
        }
    });

    // Background image
    const bgImageUpload = document.getElementById('bg-image-upload');
    const bgImageInput = document.getElementById('bg-image-input');
    bgImageUpload.addEventListener('click', () => bgImageInput.click());
    bgImageInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setBackground('image', img);
                    document.getElementById('bg-image-preview').src = event.target.result;
                    document.getElementById('bg-image-preview').style.display = 'block';
                    updateCanvas();
                };
                img.onerror = () => {
                    console.error('Failed to load background image');
                    alert('Failed to load image. Please try a different file.');
                };
                img.src = event.target.result;
            };
            reader.onerror = () => {
                console.error('Failed to read background image file');
                alert('Failed to read file. Please try again.');
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    document.getElementById('bg-image-fit').addEventListener('change', (e) => {
        setBackground('imageFit', e.target.value);
        updateCanvas();
    });

    document.getElementById('bg-blur').addEventListener('input', (e) => {
        setBackground('imageBlur', parseInt(e.target.value));
        document.getElementById('bg-blur-value').textContent = formatValue(e.target.value) + 'px';
        updateCanvas();
    });

    document.getElementById('bg-overlay-color').addEventListener('input', (e) => {
        setBackground('overlayColor', e.target.value);
        document.getElementById('bg-overlay-hex').value = e.target.value;
        updateCanvas();
    });

    document.getElementById('bg-overlay-opacity').addEventListener('input', (e) => {
        setBackground('overlayOpacity', parseInt(e.target.value));
        document.getElementById('bg-overlay-opacity-value').textContent = formatValue(e.target.value) + '%';
        updateCanvas();
    });

    // Noise toggle
    document.getElementById('noise-toggle').addEventListener('click', function() {
        this.classList.toggle('active');
        const noiseEnabled = this.classList.contains('active');
        setBackground('noise', noiseEnabled);
        const row = this.closest('.toggle-row');
        if (noiseEnabled) {
            if (row) row.classList.remove('collapsed');
            document.getElementById('noise-options').style.display = 'block';
        } else {
            if (row) row.classList.add('collapsed');
            document.getElementById('noise-options').style.display = 'none';
        }
        updateCanvas();
    });

    document.getElementById('noise-intensity').addEventListener('input', (e) => {
        setBackground('noiseIntensity', parseInt(e.target.value));
        document.getElementById('noise-intensity-value').textContent = formatValue(e.target.value) + '%';
        updateCanvas();
    });

    // Screenshot settings
    document.getElementById('screenshot-scale').addEventListener('input', (e) => {
        setScreenshotSetting('scale', parseInt(e.target.value));
        document.getElementById('screenshot-scale-value').textContent = formatValue(e.target.value) + '%';
        updateCanvas();
    });

    document.getElementById('screenshot-y').addEventListener('input', (e) => {
        setScreenshotSetting('y', parseInt(e.target.value));
        document.getElementById('screenshot-y-value').textContent = formatValue(e.target.value) + '%';
        updateCanvas();
    });

    document.getElementById('screenshot-x').addEventListener('input', (e) => {
        setScreenshotSetting('x', parseInt(e.target.value));
        document.getElementById('screenshot-x-value').textContent = formatValue(e.target.value) + '%';
        updateCanvas();
    });

    document.getElementById('corner-radius').addEventListener('input', (e) => {
        setScreenshotSetting('cornerRadius', parseInt(e.target.value));
        document.getElementById('corner-radius-value').textContent = formatValue(e.target.value) + 'px';
        updateCanvas();
    });

    document.getElementById('screenshot-rotation').addEventListener('input', (e) => {
        setScreenshotSetting('rotation', parseInt(e.target.value));
        document.getElementById('screenshot-rotation-value').textContent = formatValue(e.target.value) + '°';
        updateCanvas();
    });

    // Shadow toggle
    document.getElementById('shadow-toggle').addEventListener('click', function() {
        this.classList.toggle('active');
        const shadowEnabled = this.classList.contains('active');
        setScreenshotSetting('shadow.enabled', shadowEnabled);
        const row = this.closest('.toggle-row');
        if (shadowEnabled) {
            if (row) row.classList.remove('collapsed');
            document.getElementById('shadow-options').style.display = 'block';
        } else {
            if (row) row.classList.add('collapsed');
            document.getElementById('shadow-options').style.display = 'none';
        }
        updateCanvas();
    });

    document.getElementById('shadow-color').addEventListener('input', (e) => {
        setScreenshotSetting('shadow.color', e.target.value);
        document.getElementById('shadow-color-hex').value = e.target.value;
        updateCanvas();
    });

    document.getElementById('shadow-blur').addEventListener('input', (e) => {
        setScreenshotSetting('shadow.blur', parseInt(e.target.value));
        document.getElementById('shadow-blur-value').textContent = formatValue(e.target.value) + 'px';
        updateCanvas();
    });

    document.getElementById('shadow-opacity').addEventListener('input', (e) => {
        setScreenshotSetting('shadow.opacity', parseInt(e.target.value));
        document.getElementById('shadow-opacity-value').textContent = formatValue(e.target.value) + '%';
        updateCanvas();
    });

    document.getElementById('shadow-x').addEventListener('input', (e) => {
        setScreenshotSetting('shadow.x', parseInt(e.target.value));
        document.getElementById('shadow-x-value').textContent = formatValue(e.target.value) + 'px';
        updateCanvas();
    });

    document.getElementById('shadow-y').addEventListener('input', (e) => {
        setScreenshotSetting('shadow.y', parseInt(e.target.value));
        document.getElementById('shadow-y-value').textContent = formatValue(e.target.value) + 'px';
        updateCanvas();
    });

    // Frame toggle
    document.getElementById('frame-toggle').addEventListener('click', function() {
        this.classList.toggle('active');
        const frameEnabled = this.classList.contains('active');
        setScreenshotSetting('frame.enabled', frameEnabled);
        const row = this.closest('.toggle-row');
        if (frameEnabled) {
            if (row) row.classList.remove('collapsed');
            document.getElementById('frame-options').style.display = 'block';
        } else {
            if (row) row.classList.add('collapsed');
            document.getElementById('frame-options').style.display = 'none';
        }
        updateCanvas();
    });

    document.getElementById('frame-color').addEventListener('input', (e) => {
        setScreenshotSetting('frame.color', e.target.value);
        document.getElementById('frame-color-hex').value = e.target.value;
        updateCanvas();
    });

    document.getElementById('frame-color-hex').addEventListener('input', (e) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
            setScreenshotSetting('frame.color', e.target.value);
            document.getElementById('frame-color').value = e.target.value;
            updateCanvas();
        }
    });

    document.getElementById('frame-width').addEventListener('input', (e) => {
        setScreenshotSetting('frame.width', parseInt(e.target.value));
        document.getElementById('frame-width-value').textContent = formatValue(e.target.value) + 'px';
        updateCanvas();
    });

    document.getElementById('frame-opacity').addEventListener('input', (e) => {
        setScreenshotSetting('frame.opacity', parseInt(e.target.value));
        document.getElementById('frame-opacity-value').textContent = formatValue(e.target.value) + '%';
        updateCanvas();
    });

    // Headline toggle
    document.getElementById('headline-toggle').addEventListener('click', function() {
        this.classList.toggle('active');
        const enabled = this.classList.contains('active');
        setTextValue('headlineEnabled', enabled);
        const row = this.closest('.toggle-row');
        if (enabled) {
            if (row) row.classList.remove('collapsed');
            document.getElementById('headline-options').style.display = 'block';
        } else {
            if (row) row.classList.add('collapsed');
            document.getElementById('headline-options').style.display = 'none';
        }
        updateCanvas();
    });

    // Subheadline toggle
    document.getElementById('subheadline-toggle').addEventListener('click', function() {
        this.classList.toggle('active');
        const enabled = this.classList.contains('active');
        setTextValue('subheadlineEnabled', enabled);
        const row = this.closest('.toggle-row');
        if (enabled) {
            if (row) row.classList.remove('collapsed');
            document.getElementById('subheadline-options').style.display = 'block';
        } else {
            if (row) row.classList.add('collapsed');
            document.getElementById('subheadline-options').style.display = 'none';
        }
        updateCanvas();
    });

    // Text settings
    document.getElementById('headline-text').addEventListener('input', (e) => {
        const text = getTextSettings();
        if (!text.headlines) text.headlines = { en: '' };
        text.headlines[text.currentHeadlineLang || 'en'] = e.target.value;
        updateCanvas();
    });

    // Font picker is initialized separately via initFontPicker()

    document.getElementById('headline-size').addEventListener('input', (e) => {
        setTextValue('headlineSize', parseInt(e.target.value) || 100);
        updateCanvas();
    });

    document.getElementById('headline-color').addEventListener('input', (e) => {
        setTextValue('headlineColor', e.target.value);
        updateCanvas();
    });

    document.getElementById('headline-weight').addEventListener('change', (e) => {
        setTextValue('headlineWeight', e.target.value);
        updateCanvas();
    });

    // Text style buttons (italic, underline, strikethrough)
    document.querySelectorAll('#headline-style button').forEach(btn => {
        btn.addEventListener('click', () => {
            const style = btn.dataset.style;
            const key = 'headline' + style.charAt(0).toUpperCase() + style.slice(1);
            const text = getTextSettings();
            const newValue = !text[key];
            setTextValue(key, newValue);
            btn.classList.toggle('active', newValue);
            updateCanvas();
        });
    });

    document.querySelectorAll('#text-position button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#text-position button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setTextValue('position', btn.dataset.position);
            updateCanvas();
        });
    });

    document.getElementById('text-offset-y').addEventListener('input', (e) => {
        setTextValue('offsetY', parseInt(e.target.value));
        document.getElementById('text-offset-y-value').textContent = formatValue(e.target.value) + '%';
        updateCanvas();
    });

    document.getElementById('line-height').addEventListener('input', (e) => {
        setTextValue('lineHeight', parseInt(e.target.value));
        document.getElementById('line-height-value').textContent = formatValue(e.target.value) + '%';
        updateCanvas();
    });

    document.getElementById('subheadline-text').addEventListener('input', (e) => {
        const text = getTextSettings();
        if (!text.subheadlines) text.subheadlines = { en: '' };
        text.subheadlines[text.currentSubheadlineLang || 'en'] = e.target.value;
        updateCanvas();
    });

    document.getElementById('subheadline-size').addEventListener('input', (e) => {
        setTextValue('subheadlineSize', parseInt(e.target.value) || 50);
        updateCanvas();
    });

    document.getElementById('subheadline-color').addEventListener('input', (e) => {
        setTextValue('subheadlineColor', e.target.value);
        updateCanvas();
    });

    document.getElementById('subheadline-opacity').addEventListener('input', (e) => {
        const value = parseInt(e.target.value) || 70;
        setTextValue('subheadlineOpacity', value);
        document.getElementById('subheadline-opacity-value').textContent = formatValue(value) + '%';
        updateCanvas();
    });

    // Subheadline weight
    document.getElementById('subheadline-weight').addEventListener('change', (e) => {
        setTextValue('subheadlineWeight', e.target.value);
        updateCanvas();
    });

    // Subheadline style buttons (italic, underline, strikethrough)
    document.querySelectorAll('#subheadline-style button').forEach(btn => {
        btn.addEventListener('click', () => {
            const style = btn.dataset.style;
            const key = 'subheadline' + style.charAt(0).toUpperCase() + style.slice(1);
            const text = getTextSettings();
            const newValue = !text[key];
            setTextValue(key, newValue);
            btn.classList.toggle('active', newValue);
            updateCanvas();
        });
    });

    // Export buttons
    document.getElementById('export-current').addEventListener('click', exportCurrent);
    document.getElementById('export-all').addEventListener('click', exportAll);

    // Position presets
    document.querySelectorAll('.position-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.position-preset').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyPositionPreset(btn.dataset.preset);
        });
    });

    // Device type selector (2D/3D)
    document.querySelectorAll('#device-type-selector button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#device-type-selector button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const use3D = btn.dataset.type === '3d';
            setScreenshotSetting('use3D', use3D);
            document.getElementById('rotation-3d-options').style.display = use3D ? 'block' : 'none';

            // Hide 2D-only settings in 3D mode, show 3D tip
            document.getElementById('2d-only-settings').style.display = use3D ? 'none' : 'block';
            document.getElementById('position-presets-section').style.display = use3D ? 'none' : 'block';
            document.getElementById('3d-tip').style.display = use3D ? 'flex' : 'none';

            if (typeof showThreeJS === 'function') {
                showThreeJS(use3D);
            }

            // Check if 3D model is still loading and show indicator
            if (use3D && typeof phoneModelLoaded !== 'undefined' && !phoneModelLoaded) {
                // Model is loading - show a loading state
                const tipEl = document.getElementById('3d-tip');
                if (tipEl) {
                    tipEl.innerHTML = '<span style="opacity: 0.7;">Loading 3D model...</span>';
                }
            }

            if (use3D && typeof updateScreenTexture === 'function') {
                updateScreenTexture();
            }

            updateCanvas();
        });
    });

    // 3D device model selector
    document.querySelectorAll('#device-3d-selector button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#device-3d-selector button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const device3D = btn.dataset.model;
            setScreenshotSetting('device3D', device3D);

            if (typeof switchPhoneModel === 'function') {
                switchPhoneModel(device3D);
            }

            updateCanvas();
        });
    });

    // 3D rotation controls
    document.getElementById('rotation-3d-x').addEventListener('input', (e) => {
        const ss = getScreenshotSettings();
        if (!ss.rotation3D) ss.rotation3D = { x: 0, y: 0, z: 0 };
        ss.rotation3D.x = parseInt(e.target.value);
        document.getElementById('rotation-3d-x-value').textContent = formatValue(e.target.value) + '°';
        if (typeof setThreeJSRotation === 'function') {
            setThreeJSRotation(ss.rotation3D.x, ss.rotation3D.y, ss.rotation3D.z);
        }
        updateCanvas(); // Keep export canvas in sync
    });

    document.getElementById('rotation-3d-y').addEventListener('input', (e) => {
        const ss = getScreenshotSettings();
        if (!ss.rotation3D) ss.rotation3D = { x: 0, y: 0, z: 0 };
        ss.rotation3D.y = parseInt(e.target.value);
        document.getElementById('rotation-3d-y-value').textContent = formatValue(e.target.value) + '°';
        if (typeof setThreeJSRotation === 'function') {
            setThreeJSRotation(ss.rotation3D.x, ss.rotation3D.y, ss.rotation3D.z);
        }
        updateCanvas(); // Keep export canvas in sync
    });

    document.getElementById('rotation-3d-z').addEventListener('input', (e) => {
        const ss = getScreenshotSettings();
        if (!ss.rotation3D) ss.rotation3D = { x: 0, y: 0, z: 0 };
        ss.rotation3D.z = parseInt(e.target.value);
        document.getElementById('rotation-3d-z-value').textContent = formatValue(e.target.value) + '°';
        if (typeof setThreeJSRotation === 'function') {
            setThreeJSRotation(ss.rotation3D.x, ss.rotation3D.y, ss.rotation3D.z);
        }
        updateCanvas(); // Keep export canvas in sync
    });
}

// Per-screenshot mode is now always active (all settings are per-screenshot)
function isPerScreenshotTextMode() {
    return true;
}

// Global language picker functions
function updateLanguageMenu() {
    const container = document.getElementById('language-menu-items');
    container.innerHTML = '';

    state.projectLanguages.forEach(lang => {
        const btn = document.createElement('button');
        btn.className = 'language-menu-item' + (lang === state.currentLanguage ? ' active' : '');
        btn.innerHTML = `<span class="flag">${languageFlags[lang] || '🏳️'}</span> ${languageNames[lang] || lang.toUpperCase()}`;
        btn.onclick = () => {
            switchGlobalLanguage(lang);
            document.getElementById('language-menu').classList.remove('visible');
        };
        container.appendChild(btn);
    });
}

function updateLanguageButton() {
    const flag = languageFlags[state.currentLanguage] || '🏳️';
    document.getElementById('language-btn-flag').textContent = flag;
}

function switchGlobalLanguage(lang) {
    state.currentLanguage = lang;

    // Update all screenshots to use this language for display
    state.screenshots.forEach(screenshot => {
        screenshot.text.currentHeadlineLang = lang;
        screenshot.text.currentSubheadlineLang = lang;
    });

    // Update UI
    updateLanguageButton();
    syncUIWithState();
    updateCanvas();
    saveState();
}

// Languages modal functions
function openLanguagesModal() {
    document.getElementById('language-menu').classList.remove('visible');
    document.getElementById('languages-modal').classList.add('visible');
    updateLanguagesList();
    updateAddLanguageSelect();
}

function closeLanguagesModal() {
    document.getElementById('languages-modal').classList.remove('visible');
}

function updateLanguagesList() {
    const container = document.getElementById('languages-list');
    container.innerHTML = '';

    state.projectLanguages.forEach(lang => {
        const item = document.createElement('div');
        item.className = 'language-item';

        const flag = languageFlags[lang] || '🏳️';
        const name = languageNames[lang] || lang.toUpperCase();
        const isCurrent = lang === state.currentLanguage;
        const isOnly = state.projectLanguages.length === 1;

        item.innerHTML = `
            <span class="flag">${flag}</span>
            <span class="name">${name}</span>
            ${isCurrent ? '<span class="current-badge">Current</span>' : ''}
            <button class="remove-btn" ${isOnly ? 'disabled' : ''} title="${isOnly ? 'Cannot remove the only language' : 'Remove language'}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        `;

        const removeBtn = item.querySelector('.remove-btn');
        if (!isOnly) {
            removeBtn.addEventListener('click', () => removeProjectLanguage(lang));
        }

        container.appendChild(item);
    });
}

function updateAddLanguageSelect() {
    const select = document.getElementById('add-language-select');
    select.innerHTML = '<option value="">Add a language...</option>';

    // Add all available languages that aren't already in the project
    Object.keys(languageNames).forEach(lang => {
        if (!state.projectLanguages.includes(lang)) {
            const flag = languageFlags[lang] || '🏳️';
            const name = languageNames[lang];
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = `${flag} ${name}`;
            select.appendChild(option);
        }
    });
}

function addProjectLanguage(lang) {
    if (!lang || state.projectLanguages.includes(lang)) return;

    state.projectLanguages.push(lang);

    // Add the language to all screenshots' text settings
    state.screenshots.forEach(screenshot => {
        if (!screenshot.text.headlineLanguages.includes(lang)) {
            screenshot.text.headlineLanguages.push(lang);
            if (!screenshot.text.headlines) screenshot.text.headlines = { en: '' };
            screenshot.text.headlines[lang] = '';
        }
        if (!screenshot.text.subheadlineLanguages.includes(lang)) {
            screenshot.text.subheadlineLanguages.push(lang);
            if (!screenshot.text.subheadlines) screenshot.text.subheadlines = { en: '' };
            screenshot.text.subheadlines[lang] = '';
        }
    });

    // Also update defaults
    if (!state.defaults.text.headlineLanguages.includes(lang)) {
        state.defaults.text.headlineLanguages.push(lang);
        if (!state.defaults.text.headlines) state.defaults.text.headlines = { en: '' };
        state.defaults.text.headlines[lang] = '';
    }
    if (!state.defaults.text.subheadlineLanguages.includes(lang)) {
        state.defaults.text.subheadlineLanguages.push(lang);
        if (!state.defaults.text.subheadlines) state.defaults.text.subheadlines = { en: '' };
        state.defaults.text.subheadlines[lang] = '';
    }

    updateLanguagesList();
    updateAddLanguageSelect();
    updateLanguageMenu();
    saveState();
}

function removeProjectLanguage(lang) {
    if (state.projectLanguages.length <= 1) return; // Must have at least one language

    const index = state.projectLanguages.indexOf(lang);
    if (index > -1) {
        state.projectLanguages.splice(index, 1);

        // If removing the current language, switch to the first available
        if (state.currentLanguage === lang) {
            switchGlobalLanguage(state.projectLanguages[0]);
        }

        // Remove from all screenshots
        state.screenshots.forEach(screenshot => {
            const hIndex = screenshot.text.headlineLanguages.indexOf(lang);
            if (hIndex > -1) {
                screenshot.text.headlineLanguages.splice(hIndex, 1);
                delete screenshot.text.headlines[lang];
            }
            const sIndex = screenshot.text.subheadlineLanguages.indexOf(lang);
            if (sIndex > -1) {
                screenshot.text.subheadlineLanguages.splice(sIndex, 1);
                delete screenshot.text.subheadlines[lang];
            }
            if (screenshot.text.currentHeadlineLang === lang) {
                screenshot.text.currentHeadlineLang = state.projectLanguages[0];
            }
            if (screenshot.text.currentSubheadlineLang === lang) {
                screenshot.text.currentSubheadlineLang = state.projectLanguages[0];
            }
        });

        // Remove from defaults
        const dhIndex = state.defaults.text.headlineLanguages.indexOf(lang);
        if (dhIndex > -1) {
            state.defaults.text.headlineLanguages.splice(dhIndex, 1);
            delete state.defaults.text.headlines[lang];
        }
        const dsIndex = state.defaults.text.subheadlineLanguages.indexOf(lang);
        if (dsIndex > -1) {
            state.defaults.text.subheadlineLanguages.splice(dsIndex, 1);
            delete state.defaults.text.subheadlines[lang];
        }

        updateLanguagesList();
        updateAddLanguageSelect();
        updateLanguageMenu();
        updateLanguageButton();
        syncUIWithState();
        saveState();
    }
}

// Language helper functions
function addHeadlineLanguage(lang, flag) {
    const text = getTextSettings();
    if (!text.headlineLanguages.includes(lang)) {
        text.headlineLanguages.push(lang);
        if (!text.headlines) text.headlines = { en: '' };
        text.headlines[lang] = '';
        updateHeadlineLanguageUI();
        switchHeadlineLanguage(lang);
        saveState();
    }
}

function addSubheadlineLanguage(lang, flag) {
    const text = getTextSettings();
    if (!text.subheadlineLanguages.includes(lang)) {
        text.subheadlineLanguages.push(lang);
        if (!text.subheadlines) text.subheadlines = { en: '' };
        text.subheadlines[lang] = '';
        updateSubheadlineLanguageUI();
        switchSubheadlineLanguage(lang);
        saveState();
    }
}

function removeHeadlineLanguage(lang) {
    const text = getTextSettings();
    if (lang === 'en') return; // Can't remove default
    
    const index = text.headlineLanguages.indexOf(lang);
    if (index > -1) {
        text.headlineLanguages.splice(index, 1);
        delete text.headlines[lang];
        
        if (text.currentHeadlineLang === lang) {
            text.currentHeadlineLang = 'en';
        }
        
        updateHeadlineLanguageUI();
        switchHeadlineLanguage(text.currentHeadlineLang);
        saveState();
    }
}

function removeSubheadlineLanguage(lang) {
    const text = getTextSettings();
    if (lang === 'en') return; // Can't remove default
    
    const index = text.subheadlineLanguages.indexOf(lang);
    if (index > -1) {
        text.subheadlineLanguages.splice(index, 1);
        delete text.subheadlines[lang];
        
        if (text.currentSubheadlineLang === lang) {
            text.currentSubheadlineLang = 'en';
        }
        
        updateSubheadlineLanguageUI();
        switchSubheadlineLanguage(text.currentSubheadlineLang);
        saveState();
    }
}

function switchHeadlineLanguage(lang) {
    const text = getTextSettings();
    text.currentHeadlineLang = lang;

    // Load text for this language
    document.getElementById('headline-text').value = text.headlines[lang] || '';
    updateCanvas();
}

function switchSubheadlineLanguage(lang) {
    const text = getTextSettings();
    text.currentSubheadlineLang = lang;

    // Load text for this language
    document.getElementById('subheadline-text').value = text.subheadlines[lang] || '';
    updateCanvas();
}

function updateHeadlineLanguageUI() {
    // Language flag UI removed - translations now managed through translate modal
}

function updateSubheadlineLanguageUI() {
    // Language flag UI removed - translations now managed through translate modal
}

// Translate modal functions
let currentTranslateTarget = null;

const languageNames = {
    'en': 'English (US)', 'en-gb': 'English (UK)', 'de': 'German', 'fr': 'French', 
    'es': 'Spanish', 'it': 'Italian', 'pt': 'Portuguese', 'pt-br': 'Portuguese (BR)',
    'nl': 'Dutch', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
    'zh': 'Chinese (Simplified)', 'zh-tw': 'Chinese (Traditional)', 'ar': 'Arabic',
    'hi': 'Hindi', 'tr': 'Turkish', 'pl': 'Polish', 'sv': 'Swedish',
    'da': 'Danish', 'no': 'Norwegian', 'fi': 'Finnish', 'th': 'Thai',
    'vi': 'Vietnamese', 'id': 'Indonesian'
};

function openTranslateModal(target) {
    currentTranslateTarget = target;
    const text = getTextSettings();
    const isHeadline = target === 'headline';
    
    document.getElementById('translate-target-type').textContent = isHeadline ? 'Headline' : 'Subheadline';
    
    const languages = isHeadline ? text.headlineLanguages : text.subheadlineLanguages;
    const texts = isHeadline ? text.headlines : text.subheadlines;

    // Populate source language dropdown (first language selected by default)
    const sourceSelect = document.getElementById('translate-source-lang');
    sourceSelect.innerHTML = '';
    languages.forEach((lang, index) => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = `${languageFlags[lang]} ${languageNames[lang] || lang}`;
        if (index === 0) option.selected = true;
        sourceSelect.appendChild(option);
    });
    
    // Update source preview
    updateTranslateSourcePreview();
    
    // Populate target languages
    const targetsContainer = document.getElementById('translate-targets');
    targetsContainer.innerHTML = '';
    
    languages.forEach(lang => {
        const item = document.createElement('div');
        item.className = 'translate-target-item';
        item.dataset.lang = lang;
        item.innerHTML = `
            <div class="translate-target-header">
                <span class="flag">${languageFlags[lang]}</span>
                <span>${languageNames[lang] || lang}</span>
            </div>
            <textarea placeholder="Enter ${languageNames[lang] || lang} translation...">${texts[lang] || ''}</textarea>
        `;
        targetsContainer.appendChild(item);
    });
    
    document.getElementById('translate-modal').classList.add('visible');
}

function updateTranslateSourcePreview() {
    const text = getTextSettings();
    const sourceLang = document.getElementById('translate-source-lang').value;
    const isHeadline = currentTranslateTarget === 'headline';
    const texts = isHeadline ? text.headlines : text.subheadlines;
    const sourceText = texts[sourceLang] || '';
    
    document.getElementById('source-text-preview').textContent = sourceText || 'No text entered';
}

function applyTranslations() {
    const text = getTextSettings();
    const isHeadline = currentTranslateTarget === 'headline';
    const texts = isHeadline ? text.headlines : text.subheadlines;
    
    // Get all translations from the modal
    document.querySelectorAll('#translate-targets .translate-target-item').forEach(item => {
        const lang = item.dataset.lang;
        const textarea = item.querySelector('textarea');
        texts[lang] = textarea.value;
    });
    
    // Update the current text field
    const currentLang = isHeadline ? text.currentHeadlineLang : text.currentSubheadlineLang;
    if (isHeadline) {
        document.getElementById('headline-text').value = texts[currentLang] || '';
    } else {
        document.getElementById('subheadline-text').value = texts[currentLang] || '';
    }
    
    saveState();
    updateCanvas();
}

async function aiTranslateAll() {
    const text = getTextSettings();
    const sourceLang = document.getElementById('translate-source-lang').value;
    const isHeadline = currentTranslateTarget === 'headline';
    const texts = isHeadline ? text.headlines : text.subheadlines;
    const languages = isHeadline ? text.headlineLanguages : text.subheadlineLanguages;
    const sourceText = texts[sourceLang] || '';

    if (!sourceText.trim()) {
        setTranslateStatus('Please enter text in the source language first', 'error');
        return;
    }

    // Get target languages (all except source)
    const targetLangs = languages.filter(lang => lang !== sourceLang);

    if (targetLangs.length === 0) {
        setTranslateStatus('Add more languages to translate to', 'error');
        return;
    }

    // Get selected provider and API key
    const provider = getSelectedProvider();
    const providerConfig = llmProviders[provider];
    const apiKey = localStorage.getItem(providerConfig.storageKey);

    if (!apiKey) {
        setTranslateStatus(`Add your LLM API key in Settings to use AI translation.`, 'error');
        return;
    }

    const btn = document.getElementById('ai-translate-btn');
    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4m0 12v4m-8-10h4m12 0h4m-5.66-5.66l-2.83 2.83m-5.66 5.66l-2.83 2.83m14.14 0l-2.83-2.83M6.34 6.34L3.51 3.51"/>
        </svg>
        <span>Translating...</span>
    `;

    setTranslateStatus(`Translating to ${targetLangs.length} language(s) with ${providerConfig.name}...`, '');

    // Mark all target items as translating
    targetLangs.forEach(lang => {
        const item = document.querySelector(`.translate-target-item[data-lang="${lang}"]`);
        if (item) item.classList.add('translating');
    });

    try {
        // Build the translation prompt
        const targetLangNames = targetLangs.map(lang => `${languageNames[lang]} (${lang})`).join(', ');

        const prompt = `You are a professional translator for App Store screenshot marketing copy. Translate the following text from ${languageNames[sourceLang]} to these languages: ${targetLangNames}.

The text is a short marketing headline/tagline for an app that must fit on a screenshot, so keep translations:
- SIMILAR LENGTH to the original - do NOT make it longer, as it must fit on screen
- Concise and punchy
- Marketing-focused and compelling
- Culturally appropriate for each target market
- Natural-sounding in each language

IMPORTANT: The translated text will be displayed on app screenshots with limited space. If the source text is short, the translation MUST also be short. Prioritize brevity over literal accuracy.

Source text (${languageNames[sourceLang]}):
"${sourceText}"

Respond ONLY with a valid JSON object mapping language codes to translations. Do not include any other text.
Example format:
{"de": "German translation", "fr": "French translation"}

Translate to these language codes: ${targetLangs.join(', ')}`;

        let responseText;

        if (provider === 'anthropic') {
            responseText = await translateWithAnthropic(apiKey, prompt);
        } else if (provider === 'openai') {
            responseText = await translateWithOpenAI(apiKey, prompt);
        } else if (provider === 'google') {
            responseText = await translateWithGoogle(apiKey, prompt);
        }

        // Clean up response - remove markdown code blocks if present
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const translations = JSON.parse(responseText);

        // Apply translations to the textareas
        let translatedCount = 0;
        targetLangs.forEach(lang => {
            if (translations[lang]) {
                const item = document.querySelector(`.translate-target-item[data-lang="${lang}"]`);
                if (item) {
                    const textarea = item.querySelector('textarea');
                    textarea.value = translations[lang];
                    translatedCount++;
                }
            }
        });

        setTranslateStatus(`✓ Translated to ${translatedCount} language(s)`, 'success');

    } catch (error) {
        console.error('Translation error:', error);

        if (error.message === 'Failed to fetch') {
            setTranslateStatus('Connection failed. Check your API key in Settings.', 'error');
        } else if (error.message === 'AI_UNAVAILABLE' || error.message.includes('401') || error.message.includes('403')) {
            setTranslateStatus('Invalid API key. Update it in Settings (gear icon).', 'error');
        } else {
            setTranslateStatus('Translation failed: ' + error.message, 'error');
        }
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>Auto-translate with AI</span>
        `;

        // Remove translating state
        document.querySelectorAll('.translate-target-item').forEach(item => {
            item.classList.remove('translating');
        });
    }
}

// Helper function to show styled alert modal
function showAppAlert(message, type = 'info') {
    return new Promise((resolve) => {
        const iconBg = type === 'error' ? 'rgba(255, 69, 58, 0.2)' :
                       type === 'success' ? 'rgba(52, 199, 89, 0.2)' :
                       'rgba(10, 132, 255, 0.2)';
        const iconColor = type === 'error' ? '#ff453a' :
                          type === 'success' ? '#34c759' :
                          'var(--accent)';
        const iconPath = type === 'error' ? '<path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' :
                         type === 'success' ? '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' :
                         '<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>';

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay visible';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-icon" style="background: ${iconBg};">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: ${iconColor};">
                        ${iconPath}
                    </svg>
                </div>
                <p class="modal-message" style="margin: 16px 0;">${message}</p>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-confirm" style="background: var(--accent);">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const okBtn = overlay.querySelector('.modal-btn-confirm');
        const close = () => {
            overlay.remove();
            resolve();
        };
        okBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    });
}

// Helper function to show styled confirm modal
function showAppConfirm(message, confirmText = 'Confirm', cancelText = 'Cancel') {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay visible';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-icon" style="background: rgba(10, 132, 255, 0.2);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent);">
                        <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <p class="modal-message" style="margin: 16px 0; white-space: pre-line;">${message}</p>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-cancel">${cancelText}</button>
                    <button class="modal-btn modal-btn-confirm" style="background: var(--accent);">${confirmText}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const confirmBtn = overlay.querySelector('.modal-btn-confirm');
        const cancelBtn = overlay.querySelector('.modal-btn-cancel');

        confirmBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });
        cancelBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve(false);
            }
        });
    });
}

// Show translate confirmation dialog with source language selector
function showTranslateConfirmDialog(providerName) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay visible';

        // Default to first project language
        const defaultLang = state.projectLanguages[0] || 'en';

        // Build language options
        const languageOptions = state.projectLanguages.map(lang => {
            const flag = languageFlags[lang] || '🏳️';
            const name = languageNames[lang] || lang.toUpperCase();
            const selected = lang === defaultLang ? 'selected' : '';
            return `<option value="${lang}" ${selected}>${flag} ${name}</option>`;
        }).join('');

        // Count texts for each language
        const getTextCount = (lang) => {
            let count = 0;
            state.screenshots.forEach(screenshot => {
                const text = screenshot.text || state.text;
                if (text.headlines?.[lang]?.trim()) count++;
                if (text.subheadlines?.[lang]?.trim()) count++;
            });
            return count;
        };

        const initialCount = getTextCount(defaultLang);
        const targetCount = state.projectLanguages.length - 1;

        overlay.innerHTML = `
            <div class="modal" style="max-width: 380px;">
                <div class="modal-icon" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #764ba2;">
                        <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2v3M22 22l-5-10-5 10M14 18h6"/>
                    </svg>
                </div>
                <h3 class="modal-title">Translate All Text</h3>
                <p class="modal-message" style="margin-bottom: 16px;">Translate headlines and subheadlines from one language to all other project languages.</p>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">Source Language</label>
                    <select id="translate-source-lang" style="width: 100%; padding: 10px 12px; background: var(--bg-tertiary); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); font-size: 14px; cursor: pointer;">
                        ${languageOptions}
                    </select>
                </div>

                <div style="background: var(--bg-tertiary); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                        <span style="color: var(--text-secondary);">Texts to translate:</span>
                        <span id="translate-text-count" style="color: var(--text-primary); font-weight: 500;">${initialCount}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                        <span style="color: var(--text-secondary);">Target languages:</span>
                        <span style="color: var(--text-primary); font-weight: 500;">${targetCount}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--text-secondary);">Provider:</span>
                        <span style="color: var(--text-primary); font-weight: 500;">${providerName}</span>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-cancel" id="translate-cancel">Cancel</button>
                    <button class="modal-btn modal-btn-confirm" id="translate-confirm" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">Translate</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const select = document.getElementById('translate-source-lang');
        const countEl = document.getElementById('translate-text-count');
        const confirmBtn = document.getElementById('translate-confirm');
        const cancelBtn = document.getElementById('translate-cancel');

        // Update count when language changes
        select.addEventListener('change', () => {
            const count = getTextCount(select.value);
            countEl.textContent = count;
            confirmBtn.disabled = count === 0;
            if (count === 0) {
                confirmBtn.style.opacity = '0.5';
            } else {
                confirmBtn.style.opacity = '1';
            }
        });

        // Initial state
        if (initialCount === 0) {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
        }

        confirmBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(select.value);
        });

        cancelBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(null);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve(null);
            }
        });
    });
}

// Translate all text (headlines + subheadlines) from selected source language to all other project languages
async function translateAllText() {
    if (state.projectLanguages.length < 2) {
        await showAppAlert('Add more languages to your project first (via the language menu).', 'info');
        return;
    }

    // Get selected provider and API key
    const provider = getSelectedProvider();
    const providerConfig = llmProviders[provider];
    const apiKey = localStorage.getItem(providerConfig.storageKey);

    if (!apiKey) {
        await showAppAlert('Add your LLM API key in Settings to use AI translation.', 'error');
        return;
    }

    // Show confirmation dialog with source language selector
    const sourceLang = await showTranslateConfirmDialog(providerConfig.name);
    if (!sourceLang) return; // User cancelled

    const targetLangs = state.projectLanguages.filter(lang => lang !== sourceLang);

    // Collect all texts that need translation
    const textsToTranslate = [];

    // Go through all screenshots and collect headlines/subheadlines
    state.screenshots.forEach((screenshot, index) => {
        const text = screenshot.text || state.text;

        // Headline
        const headline = text.headlines?.[sourceLang] || '';
        if (headline.trim()) {
            textsToTranslate.push({
                type: 'headline',
                screenshotIndex: index,
                text: headline
            });
        }

        // Subheadline
        const subheadline = text.subheadlines?.[sourceLang] || '';
        if (subheadline.trim()) {
            textsToTranslate.push({
                type: 'subheadline',
                screenshotIndex: index,
                text: subheadline
            });
        }
    });

    if (textsToTranslate.length === 0) {
        await showAppAlert(`No text found in ${languageNames[sourceLang] || sourceLang}. Add headlines or subheadlines first.`, 'info');
        return;
    }

    // Create progress dialog with spinner
    const progressOverlay = document.createElement('div');
    progressOverlay.className = 'modal-overlay visible';
    progressOverlay.id = 'translate-progress-overlay';
    progressOverlay.innerHTML = `
        <div class="modal" style="text-align: center; min-width: 320px;">
            <div class="modal-icon" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #764ba2; animation: spin 1s linear infinite;">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
            </div>
            <h3 class="modal-title">Translating...</h3>
            <p class="modal-message" id="translate-progress-text">Sending to AI...</p>
            <p class="modal-message" id="translate-progress-detail" style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px;"></p>
        </div>
        <style>
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(progressOverlay);

    const progressText = document.getElementById('translate-progress-text');
    const progressDetail = document.getElementById('translate-progress-detail');

    // Helper to update status
    const updateStatus = (text, detail = '') => {
        if (progressText) progressText.textContent = text;
        if (progressDetail) progressDetail.textContent = detail;
    };

    updateStatus('Sending to AI...', `${textsToTranslate.length} texts to ${targetLangs.length} languages using ${providerConfig.name}`);

    try {
        // Build a single prompt with all texts
        const targetLangNames = targetLangs.map(lang => `${languageNames[lang]} (${lang})`).join(', ');

        // Group texts by screenshot for context-aware prompt
        const screenshotGroups = {};
        textsToTranslate.forEach((item, i) => {
            if (!screenshotGroups[item.screenshotIndex]) {
                screenshotGroups[item.screenshotIndex] = { headline: null, subheadline: null, indices: {} };
            }
            screenshotGroups[item.screenshotIndex][item.type] = item.text;
            screenshotGroups[item.screenshotIndex].indices[item.type] = i;
        });

        // Build context-rich prompt showing screenshot groupings
        let contextualTexts = '';
        Object.keys(screenshotGroups).sort((a, b) => Number(a) - Number(b)).forEach(screenshotIdx => {
            const group = screenshotGroups[screenshotIdx];
            contextualTexts += `\nScreenshot ${Number(screenshotIdx) + 1}:\n`;
            if (group.headline !== null) {
                contextualTexts += `  [${group.indices.headline}] Headline: "${group.headline}"\n`;
            }
            if (group.subheadline !== null) {
                contextualTexts += `  [${group.indices.subheadline}] Subheadline: "${group.subheadline}"\n`;
            }
        });

        const prompt = `You are a professional translator for App Store screenshot marketing copy. Translate the following texts from ${languageNames[sourceLang]} to these languages: ${targetLangNames}.

CONTEXT: These are marketing texts for app store screenshots. Each screenshot has a headline and/or subheadline that work together as a pair. The subheadline typically elaborates on or supports the headline. When translating, ensure:
- Headlines and subheadlines on the same screenshot remain thematically consistent
- Translations across all screenshots maintain a cohesive marketing voice
- SIMILAR LENGTH to the originals - do NOT make translations longer, as they must fit on screen
- Marketing-focused and compelling language
- Culturally appropriate for each target market
- Natural-sounding in each language

IMPORTANT: The translated text will be displayed on app screenshots with limited space. If the source text is short, the translation MUST also be short. Prioritize brevity over literal accuracy.

Source texts (${languageNames[sourceLang]}):
${contextualTexts}

Respond ONLY with a valid JSON object. The structure should be:
{
  "0": {"de": "German translation", "fr": "French translation", ...},
  "1": {"de": "German translation", "fr": "French translation", ...}
}

Where the keys (0, 1, etc.) correspond to the text indices [N] shown above.
Translate to these language codes: ${targetLangs.join(', ')}`;

        let responseText;

        if (provider === 'anthropic') {
            responseText = await translateWithAnthropic(apiKey, prompt);
        } else if (provider === 'openai') {
            responseText = await translateWithOpenAI(apiKey, prompt);
        } else if (provider === 'google') {
            responseText = await translateWithGoogle(apiKey, prompt);
        }

        updateStatus('Processing response...', 'Parsing translations');

        // Clean up response - remove markdown code blocks and extract JSON
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Try to extract JSON object if there's extra text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            responseText = jsonMatch[0];
        }

        console.log('Translation response:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));

        let translations;
        try {
            translations = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parse error. Response was:', responseText);
            throw new Error('Failed to parse translation response. The AI may have returned incomplete text.');
        }

        updateStatus('Applying translations...', 'Updating screenshots');

        // Apply translations
        let appliedCount = 0;
        textsToTranslate.forEach((item, index) => {
            const itemTranslations = translations[index] || translations[String(index)];
            if (!itemTranslations) return;

            const screenshot = state.screenshots[item.screenshotIndex];
            const text = screenshot.text || state.text;

            targetLangs.forEach(lang => {
                if (itemTranslations[lang]) {
                    if (item.type === 'headline') {
                        if (!text.headlines) text.headlines = {};
                        text.headlines[lang] = itemTranslations[lang];
                    } else {
                        if (!text.subheadlines) text.subheadlines = {};
                        text.subheadlines[lang] = itemTranslations[lang];
                    }
                    appliedCount++;
                }
            });
        });

        // Update UI
        syncUIWithState();
        updateCanvas();
        saveState();

        // Remove progress overlay
        progressOverlay.remove();

        await showAppAlert(`Successfully translated ${appliedCount} text(s)!`, 'success');

    } catch (error) {
        console.error('Translation error:', error);
        progressOverlay.remove();

        if (error.message === 'Failed to fetch') {
            await showAppAlert('Connection failed. Check your API key in Settings.', 'error');
        } else if (error.message === 'AI_UNAVAILABLE' || error.message.includes('401') || error.message.includes('403')) {
            await showAppAlert('Invalid API key. Update it in Settings (gear icon).', 'error');
        } else {
            await showAppAlert('Translation failed: ' + error.message, 'error');
        }
    }
}

// Provider-specific translation functions
async function translateWithAnthropic(apiKey, prompt) {
    const model = getSelectedModel('anthropic');
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 4096,
            messages: [{ role: "user", content: prompt }]
        })
    });

    if (!response.ok) {
        const status = response.status;
        if (status === 401 || status === 403) throw new Error('AI_UNAVAILABLE');
        throw new Error(`API request failed: ${status}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

async function translateWithOpenAI(apiKey, prompt) {
    const model = getSelectedModel('openai');
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            max_completion_tokens: 16384,
            messages: [{ role: "user", content: prompt }]
        })
    });

    if (!response.ok) {
        const status = response.status;
        const errorBody = await response.json().catch(() => ({}));
        console.error('OpenAI API Error:', {
            status,
            model,
            error: errorBody
        });
        if (status === 401 || status === 403) throw new Error('AI_UNAVAILABLE');
        throw new Error(`API request failed: ${status} - ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function translateWithGoogle(apiKey, prompt) {
    const model = getSelectedModel('google');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!response.ok) {
        const status = response.status;
        if (status === 401 || status === 403 || status === 400) throw new Error('AI_UNAVAILABLE');
        throw new Error(`API request failed: ${status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function setTranslateStatus(message, type) {
    const status = document.getElementById('ai-translate-status');
    status.textContent = message;
    status.className = 'ai-translate-status' + (type ? ' ' + type : '');
}

// Settings modal functions
// LLM configuration is in llm.js (llmProviders, getSelectedModel, getSelectedProvider)

function openSettingsModal() {
    // Load saved provider
    const savedProvider = getSelectedProvider();
    document.querySelectorAll('input[name="ai-provider"]').forEach(radio => {
        radio.checked = radio.value === savedProvider;
    });

    // Show the correct API section
    updateProviderSection(savedProvider);

    // Load all saved API keys and models
    Object.entries(llmProviders).forEach(([provider, config]) => {
        const savedKey = localStorage.getItem(config.storageKey);
        const input = document.getElementById(`settings-api-key-${provider}`);
        if (input) {
            input.value = savedKey || '';
            input.type = 'password';
        }

        const status = document.getElementById(`settings-key-status-${provider}`);
        if (status) {
            if (savedKey) {
                status.textContent = '✓ API key is saved';
                status.className = 'settings-key-status success';
            } else {
                status.textContent = '';
                status.className = 'settings-key-status';
            }
        }

        // Populate and load saved model selection
        const modelSelect = document.getElementById(`settings-model-${provider}`);
        if (modelSelect) {
            // Populate options from llm.js config
            modelSelect.innerHTML = generateModelOptions(provider);
            // Set saved value
            const savedModel = localStorage.getItem(config.modelStorageKey) || config.defaultModel;
            modelSelect.value = savedModel;
        }
    });

    document.getElementById('settings-modal').classList.add('visible');
}

function updateProviderSection(provider) {
    document.querySelectorAll('.settings-api-section').forEach(section => {
        section.style.display = section.dataset.provider === provider ? 'block' : 'none';
    });
}

function saveSettings() {
    // Save selected provider
    const selectedProvider = document.querySelector('input[name="ai-provider"]:checked').value;
    localStorage.setItem('aiProvider', selectedProvider);

    // Save all API keys and models
    let allValid = true;
    Object.entries(llmProviders).forEach(([provider, config]) => {
        const input = document.getElementById(`settings-api-key-${provider}`);
        const status = document.getElementById(`settings-key-status-${provider}`);
        if (!input || !status) return;

        const key = input.value.trim();

        if (key) {
            // Validate key format
            if (key.startsWith(config.keyPrefix)) {
                localStorage.setItem(config.storageKey, key);
                status.textContent = '✓ API key saved';
                status.className = 'settings-key-status success';
            } else {
                status.textContent = `Invalid format. Should start with ${config.keyPrefix}...`;
                status.className = 'settings-key-status error';
                if (provider === selectedProvider) allValid = false;
            }
        } else {
            localStorage.removeItem(config.storageKey);
            status.textContent = '';
            status.className = 'settings-key-status';
        }

        // Save model selection
        const modelSelect = document.getElementById(`settings-model-${provider}`);
        if (modelSelect) {
            localStorage.setItem(config.modelStorageKey, modelSelect.value);
        }
    });

    if (allValid) {
        setTimeout(() => {
            document.getElementById('settings-modal').classList.remove('visible');
        }, 500);
    }
}

// Helper function to set text value for current screenshot
function setTextValue(key, value) {
    setTextSetting(key, value);
}

// Helper function to get text settings for current screenshot
function getTextSettings() {
    return getText();
}

// Load text UI from current screenshot's settings
function loadTextUIFromScreenshot() {
    updateTextUI(getText());
}

// Load text UI from default settings
function loadTextUIFromGlobal() {
    updateTextUI(state.defaults.text);
}

// Update all text UI elements
function updateTextUI(text) {
    document.getElementById('headline-text').value = text.headline || '';
    document.getElementById('headline-font').value = text.headlineFont;
    updateFontPickerPreview();
    document.getElementById('headline-size').value = text.headlineSize;
    document.getElementById('headline-color').value = text.headlineColor;
    document.getElementById('headline-weight').value = text.headlineWeight;
    // Sync text style buttons
    document.querySelectorAll('#headline-style button').forEach(btn => {
        const style = btn.dataset.style;
        const key = 'headline' + style.charAt(0).toUpperCase() + style.slice(1);
        btn.classList.toggle('active', text[key] || false);
    });
    document.querySelectorAll('#text-position button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.position === text.position);
    });
    document.getElementById('text-offset-y').value = text.offsetY;
    document.getElementById('text-offset-y-value').textContent = formatValue(text.offsetY) + '%';
    document.getElementById('line-height').value = text.lineHeight;
    document.getElementById('line-height-value').textContent = formatValue(text.lineHeight) + '%';
    document.getElementById('subheadline-text').value = text.subheadline || '';
    document.getElementById('subheadline-font').value = text.subheadlineFont || text.headlineFont;
    document.getElementById('subheadline-size').value = text.subheadlineSize;
    document.getElementById('subheadline-color').value = text.subheadlineColor;
    document.getElementById('subheadline-opacity').value = text.subheadlineOpacity;
    document.getElementById('subheadline-opacity-value').textContent = formatValue(text.subheadlineOpacity) + '%';
    document.getElementById('subheadline-weight').value = text.subheadlineWeight || '400';
    // Sync subheadline style buttons
    document.querySelectorAll('#subheadline-style button').forEach(btn => {
        const style = btn.dataset.style;
        const key = 'subheadline' + style.charAt(0).toUpperCase() + style.slice(1);
        btn.classList.toggle('active', text[key] || false);
    });
}

function applyPositionPreset(preset) {
    const presets = {
        'centered': { scale: 70, x: 50, y: 50, rotation: 0, perspective: 0 },
        'bleed-bottom': { scale: 85, x: 50, y: 120, rotation: 0, perspective: 0 },
        'bleed-top': { scale: 85, x: 50, y: -20, rotation: 0, perspective: 0 },
        'float-center': { scale: 60, x: 50, y: 50, rotation: 0, perspective: 0 },
        'tilt-left': { scale: 65, x: 50, y: 55, rotation: -8, perspective: 0 },
        'tilt-right': { scale: 65, x: 50, y: 55, rotation: 8, perspective: 0 },
        'perspective': { scale: 65, x: 50, y: 50, rotation: 0, perspective: 15 },
        'float-bottom': { scale: 55, x: 50, y: 70, rotation: 0, perspective: 0 }
    };

    const p = presets[preset];
    if (!p) return;

    setScreenshotSetting('scale', p.scale);
    setScreenshotSetting('x', p.x);
    setScreenshotSetting('y', p.y);
    setScreenshotSetting('rotation', p.rotation);
    setScreenshotSetting('perspective', p.perspective);

    // Update UI controls
    document.getElementById('screenshot-scale').value = p.scale;
    document.getElementById('screenshot-scale-value').textContent = formatValue(p.scale) + '%';
    document.getElementById('screenshot-x').value = p.x;
    document.getElementById('screenshot-x-value').textContent = formatValue(p.x) + '%';
    document.getElementById('screenshot-y').value = p.y;
    document.getElementById('screenshot-y-value').textContent = formatValue(p.y) + '%';
    document.getElementById('screenshot-rotation').value = p.rotation;
    document.getElementById('screenshot-rotation-value').textContent = formatValue(p.rotation) + '°';

    updateCanvas();
}

// File validation constants
const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB max per file

function handleFiles(files) {
    const validFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
        // Validate file type
        if (!VALID_IMAGE_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
            errors.push(`${file.name}: Invalid file type. Please use PNG, JPEG, GIF, or WebP.`);
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            errors.push(`${file.name}: File too large (${sizeMB}MB). Maximum size is 20MB.`);
            return;
        }

        validFiles.push(file);
    });

    // Show errors if any
    if (errors.length > 0) {
        console.warn('File validation errors:', errors);
        alert('Some files could not be uploaded:\n\n' + errors.join('\n'));
    }

    // Process valid files
    if (validFiles.length > 0) {
        processFilesSequentially(validFiles);
    }
}

// Handle files from Electron menu (receives array of {dataUrl, name})
function handleFilesFromElectron(filesData) {
    processElectronFilesSequentially(filesData);
}

async function processElectronFilesSequentially(filesData) {
    for (const fileData of filesData) {
        await processElectronImageFile(fileData);
    }
}

async function processElectronImageFile(fileData) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = async () => {
            // Detect device type based on aspect ratio
            const ratio = img.width / img.height;
            let deviceType = 'iPhone';
            if (ratio > 0.6) {
                deviceType = 'iPad';
            }

            // Detect language from filename
            const detectedLang = detectLanguageFromFilename(fileData.name);

            // Check if this is a localized version of an existing screenshot
            const existingIndex = findScreenshotByBaseFilename(fileData.name);

            if (existingIndex !== -1) {
                // Found a screenshot with matching base filename
                const existingScreenshot = state.screenshots[existingIndex];
                const hasExistingLangImage = existingScreenshot.localizedImages?.[detectedLang]?.image;

                if (hasExistingLangImage) {
                    // There's already an image for this language - show dialog
                    const choice = await showDuplicateDialog({
                        existingIndex: existingIndex,
                        detectedLang: detectedLang,
                        newImage: img,
                        newSrc: fileData.dataUrl,
                        newName: fileData.name
                    });

                    if (choice === 'replace') {
                        addLocalizedImage(existingIndex, detectedLang, img, fileData.dataUrl, fileData.name);
                    } else if (choice === 'create') {
                        createNewScreenshot(img, fileData.dataUrl, fileData.name, detectedLang, deviceType);
                    }
                } else {
                    // No image for this language yet - just add it silently
                    addLocalizedImage(existingIndex, detectedLang, img, fileData.dataUrl, fileData.name);
                }
            } else {
                createNewScreenshot(img, fileData.dataUrl, fileData.name, detectedLang, deviceType);
            }

            // Update 3D texture if in 3D mode
            const ss = getScreenshotSettings();
            if (ss.use3D && typeof updateScreenTexture === 'function') {
                updateScreenTexture();
            }
            updateCanvas();
            resolve();
        };
        img.onerror = () => {
            console.error('Failed to load image:', fileData.name);
            alert(`Failed to load image: ${fileData.name}. The file may be corrupted.`);
            resolve(); // Resolve anyway to continue processing other files
        };
        img.src = fileData.dataUrl;
    });
}

async function processFilesSequentially(files) {
    for (const file of files) {
        await processImageFile(file);
    }
}

async function processImageFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const img = new Image();
            img.onload = async () => {
                // Detect device type based on aspect ratio
                const ratio = img.width / img.height;
                let deviceType = 'iPhone';
                if (ratio > 0.6) {
                    deviceType = 'iPad';
                }

                // Detect language from filename
                const detectedLang = detectLanguageFromFilename(file.name);

                // Check if this is a localized version of an existing screenshot
                const existingIndex = findScreenshotByBaseFilename(file.name);

                if (existingIndex !== -1) {
                    // Found a screenshot with matching base filename
                    const existingScreenshot = state.screenshots[existingIndex];
                    const hasExistingLangImage = existingScreenshot.localizedImages?.[detectedLang]?.image;

                    if (hasExistingLangImage) {
                        // There's already an image for this language - show dialog
                        const choice = await showDuplicateDialog({
                            existingIndex: existingIndex,
                            detectedLang: detectedLang,
                            newImage: img,
                            newSrc: e.target.result,
                            newName: file.name
                        });

                        if (choice === 'replace') {
                            addLocalizedImage(existingIndex, detectedLang, img, e.target.result, file.name);
                        } else if (choice === 'create') {
                            createNewScreenshot(img, e.target.result, file.name, detectedLang, deviceType);
                        }
                        // 'ignore' does nothing
                    } else {
                        // No image for this language yet - just add it silently
                        addLocalizedImage(existingIndex, detectedLang, img, e.target.result, file.name);
                    }
                } else {
                    // No duplicate - create new screenshot
                    createNewScreenshot(img, e.target.result, file.name, detectedLang, deviceType);
                }

                // Update 3D texture if in 3D mode
                const ss = getScreenshotSettings();
                if (ss.use3D && typeof updateScreenTexture === 'function') {
                    updateScreenTexture();
                }
                updateCanvas();
                resolve();
            };
            img.onerror = () => {
                console.error('Failed to load image:', file.name);
                alert(`Failed to load image: ${file.name}. The file may be corrupted.`);
                resolve(); // Resolve anyway to continue processing other files
            };
            img.src = e.target.result;
        };
        reader.onerror = () => {
            console.error('Failed to read file:', file.name);
            alert(`Failed to read file: ${file.name}. Please try again.`);
            resolve(); // Resolve anyway to continue processing other files
        };
        reader.readAsDataURL(file);
    });
}

function createNewScreenshot(img, src, name, lang, deviceType) {
    const localizedImages = {};
    localizedImages[lang] = {
        image: img,
        src: src,
        name: name
    };

    // Auto-add language to project if not already present
    if (!state.projectLanguages.includes(lang)) {
        addProjectLanguage(lang);
    }

    // Each screenshot gets its own copy of all settings from defaults
    state.screenshots.push({
        image: img, // Keep for legacy compatibility
        name: name,
        deviceType: deviceType,
        localizedImages: localizedImages,
        background: JSON.parse(JSON.stringify(state.defaults.background)),
        screenshot: JSON.parse(JSON.stringify(state.defaults.screenshot)),
        text: JSON.parse(JSON.stringify(state.defaults.text)),
        // Legacy overrides for backwards compatibility
        overrides: {}
    });

    updateScreenshotList();
    if (state.screenshots.length === 1) {
        state.selectedIndex = 0;
        // Show Magical Titles tooltip hint for first screenshot
        setTimeout(() => showMagicalTitlesTooltip(), 500);
    }
}

let draggedScreenshotIndex = null;

function updateScreenshotList() {
    screenshotList.innerHTML = '';
    noScreenshot.style.display = state.screenshots.length === 0 ? 'block' : 'none';

    // Show transfer mode hint if active
    if (state.transferTarget !== null && state.screenshots.length > 1) {
        const hint = document.createElement('div');
        hint.className = 'transfer-hint';
        hint.innerHTML = `
            <span>Select a screenshot to copy style from</span>
            <button class="transfer-cancel" onclick="cancelTransfer()">Cancel</button>
        `;
        screenshotList.appendChild(hint);
    }

    state.screenshots.forEach((screenshot, index) => {
        const item = document.createElement('div');
        const isTransferTarget = state.transferTarget === index;
        const isTransferMode = state.transferTarget !== null;
        item.className = 'screenshot-item' +
            (index === state.selectedIndex ? ' selected' : '') +
            (isTransferTarget ? ' transfer-target' : '') +
            (isTransferMode && !isTransferTarget ? ' transfer-source-option' : '');

        // Enable drag and drop (disabled in transfer mode)
        if (!isTransferMode) {
            item.draggable = true;
            item.dataset.index = index;
        }

        // Show different UI in transfer mode
        const buttonsHtml = isTransferMode ? '' : `
            <div class="screenshot-menu-wrapper">
                <button class="screenshot-menu-btn" data-index="${index}" title="More options">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="12" cy="19" r="2"/>
                    </svg>
                </button>
                <div class="screenshot-menu" data-index="${index}">
                    <button class="screenshot-menu-item screenshot-translations" data-index="${index}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2v3M22 22l-5-10-5 10M14 18h6"/>
                        </svg>
                        Manage Translations...
                    </button>
                    <button class="screenshot-menu-item screenshot-replace" data-index="${index}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Replace Screenshot...
                    </button>
                    <button class="screenshot-menu-item screenshot-transfer" data-index="${index}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy style from...
                    </button>
                    <button class="screenshot-menu-item screenshot-apply-all" data-index="${index}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            <path d="M14 14l2 2 4-4"/>
                        </svg>
                        Apply style to all...
                    </button>
                    <button class="screenshot-menu-item screenshot-delete danger" data-index="${index}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        `;

        // Get localized thumbnail image
        const thumbImg = getScreenshotImage(screenshot);
        const thumbSrc = thumbImg?.src || '';

        // Build language flags indicator
        const availableLangs = getAvailableLanguagesForScreenshot(screenshot);
        const isComplete = isScreenshotComplete(screenshot);
        let langFlagsHtml = '';
        if (state.projectLanguages.length > 1) {
            const flags = availableLangs.map(lang => languageFlags[lang] || '🏳️').join('');
            const checkmark = isComplete ? '<span class="screenshot-complete">✓</span>' : '';
            langFlagsHtml = `<span class="screenshot-lang-flags">${flags}${checkmark}</span>`;
        }

        item.innerHTML = `
            <div class="drag-handle">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="2"/><circle cx="15" cy="6" r="2"/>
                    <circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/>
                    <circle cx="9" cy="18" r="2"/><circle cx="15" cy="18" r="2"/>
                </svg>
            </div>
            <img class="screenshot-thumb" src="${thumbSrc}" alt="${screenshot.name}">
            <div class="screenshot-info">
                <div class="screenshot-name">${screenshot.name}</div>
                <div class="screenshot-device">${isTransferTarget ? 'Click source to copy style' : screenshot.deviceType}${langFlagsHtml}</div>
            </div>
            ${buttonsHtml}
        `;

        // Drag and drop handlers
        item.addEventListener('dragstart', (e) => {
            draggedScreenshotIndex = index;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            draggedScreenshotIndex = null;
            // Remove all drag-over states
            document.querySelectorAll('.screenshot-item.drag-insert-after, .screenshot-item.drag-insert-before').forEach(el => {
                el.classList.remove('drag-insert-after', 'drag-insert-before');
            });
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (draggedScreenshotIndex !== null && draggedScreenshotIndex !== index) {
                // Determine if cursor is in top or bottom half
                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                const isAbove = e.clientY < midpoint;

                // Clear all indicators first
                document.querySelectorAll('.screenshot-item.drag-insert-after, .screenshot-item.drag-insert-before').forEach(el => {
                    el.classList.remove('drag-insert-after', 'drag-insert-before');
                });

                // Show line on the item AFTER which the drop will occur
                if (isAbove && index === 0) {
                    // Dropping before the first item - show line above it
                    item.classList.add('drag-insert-before');
                } else if (isAbove && index > 0) {
                    // Dropping before this item = after the previous item
                    const items = screenshotList.querySelectorAll('.screenshot-item:not(.upload-item)');
                    const prevItem = items[index - 1];
                    if (prevItem && !prevItem.classList.contains('dragging')) {
                        prevItem.classList.add('drag-insert-after');
                    }
                } else if (!isAbove) {
                    // Dropping after this item
                    item.classList.add('drag-insert-after');
                }
            }
        });

        item.addEventListener('dragleave', () => {
            // Don't remove here - let dragover on other items handle it
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();

            // Determine drop position based on cursor
            const rect = item.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            const dropAbove = e.clientY < midpoint;

            document.querySelectorAll('.screenshot-item.drag-insert-after, .screenshot-item.drag-insert-before').forEach(el => {
                el.classList.remove('drag-insert-after', 'drag-insert-before');
            });

            if (draggedScreenshotIndex !== null && draggedScreenshotIndex !== index) {
                // Calculate target index based on drop position
                let targetIndex = dropAbove ? index : index + 1;

                // Adjust if dragging from before the target
                if (draggedScreenshotIndex < targetIndex) {
                    targetIndex--;
                }

                // Reorder screenshots
                const draggedItem = state.screenshots[draggedScreenshotIndex];
                state.screenshots.splice(draggedScreenshotIndex, 1);
                state.screenshots.splice(targetIndex, 0, draggedItem);

                // Update selected index to follow the selected item
                if (state.selectedIndex === draggedScreenshotIndex) {
                    state.selectedIndex = targetIndex;
                } else if (draggedScreenshotIndex < state.selectedIndex && targetIndex >= state.selectedIndex) {
                    state.selectedIndex--;
                } else if (draggedScreenshotIndex > state.selectedIndex && targetIndex <= state.selectedIndex) {
                    state.selectedIndex++;
                }

                updateScreenshotList();
                updateCanvas();
            }
        });

        item.addEventListener('click', (e) => {
            if (e.target.closest('.screenshot-menu-wrapper') || e.target.closest('.drag-handle')) {
                return;
            }

            // Handle transfer mode click
            if (state.transferTarget !== null) {
                if (index !== state.transferTarget) {
                    // Transfer style from clicked screenshot to target
                    transferStyle(index, state.transferTarget);
                }
                return;
            }

            // Normal selection
            state.selectedIndex = index;
            updateScreenshotList();
            // Sync all UI with current screenshot's settings
            syncUIWithState();
            updateGradientStopsUI();
            // Update 3D texture if in 3D mode
            const ss = getScreenshotSettings();
            if (ss.use3D && typeof updateScreenTexture === 'function') {
                updateScreenTexture();
            }
            updateCanvas();
        });

        // Menu button handler
        const menuBtn = item.querySelector('.screenshot-menu-btn');
        const menu = item.querySelector('.screenshot-menu');
        if (menuBtn && menu) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close all other menus first
                document.querySelectorAll('.screenshot-menu.open').forEach(m => {
                    if (m !== menu) m.classList.remove('open');
                });
                menu.classList.toggle('open');
            });
        }

        // Manage Translations button handler
        const translationsBtn = item.querySelector('.screenshot-translations');
        if (translationsBtn) {
            translationsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu?.classList.remove('open');
                openScreenshotTranslationsModal(index);
            });
        }

        // Replace button handler
        const replaceBtn = item.querySelector('.screenshot-replace');
        if (replaceBtn) {
            replaceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu?.classList.remove('open');
                replaceScreenshot(index);
            });
        }

        // Transfer button handler
        const transferBtn = item.querySelector('.screenshot-transfer');
        if (transferBtn) {
            transferBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu?.classList.remove('open');
                state.transferTarget = index;
                updateScreenshotList();
            });
        }

        // Apply style to all button handler
        const applyAllBtn = item.querySelector('.screenshot-apply-all');
        if (applyAllBtn) {
            applyAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu?.classList.remove('open');
                showApplyStyleModal(index);
            });
        }

        // Delete button handler
        const deleteBtn = item.querySelector('.screenshot-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu?.classList.remove('open');
                state.screenshots.splice(index, 1);
                if (state.selectedIndex >= state.screenshots.length) {
                    state.selectedIndex = Math.max(0, state.screenshots.length - 1);
                }
                updateScreenshotList();
                syncUIWithState();
                updateGradientStopsUI();
                updateCanvas();
            });
        }

        screenshotList.appendChild(item);
    });

    // Add upload zone as last item in the list (unless in transfer mode)
    if (state.transferTarget === null) {
        const uploadItem = document.createElement('div');
        uploadItem.className = 'screenshot-item upload-item';
        uploadItem.id = 'upload-zone';
        uploadItem.innerHTML = `
            <div class="upload-item-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
            </div>
            <div class="screenshot-info">
                <div class="screenshot-name">Add Screenshots</div>
                <div class="screenshot-device">Drop or click to browse</div>
            </div>
        `;
        uploadItem.addEventListener('click', () => fileInput.click());
        screenshotList.appendChild(uploadItem);
    }

    // Update project selector to reflect current screenshot count
    updateProjectSelector();
}

function cancelTransfer() {
    state.transferTarget = null;
    updateScreenshotList();
}

function transferStyle(sourceIndex, targetIndex) {
    const source = state.screenshots[sourceIndex];
    const target = state.screenshots[targetIndex];

    if (!source || !target) {
        state.transferTarget = null;
        updateScreenshotList();
        return;
    }

    // Deep copy background settings
    target.background = JSON.parse(JSON.stringify(source.background));
    // Handle background image separately (not JSON serializable)
    if (source.background.image) {
        target.background.image = source.background.image;
    }

    // Deep copy screenshot settings
    target.screenshot = JSON.parse(JSON.stringify(source.screenshot));

    // Copy text styling but preserve actual text content
    const targetHeadlines = target.text.headlines;
    const targetSubheadlines = target.text.subheadlines;
    target.text = JSON.parse(JSON.stringify(source.text));
    // Restore original text content
    target.text.headlines = targetHeadlines;
    target.text.subheadlines = targetSubheadlines;

    // Reset transfer mode
    state.transferTarget = null;

    // Update UI
    updateScreenshotList();
    syncUIWithState();
    updateGradientStopsUI();
    updateCanvas();
}

// Track which screenshot to apply style from
let applyStyleSourceIndex = null;

function showApplyStyleModal(sourceIndex) {
    applyStyleSourceIndex = sourceIndex;
    document.getElementById('apply-style-modal').classList.add('visible');
}

function applyStyleToAll() {
    if (applyStyleSourceIndex === null) return;

    const source = state.screenshots[applyStyleSourceIndex];
    if (!source) {
        applyStyleSourceIndex = null;
        return;
    }

    // Apply style to all other screenshots
    state.screenshots.forEach((target, index) => {
        if (index === applyStyleSourceIndex) return; // Skip source

        // Deep copy background settings
        target.background = JSON.parse(JSON.stringify(source.background));
        // Handle background image separately (not JSON serializable)
        if (source.background.image) {
            target.background.image = source.background.image;
        }

        // Deep copy screenshot settings
        target.screenshot = JSON.parse(JSON.stringify(source.screenshot));

        // Copy text styling but preserve actual text content
        const targetHeadlines = target.text.headlines;
        const targetSubheadlines = target.text.subheadlines;
        target.text = JSON.parse(JSON.stringify(source.text));
        // Restore original text content
        target.text.headlines = targetHeadlines;
        target.text.subheadlines = targetSubheadlines;
    });

    applyStyleSourceIndex = null;

    // Update UI
    updateScreenshotList();
    syncUIWithState();
    updateGradientStopsUI();
    updateCanvas();
}

// Replace screenshot image via file picker
function replaceScreenshot(index) {
    const screenshot = state.screenshots[index];
    if (!screenshot) return;

    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            document.body.removeChild(fileInput);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Get the current language
                const lang = state.currentLanguage;

                // Update the localized image for the current language
                if (!screenshot.localizedImages) {
                    screenshot.localizedImages = {};
                }

                screenshot.localizedImages[lang] = {
                    image: img,
                    src: event.target.result,
                    name: file.name
                };

                // Also update legacy image field for compatibility
                screenshot.image = img;

                // Update displays
                updateScreenshotList();
                updateCanvas();
                saveState();
            };
            img.onerror = () => {
                console.error('Failed to load replacement image:', file.name);
                alert(`Failed to load image: ${file.name}. The file may be corrupted.`);
            };
            img.src = event.target.result;
        };
        reader.onerror = () => {
            console.error('Failed to read replacement file:', file.name);
            alert(`Failed to read file: ${file.name}. Please try again.`);
        };
        reader.readAsDataURL(file);

        document.body.removeChild(fileInput);
    });

    // Trigger file dialog
    fileInput.click();
}

function updateGradientStopsUI() {
    const container = document.getElementById('gradient-stops');
    if (!container) return;
    container.innerHTML = '';

    const bg = getBackground();
    if (!bg.gradient || !bg.gradient.stops) {
        // No gradient data - show empty state or create default
        return;
    }
    bg.gradient.stops.forEach((stop, index) => {
        const div = document.createElement('div');
        div.className = 'gradient-stop';
        div.innerHTML = `
            <input type="color" value="${stop.color}" data-stop="${index}">
            <input type="number" value="${stop.position}" min="0" max="100" data-stop="${index}">
            <span>%</span>
            ${index > 1 ? `<button class="screenshot-delete" data-stop="${index}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>` : ''}
        `;

        div.querySelector('input[type="color"]').addEventListener('input', (e) => {
            const currentBg = getBackground();
            currentBg.gradient.stops[index].color = e.target.value;
            // Deselect preset when manually changing colors
            document.querySelectorAll('.preset-swatch').forEach(s => s.classList.remove('selected'));
            updateCanvas();
        });

        div.querySelector('input[type="number"]').addEventListener('input', (e) => {
            const currentBg = getBackground();
            currentBg.gradient.stops[index].position = parseInt(e.target.value);
            // Deselect preset when manually changing positions
            document.querySelectorAll('.preset-swatch').forEach(s => s.classList.remove('selected'));
            updateCanvas();
        });

        const deleteBtn = div.querySelector('.screenshot-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const currentBg = getBackground();
                currentBg.gradient.stops.splice(index, 1);
                // Deselect preset when deleting a stop
                document.querySelectorAll('.preset-swatch').forEach(s => s.classList.remove('selected'));
                updateGradientStopsUI();
                updateCanvas();
            });
        }

        container.appendChild(div);
    });
}

function getCanvasDimensions() {
    if (state.outputDevice === 'custom') {
        return { width: state.customWidth, height: state.customHeight };
    }
    return deviceDimensions[state.outputDevice];
}

// ============================================================================
// RULE 4: TEXT-DEVICE SEPARATION VALIDATION
// Ensures minimum 50px gap between text and device
// ============================================================================

function calculateTextBounds(dims) {
    const text = getTextSettings();
    const headline = text.headlines[state.selectedLanguage] || text.headlines['en'] || '';
    const subheadline = text.subheadlines?.[state.selectedLanguage] || text.subheadlines?.['en'] || '';

    if (!headline && !subheadline) return null;

    // Create off-screen canvas for measuring
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const leftPadding = dims.width * 0.08;
    const rightPadding = dims.width * 0.08;
    const useStackedText = text.stackedText !== false;

    let textY = text.position === 'top'
        ? dims.height * (text.offsetY / 100)
        : dims.height * (1 - text.offsetY / 100);

    let totalHeight = 0;

    // Calculate headline bounds
    if (headline) {
        tempCtx.font = `${text.headlineWeight} ${text.headlineSize}px ${text.headlineFont}`;

        let lines;
        if (useStackedText) {
            lines = headline.split(/\s+/).filter(word => word.length > 0);
        } else {
            lines = wrapText(tempCtx, headline, dims.width - leftPadding - rightPadding);
        }

        const lineHeight = text.headlineSize * (text.lineHeight / 100);
        totalHeight += lines.length * lineHeight;
    }

    // Calculate subheadline bounds
    if (subheadline && text.subheadlineEnabled) {
        const gap = 16; // Gap between headline and subheadline
        tempCtx.font = `${text.subheadlineWeight || '400'} ${text.subheadlineSize}px ${text.subheadlineFont || text.headlineFont}`;
        const subLines = wrapText(tempCtx, subheadline, dims.width - leftPadding - rightPadding);
        const subLineHeight = text.subheadlineSize * 1.4;
        totalHeight += gap + (subLines.length * subLineHeight);
    }

    // Return bounds based on position
    if (text.position === 'top') {
        return {
            top: textY,
            bottom: textY + totalHeight,
            height: totalHeight
        };
    } else {
        return {
            top: textY - totalHeight,
            bottom: textY,
            height: totalHeight
        };
    }
}

function calculateDeviceBounds(dims) {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return null;

    const img = getScreenshotImage(screenshot);
    if (!img) return null;

    const settings = getScreenshotSettings();
    const scale = settings.scale / 100;

    let imgWidth = dims.width * scale;
    let imgHeight = (img.height / img.width) * imgWidth;

    if (imgHeight > dims.height * scale) {
        imgHeight = dims.height * scale;
        imgWidth = (img.width / img.height) * imgHeight;
    }

    const y = (dims.height - imgHeight) * (settings.y / 100);

    return {
        top: y,
        bottom: y + imgHeight,
        height: imgHeight,
        width: imgWidth
    };
}

function validateTextDeviceSeparation(autoAdjust = false) {
    const dims = getCanvasDimensions();
    const textBounds = calculateTextBounds(dims);
    const deviceBounds = calculateDeviceBounds(dims);

    if (!textBounds || !deviceBounds) return { valid: true, gap: null };

    const MIN_GAP = 50; // RULE 4: Minimum 50px gap
    const text = getTextSettings();

    let gap;
    if (text.position === 'top') {
        gap = deviceBounds.top - textBounds.bottom;
    } else {
        gap = textBounds.top - deviceBounds.bottom;
    }

    const isValid = gap >= MIN_GAP;

    if (!isValid && autoAdjust) {
        // Auto-adjust device position to maintain minimum gap
        const screenshot = state.screenshots[state.selectedIndex];
        if (screenshot && screenshot.screenshot) {
            const neededShift = MIN_GAP - gap + 10; // Extra 10px buffer
            const currentY = screenshot.screenshot.y;

            if (text.position === 'top') {
                // Move device down
                const newY = Math.min(90, currentY + (neededShift / dims.height) * 100);
                screenshot.screenshot.y = newY;
            } else {
                // Move device up
                const newY = Math.max(10, currentY - (neededShift / dims.height) * 100);
                screenshot.screenshot.y = newY;
            }

            console.log(`[RULE 4] Auto-adjusted device Y from ${currentY.toFixed(1)}% to ${screenshot.screenshot.y.toFixed(1)}%`);
            return { valid: true, gap: MIN_GAP + 10, adjusted: true };
        }
    }

    return { valid: isValid, gap: gap };
}

// ============================================================================
// CATEGORY DETECTION & DESIGN PROFILES
// Automatically applies category-specific design settings
// ============================================================================

const CATEGORY_PROFILES = {
    finance: {
        name: 'Finance & Banking',
        keywords: ['bank', 'money', 'invest', 'stock', 'crypto', 'trade', 'wallet', 'payment', 'budget', 'savings'],
        colors: ['#0A1628', '#1A2744', '#0D47A1', '#1565C0', '#00695C'],
        fonts: { headline: 'SF Pro Display', subheadline: 'Inter' },
        style: 'professional'
    },
    wellness: {
        name: 'Health & Wellness',
        keywords: ['health', 'fitness', 'workout', 'meditation', 'sleep', 'yoga', 'calm', 'mindful', 'diet', 'nutrition'],
        colors: ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#4DB6AC'],
        fonts: { headline: 'Poppins', subheadline: 'Inter' },
        style: 'calming'
    },
    ecommerce: {
        name: 'E-commerce & Shopping',
        keywords: ['shop', 'buy', 'cart', 'store', 'deal', 'sale', 'product', 'order', 'delivery', 'price'],
        colors: ['#FF6B35', '#F7931E', '#FFB627', '#FF4757', '#2ED573'],
        fonts: { headline: 'Poppins', subheadline: 'Inter' },
        style: 'vibrant'
    },
    social: {
        name: 'Social & Communication',
        keywords: ['chat', 'message', 'social', 'friend', 'share', 'connect', 'network', 'dating', 'community'],
        colors: ['#667EEA', '#764BA2', '#F093FB', '#F5576C', '#4FACFE'],
        fonts: { headline: 'SF Pro Display', subheadline: 'Inter' },
        style: 'modern'
    },
    kids: {
        name: 'Kids & Education',
        keywords: ['kids', 'child', 'learn', 'education', 'school', 'game', 'play', 'fun', 'abc', 'math'],
        colors: ['#FFD93D', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'],
        fonts: { headline: 'Nunito', subheadline: 'Nunito' },
        style: 'playful'
    },
    entertainment: {
        name: 'Entertainment & Media',
        keywords: ['movie', 'music', 'video', 'stream', 'watch', 'listen', 'podcast', 'tv', 'show', 'play'],
        colors: ['#141414', '#E50914', '#1DB954', '#FF0050', '#000000'],
        fonts: { headline: 'Poppins', subheadline: 'Inter' },
        style: 'bold'
    },
    sports: {
        name: 'Sports & Fitness',
        keywords: ['sport', 'run', 'gym', 'training', 'athlete', 'score', 'team', 'match', 'workout', 'exercise'],
        colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#00FF87'],
        fonts: { headline: 'Oswald', subheadline: 'Inter' },
        style: 'energetic'
    },
    food: {
        name: 'Food & Dining',
        keywords: ['food', 'recipe', 'cook', 'restaurant', 'delivery', 'order', 'meal', 'eat', 'menu', 'cuisine'],
        colors: ['#FF6B35', '#FF8E53', '#FFD93D', '#6BCB77', '#4D96FF'],
        fonts: { headline: 'Poppins', subheadline: 'Inter' },
        style: 'appetizing'
    }
};

function detectCategory(appName, description = '') {
    const searchText = (appName + ' ' + description).toLowerCase();
    let bestMatch = { category: null, score: 0 };

    for (const [category, profile] of Object.entries(CATEGORY_PROFILES)) {
        let score = 0;
        for (const keyword of profile.keywords) {
            if (searchText.includes(keyword)) {
                score += 1;
            }
        }
        if (score > bestMatch.score) {
            bestMatch = { category, score };
        }
    }

    return bestMatch.score > 0 ? bestMatch.category : 'ecommerce'; // Default to ecommerce
}

function applyCategoryProfile(category) {
    const profile = CATEGORY_PROFILES[category];
    if (!profile) return;

    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;

    // Apply font settings
    state.text.headlineFont = profile.fonts.headline;
    state.text.subheadlineFont = profile.fonts.subheadline;

    // Apply a color from the category palette
    const colorIndex = state.selectedIndex % profile.colors.length;
    const bgColor = profile.colors[colorIndex];

    // Update background for current screenshot
    if (!screenshot.background) {
        screenshot.background = {};
    }
    screenshot.background.type = 'solid';
    screenshot.background.color = bgColor;

    console.log(`[Category Profile] Applied "${profile.name}" profile with color ${bgColor}`);

    syncUIWithState();
    updateCanvas();
}

// ============================================================================
// MAGIC DESIGN - AUTO-APPLY ALL DESIGN RULES
// One-click professional screenshot transformation
// ============================================================================

/**
 * Magic Design - automatically applies professional design rules
 * Delegates to AI Engine if available and API key is configured,
 * otherwise uses local rule-based design.
 */
function magicDesign(appName = '', options = {}) {
    // Check if we should use AI Engine (has API key configured)
    const hasApiKey = localStorage.getItem('googleApiKey') ||
                      localStorage.getItem('anthropicApiKey') ||
                      localStorage.getItem('openaiApiKey');

    // If AI Engine is available and has API key, delegate to full AI pipeline
    if (window.AIEngine?.magicDesign && hasApiKey && !options.forceBasic) {
        if (window.Utils?.DEBUG) console.log('[Magic Design] Delegating to AI Engine');
        return window.AIEngine.magicDesign(options);
    }

    // Otherwise use basic design rules
    return applyBasicMagicDesign(appName, options);
}

/**
 * Apply basic magic design using local rules (no AI)
 */
function applyBasicMagicDesign(appName = '', options = {}) {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) {
        if (window.Utils?.DEBUG) console.warn('[Magic Design] No screenshot selected');
        return;
    }

    if (window.Utils?.DEBUG) console.log('[Magic Design] Starting basic transformation...');

    // 1. Detect category and get profile
    const category = options.category || detectCategory(appName);
    const profile = CATEGORY_PROFILES[category] || CATEGORY_PROFILES.ecommerce;

    // 2. Initialize screenshot settings with defaults
    if (!screenshot.screenshot) {
        screenshot.screenshot = window.Utils?.deepClone(state.defaults.screenshot) || {};
    }

    // 3. Get canvas dimensions for calculations
    const dims = getCanvasDimensions();

    // 4. Calculate optimal device Y position based on text settings (RULE 1 & 4)
    const textSettings = getTextSettings();
    const optimalY = window.Utils?.calculateOptimalDeviceY(dims, textSettings, state.currentLanguage)
        || calculateLocalOptimalDeviceY(dims, textSettings);

    // 5. Apply device positioning
    screenshot.screenshot.y = optimalY;
    screenshot.screenshot.x = 50; // Centered horizontally

    // 6. Apply RULE 8: Device scale (58-65%)
    screenshot.screenshot.scale = 62;

    // 7. Apply RULE 7: Shadow settings
    screenshot.screenshot.shadow = {
        enabled: true,
        blur: 60,
        opacity: 35,
        x: 0,
        y: 25,
        color: '#000000'
    };

    // 8. Apply RULE 6: Background color from category profile
    const colorIndex = state.selectedIndex % profile.colors.length;
    if (!screenshot.background) {
        screenshot.background = window.Utils?.deepClone(state.defaults.background) || {};
    }
    screenshot.background.type = 'solid';
    screenshot.background.solid = profile.colors[colorIndex];

    // 9. Apply RULE 2 & 12: Typography settings
    state.text.headlineFont = profile.fonts.headline;
    state.text.subheadlineFont = profile.fonts.subheadline;
    state.text.headlineSize = 72;
    state.text.headlineWeight = '700';
    state.text.lineHeight = 95;
    state.text.stackedText = true;
    state.text.position = 'top';
    state.text.offsetY = 8;
    state.text.headlineColor = '#FFFFFF';

    // 10. Apply RULE 3: Subheadline settings
    state.text.subheadlineSize = 28;
    state.text.subheadlineWeight = '400';
    state.text.subheadlineOpacity = 75;

    // 11. Apply corner radius for modern look
    screenshot.screenshot.cornerRadius = 45;

    // 12. Handle 3D mode if active
    const ss = getScreenshotSettings();
    if (ss.use3D) {
        if (!screenshot.screenshot.rotation3D) {
            screenshot.screenshot.rotation3D = { x: 0, y: 0, z: 0 };
        }
        // Apply subtle dynamic rotation for visual interest
        screenshot.screenshot.rotation3D.y = -5 + (state.selectedIndex % 3) * 2;
        screenshot.screenshot.rotation3D.x = 3;

        // Update 3D renderer
        if (typeof setThreeJSRotation === 'function') {
            setThreeJSRotation(
                screenshot.screenshot.rotation3D.x,
                screenshot.screenshot.rotation3D.y,
                screenshot.screenshot.rotation3D.z || 0
            );
        }
    }

    if (window.Utils?.DEBUG) {
        console.log(`[Magic Design] Applied "${profile.name}" style to screenshot ${state.selectedIndex + 1}`);
    }

    // 13. Update UI and render
    syncUIWithState();
    updateCanvas();

    // 14. FINAL: Validate text-device separation after render (RULE 4)
    // This must happen after canvas dimensions are recalculated
    setTimeout(() => {
        const separationCheck = validateTextDeviceSeparation(true);
        if (separationCheck && separationCheck.adjusted) {
            if (window.Utils?.DEBUG) console.log('[Magic Design] Adjusted device position for text separation');
            updateCanvas();
        }
    }, 50);

    return {
        category,
        profile: profile.name,
        color: profile.colors[colorIndex]
    };
}

/**
 * Calculate optimal device Y position locally (fallback when Utils not available)
 */
function calculateLocalOptimalDeviceY(dims, text) {
    if (!dims || !text) return 72;

    const headline = text.headlines?.[state.currentLanguage] || '';
    const headlineLines = text.stackedText
        ? headline.split(/\s+/).filter(w => w.length > 0).length
        : 1;

    const hasSubheadline = text.subheadlineEnabled && text.subheadlines?.[state.currentLanguage];
    const headlineSize = text.headlineSize || 72;
    const subheadlineSize = text.subheadlineSize || 28;
    const lineHeight = headlineSize * ((text.lineHeight || 95) / 100);

    const textHeight = (headlineLines * lineHeight)
        + (hasSubheadline ? subheadlineSize * 1.5 + 16 : 0);

    const textTopOffset = dims.height * ((text.offsetY || 8) / 100);
    const minGap = 50; // RULE 4: 50px minimum gap

    const contentBottom = textTopOffset + textHeight + minGap;
    const deviceTopPercent = (contentBottom / dims.height) * 100;

    // Return Y position clamped between reasonable values
    return Math.min(85, Math.max(65, deviceTopPercent + 10));
}

// Apply Magic Design to all screenshots with consistent styling
function magicDesignAll(appName = '', options = {}) {
    const category = options.category || detectCategory(appName);
    const profile = CATEGORY_PROFILES[category] || CATEGORY_PROFILES.ecommerce;
    const originalIndex = state.selectedIndex;

    if (window.Utils?.DEBUG) {
        console.log(`[Magic Design] Applying "${profile.name}" style to all ${state.screenshots.length} screenshots...`);
    }

    state.screenshots.forEach((screenshot, index) => {
        state.selectedIndex = index;

        // Apply Magic Design with same category for consistency, force basic mode
        // to avoid multiple AI calls
        applyBasicMagicDesign(appName, { category, forceBasic: true });
    });

    // Restore original selection
    state.selectedIndex = originalIndex;

    // RULE 10: Ensure set consistency
    const consistency = validateSetConsistency();
    if (!consistency.consistent && window.Utils?.DEBUG) {
        console.warn('[Magic Design] Consistency issues:', consistency.issues);
    }

    syncUIWithState();
    updateCanvas();

    if (window.Utils?.DEBUG) {
        console.log('[Magic Design] All screenshots transformed successfully!');
    }
}

// Quick presets for common app types
const MAGIC_PRESETS = {
    professional: {
        category: 'finance',
        options: { style: 'minimal' }
    },
    vibrant: {
        category: 'ecommerce',
        options: { style: 'bold' }
    },
    calming: {
        category: 'wellness',
        options: { style: 'soft' }
    },
    playful: {
        category: 'kids',
        options: { style: 'fun' }
    },
    modern: {
        category: 'social',
        options: { style: 'trendy' }
    },
    dark: {
        category: 'entertainment',
        options: { style: 'dramatic' }
    }
};

function applyMagicPreset(presetName) {
    const preset = MAGIC_PRESETS[presetName];
    if (!preset) {
        console.warn(`[Magic Design] Unknown preset: ${presetName}`);
        return;
    }

    magicDesign('', { category: preset.category });
}

function updateCanvas() {
    debouncedSaveState(); // Persist state with debounce to avoid performance issues
    const dims = getCanvasDimensions();
    canvas.width = dims.width;
    canvas.height = dims.height;

    // Scale for preview
    const maxPreviewWidth = 400;
    const maxPreviewHeight = 700;
    const scale = Math.min(maxPreviewWidth / dims.width, maxPreviewHeight / dims.height);
    canvas.style.width = (dims.width * scale) + 'px';
    canvas.style.height = (dims.height * scale) + 'px';

    // Draw background
    drawBackground();

    // Draw noise overlay on background if enabled
    if (getBackground().noise) {
        drawNoise();
    }

    // Draw screenshot (2D mode) or 3D phone model
    if (state.screenshots.length > 0) {
        const ss = getScreenshotSettings();
        const use3D = ss.use3D || false;
        if (use3D && typeof renderThreeJSToCanvas === 'function' && phoneModelLoaded) {
            // In 3D mode, update the screen texture and render the phone model
            if (typeof updateScreenTexture === 'function') {
                updateScreenTexture();
            }
            renderThreeJSToCanvas(canvas, dims.width, dims.height);
        } else if (!use3D) {
            // In 2D mode, draw the screenshot normally
            drawScreenshot();
        }
    }

    // Draw text
    drawText();

    // Draw widgets if any
    drawWidgets();

    // Draw uploaded elements (logos, etc.)
    drawElements();

    // Update side previews
    updateSidePreviews();
}

// ============================================================================
// WIDGET RENDERING SYSTEM
// Supports: star ratings, download counts, App of the Day badges, custom text
// ============================================================================

const WIDGET_PRESETS = {
    rating: {
        type: 'rating',
        text: '4.9',
        stars: 5,
        style: {
            background: 'rgba(0,0,0,0.75)',
            color: '#FFD700',
            textColor: '#FFFFFF',
            fontSize: 16,
            padding: 12,
            borderRadius: 12,
            blur: 10
        }
    },
    downloads: {
        type: 'downloads',
        text: '10M+',
        label: 'Downloads',
        style: {
            background: 'rgba(0,0,0,0.75)',
            color: '#FFFFFF',
            fontSize: 14,
            padding: 10,
            borderRadius: 10,
            blur: 10
        }
    },
    appOfTheDay: {
        type: 'appOfTheDay',
        text: 'App of the Day',
        icon: 'apple',
        style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#FFFFFF',
            fontSize: 14,
            padding: 12,
            borderRadius: 16,
            blur: 0
        }
    },
    featured: {
        type: 'featured',
        text: '#1 in Category',
        style: {
            background: 'rgba(34, 197, 94, 0.9)',
            color: '#FFFFFF',
            fontSize: 14,
            padding: 10,
            borderRadius: 8,
            blur: 0
        }
    },
    editorsChoice: {
        type: 'editorsChoice',
        text: "Editor's Choice",
        icon: 'badge',
        style: {
            background: 'rgba(59, 130, 246, 0.9)',
            color: '#FFFFFF',
            fontSize: 14,
            padding: 12,
            borderRadius: 12,
            blur: 0
        }
    }
};

function drawStar(ctx, cx, cy, size, filled = true) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / 2 * 3) + (i * Math.PI / spikes);
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();

    if (filled) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function drawWidgets() {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot || !screenshot.widgets || screenshot.widgets.length === 0) return;

    const dims = getCanvasDimensions();

    screenshot.widgets.forEach(widget => {
        const x = dims.width * (widget.position.x / 100);
        const y = dims.height * (widget.position.y / 100);
        const style = widget.style || {};
        const type = widget.type || 'text';

        ctx.save();

        // Apply blur effect for glassmorphism
        if (style.blur && style.blur > 0) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = style.blur;
            ctx.shadowOffsetY = 4;
        }

        switch (type) {
            case 'rating':
                drawRatingWidget(ctx, x, y, widget, style, dims);
                break;
            case 'downloads':
                drawDownloadsWidget(ctx, x, y, widget, style, dims);
                break;
            case 'appOfTheDay':
                drawAppOfTheDayWidget(ctx, x, y, widget, style, dims);
                break;
            case 'featured':
            case 'editorsChoice':
                drawBadgeWidget(ctx, x, y, widget, style, dims);
                break;
            default:
                drawTextWidget(ctx, x, y, widget, style, dims);
        }

        ctx.restore();
    });
}

function drawRatingWidget(ctx, x, y, widget, style, dims) {
    const fontSize = style.fontSize || 16;
    const padding = style.padding || 12;
    const borderRadius = style.borderRadius || 12;
    const stars = widget.stars || 5;
    const rating = parseFloat(widget.text) || 4.9;

    // Calculate dimensions
    const starSize = fontSize * 0.6;
    const starGap = 3;
    const starsWidth = stars * (starSize * 2 + starGap);

    ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    const ratingTextWidth = ctx.measureText(widget.text).width;

    const totalWidth = ratingTextWidth + 12 + starsWidth + padding * 2;
    const totalHeight = fontSize + padding * 2;

    // Draw background with glassmorphism
    ctx.fillStyle = style.background || 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    roundRect(ctx, x, y, totalWidth, totalHeight, borderRadius);
    ctx.fill();

    // Draw border for glass effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Reset shadow for text
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw rating number
    ctx.fillStyle = style.textColor || '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(widget.text, x + padding, y + totalHeight / 2);

    // Draw stars
    ctx.fillStyle = style.color || '#FFD700';
    const starStartX = x + padding + ratingTextWidth + 12;
    const starY = y + totalHeight / 2;

    for (let i = 0; i < stars; i++) {
        const starX = starStartX + i * (starSize * 2 + starGap) + starSize;
        const filled = i < Math.floor(rating);
        drawStar(ctx, starX, starY, starSize, filled);
    }
}

function drawDownloadsWidget(ctx, x, y, widget, style, dims) {
    const fontSize = style.fontSize || 14;
    const padding = style.padding || 10;
    const borderRadius = style.borderRadius || 10;

    // Two-line layout: number on top, "Downloads" below
    const numberFontSize = fontSize * 1.4;
    ctx.font = `700 ${numberFontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    const numberWidth = ctx.measureText(widget.text).width;

    ctx.font = `400 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    const labelWidth = ctx.measureText(widget.label || 'Downloads').width;

    const totalWidth = Math.max(numberWidth, labelWidth) + padding * 2;
    const totalHeight = numberFontSize + fontSize + 6 + padding * 2;

    // Draw background
    ctx.fillStyle = style.background || 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    roundRect(ctx, x, y, totalWidth, totalHeight, borderRadius);
    ctx.fill();

    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw number
    ctx.fillStyle = style.color || '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = `700 ${numberFontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    ctx.fillText(widget.text, x + totalWidth / 2, y + padding);

    // Draw label
    ctx.font = `400 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(widget.label || 'Downloads', x + totalWidth / 2, y + padding + numberFontSize + 6);
}

function drawAppOfTheDayWidget(ctx, x, y, widget, style, dims) {
    const fontSize = style.fontSize || 14;
    const padding = style.padding || 12;
    const borderRadius = style.borderRadius || 16;

    // Apple logo + text layout
    const logoSize = fontSize * 1.2;
    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    const textWidth = ctx.measureText(widget.text).width;

    const totalWidth = logoSize + 10 + textWidth + padding * 2;
    const totalHeight = Math.max(logoSize, fontSize) + padding * 2;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(x, y, x + totalWidth, y + totalHeight);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    roundRect(ctx, x, y, totalWidth, totalHeight, borderRadius);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw Apple logo (simplified)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${logoSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('', x + padding, y + totalHeight / 2);

    // Draw text
    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    ctx.fillText(widget.text, x + padding + logoSize + 10, y + totalHeight / 2);
}

function drawBadgeWidget(ctx, x, y, widget, style, dims) {
    const fontSize = style.fontSize || 14;
    const padding = style.padding || 10;
    const borderRadius = style.borderRadius || 8;

    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    const textWidth = ctx.measureText(widget.text).width;

    const iconSize = fontSize * 1.1;
    const hasIcon = widget.icon;
    const iconSpace = hasIcon ? iconSize + 8 : 0;

    const totalWidth = iconSpace + textWidth + padding * 2;
    const totalHeight = fontSize + padding * 2;

    // Draw background
    ctx.fillStyle = style.background || 'rgba(59, 130, 246, 0.9)';
    ctx.beginPath();
    roundRect(ctx, x, y, totalWidth, totalHeight, borderRadius);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw icon if present
    ctx.fillStyle = style.color || '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    if (hasIcon) {
        // Draw checkmark or badge icon
        ctx.font = `${iconSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText('✓', x + padding, y + totalHeight / 2);
    }

    // Draw text
    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    ctx.fillText(widget.text, x + padding + iconSpace, y + totalHeight / 2);
}

function drawTextWidget(ctx, x, y, widget, style, dims) {
    const fontSize = style.fontSize || 14;
    const padding = style.padding || 8;
    const borderRadius = style.borderRadius || 8;

    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
    const textWidth = ctx.measureText(widget.text).width;

    const totalWidth = textWidth + padding * 2;
    const totalHeight = fontSize + padding * 2;

    // Draw background
    ctx.fillStyle = style.background || 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    roundRect(ctx, x, y, totalWidth, totalHeight, borderRadius);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw text
    ctx.fillStyle = style.color || '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(widget.text, x + padding, y + totalHeight / 2);
}

// Add widget to current screenshot
function addWidget(presetName, position = { x: 5, y: 5 }) {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;

    if (!screenshot.widgets) {
        screenshot.widgets = [];
    }

    const preset = WIDGET_PRESETS[presetName] || WIDGET_PRESETS.rating;
    const widget = {
        ...JSON.parse(JSON.stringify(preset)),
        position: { ...position },
        id: Date.now()
    };

    screenshot.widgets.push(widget);
    updateCanvas();
    return widget;
}

function removeWidget(widgetId) {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot || !screenshot.widgets) return;

    screenshot.widgets = screenshot.widgets.filter(w => w.id !== widgetId);
    updateCanvas();
}

function updateSidePreviews() {
    const dims = getCanvasDimensions();
    // Same scale as main preview
    const maxPreviewWidth = 400;
    const maxPreviewHeight = 700;
    const previewScale = Math.min(maxPreviewWidth / dims.width, maxPreviewHeight / dims.height);

    // Initialize Three.js if any screenshot uses 3D mode (needed for side previews)
    const any3D = state.screenshots.some(s => s.screenshot?.use3D);
    if (any3D && typeof showThreeJS === 'function') {
        showThreeJS(true);

        // Preload phone models for adjacent screenshots to prevent flicker
        if (typeof loadCachedPhoneModel === 'function') {
            const adjacentIndices = [state.selectedIndex - 1, state.selectedIndex + 1]
                .filter(i => i >= 0 && i < state.screenshots.length);
            adjacentIndices.forEach(i => {
                const ss = state.screenshots[i]?.screenshot;
                if (ss?.use3D && ss?.device3D) {
                    loadCachedPhoneModel(ss.device3D);
                }
            });
        }
    }

    // Calculate main canvas display width and position side previews with 10px gap
    const mainCanvasWidth = dims.width * previewScale;
    const gap = 10;
    const sideOffset = mainCanvasWidth / 2 + gap;
    const farSideOffset = sideOffset + mainCanvasWidth + gap;

    // Previous screenshot (left, index - 1)
    const prevIndex = state.selectedIndex - 1;
    if (prevIndex >= 0 && state.screenshots.length > 1) {
        sidePreviewLeft.classList.remove('hidden');
        sidePreviewLeft.style.right = `calc(50% + ${sideOffset}px)`;
        // Skip render if already pre-rendered during slide transition
        if (!skipSidePreviewRender) {
            renderScreenshotToCanvas(prevIndex, canvasLeft, ctxLeft, dims, previewScale);
        }
        // Click to select previous with animation
        sidePreviewLeft.onclick = () => {
            if (isSliding) return;
            slideToScreenshot(prevIndex, 'left');
        };
    } else {
        sidePreviewLeft.classList.add('hidden');
    }

    // Far previous screenshot (far left, index - 2)
    const farPrevIndex = state.selectedIndex - 2;
    if (farPrevIndex >= 0 && state.screenshots.length > 2) {
        sidePreviewFarLeft.classList.remove('hidden');
        sidePreviewFarLeft.style.right = `calc(50% + ${farSideOffset}px)`;
        renderScreenshotToCanvas(farPrevIndex, canvasFarLeft, ctxFarLeft, dims, previewScale);
    } else {
        sidePreviewFarLeft.classList.add('hidden');
    }

    // Next screenshot (right, index + 1)
    const nextIndex = state.selectedIndex + 1;
    if (nextIndex < state.screenshots.length && state.screenshots.length > 1) {
        sidePreviewRight.classList.remove('hidden');
        sidePreviewRight.style.left = `calc(50% + ${sideOffset}px)`;
        // Skip render if already pre-rendered during slide transition
        if (!skipSidePreviewRender) {
            renderScreenshotToCanvas(nextIndex, canvasRight, ctxRight, dims, previewScale);
        }
        // Click to select next with animation
        sidePreviewRight.onclick = () => {
            if (isSliding) return;
            slideToScreenshot(nextIndex, 'right');
        };
    } else {
        sidePreviewRight.classList.add('hidden');
    }

    // Far next screenshot (far right, index + 2)
    const farNextIndex = state.selectedIndex + 2;
    if (farNextIndex < state.screenshots.length && state.screenshots.length > 2) {
        sidePreviewFarRight.classList.remove('hidden');
        sidePreviewFarRight.style.left = `calc(50% + ${farSideOffset}px)`;
        renderScreenshotToCanvas(farNextIndex, canvasFarRight, ctxFarRight, dims, previewScale);
    } else {
        sidePreviewFarRight.classList.add('hidden');
    }
}

function slideToScreenshot(newIndex, direction) {
    isSliding = true;
    previewStrip.classList.add('sliding');

    const dims = getCanvasDimensions();
    const maxPreviewWidth = 400;
    const maxPreviewHeight = 700;
    const previewScale = Math.min(maxPreviewWidth / dims.width, maxPreviewHeight / dims.height);
    const slideDistance = dims.width * previewScale + 10; // canvas width + gap

    const newPrevIndex = newIndex - 1;
    const newNextIndex = newIndex + 1;

    // Collect model loading promises for new active AND adjacent screenshots
    const modelPromises = [];
    [newIndex, newPrevIndex, newNextIndex].forEach(index => {
        if (index >= 0 && index < state.screenshots.length) {
            const ss = state.screenshots[index]?.screenshot;
            if (ss?.use3D && ss?.device3D && typeof loadCachedPhoneModel === 'function') {
                modelPromises.push(loadCachedPhoneModel(ss.device3D).catch(() => null));
            }
        }
    });

    // Start loading models immediately (in parallel with animation)
    const modelsReady = modelPromises.length > 0 ? Promise.all(modelPromises) : Promise.resolve();

    // Slide the strip in the opposite direction of the click
    if (direction === 'right') {
        previewStrip.style.transform = `translateX(-${slideDistance}px)`;
    } else {
        previewStrip.style.transform = `translateX(${slideDistance}px)`;
    }

    // Wait for BOTH animation AND models to be ready
    const animationDone = new Promise(resolve => setTimeout(resolve, 300));
    Promise.all([animationDone, modelsReady]).then(() => {
        // Pre-render new side previews to temporary canvases NOW (models are loaded)
        const tempCanvases = [];

        const prerenderToTemp = (index, targetCanvas) => {
            if (index < 0 || index >= state.screenshots.length) return null;
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            renderScreenshotToCanvas(index, tempCanvas, tempCtx, dims, previewScale);
            return { tempCanvas, targetCanvas };
        };

        const leftPrerender = prerenderToTemp(newPrevIndex, canvasLeft);
        const rightPrerender = prerenderToTemp(newNextIndex, canvasRight);
        if (leftPrerender) tempCanvases.push(leftPrerender);
        if (rightPrerender) tempCanvases.push(rightPrerender);

        // Disable transition temporarily for instant reset
        previewStrip.style.transition = 'none';
        previewStrip.style.transform = 'translateX(0)';

        // Suppress updateCanvas calls from switchPhoneModel during sync
        window.suppressSwitchModelUpdate = true;

        // Update state
        state.selectedIndex = newIndex;
        updateScreenshotList();
        syncUIWithState();
        updateGradientStopsUI();

        // Copy pre-rendered canvases to actual canvases BEFORE updateCanvas
        // This prevents flicker by having content ready before the swap
        tempCanvases.forEach(({ tempCanvas, targetCanvas }) => {
            targetCanvas.width = tempCanvas.width;
            targetCanvas.height = tempCanvas.height;
            targetCanvas.style.width = tempCanvas.style.width;
            targetCanvas.style.height = tempCanvas.style.height;
            const targetCtx = targetCanvas.getContext('2d');
            targetCtx.drawImage(tempCanvas, 0, 0);
        });

        // Skip side preview re-render since we already pre-rendered them
        skipSidePreviewRender = true;

        // Now do a full updateCanvas for main preview, far sides, etc.
        // Side previews won't flicker because we already drew to them
        updateCanvas();

        // Reset flags
        skipSidePreviewRender = false;
        window.suppressSwitchModelUpdate = false;

        // Re-enable transition after a frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                previewStrip.style.transition = '';
                previewStrip.classList.remove('sliding');
                isSliding = false;
            });
        });
    });
}

function renderScreenshotToCanvas(index, targetCanvas, targetCtx, dims, previewScale) {
    const screenshot = state.screenshots[index];
    if (!screenshot) return;

    // Get localized image for current language
    const img = getScreenshotImage(screenshot);
    if (!img) return;

    // Set canvas size (this also clears the canvas)
    targetCanvas.width = dims.width;
    targetCanvas.height = dims.height;
    targetCanvas.style.width = (dims.width * previewScale) + 'px';
    targetCanvas.style.height = (dims.height * previewScale) + 'px';

    // Clear canvas explicitly
    targetCtx.clearRect(0, 0, dims.width, dims.height);

    // Draw background for this screenshot
    const bg = screenshot.background;
    drawBackgroundToContext(targetCtx, dims, bg);

    // Draw noise if enabled
    if (bg.noise) {
        drawNoiseToContext(targetCtx, dims, bg.noiseIntensity);
    }

    // Draw screenshot - 3D if active for this screenshot, otherwise 2D
    const settings = screenshot.screenshot;
    const use3D = settings.use3D || false;

    if (use3D && typeof renderThreeJSForScreenshot === 'function' && phoneModelLoaded) {
        // Render 3D phone model for this specific screenshot
        renderThreeJSForScreenshot(targetCanvas, dims.width, dims.height, index);
    } else {
        // Draw 2D screenshot using localized image
        drawScreenshotToContext(targetCtx, dims, img, settings);
    }

    // Draw text
    const txt = screenshot.text;
    drawTextToContext(targetCtx, dims, txt);
}

function drawBackgroundToContext(context, dims, bg) {
    if (bg.type === 'gradient' && bg.gradient && bg.gradient.stops && bg.gradient.stops.length > 0) {
        const angle = (bg.gradient.angle || 135) * Math.PI / 180;
        const x1 = dims.width / 2 - Math.cos(angle) * dims.width;
        const y1 = dims.height / 2 - Math.sin(angle) * dims.height;
        const x2 = dims.width / 2 + Math.cos(angle) * dims.width;
        const y2 = dims.height / 2 + Math.sin(angle) * dims.height;

        const gradient = context.createLinearGradient(x1, y1, x2, y2);
        bg.gradient.stops.forEach(stop => {
            gradient.addColorStop(stop.position / 100, stop.color);
        });

        context.fillStyle = gradient;
        context.fillRect(0, 0, dims.width, dims.height);
    } else if (bg.type === 'gradient') {
        // Fallback: gradient type but no valid gradient data
        context.fillStyle = bg.solid || '#667eea';
        context.fillRect(0, 0, dims.width, dims.height);
    } else if (bg.type === 'solid') {
        context.fillStyle = bg.solid || '#1a1a2e';
        context.fillRect(0, 0, dims.width, dims.height);
    } else if (bg.type === 'image' && bg.image) {
        const img = bg.image;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        let dx = 0, dy = 0, dw = dims.width, dh = dims.height;

        if (bg.imageFit === 'cover') {
            const imgRatio = img.width / img.height;
            const canvasRatio = dims.width / dims.height;

            if (imgRatio > canvasRatio) {
                sw = img.height * canvasRatio;
                sx = (img.width - sw) / 2;
            } else {
                sh = img.width / canvasRatio;
                sy = (img.height - sh) / 2;
            }
        } else if (bg.imageFit === 'contain') {
            const imgRatio = img.width / img.height;
            const canvasRatio = dims.width / dims.height;

            if (imgRatio > canvasRatio) {
                dh = dims.width / imgRatio;
                dy = (dims.height - dh) / 2;
            } else {
                dw = dims.height * imgRatio;
                dx = (dims.width - dw) / 2;
            }

            context.fillStyle = '#000';
            context.fillRect(0, 0, dims.width, dims.height);
        }

        if (bg.imageBlur > 0) {
            context.filter = `blur(${bg.imageBlur}px)`;
        }

        context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        context.filter = 'none';

        if (bg.overlayOpacity > 0) {
            context.fillStyle = bg.overlayColor;
            context.globalAlpha = bg.overlayOpacity / 100;
            context.fillRect(0, 0, dims.width, dims.height);
            context.globalAlpha = 1;
        }
    }
}

function drawNoiseToContext(context, dims, intensity) {
    const imageData = context.getImageData(0, 0, dims.width, dims.height);
    const data = imageData.data;
    const noiseAmount = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 255 * noiseAmount;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }

    context.putImageData(imageData, 0, 0);
}

function drawScreenshotToContext(context, dims, img, settings) {
    if (!img) return;

    const scale = settings.scale / 100;
    let imgWidth = dims.width * scale;
    let imgHeight = (img.height / img.width) * imgWidth;

    if (imgHeight > dims.height * scale) {
        imgHeight = dims.height * scale;
        imgWidth = (img.width / img.height) * imgHeight;
    }

    const x = (dims.width - imgWidth) * (settings.x / 100);
    const y = (dims.height - imgHeight) * (settings.y / 100);
    const centerX = x + imgWidth / 2;
    const centerY = y + imgHeight / 2;

    context.save();

    // Apply transformations
    context.translate(centerX, centerY);

    // Apply rotation
    if (settings.rotation !== 0) {
        context.rotate(settings.rotation * Math.PI / 180);
    }

    // Apply perspective (simulated with scale transform)
    if (settings.perspective !== 0) {
        context.transform(1, settings.perspective * 0.01, 0, 1, 0, 0);
    }

    context.translate(-centerX, -centerY);

    // Scale corner radius with image size
    const radius = (settings.cornerRadius || 0) * (imgWidth / 400);

    // Draw shadow first (needs a filled shape, not clipped)
    if (settings.shadow && settings.shadow.enabled) {
        const shadowOpacity = settings.shadow.opacity / 100;
        const shadowColor = settings.shadow.color + Math.round(shadowOpacity * 255).toString(16).padStart(2, '0');
        context.shadowColor = shadowColor;
        context.shadowBlur = settings.shadow.blur;
        context.shadowOffsetX = settings.shadow.x;
        context.shadowOffsetY = settings.shadow.y;

        // Draw filled rounded rect for shadow
        context.fillStyle = '#000';
        context.beginPath();
        context.roundRect(x, y, imgWidth, imgHeight, radius);
        context.fill();

        // Reset shadow before drawing image
        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
    }

    // Clip and draw image
    context.beginPath();
    context.roundRect(x, y, imgWidth, imgHeight, radius);
    context.clip();
    context.drawImage(img, x, y, imgWidth, imgHeight);

    context.restore();

    // Draw device frame if enabled
    if (settings.frame && settings.frame.enabled) {
        context.save();
        context.translate(centerX, centerY);
        if (settings.rotation !== 0) {
            context.rotate(settings.rotation * Math.PI / 180);
        }
        if (settings.perspective !== 0) {
            context.transform(1, settings.perspective * 0.01, 0, 1, 0, 0);
        }
        context.translate(-centerX, -centerY);
        drawDeviceFrameToContext(context, x, y, imgWidth, imgHeight, settings);
        context.restore();
    }
}

function drawDeviceFrameToContext(context, x, y, width, height, settings) {
    const frameColor = settings.frame.color;
    const frameWidth = settings.frame.width * (width / 400);
    const frameOpacity = settings.frame.opacity / 100;
    const radius = (settings.cornerRadius || 0) * (width / 400) + frameWidth;

    context.globalAlpha = frameOpacity;
    context.strokeStyle = frameColor;
    context.lineWidth = frameWidth;
    context.beginPath();
    context.roundRect(x - frameWidth/2, y - frameWidth/2, width + frameWidth, height + frameWidth, radius);
    context.stroke();
    context.globalAlpha = 1;
}

function drawTextToContext(context, dims, txt) {
    // Check enabled states (default headline to true for backwards compatibility)
    const headlineEnabled = txt.headlineEnabled !== false;
    const subheadlineEnabled = txt.subheadlineEnabled || false;

    const headline = headlineEnabled && txt.headlines ? (txt.headlines[txt.currentHeadlineLang || 'en'] || '') : '';
    const subheadline = subheadlineEnabled && txt.subheadlines ? (txt.subheadlines[txt.currentSubheadlineLang || 'en'] || '') : '';

    if (!headline && !subheadline) return;

    const padding = dims.width * 0.08;
    const textY = txt.position === 'top'
        ? dims.height * (txt.offsetY / 100)
        : dims.height * (1 - txt.offsetY / 100);

    context.textAlign = 'center';
    context.textBaseline = txt.position === 'top' ? 'top' : 'bottom';

    let currentY = textY;

    // Draw headline
    if (headline) {
        const fontStyle = txt.headlineItalic ? 'italic' : 'normal';
        context.font = `${fontStyle} ${txt.headlineWeight} ${txt.headlineSize}px ${txt.headlineFont}`;
        context.fillStyle = txt.headlineColor;

        const lines = wrapText(context, headline, dims.width - padding * 2);
        const lineHeight = txt.headlineSize * (txt.lineHeight / 100);

        // For bottom positioning, offset currentY so lines draw correctly
        if (txt.position === 'bottom') {
            currentY -= (lines.length - 1) * lineHeight;
        }

        let lastLineY;
        lines.forEach((line, i) => {
            const y = currentY + i * lineHeight;
            lastLineY = y;
            context.fillText(line, dims.width / 2, y);

            // Calculate text metrics for decorations
            const textWidth = context.measureText(line).width;
            const fontSize = txt.headlineSize;
            const lineThickness = Math.max(2, fontSize * 0.05);
            const x = dims.width / 2 - textWidth / 2;

            // Draw underline
            if (txt.headlineUnderline) {
                const underlineY = txt.position === 'top'
                    ? y + fontSize * 0.9
                    : y + fontSize * 0.1;
                context.fillRect(x, underlineY, textWidth, lineThickness);
            }

            // Draw strikethrough
            if (txt.headlineStrikethrough) {
                const strikeY = txt.position === 'top'
                    ? y + fontSize * 0.4
                    : y - fontSize * 0.4;
                context.fillRect(x, strikeY, textWidth, lineThickness);
            }
        });

        // Track where subheadline should start (below the bottom edge of headline)
        // The gap between headline and subheadline should be (lineHeight - fontSize)
        // This is the "extra" spacing beyond the text itself
        const gap = lineHeight - txt.headlineSize;
        if (txt.position === 'top') {
            // For top: lastLineY is top of last line, add fontSize to get bottom, then add gap
            currentY = lastLineY + txt.headlineSize + gap;
        } else {
            // For bottom: lastLineY is already the bottom of last line, just add gap
            currentY = lastLineY + gap;
        }
    }

    // Draw subheadline (always below headline visually)
    if (subheadline) {
        const subFontStyle = txt.subheadlineItalic ? 'italic' : 'normal';
        const subWeight = txt.subheadlineWeight || '400';
        context.font = `${subFontStyle} ${subWeight} ${txt.subheadlineSize}px ${txt.subheadlineFont || txt.headlineFont}`;
        context.fillStyle = hexToRgba(txt.subheadlineColor, txt.subheadlineOpacity / 100);

        const lines = wrapText(context, subheadline, dims.width - padding * 2);
        const subLineHeight = txt.subheadlineSize * 1.4;

        // Subheadline starts after headline with gap determined by headline lineHeight
        // For bottom position, switch to 'top' baseline so subheadline draws downward
        const subY = currentY;
        if (txt.position === 'bottom') {
            context.textBaseline = 'top';
        }

        lines.forEach((line, i) => {
            const y = subY + i * subLineHeight;
            context.fillText(line, dims.width / 2, y);

            // Calculate text metrics for decorations
            const textWidth = context.measureText(line).width;
            const fontSize = txt.subheadlineSize;
            const lineThickness = Math.max(2, fontSize * 0.05);
            const x = dims.width / 2 - textWidth / 2;

            // Draw underline (using 'top' baseline for subheadline)
            if (txt.subheadlineUnderline) {
                const underlineY = y + fontSize * 0.9;
                context.fillRect(x, underlineY, textWidth, lineThickness);
            }

            // Draw strikethrough
            if (txt.subheadlineStrikethrough) {
                const strikeY = y + fontSize * 0.4;
                context.fillRect(x, strikeY, textWidth, lineThickness);
            }
        });

        // Restore baseline if we changed it
        if (txt.position === 'bottom') {
            context.textBaseline = 'bottom';
        }
    }
}

function drawBackground() {
    const dims = getCanvasDimensions();
    const bg = getBackground();

    if (bg.type === 'gradient' && bg.gradient && bg.gradient.stops && bg.gradient.stops.length > 0) {
        const angle = (bg.gradient.angle || 135) * Math.PI / 180;
        const x1 = dims.width / 2 - Math.cos(angle) * dims.width;
        const y1 = dims.height / 2 - Math.sin(angle) * dims.height;
        const x2 = dims.width / 2 + Math.cos(angle) * dims.width;
        const y2 = dims.height / 2 + Math.sin(angle) * dims.height;

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        bg.gradient.stops.forEach(stop => {
            gradient.addColorStop(stop.position / 100, stop.color);
        });

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, dims.width, dims.height);
    } else if (bg.type === 'gradient') {
        // Fallback: gradient type but no valid gradient data - use default
        ctx.fillStyle = bg.solid || '#667eea';
        ctx.fillRect(0, 0, dims.width, dims.height);
    } else if (bg.type === 'solid') {
        ctx.fillStyle = bg.solid || '#1a1a2e';
        ctx.fillRect(0, 0, dims.width, dims.height);
    } else if (bg.type === 'image' && bg.image) {
        const img = bg.image;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        let dx = 0, dy = 0, dw = dims.width, dh = dims.height;

        if (bg.imageFit === 'cover') {
            const imgRatio = img.width / img.height;
            const canvasRatio = dims.width / dims.height;

            if (imgRatio > canvasRatio) {
                sw = img.height * canvasRatio;
                sx = (img.width - sw) / 2;
            } else {
                sh = img.width / canvasRatio;
                sy = (img.height - sh) / 2;
            }
        } else if (bg.imageFit === 'contain') {
            const imgRatio = img.width / img.height;
            const canvasRatio = dims.width / dims.height;

            if (imgRatio > canvasRatio) {
                dh = dims.width / imgRatio;
                dy = (dims.height - dh) / 2;
            } else {
                dw = dims.height * imgRatio;
                dx = (dims.width - dw) / 2;
            }

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, dims.width, dims.height);
        }

        if (bg.imageBlur > 0) {
            ctx.filter = `blur(${bg.imageBlur}px)`;
        }

        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.filter = 'none';

        // Overlay
        if (bg.overlayOpacity > 0) {
            ctx.fillStyle = bg.overlayColor;
            ctx.globalAlpha = bg.overlayOpacity / 100;
            ctx.fillRect(0, 0, dims.width, dims.height);
            ctx.globalAlpha = 1;
        }
    }
}

function drawScreenshot() {
    const dims = getCanvasDimensions();
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;

    // Use localized image based on current language
    const img = getScreenshotImage(screenshot);
    if (!img) return;

    const settings = getScreenshotSettings();
    const scale = settings.scale / 100;

    // Calculate scaled dimensions
    let imgWidth = dims.width * scale;
    let imgHeight = (img.height / img.width) * imgWidth;

    // If image is taller than canvas after scaling, adjust
    if (imgHeight > dims.height * scale) {
        imgHeight = dims.height * scale;
        imgWidth = (img.width / img.height) * imgHeight;
    }

    const x = (dims.width - imgWidth) * (settings.x / 100);
    const y = (dims.height - imgHeight) * (settings.y / 100);

    // Center point for transformations
    const centerX = x + imgWidth / 2;
    const centerY = y + imgHeight / 2;

    ctx.save();

    // Apply transformations
    ctx.translate(centerX, centerY);

    // Apply rotation
    if (settings.rotation !== 0) {
        ctx.rotate(settings.rotation * Math.PI / 180);
    }

    // Apply perspective (simulated with scale transform)
    if (settings.perspective !== 0) {
        const perspectiveScale = 1 - Math.abs(settings.perspective) * 0.005;
        ctx.transform(1, settings.perspective * 0.01, 0, 1, 0, 0);
    }

    ctx.translate(-centerX, -centerY);

    // Draw rounded rectangle with screenshot
    const radius = settings.cornerRadius * (imgWidth / 400); // Scale radius with image

    // Draw glassmorphism card effect if enabled
    if (screenshot.glass && screenshot.glass.enabled) {
        const glassSettings = screenshot.glass;
        const padding = imgWidth * 0.08; // 8% padding around the screenshot
        const glassX = x - padding;
        const glassY = y - padding;
        const glassWidth = imgWidth + padding * 2;
        const glassHeight = imgHeight + padding * 2;
        const glassRadius = radius + padding * 0.5;

        // Draw frosted glass background
        ctx.save();
        ctx.beginPath();
        roundRect(ctx, glassX, glassY, glassWidth, glassHeight, glassRadius);
        ctx.fillStyle = glassSettings.background || 'rgba(255,255,255,0.1)';
        ctx.fill();

        // Draw glass border
        ctx.strokeStyle = glassSettings.border || 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }

    // Draw shadow first (needs a filled shape, not clipped)
    if (settings.shadow.enabled) {
        const shadowColor = hexToRgba(settings.shadow.color, settings.shadow.opacity / 100);
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = settings.shadow.blur;
        ctx.shadowOffsetX = settings.shadow.x;
        ctx.shadowOffsetY = settings.shadow.y;

        // Draw filled rounded rect for shadow
        ctx.fillStyle = '#000';
        ctx.beginPath();
        roundRect(ctx, x, y, imgWidth, imgHeight, radius);
        ctx.fill();

        // Reset shadow before drawing image
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    // Clip and draw image
    ctx.beginPath();
    roundRect(ctx, x, y, imgWidth, imgHeight, radius);
    ctx.clip();
    ctx.drawImage(img, x, y, imgWidth, imgHeight);

    ctx.restore();

    // Draw device frame if enabled (needs separate transform context)
    if (settings.frame.enabled) {
        ctx.save();
        ctx.translate(centerX, centerY);
        if (settings.rotation !== 0) {
            ctx.rotate(settings.rotation * Math.PI / 180);
        }
        if (settings.perspective !== 0) {
            ctx.transform(1, settings.perspective * 0.01, 0, 1, 0, 0);
        }
        ctx.translate(-centerX, -centerY);
        drawDeviceFrame(x, y, imgWidth, imgHeight);
        ctx.restore();
    }
}

function drawDeviceFrame(x, y, width, height) {
    const settings = getScreenshotSettings();
    const frameColor = settings.frame.color;
    const frameWidth = settings.frame.width * (width / 400); // Scale with image
    const frameOpacity = settings.frame.opacity / 100;
    const radius = settings.cornerRadius * (width / 400) + frameWidth;

    ctx.globalAlpha = frameOpacity;
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = frameWidth;
    ctx.beginPath();
    roundRect(ctx, x - frameWidth/2, y - frameWidth/2, width + frameWidth, height + frameWidth, radius);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawText() {
    const dims = getCanvasDimensions();
    const text = getTextSettings();

    // Check enabled states (default headline to true for backwards compatibility)
    const headlineEnabled = text.headlineEnabled !== false;
    const subheadlineEnabled = text.subheadlineEnabled || false;

    // Get current language text (only if enabled)
    const headline = headlineEnabled && text.headlines ? (text.headlines[text.currentHeadlineLang || 'en'] || '') : '';
    const subheadline = subheadlineEnabled && text.subheadlines ? (text.subheadlines[text.currentSubheadlineLang || 'en'] || '') : '';

    if (!headline && !subheadline) return;

    // RULE 11: Margins - 6% from left edge
    const leftPadding = dims.width * 0.08;
    const rightPadding = dims.width * 0.08;
    const textY = text.position === 'top'
        ? dims.height * (text.offsetY / 100)
        : dims.height * (1 - text.offsetY / 100);

    // RULE 2: Check if stacked text mode is enabled
    const useStackedText = text.stackedText !== false;

    // Set text alignment based on stacked mode
    ctx.textAlign = useStackedText ? 'left' : 'center';
    ctx.textBaseline = text.position === 'top' ? 'top' : 'bottom';

    let currentY = textY;

    // Draw headline
    if (headline) {
        const fontStyle = text.headlineItalic ? 'italic' : 'normal';
        ctx.font = `${fontStyle} ${text.headlineWeight} ${text.headlineSize}px ${text.headlineFont}`;
        ctx.fillStyle = text.headlineColor;

        // Apply text shadow if enabled
        if (text.headline?.shadow?.enabled) {
            ctx.shadowColor = text.headline.shadow.color || 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = text.headline.shadow.blur || 10;
            ctx.shadowOffsetX = text.headline.shadow.offsetX || 2;
            ctx.shadowOffsetY = text.headline.shadow.offsetY || 2;
        }

        // RULE 2: Stacked text - each word on its own line
        let lines;
        if (useStackedText) {
            // Split headline into individual words, each on its own line
            lines = headline.split(/\s+/).filter(word => word.length > 0);
        } else {
            lines = wrapText(ctx, headline, dims.width - leftPadding - rightPadding);
        }

        // RULE 2: Tight line height (0.90-0.98)
        const lineHeight = text.headlineSize * (text.lineHeight / 100);

        if (text.position === 'bottom') {
            currentY -= (lines.length - 1) * lineHeight;
        }

        // Calculate X position based on alignment
        const textX = useStackedText ? leftPadding : dims.width / 2;

        let lastLineY;
        lines.forEach((line, i) => {
            const y = currentY + i * lineHeight;
            lastLineY = y;
            ctx.fillText(line, textX, y);

            // Calculate text metrics for decorations
            // When textBaseline is 'top', y is at top of text; when 'bottom', y is at bottom
            const textWidth = ctx.measureText(line).width;
            const fontSize = text.headlineSize;
            const lineThickness = Math.max(2, fontSize * 0.05);
            const decorX = useStackedText ? textX : (dims.width / 2 - textWidth / 2);

            // Draw underline
            if (text.headlineUnderline) {
                const underlineY = text.position === 'top'
                    ? y + fontSize * 0.9  // Below text when baseline is top
                    : y + fontSize * 0.1; // Below text when baseline is bottom
                ctx.fillRect(decorX, underlineY, textWidth, lineThickness);
            }

            // Draw strikethrough
            if (text.headlineStrikethrough) {
                const strikeY = text.position === 'top'
                    ? y + fontSize * 0.4  // Middle of text when baseline is top
                    : y - fontSize * 0.4; // Middle of text when baseline is bottom
                ctx.fillRect(decorX, strikeY, textWidth, lineThickness);
            }
        });

        // Track where subheadline should start (below the bottom edge of headline)
        // RULE 3: margin top 12-20px below headline
        const gap = Math.max(16, lineHeight - text.headlineSize);
        if (text.position === 'top') {
            // For top: lastLineY is top of last line, add fontSize to get bottom, then add gap
            currentY = lastLineY + text.headlineSize + gap;
        } else {
            // For bottom: lastLineY is already the bottom of last line, just add gap
            currentY = lastLineY + gap;
        }

        // Reset shadow after headline
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    // Draw subheadline (always below headline visually)
    if (subheadline) {
        const subFontStyle = text.subheadlineItalic ? 'italic' : 'normal';
        const subWeight = text.subheadlineWeight || '400';
        ctx.font = `${subFontStyle} ${subWeight} ${text.subheadlineSize}px ${text.subheadlineFont || text.headlineFont}`;
        ctx.fillStyle = hexToRgba(text.subheadlineColor, text.subheadlineOpacity / 100);

        // Subheadline uses same alignment as headline
        const subLines = wrapText(ctx, subheadline, dims.width - leftPadding - rightPadding);
        const subLineHeight = text.subheadlineSize * 1.4;

        // Subheadline starts after headline with gap
        const subY = currentY;
        if (text.position === 'bottom') {
            ctx.textBaseline = 'top';
        }

        // Calculate X position based on alignment (same as headline)
        const subTextX = useStackedText ? leftPadding : dims.width / 2;

        subLines.forEach((line, i) => {
            const y = subY + i * subLineHeight;
            ctx.fillText(line, subTextX, y);

            // Calculate text metrics for decorations
            const textWidth = ctx.measureText(line).width;
            const fontSize = text.subheadlineSize;
            const lineThickness = Math.max(2, fontSize * 0.05);
            const subDecorX = useStackedText ? subTextX : (dims.width / 2 - textWidth / 2);

            // Draw underline (using 'top' baseline for subheadline)
            if (text.subheadlineUnderline) {
                const underlineY = y + fontSize * 0.9;
                ctx.fillRect(subDecorX, underlineY, textWidth, lineThickness);
            }

            // Draw strikethrough
            if (text.subheadlineStrikethrough) {
                const strikeY = y + fontSize * 0.4;
                ctx.fillRect(subDecorX, strikeY, textWidth, lineThickness);
            }
        });

        // Restore baseline if we changed it
        if (text.position === 'bottom') {
            ctx.textBaseline = 'bottom';
        }
    }
}

function drawNoise() {
    const dims = getCanvasDimensions();
    const imageData = ctx.getImageData(0, 0, dims.width, dims.height);
    const data = imageData.data;
    const intensity = getBackground().noiseIntensity / 100 * 50;

    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// RULE 15: VALIDATION CHECKS BEFORE EXPORT
// Comprehensive quality assurance before exporting screenshots
// ============================================================================

function validateScreenshot(screenshotIndex) {
    const errors = [];
    const warnings = [];
    const screenshot = state.screenshots[screenshotIndex];

    if (!screenshot) {
        errors.push('Screenshot not found');
        return { valid: false, errors, warnings };
    }

    const dims = getCanvasDimensions();
    const settings = screenshot.screenshot || getScreenshotSettings();
    const text = getTextSettings();

    // RULE 1: Device positioning check (Y should be 70-80%)
    if (settings.y < 65 || settings.y > 85) {
        warnings.push(`Device Y position (${settings.y.toFixed(0)}%) is outside optimal range (70-80%)`);
    }

    // RULE 4: Text-device separation check
    const separation = validateTextDeviceSeparation(false);
    if (!separation.valid && separation.gap !== null) {
        errors.push(`Text-device gap is only ${Math.round(separation.gap)}px (minimum 50px required)`);
    }

    // RULE 2: Headline length check (2-4 words)
    const headline = text.headlines[state.selectedLanguage] || text.headlines['en'] || '';
    if (headline) {
        const wordCount = headline.split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount > 4) {
            warnings.push(`Headline has ${wordCount} words (recommended: 2-4 words)`);
        }
        if (wordCount === 1) {
            warnings.push('Single-word headlines may lack impact');
        }
    }

    // RULE 5: Color contrast check (simplified)
    const bg = screenshot.background || state.background;
    if (bg && bg.type === 'solid' && bg.color) {
        const bgLuminance = getRelativeLuminance(bg.color);
        const textColor = text.headlineColor || '#FFFFFF';
        const textLuminance = getRelativeLuminance(textColor);
        const contrastRatio = (Math.max(bgLuminance, textLuminance) + 0.05) /
                             (Math.min(bgLuminance, textLuminance) + 0.05);

        if (contrastRatio < 4.5) {
            warnings.push(`Text contrast ratio (${contrastRatio.toFixed(1)}:1) may be too low for readability`);
        }
    }

    // RULE 8: Device scale check (58-65% optimal)
    if (settings.scale < 50 || settings.scale > 75) {
        warnings.push(`Device scale (${settings.scale}%) is outside optimal range (58-65%)`);
    }

    // RULE 11: Margin/safe zone check
    if (settings.x < 5 || settings.x > 95) {
        warnings.push('Device may be too close to horizontal edge');
    }

    // Check for missing image
    const img = getScreenshotImage(screenshot);
    if (!img) {
        errors.push('Screenshot image is missing or failed to load');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        index: screenshotIndex
    };
}

function getRelativeLuminance(hex) {
    // Convert hex to RGB and calculate relative luminance
    if (!hex || hex.length < 7) return 0.5;

    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const sRGB = [r, g, b].map(c =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function validateAllScreenshots() {
    const results = [];
    let allValid = true;

    for (let i = 0; i < state.screenshots.length; i++) {
        // Temporarily switch to this screenshot for validation
        const originalIndex = state.selectedIndex;
        state.selectedIndex = i;

        const result = validateScreenshot(i);
        results.push(result);

        if (!result.valid) allValid = false;

        // Restore original index
        state.selectedIndex = originalIndex;
    }

    return { allValid, results };
}

// RULE 10: Set consistency validation
function validateSetConsistency() {
    const issues = [];

    if (state.screenshots.length < 2) {
        return { consistent: true, issues };
    }

    // Check font consistency
    const fonts = new Set();
    const fontSizes = new Set();

    state.screenshots.forEach((s, i) => {
        const text = s.text || state.text;
        fonts.add(text.headlineFont);
        fontSizes.add(text.headlineSize);
    });

    if (fonts.size > 2) {
        issues.push(`Multiple headline fonts used across screenshots (${fonts.size} different fonts)`);
    }

    if (fontSizes.size > 2) {
        issues.push('Inconsistent headline sizes across screenshots');
    }

    // Check device scale consistency
    const scales = state.screenshots.map(s => s.screenshot?.scale || 62);
    const scaleVariance = Math.max(...scales) - Math.min(...scales);
    if (scaleVariance > 10) {
        issues.push(`Device scales vary by ${scaleVariance}% across screenshots`);
    }

    return {
        consistent: issues.length === 0,
        issues
    };
}

function showValidationResults(validation) {
    const { allValid, results } = validation;
    const consistency = validateSetConsistency();

    let message = '';

    if (allValid && consistency.consistent) {
        console.log('[Validation] All screenshots passed validation checks');
        return true;
    }

    // Build error message
    results.forEach((result, i) => {
        if (result.errors.length > 0 || result.warnings.length > 0) {
            message += `\nScreenshot ${i + 1}:\n`;
            result.errors.forEach(e => message += `  ❌ ${e}\n`);
            result.warnings.forEach(w => message += `  ⚠️ ${w}\n`);
        }
    });

    if (!consistency.consistent) {
        message += '\nConsistency Issues:\n';
        consistency.issues.forEach(i => message += `  ⚠️ ${i}\n`);
    }

    console.warn('[Validation]' + message);

    // For critical errors, ask user to confirm
    const hasErrors = results.some(r => r.errors.length > 0);
    if (hasErrors) {
        return confirm('Some screenshots have issues:\n' + message + '\n\nExport anyway?');
    }

    return true;
}

function exportCurrent() {
    if (state.screenshots.length === 0) {
        alert('Please upload a screenshot first');
        return;
    }

    // RULE 15: Validate before export
    const validation = validateScreenshot(state.selectedIndex);
    if (!validation.valid) {
        const proceed = showValidationResults({ allValid: false, results: [validation] });
        if (!proceed) return;
    }

    // Ensure canvas is up-to-date (especially important for 3D mode)
    updateCanvas();

    const link = document.createElement('a');
    link.download = `screenshot-${state.selectedIndex + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Export state flag to prevent race conditions
let isExporting = false;

async function exportAll() {
    if (isExporting) {
        alert('Export already in progress. Please wait.');
        return;
    }
    if (state.screenshots.length === 0) {
        alert('Please upload screenshots first');
        return;
    }

    // RULE 15: Validate all screenshots before export
    const validation = validateAllScreenshots();
    if (!validation.allValid) {
        const proceed = showValidationResults(validation);
        if (!proceed) return;
    }

    // Check if project has multiple languages configured
    const hasMultipleLanguages = state.projectLanguages.length > 1;

    if (hasMultipleLanguages) {
        // Show language choice dialog
        showExportLanguageDialog(async (choice) => {
            if (choice === 'current') {
                await exportAllForLanguage(state.currentLanguage);
            } else if (choice === 'all') {
                await exportAllLanguages();
            }
        });
    } else {
        // Only one language, export directly
        await exportAllForLanguage(state.currentLanguage);
    }
}

// Show export progress modal
function showExportProgress(status, detail, percent) {
    const modal = document.getElementById('export-progress-modal');
    const statusEl = document.getElementById('export-progress-status');
    const detailEl = document.getElementById('export-progress-detail');
    const fillEl = document.getElementById('export-progress-fill');

    if (modal) modal.classList.add('visible');
    if (statusEl) statusEl.textContent = status;
    if (detailEl) detailEl.textContent = detail || '';
    if (fillEl) fillEl.style.width = `${percent}%`;
}

// Hide export progress modal
function hideExportProgress() {
    const modal = document.getElementById('export-progress-modal');
    if (modal) modal.classList.remove('visible');
}

// Export all screenshots for a specific language
async function exportAllForLanguage(lang) {
    if (isExporting) {
        alert('Export already in progress. Please wait.');
        return;
    }
    isExporting = true;

    const originalIndex = state.selectedIndex;
    const originalLang = state.currentLanguage;
    const zip = new JSZip();
    const total = state.screenshots.length;

    // Show progress
    const langName = languageNames[lang] || lang.toUpperCase();
    showExportProgress('Exporting...', `Preparing ${langName} screenshots`, 0);

    // Save original text languages for each screenshot
    const originalTextLangs = state.screenshots.map(s => ({
        headline: s.text.currentHeadlineLang,
        subheadline: s.text.currentSubheadlineLang
    }));

    // Temporarily switch to the target language (images and text)
    state.currentLanguage = lang;
    state.screenshots.forEach(s => {
        s.text.currentHeadlineLang = lang;
        s.text.currentSubheadlineLang = lang;
    });

    for (let i = 0; i < state.screenshots.length; i++) {
        state.selectedIndex = i;
        updateCanvas();

        // Update progress
        const percent = Math.round(((i + 1) / total) * 90); // Reserve 10% for ZIP generation
        showExportProgress('Exporting...', `Screenshot ${i + 1} of ${total}`, percent);

        await new Promise(resolve => setTimeout(resolve, 100));

        // Get canvas data as base64, strip the data URL prefix
        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

        zip.file(`screenshot-${i + 1}.png`, base64Data, { base64: true });
    }

    // Restore original settings
    state.selectedIndex = originalIndex;
    state.currentLanguage = originalLang;
    state.screenshots.forEach((s, i) => {
        s.text.currentHeadlineLang = originalTextLangs[i].headline;
        s.text.currentSubheadlineLang = originalTextLangs[i].subheadline;
    });
    updateCanvas();

    // Generate ZIP
    showExportProgress('Generating ZIP...', '', 95);
    const content = await zip.generateAsync({ type: 'blob' });

    showExportProgress('Complete!', '', 100);
    await new Promise(resolve => setTimeout(resolve, 1500));
    hideExportProgress();

    const link = document.createElement('a');
    link.download = `screenshots-${lang}.zip`;
    link.href = URL.createObjectURL(content);
    link.click();
    URL.revokeObjectURL(link.href);
    isExporting = false;
}

// Export all screenshots for all languages (separate folders)
async function exportAllLanguages() {
    if (isExporting) {
        alert('Export already in progress. Please wait.');
        return;
    }
    isExporting = true;

    const originalIndex = state.selectedIndex;
    const originalLang = state.currentLanguage;
    const zip = new JSZip();

    const totalLangs = state.projectLanguages.length;
    const totalScreenshots = state.screenshots.length;
    const totalItems = totalLangs * totalScreenshots;
    let completedItems = 0;

    // Show progress
    showExportProgress('Exporting...', 'Preparing all languages', 0);

    // Save original text languages for each screenshot
    const originalTextLangs = state.screenshots.map(s => ({
        headline: s.text.currentHeadlineLang,
        subheadline: s.text.currentSubheadlineLang
    }));

    for (let langIdx = 0; langIdx < state.projectLanguages.length; langIdx++) {
        const lang = state.projectLanguages[langIdx];
        const langName = languageNames[lang] || lang.toUpperCase();

        // Temporarily switch to this language (images and text)
        state.currentLanguage = lang;
        state.screenshots.forEach(s => {
            s.text.currentHeadlineLang = lang;
            s.text.currentSubheadlineLang = lang;
        });

        for (let i = 0; i < state.screenshots.length; i++) {
            state.selectedIndex = i;
            updateCanvas();

            completedItems++;
            const percent = Math.round((completedItems / totalItems) * 90); // Reserve 10% for ZIP
            showExportProgress('Exporting...', `${langName}: Screenshot ${i + 1} of ${totalScreenshots}`, percent);

            await new Promise(resolve => setTimeout(resolve, 100));

            // Get canvas data as base64, strip the data URL prefix
            const dataUrl = canvas.toDataURL('image/png');
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

            // Use language code as folder name
            zip.file(`${lang}/screenshot-${i + 1}.png`, base64Data, { base64: true });
        }
    }

    // Restore original settings
    state.selectedIndex = originalIndex;
    state.currentLanguage = originalLang;
    state.screenshots.forEach((s, i) => {
        s.text.currentHeadlineLang = originalTextLangs[i].headline;
        s.text.currentSubheadlineLang = originalTextLangs[i].subheadline;
    });
    updateCanvas();

    // Generate ZIP
    showExportProgress('Generating ZIP...', '', 95);
    const content = await zip.generateAsync({ type: 'blob' });

    showExportProgress('Complete!', '', 100);
    await new Promise(resolve => setTimeout(resolve, 1500));
    hideExportProgress();

    const link = document.createElement('a');
    link.download = 'screenshots-all-languages.zip';
    link.href = URL.createObjectURL(content);
    link.click();
    URL.revokeObjectURL(link.href);
    isExporting = false;
}

// ======================================
// NEW COMBINED FEATURES INTEGRATION
// ======================================

// Magic Design Button Handler - Show Input Modal First
const _magicDesignBtn = document.getElementById('magic-design-btn');
console.log('[Magic Design] Registering button handler, element:', _magicDesignBtn);

if (_magicDesignBtn) {
    _magicDesignBtn.addEventListener('click', async () => {
        console.log('[Magic Design] Button clicked! Screenshots:', state.screenshots.length);

        if (state.screenshots.length === 0) {
            alert('Please upload at least one screenshot first.');
            return;
        }

        // Check for API key
        const provider = localStorage.getItem('aiProvider') || 'google';
        const apiKey = localStorage.getItem(
            provider === 'anthropic' ? 'claudeApiKey' :
                provider === 'openai' ? 'openaiApiKey' :
                    'googleApiKey'
        );

        console.log('[Magic Design] API Key exists:', !!apiKey);

        // If no API key, use local Magic Design (applies design rules without AI)
        if (!apiKey) {
            console.log('[Magic Design] No API key, using local design rules');
            magicDesignAll();
            return;
        }

    // Show input modal
    const inputModal = document.getElementById('magic-design-input-modal');
    const appNameInput = document.getElementById('magic-app-name');
    const appDescInput = document.getElementById('magic-app-description');

    // Pre-fill with project name if available
    appNameInput.value = state.projectName || '';
    appDescInput.value = state.appDescription || '';

    // Populate language dropdown
    const languageSelect = document.getElementById('magic-language');
    if (languageSelect) {
        languageSelect.innerHTML = '';
        const languages = state.languages || ['en'];
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = window.getLanguageName ? window.getLanguageName(lang) : lang;
            if (lang === state.currentLanguage) option.selected = true;
            languageSelect.appendChild(option);
        });
    }

    inputModal.classList.add('active');
    appNameInput.focus();
    });
} else {
    console.warn('[Magic Design] Button element not found!');
}

// Cancel button on input modal
document.getElementById('magic-input-cancel')?.addEventListener('click', () => {
    document.getElementById('magic-design-input-modal').classList.remove('active');
});

// Start button on input modal - runs the AI pipeline
document.getElementById('magic-input-start')?.addEventListener('click', async () => {
    const inputModal = document.getElementById('magic-design-input-modal');
    const appName = document.getElementById('magic-app-name')?.value.trim() || '';
    const appDescription = document.getElementById('magic-app-description')?.value.trim() || '';

    // Get the new AI options
    const category = document.getElementById('magic-category')?.value || 'auto';
    const theme = document.getElementById('magic-theme')?.value || 'auto';
    const headlineStyle = document.getElementById('magic-headline-style')?.value || 'short_punchy';
    const bgType = document.querySelector('input[name="magic-bg-type"]:checked')?.value || 'gradient';

    // Hide input modal
    inputModal.classList.remove('active');

    // Use the new AI Engine if available
    if (window.AIEngine) {
        console.log('[MagicDesign] Using new AI Engine with options:', { category, theme, headlineStyle, bgType });

        // Store app info
        if (appName) state.projectName = appName;
        if (appDescription) state.appDescription = appDescription;

        // Call the new AI Engine
        await window.AIEngine.magicDesign({
            category: category,
            theme: theme,
            headlineStyle: headlineStyle,
            generateBackgroundImages: bgType === 'image'
        });

        return;
    }

    // Fallback to old AI Agents system
    console.log('[MagicDesign] Falling back to old AI Agents system');

    if (!appName) {
        alert('Please enter your app name.');
        inputModal.classList.add('active');
        document.getElementById('magic-app-name').focus();
        return;
    }

    if (!appDescription) {
        alert('Please enter a description of your app.');
        inputModal.classList.add('active');
        document.getElementById('magic-app-description').focus();
        return;
    }

    const modal = document.getElementById('magic-design-modal');
    const statusEl = document.getElementById('magic-design-status');
    const progressBar = document.getElementById('magic-progress-bar');
    const stages = document.querySelectorAll('.magic-stage');

    modal.classList.add('active');
    progressBar.style.width = '0%';
    stages.forEach(s => s.classList.remove('active', 'completed'));

    let cancelled = false;
    const cancelHandler = () => {
        cancelled = true;
        modal.classList.remove('active');
    };
    document.getElementById('magic-design-cancel')?.addEventListener('click', cancelHandler, { once: true });

    try {
        // Run Magic Design pipeline with user input
        const result = await window.AIAgents?.runMagicDesign(
            appName,
            appDescription,
            state.screenshots,
            (message) => {
                if (!cancelled) statusEl.textContent = message;
            },
            (stage, index, total) => {
                if (cancelled) return;
                const percent = ((index + 1) / total) * 100;
                progressBar.style.width = `${percent}%`;

                // Update stage indicators
                stages.forEach((s, i) => {
                    if (i < index) {
                        s.classList.remove('active');
                        s.classList.add('completed');
                    } else if (i === index) {
                        s.classList.add('active');
                        s.classList.remove('completed');
                    } else {
                        s.classList.remove('active', 'completed');
                    }
                });
            }
        );

        if (!cancelled && result) {
            // Apply the design plan
            window.AIAgents?.applyDesignPlan(result, state);

            // Store the app info
            state.projectName = appName;
            state.appDescription = appDescription;

            updateCanvas();
            syncUIWithState();

            // Save undo state
            window.UndoRedo?.saveState(state, 'Magic Design applied');

            statusEl.textContent = 'Design applied successfully!';
            stages.forEach(s => {
                s.classList.remove('active');
                s.classList.add('completed');
            });
            progressBar.style.width = '100%';

            await new Promise(r => setTimeout(r, 1500));
        }
    } catch (error) {
        console.error('Magic Design error:', error);
        statusEl.textContent = `Error: ${error.message}`;
        await new Promise(r => setTimeout(r, 3000));
    }

    modal.classList.remove('active');
});

// Undo/Redo Button Handlers
document.getElementById('undo-btn')?.addEventListener('click', () => {
    const previousState = window.UndoRedo?.undo();
    if (previousState) {
        // Apply the state
        Object.assign(state, previousState);
        updateCanvas();
        syncUIWithState();
    }
});

document.getElementById('redo-btn')?.addEventListener('click', () => {
    const nextState = window.UndoRedo?.redo();
    if (nextState) {
        Object.assign(state, nextState);
        updateCanvas();
        syncUIWithState();
    }
});

// Initialize Undo/Redo keyboard shortcuts
window.UndoRedo?.setupKeyboardShortcuts((newState) => {
    Object.assign(state, newState);
    updateCanvas();
    syncUIWithState();
});

// Initialize onboarding for first-time users
setTimeout(() => {
    window.Onboarding?.initialize(true);
}, 2000);

// ============================================
// Layout Picker Functionality
// ============================================

const LAYOUT_CATEGORIES = {
    hero: ['hero_large', 'classic', 'offset_right', 'offset_left', 'floating_hero', 'poster_hero'],
    panoramic: ['panoramic_right', 'panoramic_left', 'panoramic_center_right'],
    dual: ['duo_overlap', 'duo_side_by_side', 'double_phones'],
    zoom: ['zoom_top', 'zoom_bottom', 'tilted_dynamic', 'isometric_stack'],
    minimal: ['minimal_type', 'minimal_float', 'magazine_cover', 'bento_grid', 'off_axis_left', 'card_focus']
};

function generateLayoutSVG(layout) {
    const device = layout.device;
    const scale = device.scale || 0.7;
    const x = 20 + (device.x || 0) * 0.3;
    const y = 25 + (device.y || 10) * 0.3;
    const rotation = device.rotation || 0;
    const width = 16 * scale;
    const height = 28 * scale;

    let svg = `<svg viewBox="0 0 40 60" fill="none" stroke="currentColor" stroke-width="1.5">`;
    svg += `<rect x="${x - width/2}" y="${y - height/2}" width="${width}" height="${height}" rx="2" transform="rotate(${rotation} ${x} ${y})"/>`;

    if (layout.showSecondaryDevice && layout.secondaryDevice) {
        const sd = layout.secondaryDevice;
        const sx = 20 + (sd.x || 0) * 0.3;
        const sy = 25 + (sd.y || 10) * 0.3;
        const swidth = 16 * (sd.scale || 0.6);
        const sheight = 28 * (sd.scale || 0.6);
        svg += `<rect x="${sx - swidth/2}" y="${sy - sheight/2}" width="${swidth}" height="${sheight}" rx="2" transform="rotate(${sd.rotation || 0} ${sx} ${sy})" opacity="0.6"/>`;
    }

    svg += `</svg>`;
    return svg;
}

function populateLayoutGrid(category = 'hero') {
    const grid = document.getElementById('layout-grid');
    if (!grid || !window.LayoutEngine) return;

    const layoutIds = LAYOUT_CATEGORIES[category] || LAYOUT_CATEGORIES.hero;
    grid.innerHTML = '';

    layoutIds.forEach(layoutId => {
        const layout = window.LayoutEngine.getLayoutConfig(layoutId);
        if (!layout) return;

        const item = document.createElement('div');
        item.className = 'layout-item';
        item.dataset.layout = layoutId;
        item.innerHTML = `
            ${generateLayoutSVG(layout)}
            <span class="layout-item-name">${layout.name}</span>
        `;
        item.addEventListener('click', () => applyLayoutToScreenshot(layoutId));
        grid.appendChild(item);
    });
}

function applyLayoutToScreenshot(layoutId) {
    const layout = window.LayoutEngine?.getLayoutConfig(layoutId);
    if (!layout) return;

    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;

    // Apply device settings
    screenshot.scale = layout.device.scale * 100;
    screenshot.x = 50 + layout.device.x;
    screenshot.y = 50 + layout.device.y;
    screenshot.rotation = layout.device.rotation;
    screenshot.layout = layoutId;

    // Apply text settings if defined in layout
    const textSettings = getTextSettings();
    if (layout.text) {
        if (layout.text.offsetY !== undefined) {
            textSettings.offsetY = layout.text.offsetY;
        }
        if (layout.text.position) {
            textSettings.position = layout.text.position;
        }
    }

    updateCanvas();
    syncUIWithState();

    // Mark as selected
    document.querySelectorAll('.layout-item').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.layout-item[data-layout="${layoutId}"]`)?.classList.add('selected');
}

// Layout picker dropdown
document.getElementById('layout-preset-trigger')?.addEventListener('click', () => {
    document.getElementById('layout-preset-dropdown')?.classList.toggle('open');
    if (document.getElementById('layout-preset-dropdown')?.classList.contains('open')) {
        populateLayoutGrid('hero');
    }
});

// Layout category tabs
document.querySelectorAll('.layout-cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.layout-cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        populateLayoutGrid(tab.dataset.category);
    });
});

// ============================================
// Theme Selector Functionality
// ============================================

document.getElementById('theme-selector')?.addEventListener('change', (e) => {
    const themeId = e.target.value;
    if (!themeId || !window.DesignThemes) return;

    const theme = window.DesignThemes.getTheme(themeId);
    if (!theme) return;

    // Apply theme to current screenshot
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;

    // Apply background
    if (theme.background) {
        screenshot.background = {
            type: 'gradient',
            gradient: theme.background.gradient || `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
            stops: theme.background.stops || [
                { color: theme.colors.primary, position: 0 },
                { color: theme.colors.secondary, position: 100 }
            ],
            angle: theme.background.angle || 135
        };
    }

    // Apply text colors
    const textSettings = getTextSettings();
    if (theme.text) {
        textSettings.headline.color = theme.text.color || theme.colors.text || '#ffffff';
        textSettings.headline.font = theme.text.fontFamily || textSettings.headline.font;
    }

    updateCanvas();
    syncUIWithState();
});

// ============================================
// Background Preset Gallery Functionality
// ============================================

function populateBgPresetGrid(category = 'all') {
    const grid = document.getElementById('bg-preset-grid');
    if (!grid || !window.BackgroundPresets) return;

    const presets = category === 'all'
        ? window.BackgroundPresets.getAllPresets()
        : window.BackgroundPresets.getPresetsForCategory(category);

    grid.innerHTML = '';

    (presets || []).slice(0, 20).forEach(preset => {
        const item = document.createElement('div');
        item.className = 'bg-preset-item';
        item.dataset.preset = preset.id;
        item.dataset.name = preset.name;

        // Generate gradient background
        const colors = preset.colors;
        const gradient = preset.themeMode === 'dark'
            ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary || colors.primary} 100%)`
            : `linear-gradient(135deg, ${colors.background || colors.primary} 0%, ${colors.primary} 100%)`;

        item.style.background = gradient;

        item.addEventListener('click', () => applyBgPreset(preset));
        grid.appendChild(item);
    });
}

function applyBgPreset(preset) {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;

    const colors = preset.colors;
    screenshot.background = {
        type: 'gradient',
        gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary || colors.background} 100%)`,
        stops: [
            { color: colors.primary, position: 0 },
            { color: colors.secondary || colors.background, position: 100 }
        ],
        angle: 135
    };

    // Adjust text color based on theme mode
    const textSettings = getTextSettings();
    textSettings.headline.color = preset.themeMode === 'dark' ? '#ffffff' : '#1a1a1a';

    updateCanvas();
    syncUIWithState();

    // Mark as selected
    document.querySelectorAll('.bg-preset-item').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.bg-preset-item[data-preset="${preset.id}"]`)?.classList.add('selected');
}

// Background preset dropdown
document.getElementById('bg-preset-trigger')?.addEventListener('click', () => {
    document.getElementById('bg-preset-dropdown')?.classList.toggle('open');
    if (document.getElementById('bg-preset-dropdown')?.classList.contains('open')) {
        populateBgPresetGrid('all');
    }
});

// Background preset category filter
document.getElementById('bg-preset-category')?.addEventListener('change', (e) => {
    populateBgPresetGrid(e.target.value);
});

// ============================================
// Widget Palette Functionality
// ============================================

document.getElementById('widgets-btn')?.addEventListener('click', () => {
    document.getElementById('widget-palette')?.classList.toggle('open');
});

document.getElementById('widget-palette-close')?.addEventListener('click', () => {
    document.getElementById('widget-palette')?.classList.remove('open');
});

document.querySelectorAll('.widget-item').forEach(item => {
    item.addEventListener('click', () => {
        const widgetType = item.dataset.widget;
        addWidgetToScreenshot(widgetType);
    });
});

function addWidgetToScreenshot(widgetType) {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;

    if (!screenshot.widgets) {
        screenshot.widgets = [];
    }

    const widgetTexts = {
        rating: '4.9 ★',
        award: 'App of the Day',
        download: '1M+ Downloads',
        featured: 'Featured',
        secure: 'Secure',
        verified: 'Verified',
        privacy: 'Privacy First',
        new: 'NEW',
        free: 'FREE',
        pro: 'PRO',
        offline: 'Works Offline',
        sync: 'Cloud Sync'
    };

    const widget = {
        id: Date.now().toString(),
        type: widgetType,
        text: widgetTexts[widgetType] || widgetType,
        position: { x: 10 + screenshot.widgets.length * 5, y: 5 + screenshot.widgets.length * 5 },
        style: {
            background: 'rgba(0,0,0,0.7)',
            color: '#ffffff',
            borderRadius: 8,
            padding: 8,
            fontSize: 14
        }
    };

    screenshot.widgets.push(widget);
    updateCanvas();
}

document.getElementById('widget-clear-btn')?.addEventListener('click', () => {
    const screenshot = state.screenshots[state.selectedIndex];
    if (screenshot) {
        screenshot.widgets = [];
        updateCanvas();
    }
});

// ============================================
// Text Shadow Functionality
// ============================================

// Text shadow toggle
document.getElementById('text-shadow-toggle')?.addEventListener('click', function() {
    this.classList.toggle('active');
    const options = document.getElementById('text-shadow-options');
    const row = this.closest('.toggle-row');

    if (this.classList.contains('active')) {
        options.style.display = 'block';
        row?.classList.remove('collapsed');
    } else {
        options.style.display = 'none';
        row?.classList.add('collapsed');
    }

    updateTextShadow();
});

function updateTextShadow() {
    const enabled = document.getElementById('text-shadow-toggle')?.classList.contains('active');
    const textSettings = getTextSettings();

    if (enabled) {
        const color = document.getElementById('text-shadow-color')?.value || '#000000';
        const blur = parseInt(document.getElementById('text-shadow-blur')?.value || 10);
        const opacity = parseInt(document.getElementById('text-shadow-opacity')?.value || 50) / 100;
        const x = parseInt(document.getElementById('text-shadow-x')?.value || 2);
        const y = parseInt(document.getElementById('text-shadow-y')?.value || 2);

        // Convert hex to rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        textSettings.headline.shadow = {
            enabled: true,
            color: `rgba(${r}, ${g}, ${b}, ${opacity})`,
            blur: blur,
            offsetX: x,
            offsetY: y
        };
    } else {
        textSettings.headline.shadow = { enabled: false };
    }

    updateCanvas();
}

// Text shadow control listeners
['text-shadow-color', 'text-shadow-blur', 'text-shadow-opacity', 'text-shadow-x', 'text-shadow-y'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', (e) => {
        // Update value display
        const valueEl = document.getElementById(id + '-value');
        if (valueEl) {
            if (id === 'text-shadow-color') {
                document.getElementById('text-shadow-color-hex').value = e.target.value;
            } else if (id.includes('opacity')) {
                valueEl.textContent = e.target.value + '%';
            } else {
                valueEl.textContent = e.target.value + 'px';
            }
        }
        updateTextShadow();
    });
});

// Hex input sync
document.getElementById('text-shadow-color-hex')?.addEventListener('input', (e) => {
    const hex = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        document.getElementById('text-shadow-color').value = hex;
        updateTextShadow();
    }
});

// ============================================
// AI Background Generator
// ============================================

document.getElementById('ai-bg-generate')?.addEventListener('click', async () => {
    const btn = document.getElementById('ai-bg-generate');
    const prompt = document.getElementById('ai-bg-prompt')?.value || '';
    const style = document.getElementById('ai-bg-style')?.value || 'abstract';

    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z"/></svg> Generating...`;

    try {
        const colors = await generateBackgroundColors(prompt, style);
        applyGeneratedBackground(colors);
    } catch (error) {
        console.error('Background generation failed:', error);
        alert('Failed to generate background. Please try again.');
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z"/></svg> Generate`;
    }
});

async function generateBackgroundColors(prompt, style) {
    const stylePrompts = {
        abstract: 'abstract flowing shapes',
        gradient: 'smooth color transition',
        geometric: 'geometric patterns',
        nature: 'natural organic colors',
        minimal: 'clean minimal aesthetic',
        tech: 'futuristic cyber neon'
    };

    const fullPrompt = `Generate a color palette for an App Store screenshot background.
Style: ${stylePrompts[style] || style}
User request: ${prompt || 'professional app background'}

Return ONLY a JSON object with exactly this format, no other text:
{"primary": "#hexcolor", "secondary": "#hexcolor", "accent": "#hexcolor", "angle": number}

The colors should work well together and be suitable for app marketing. Use the angle (0-360) for gradient direction.`;

    try {
        const response = await callLLM(fullPrompt, { maxTokens: 150 });
        const jsonMatch = response.match(/\{[^}]+\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('LLM call failed:', e);
    }

    // Fallback colors based on style
    const fallbacks = {
        abstract: { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb', angle: 135 },
        gradient: { primary: '#4facfe', secondary: '#00f2fe', accent: '#43e97b', angle: 135 },
        geometric: { primary: '#1a1a2e', secondary: '#16213e', accent: '#0f3460', angle: 180 },
        nature: { primary: '#134e5e', secondary: '#71b280', accent: '#a8e063', angle: 135 },
        minimal: { primary: '#f5f7fa', secondary: '#c3cfe2', accent: '#667eea', angle: 135 },
        tech: { primary: '#0f0c29', secondary: '#302b63', accent: '#24243e', angle: 135 }
    };
    return fallbacks[style] || fallbacks.abstract;
}

function applyGeneratedBackground(colors) {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;

    screenshot.background = {
        type: 'gradient',
        gradient: `linear-gradient(${colors.angle}deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        stops: [
            { color: colors.primary, position: 0 },
            { color: colors.secondary, position: 100 }
        ],
        angle: colors.angle
    };

    // Auto-adjust text color based on background brightness
    const textSettings = getTextSettings();
    const brightness = getColorBrightness(colors.primary);
    textSettings.headline.color = brightness < 128 ? '#ffffff' : '#1a1a1a';

    updateCanvas();
    syncUIWithState();

    // Switch to gradient view
    document.querySelectorAll('#bg-type-selector button').forEach(b => b.classList.remove('active'));
    document.querySelector('#bg-type-selector button[data-type="gradient"]')?.classList.add('active');
    document.getElementById('gradient-options').style.display = 'block';
    document.getElementById('solid-options').style.display = 'none';
    document.getElementById('image-options').style.display = 'none';
}

function getColorBrightness(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// ============================================
// Canvas Drag & Drop System
// ============================================

const canvasInteraction = {
    isDragging: false,
    dragTarget: null, // 'screenshot', 'text', 'element', 'widget'
    dragData: null,
    startPos: { x: 0, y: 0 },
    startValue: null,
    selectedElement: null
};

// Get click position relative to canvas
function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
        percentX: ((e.clientX - rect.left) / rect.width) * 100,
        percentY: ((e.clientY - rect.top) / rect.height) * 100
    };
}

// Detect what was clicked on the canvas
function detectClickTarget(coords) {
    const dims = getCanvasDimensions();
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return null;

    // Check elements first (they're on top)
    if (screenshot.elements?.length) {
        for (let i = screenshot.elements.length - 1; i >= 0; i--) {
            const el = screenshot.elements[i];
            const elX = dims.width * (el.x / 100);
            const elY = dims.height * (el.y / 100);
            const size = Math.max(50, el.scale * 2); // Approximate hit area

            if (Math.abs(coords.x - elX) < size && Math.abs(coords.y - elY) < size) {
                return { type: 'element', data: el, index: i };
            }
        }
    }

    // Check widgets
    if (screenshot.widgets?.length) {
        for (let i = screenshot.widgets.length - 1; i >= 0; i--) {
            const widget = screenshot.widgets[i];
            const wX = dims.width * (widget.position.x / 100);
            const wY = dims.height * (widget.position.y / 100);

            if (coords.x >= wX && coords.x <= wX + 150 && coords.y >= wY && coords.y <= wY + 40) {
                return { type: 'widget', data: widget, index: i };
            }
        }
    }

    // Check text area
    const textSettings = getTextSettings();
    const textAreaHeight = dims.height * 0.25;
    if (textSettings.position === 'top' && coords.y < textAreaHeight) {
        return { type: 'text', data: textSettings };
    } else if (textSettings.position === 'bottom' && coords.y > dims.height - textAreaHeight) {
        return { type: 'text', data: textSettings };
    }

    // Check screenshot/device area
    const ss = getScreenshotSettings();
    const ssX = dims.width * (ss.x / 100);
    const ssY = dims.height * (ss.y / 100);
    const ssWidth = dims.width * (ss.scale / 100) * 0.45;
    const ssHeight = dims.height * (ss.scale / 100) * 0.8;

    if (coords.x >= ssX - ssWidth && coords.x <= ssX + ssWidth &&
        coords.y >= ssY - ssHeight && coords.y <= ssY + ssHeight) {
        return { type: 'screenshot', data: ss };
    }

    return null;
}

canvas.addEventListener('mousedown', (e) => {
    const coords = getCanvasCoords(e);
    const target = detectClickTarget(coords);

    if (target) {
        canvasInteraction.isDragging = true;
        canvasInteraction.dragTarget = target.type;
        canvasInteraction.dragData = target;
        canvasInteraction.startPos = { x: e.clientX, y: e.clientY };

        // Store starting values
        switch (target.type) {
            case 'screenshot':
                canvasInteraction.startValue = { x: target.data.x, y: target.data.y };
                break;
            case 'text':
                canvasInteraction.startValue = { offsetY: target.data.offsetY || 12 };
                break;
            case 'element':
                canvasInteraction.startValue = { x: target.data.x, y: target.data.y };
                canvasInteraction.selectedElement = target.index;
                break;
            case 'widget':
                canvasInteraction.startValue = { ...target.data.position };
                break;
        }

        canvas.style.cursor = 'grabbing';
        e.preventDefault();
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!canvasInteraction.isDragging) {
        // Update cursor based on hover
        const coords = getCanvasCoords(e);
        const target = detectClickTarget(coords);
        canvas.style.cursor = target ? 'grab' : 'default';
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const deltaX = (e.clientX - canvasInteraction.startPos.x) / rect.width * 100;
    const deltaY = (e.clientY - canvasInteraction.startPos.y) / rect.height * 100;
    const screenshot = state.screenshots[state.selectedIndex];

    switch (canvasInteraction.dragTarget) {
        case 'screenshot':
            const ss = getScreenshotSettings();
            ss.x = Math.max(10, Math.min(90, canvasInteraction.startValue.x + deltaX));
            ss.y = Math.max(10, Math.min(90, canvasInteraction.startValue.y + deltaY));
            break;

        case 'text':
            const textSettings = getTextSettings();
            let newOffsetY = canvasInteraction.startValue.offsetY +
                (textSettings.position === 'top' ? deltaY : -deltaY);
            textSettings.offsetY = Math.max(2, Math.min(40, newOffsetY));
            break;

        case 'element':
            if (screenshot?.elements && canvasInteraction.selectedElement !== null) {
                const el = screenshot.elements[canvasInteraction.selectedElement];
                el.x = Math.max(5, Math.min(95, canvasInteraction.startValue.x + deltaX));
                el.y = Math.max(5, Math.min(95, canvasInteraction.startValue.y + deltaY));
            }
            break;

        case 'widget':
            if (screenshot?.widgets && canvasInteraction.dragData?.index !== undefined) {
                const widget = screenshot.widgets[canvasInteraction.dragData.index];
                widget.position.x = Math.max(2, Math.min(85, canvasInteraction.startValue.x + deltaX));
                widget.position.y = Math.max(2, Math.min(90, canvasInteraction.startValue.y + deltaY));
            }
            break;
    }

    updateCanvas();
});

canvas.addEventListener('mouseup', () => {
    if (canvasInteraction.isDragging) {
        canvasInteraction.isDragging = false;
        canvasInteraction.dragTarget = null;
        canvas.style.cursor = 'default';
        syncUIWithState();
    }
});

canvas.addEventListener('mouseleave', () => {
    if (canvasInteraction.isDragging) {
        canvasInteraction.isDragging = false;
        canvasInteraction.dragTarget = null;
        canvas.style.cursor = 'default';
    }
});

// ============================================
// Scroll to Resize
// ============================================

canvas.addEventListener('wheel', (e) => {
    const coords = getCanvasCoords(e);
    const target = detectClickTarget(coords);

    if (!target) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? -2 : 2; // Scroll down = smaller, up = larger
    const screenshot = state.screenshots[state.selectedIndex];

    switch (target.type) {
        case 'screenshot':
            const ss = getScreenshotSettings();
            ss.scale = Math.max(20, Math.min(150, ss.scale + delta));
            break;

        case 'text':
            const textSettings = getTextSettings();
            textSettings.headlineSize = Math.max(30, Math.min(150, (textSettings.headlineSize || 80) + delta));
            break;

        case 'element':
            if (screenshot?.elements && target.index !== undefined) {
                const el = screenshot.elements[target.index];
                el.scale = Math.max(5, Math.min(100, el.scale + delta));
            }
            break;

        case 'widget':
            if (screenshot?.widgets && target.index !== undefined) {
                const widget = screenshot.widgets[target.index];
                widget.style = widget.style || {};
                widget.style.fontSize = Math.max(10, Math.min(30, (widget.style.fontSize || 14) + delta / 2));
            }
            break;
    }

    updateCanvas();
    syncUIWithState();
}, { passive: false });

// ============================================
// Apply Background to All Screenshots
// ============================================

document.getElementById('apply-bg-to-all')?.addEventListener('click', () => {
    const currentScreenshot = state.screenshots[state.selectedIndex];
    if (!currentScreenshot) return;

    const currentBg = currentScreenshot.background || getBackground();

    if (confirm('Apply this background to all screenshots?')) {
        state.screenshots.forEach((screenshot, index) => {
            if (index !== state.selectedIndex) {
                screenshot.background = JSON.parse(JSON.stringify(currentBg));
            }
        });

        updateCanvas();
        updateSidePreviews();
    }
});

// ============================================
// Elements / Logo Upload
// ============================================

document.getElementById('element-upload')?.addEventListener('click', () => {
    document.getElementById('element-input')?.click();
});

document.getElementById('element-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        addElementToScreenshot({
            name: file.name,
            src: event.target.result,
            x: 50,
            y: 50,
            scale: 20,
            rotation: 0
        });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
});

function addElementToScreenshot(element) {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;

    if (!screenshot.elements) {
        screenshot.elements = [];
    }

    element.id = Date.now().toString();
    screenshot.elements.push(element);

    updateElementsList();
    updateCanvas();
}

function updateElementsList() {
    const list = document.getElementById('element-list');
    if (!list) return;

    const screenshot = state.screenshots[state.selectedIndex];
    const elements = screenshot?.elements || [];

    list.innerHTML = elements.map(el => `
        <div class="element-item" data-id="${el.id}">
            <img src="${el.src}" alt="${el.name}">
            <div class="element-item-info">
                <div class="element-item-name">${el.name}</div>
            </div>
            <div class="element-item-controls">
                <button onclick="moveElementToCanvas('${el.id}')">Place</button>
                <button class="delete" onclick="removeElement('${el.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

window.removeElement = function(elementId) {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot?.elements) return;

    screenshot.elements = screenshot.elements.filter(el => el.id !== elementId);
    updateElementsList();
    updateCanvas();
};

window.moveElementToCanvas = function(elementId) {
    // Element is already on canvas, this just confirms placement
    alert('Drag the element on the canvas to position it. Use scroll to resize.');
};

// Draw elements on canvas (add to updateCanvas flow)
function drawElements() {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot?.elements?.length) return;

    const dims = getCanvasDimensions();

    screenshot.elements.forEach(element => {
        const img = new Image();
        img.src = element.src;

        if (img.complete) {
            drawElementImage(img, element, dims);
        } else {
            img.onload = () => {
                drawElementImage(img, element, dims);
            };
        }
    });
}

function drawElementImage(img, element, dims) {
    const x = dims.width * (element.x / 100);
    const y = dims.height * (element.y / 100);
    const scale = element.scale / 100;
    const width = img.width * scale;
    const height = img.height * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((element.rotation || 0) * Math.PI / 180);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

// Elements toggle (collapsible section)
document.querySelector('[data-target="elements-options"]')?.addEventListener('click', function() {
    const options = document.getElementById('elements-options');
    if (options) {
        const isCollapsed = this.classList.contains('collapsed');
        this.classList.toggle('collapsed');
        options.style.display = isCollapsed ? 'block' : 'none';
    }
});

// ============================================
// Fresh Template Gallery
// ============================================

let selectedTemplate = null;

function populateTemplateGrid(category = 'all') {
    const grid = document.getElementById('template-grid');
    if (!grid || !window.FreshTemplates) return;

    const templates = window.FreshTemplates.getTemplatesByCategory(category);
    grid.innerHTML = '';

    templates.forEach(template => {
        const item = document.createElement('div');
        item.className = 'template-item';
        item.dataset.id = template.id;
        item.dataset.name = template.name;
        item.dataset.category = template.category;
        item.style.background = template.preview;

        // Add mini phone preview and category badge
        const categoryLabels = {
            'minimal': 'MIN',
            'gradient': 'GRAD',
            'dynamic': 'DYN',
            'neon': 'NEON',
            'soft': 'SOFT',
            'bold': 'BOLD',
            'nature': 'NAT',
            'glass': 'GLASS',
            '3d': '3D'
        };
        const badge = categoryLabels[template.category] || template.category.toUpperCase();
        item.innerHTML = `
            <div class="template-preview-phone"></div>
            <span class="category-badge">${badge}</span>
        `;

        item.addEventListener('click', () => {
            selectAndApplyTemplate(template.id);
        });

        grid.appendChild(item);
    });
}

function selectAndApplyTemplate(templateId) {
    const template = window.FreshTemplates.getTemplateById(templateId);
    if (!template) return;

    selectedTemplate = template;

    // Mark as selected
    document.querySelectorAll('.template-item').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.template-item[data-id="${templateId}"]`)?.classList.add('selected');

    // Apply to current screenshot
    const screenshot = state.screenshots[state.selectedIndex];
    if (screenshot) {
        window.FreshTemplates.applyTemplate(template, screenshot);
        updateCanvas();
        syncUIWithState();
    }
}

// Template category filter
document.getElementById('template-category-filter')?.addEventListener('change', (e) => {
    populateTemplateGrid(e.target.value);
});

// Apply template to all
document.getElementById('apply-template-all-btn')?.addEventListener('click', () => {
    if (!selectedTemplate) {
        alert('Please select a template first');
        return;
    }

    if (confirm('Apply this template to all screenshots?')) {
        window.FreshTemplates.applyTemplateToAll(selectedTemplate, state.screenshots);
        updateCanvas();
        updateSidePreviews();
        syncUIWithState();
    }
});

// Smart Match - extract colors from screenshots
document.getElementById('smart-match-btn')?.addEventListener('click', async () => {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) {
        alert('Please upload a screenshot first');
        return;
    }

    const btn = document.getElementById('smart-match-btn');
    btn.disabled = true;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg> Analyzing...';

    try {
        // Get the screenshot image
        const imgSrc = screenshot.image?.src || screenshot.localizedImages?.en?.src;
        if (!imgSrc) {
            throw new Error('No image found');
        }

        // Extract colors
        const colors = await window.FreshTemplates.extractColorsFromImage(imgSrc);

        // Determine if screenshot is dark or light
        const isDark = isImageDark(imgSrc);

        // Generate smart template
        const smartTemplate = window.FreshTemplates.generateSmartTemplate(colors, isDark);

        // Apply it
        window.FreshTemplates.applyTemplate(smartTemplate, screenshot);
        updateCanvas();
        syncUIWithState();

        // Show success feedback
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Applied!';
        setTimeout(() => {
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 6v6l4 2"/></svg> Smart Match';
            btn.disabled = false;
        }, 1500);

    } catch (error) {
        console.error('Smart match failed:', error);
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 6v6l4 2"/></svg> Smart Match';
        btn.disabled = false;
    }
});

function isImageDark(imgSrc) {
    // Simple brightness check - assume dark if we can't determine
    return true;
}

// Story Flow Button Handler
document.getElementById('story-flow-btn')?.addEventListener('click', async () => {
    if (state.screenshots.length === 0) {
        showAppAlert('Please upload at least one screenshot first.', 'info');
        return;
    }

    const flowType = document.getElementById('story-flow-select')?.value || 'journey';

    if (window.AIEngine && window.AIEngine.generateStoryFlow) {
        await window.AIEngine.generateStoryFlow(flowType);
    } else {
        showAppAlert('AI Engine not loaded. Please refresh the page.', 'error');
    }
});

// Initialize template grid on load
setTimeout(() => {
    populateTemplateGrid('all');
}, 500);

// Initialize the app
initSync();