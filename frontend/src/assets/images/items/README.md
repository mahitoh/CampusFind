# Item Images for FeaturedItems Component

## Overview

The FeaturedItems component displays sample lost and found items on the landing page. The images have been updated to use high-quality Unsplash photos that accurately represent the actual items described.

## Current Items & Images

### 1. Blue Backpack (Found)

- **Image**: Blue backpack from Unsplash
- **URL**: `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&crop=center`
- **Description**: Found near the Science Building

### 2. Student ID Card (Lost)

- **Image**: ID card/wallet from Unsplash
- **URL**: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&crop=center`
- **Description**: Lost at the Student Center

### 3. Apple AirPods (Found)

- **Image**: Apple AirPods from Unsplash
- **URL**: `https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop&crop=center`
- **Description**: Found in the Library, 3rd floor

### 4. Water Bottle (Lost)

- **Image**: Water bottle from Unsplash
- **URL**: `https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=200&fit=crop&crop=center`
- **Description**: Lost at the Gym

## Image Specifications

All images are configured with:

- **Width**: 300px
- **Height**: 200px
- **Fit**: crop
- **Crop**: center
- **Format**: Responsive (automatically optimized by Unsplash)

## Benefits of Current Solution

1. **Accurate Representation**: Images now match the actual item descriptions
2. **High Quality**: Professional photos from Unsplash
3. **Consistent Sizing**: All images have uniform dimensions
4. **Fast Loading**: Optimized delivery through Unsplash CDN
5. **No Storage Required**: External hosting means no local file storage needed

## Future Improvements

### Option 1: Use Local Images

If you prefer to use local images:

1. Add actual item photos to `/src/assets/images/items/`
2. Update the image paths in `FeaturedItems.jsx`:
   ```jsx
   image: "/src/assets/images/items/backpack.jpg";
   ```

### Option 2: Connect to Backend

When connecting to a real backend:

1. Remove the static `items` array
2. Fetch data from your API endpoint
3. Use actual user-uploaded images from your database

### Option 3: Add More Items

To add more sample items:

```jsx
{
  id: 5,
  title: "Laptop Charger",
  description: "Found in Computer Lab",
  image: "https://images.unsplash.com/photo-1558618666-06c1c5b5e3b2?w=300&h=200&fit=crop&crop=center",
  category: "Found",
}
```

## Recommended Item Categories

Common lost and found items that work well for display:

### Electronics

- Phones, chargers, headphones, laptops, tablets
- **Unsplash search terms**: "phone", "charger", "headphones", "laptop"

### Personal Items

- Wallets, keys, jewelry, watches, glasses
- **Unsplash search terms**: "wallet", "keys", "glasses", "watch"

### School Supplies

- Backpacks, notebooks, textbooks, calculators
- **Unsplash search terms**: "backpack", "notebook", "textbook"

### Clothing & Accessories

- Jackets, hats, scarves, umbrellas
- **Unsplash search terms**: "jacket", "hat", "umbrella"

## Image Guidelines

When selecting or replacing images:

1. **Relevance**: Image should clearly represent the item
2. **Quality**: Use high-resolution photos (minimum 300x200)
3. **Lighting**: Well-lit photos with good contrast
4. **Background**: Clean, uncluttered backgrounds work best
5. **Orientation**: Landscape orientation fits the card layout better

## Technical Notes

- Images are loaded lazily for better performance
- Fallback error handling is implemented in the Card component
- All images have proper alt attributes for accessibility
- The component supports both local and external image sources
